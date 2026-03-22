import { Router } from "express";
import fetch from "node-fetch";
import type { Low } from "lowdb";
import type nodemailer from "nodemailer";
import type { AppConfig } from "./config.js";
import type { DbSchema, Product } from "./db.js";
import { firebaseRequest, normalizeFirebaseError } from "./firebase.js";
import { translateTexts } from "./translate.js";

function checkIfAdminExists(admins: Record<string, string>, u: string, p: string) {
  return Object.entries(admins).some(([key, value]) => key === u && value === p);
}

function newsDateKey(date: Date) {
  return `${date.getUTCHours()}${date.getUTCDate()}${date.getUTCMonth()}${date.getUTCFullYear()}`;
}

function findById(products: Product[], id: number) {
  return products.find((item) => item.id === id) || null;
}

async function translateProduct(product: Product, target: string, apiKey: string): Promise<Product> {
  const texts = [product.name, product.alt, ...product.options];
  const translated = await translateTexts(texts, target, apiKey);
  return {
    ...product,
    name: translated[0],
    alt: translated[1],
    options: translated.slice(2),
  };
}

export function buildApiRouter(
  db: Low<DbSchema>,
  transporter: nodemailer.Transporter,
  configs: AppConfig
) {
  const router = Router();

  router.get("/news", async (req, res) => {
    const target = String(req.query.lang || "en");
    const dateKey = newsDateKey(new Date());
    if (!db.data.news || db.data.news.date !== dateKey) {
      if (!configs.NEWSDATA_API_KEY) {
        res.status(200).json({ news: db.data.news?.arr ?? [] });
        return;
      }
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${encodeURIComponent(
          configs.NEWSDATA_API_KEY
        )}&q=nba&language=en&category=sports`
      );
      const data = (await response.json()) as { results?: Array<Record<string, unknown>> };
      const arr = (data.results || []).filter(
        (el) => el.image_url !== null && el.description !== null
      );
      db.data.news = { date: dateKey, arr };
      await db.write();
    }
    if (!configs.GOOGLE_TRANSLATE_API_KEY || target.toLowerCase() === "en") {
      res.status(200).json({ news: db.data.news.arr });
      return;
    }

    try {
      const translatedNews = await Promise.all(
        db.data.news.arr.map(async (article) => {
          const title = String(article.title || "");
          const description = String(article.description || "");
          const [translatedTitle, translatedDescription] = await translateTexts(
            [title, description],
            target,
            configs.GOOGLE_TRANSLATE_API_KEY
          );
          return {
            ...article,
            title: translatedTitle,
            description: translatedDescription,
          };
        })
      );
      res.status(200).json({ news: translatedNews });
    } catch {
      res.status(200).json({ news: db.data.news.arr });
    }
  });

  router.get("/products", async (req, res) => {
    const target = String(req.query.lang || "en");
    if (!configs.GOOGLE_TRANSLATE_API_KEY) {
      res.status(200).json({ products: db.data.products });
      return;
    }

    try {
      const translated = await Promise.all(
        db.data.products.map((product) =>
          translateProduct(product, target, configs.GOOGLE_TRANSLATE_API_KEY)
        )
      );
      res.status(200).json({ products: translated });
    } catch {
      res.status(200).json({ products: db.data.products });
    }
  });

  router.get("/products/:id", async (req, res) => {
    const target = String(req.query.lang || "en");
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      res.status(400).json({ message: "Invalid product id" });
      return;
    }
    const product = findById(db.data.products, id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    if (!configs.GOOGLE_TRANSLATE_API_KEY) {
      res.status(200).json({ product });
      return;
    }
    try {
      const translated = await translateProduct(
        product,
        target,
        configs.GOOGLE_TRANSLATE_API_KEY
      );
      res.status(200).json({ product: translated });
    } catch {
      res.status(200).json({ product });
    }
  });

  router.get("/pdcnt", async (_req, res) => {
    res.status(200).json({ count: db.data.ids });
  });

  router.get("/mail", async (req, res) => {
    const address = String(req.query.mail || "");
    if (!address) {
      res.status(400).json({ message: "Missing mail query param" });
      return;
    }
    await transporter.sendMail({
      from: `"BasketballShop" <${configs.MAILUSER}>`,
      to: address,
      subject: "Newsletter",
      text: "Cam on ban da dang ki newsletter cua BasketballShop.",
      html: "Cam on ban da dang ki newsletter cua BasketballShop.",
    });
    res.status(200).json({ message: "successful" });
  });

  router.post("/auth/signup", async (req, res) => {
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    if (!configs.FIREBASE_WEB_API_KEY) {
      res.status(500).json({ message: "Firebase server config is missing" });
      return;
    }
    try {
      const signUp = await firebaseRequest<{ idToken: string }>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(
          configs.FIREBASE_WEB_API_KEY
        )}`,
        { email, password, returnSecureToken: true }
      );
      await firebaseRequest(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${encodeURIComponent(
          configs.FIREBASE_WEB_API_KEY
        )}`,
        { idToken: signUp.idToken, displayName: username, returnSecureToken: true }
      );
      res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      res.status(400).json({
        message: normalizeFirebaseError((error as Error).message),
      });
    }
  });

  router.post("/auth/signin", async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    if (!configs.FIREBASE_WEB_API_KEY) {
      res.status(500).json({ message: "Firebase server config is missing" });
      return;
    }
    try {
      const signIn = await firebaseRequest<{ idToken: string; email: string; displayName?: string }>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(
          configs.FIREBASE_WEB_API_KEY
        )}`,
        { email, password, returnSecureToken: true }
      );
      let username = signIn.displayName || "";
      if (!username) {
        const lookup = await firebaseRequest<{ users?: Array<{ displayName?: string }> }>(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(
            configs.FIREBASE_WEB_API_KEY
          )}`,
          { idToken: signIn.idToken }
        );
        username = lookup.users?.[0]?.displayName || email.split("@")[0];
      }
      res.status(200).json({ message: "Signin successful", username, email: signIn.email });
    } catch (error) {
      res.status(401).json({
        message: normalizeFirebaseError((error as Error).message),
      });
    }
  });

  router.post("/auth/signout", async (_req, res) => {
    res.status(200).json({ message: "Signed out" });
  });

  router.post("/translate", async (req, res) => {
    const text = String(req.body.text || "");
    const target = String(req.body.target || "en");
    if (!text) {
      res.status(400).json({ message: "Missing text" });
      return;
    }
    if (!configs.GOOGLE_TRANSLATE_API_KEY) {
      res.status(500).json({ message: "Google Translate API key is missing" });
      return;
    }
    try {
      const [translated] = await translateTexts(
        [text],
        target,
        configs.GOOGLE_TRANSLATE_API_KEY
      );
      res.status(200).json({ translatedText: translated, target });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  router.get("/admin/checklogin", async (req, res) => {
    const username = String(req.query.username || "");
    const password = String(req.query.password || "");
    if (checkIfAdminExists(db.data.admins, username, password)) {
      res.status(200).json({ message: "admin exists" });
      return;
    }
    res.status(400).json({ message: "admin doesnt exist" });
  });

  router.post("/admin/addproduct", async (req, res) => {
    const {
      username,
      password,
      name,
      alt,
      banner,
      images,
      price,
      filter,
      mouseover,
      mouseout,
      cartpic,
      options,
    } = req.body as Record<string, unknown>;

    const valid =
      username &&
      password &&
      name &&
      alt &&
      banner &&
      images &&
      price &&
      filter &&
      mouseover &&
      mouseout &&
      cartpic &&
      options &&
      checkIfAdminExists(db.data.admins, String(username), String(password));

    if (!valid) {
      res.status(400).json({ message: "Invalid payload or admin credentials" });
      return;
    }

    db.data.ids += 1;
    db.data.products.push({
      id: db.data.ids,
      name: String(name),
      alt: String(alt),
      banner: String(banner),
      images: images as string[],
      price: String(price),
      filter: String(filter),
      mouseover: String(mouseover),
      mouseout: String(mouseout),
      cartpic: String(cartpic),
      options: options as string[],
    });
    await db.write();
    res.status(200).json({ message: "ok" });
  });

  return router;
}
