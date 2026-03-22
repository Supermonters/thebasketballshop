import fetch from "node-fetch";

function checkIfAdminExists(admins, username, password) {
  for (const [key, value] of Object.entries(admins)) {
    if (key === username && value === password) {
      return true;
    }
  }

  return false;
}

function newsDateKey(date) {
  return `${date.getUTCHours().toString()}${date
    .getUTCDate()
    .toString()}${date.getUTCMonth().toString()}${date
    .getUTCFullYear()
    .toString()}`;
}

async function firebaseRequest(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Firebase auth request failed");
  }

  return data;
}

function normalizeFirebaseError(message) {
  const errors = {
    EMAIL_EXISTS: "Email already exists",
    INVALID_EMAIL: "Email format is invalid",
    WEAK_PASSWORD: "Password should be at least 6 characters",
    EMAIL_NOT_FOUND: "Invalid email or password",
    INVALID_PASSWORD: "Invalid email or password",
    USER_DISABLED: "This user account is disabled",
  };

  return errors[message] || message;
}

export function findByProductName(products, name) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].name === name) {
      return products[i];
    }
  }

  return null;
}

export function ensureDbShape(db) {
  db.data ||= {};
  db.data.products ||= [];
  db.data.admins ||= {};
  db.data.ids ||= 0;
}

export function registerApiRoutes({ app, db, transporter, configs }) {
  app.get("/news", async (req, res) => {
    let arr;
    const now = new Date();
    now.setTime(Date.now());
    const dateKey = newsDateKey(now);

    if (db.data.news === undefined || db.data.news.date !== dateKey) {
      if (!configs.NEWSDATA_API_KEY) {
        const cachedNews = db.data.news?.arr ?? [];
        res.status(200).json({ news: cachedNews });
        return;
      }

      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${encodeURIComponent(
          configs.NEWSDATA_API_KEY
        )}&q=nba&language=en&category=sports`
      );
      const data = await response.json();
      arr = data.results.filter(
        (el) => el.image_url !== null && el.description !== null
      );
      db.data.news = {
        date: dateKey,
        arr,
      };
      await db.write();
    } else {
      arr = db.data.news.arr;
    }

    res.status(200).json({
      news: arr,
    });
  });

  app.get("/productlist", async (req, res) => {
    res.status(200).json(db.data);
  });

  app.get("/pdcnt", async (req, res) => {
    res.status(200).json({
      count: db.data.ids,
    });
  });

  app.get("/mail", async (req, res) => {
    const address = req.query.mail;
    await transporter.sendMail({
      from: `"BasketballShop" <${configs.MAILUSER}>`,
      to: address,
      subject: "Newsletter",
      text: "Cảm ơn bạn đã đăng kí newsletter của BasketballShop.\nChúng tôi sẽ gửi cho bạn các thông tin về NBA.",
      html: `Cảm ơn bạn đã đăng kí newsletter của BasketballShop.<br>Chúng tôi sẽ gửi cho bạn các thông tin về NBA.<br>Đây là tin nhắn tự động, xin đừng trả lời tin nhắn này.<br><img src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/304881059_107600002091807_5624213785648279587_n.png?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=g35yFBvN5ZwAX8ufcDE&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfBC--swpZWsUuHSWclaxQ99wqqSeY0Dp2M6uL4JXXIXrA&oe=63C701EF" alt="idk" width=200 height=200>
        `,
    });
    res.status(200).send("successful");
  });

  app.get("/admin", (req, res) => {
    res.redirect("/admin/product.html");
  });

  app.post("/auth/signup", async (req, res) => {
    const username = (req.body.username || "").toString().trim();
    const email = (req.body.email || "").toString().trim().toLowerCase();
    const password = (req.body.password || "").toString();

    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!configs.FIREBASE_WEB_API_KEY) {
      res.status(500).json({ message: "Firebase server config is missing" });
      return;
    }

    try {
      const signUpResult = await firebaseRequest(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(
          configs.FIREBASE_WEB_API_KEY
        )}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      await firebaseRequest(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${encodeURIComponent(
          configs.FIREBASE_WEB_API_KEY
        )}`,
        {
          idToken: signUpResult.idToken,
          displayName: username,
          returnSecureToken: true,
        }
      );

      res.status(201).json({ message: "Signup successful" });
    } catch (error) {
      res.status(400).json({ message: normalizeFirebaseError(error.message) });
    }
  });

  app.post("/auth/signin", async (req, res) => {
    const email = (req.body.email || "").toString().trim().toLowerCase();
    const password = (req.body.password || "").toString();

    if (!email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!configs.FIREBASE_WEB_API_KEY) {
      res.status(500).json({ message: "Firebase server config is missing" });
      return;
    }

    try {
      const signInResult = await firebaseRequest(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(
          configs.FIREBASE_WEB_API_KEY
        )}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      let username = signInResult.displayName;
      if (!username) {
        const lookupResult = await firebaseRequest(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(
            configs.FIREBASE_WEB_API_KEY
          )}`,
          {
            idToken: signInResult.idToken,
          }
        );
        username = lookupResult.users?.[0]?.displayName || "";
      }

      if (!username) {
        username = email.split("@")[0];
      }

      res.status(200).json({
        message: "Signin successful",
        username,
        email: signInResult.email || email,
      });
    } catch (error) {
      res.status(401).json({ message: normalizeFirebaseError(error.message) });
    }
  });

  app.post("/auth/signout", async (req, res) => {
    res.status(200).json({ message: "Signed out" });
  });

  app.get("/admin/checklogin", async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (checkIfAdminExists(db.data.admins, username, password)) {
      res.status(200).send("admin exists");
    } else {
      res.status(400).send("admin doesnt exist");
    }
  });

  app.post("/admin/addproduct", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const alt = req.body.alt;
    const banner = req.body.banner;
    const images = req.body.images;
    const price = req.body.price;
    const filter = req.body.filter;
    const mouseover = req.body.mouseover;
    const mouseout = req.body.mouseout;
    const cartpic = req.body.cartpic;
    const options = req.body.options;
    if (
      !username ||
      !password ||
      !name ||
      !alt ||
      !banner ||
      !images ||
      !price ||
      !filter ||
      !mouseover ||
      !mouseout ||
      !cartpic ||
      !options ||
      !checkIfAdminExists(db.data.admins, username, password)
    ) {
      res.status(400).send();
      return;
    }

    db.data.ids++;
    db.data.products.push({
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
      id: db.data.ids,
    });
    await db.write();
    res.status(200).send();
  });
}
