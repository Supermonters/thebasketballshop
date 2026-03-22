import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api";

type FormState = {
  name: string;
  alt: string;
  banner: string;
  images: string;
  price: string;
  filter: string;
  mouseover: string;
  mouseout: string;
  cartpic: string;
  options: string;
};

export function AdminProductPage() {
  const navigate = useNavigate();
  const creds = useMemo(() => {
    const raw = localStorage.getItem("adminCreds");
    return raw ? (JSON.parse(raw) as { username: string; password: string }) : null;
  }, []);

  const [message, setMessage] = useState("");
  const [form, setForm] = useState<FormState>({
    name: "",
    alt: "",
    banner: "",
    images: "",
    price: "",
    filter: "",
    mouseover: "",
    mouseout: "",
    cartpic: "",
    options: "",
  });

  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const hrefs = ["/legacy-admin/product.css"];
    hrefs.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => link.remove());
    };
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!creds) {
      setMessage("Missing admin credentials. Please login again.");
      return;
    }
    try {
      await addProduct({
        ...creds,
        ...form,
        images: form.images.split("\n").filter(Boolean),
        options: form.options.split(",").map((x) => x.trim()).filter(Boolean),
      });
      setMessage("Added product");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <section className="react-admin-product">
      <h1 className="react-admin-title">ADD PRODUCT</h1>
      <form onSubmit={submit}>
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <textarea
              className="question"
              placeholder={key}
              value={value}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            />
            <label>
              <span className="spn">{key}</span>
            </label>
            <br />
          </div>
        ))}
        <button type="submit" className="btn-purchase button-30 react-admin-submit">
          Add Product
        </button>
      </form>
      <button
        type="button"
        className="btn-purchase button-30 react-admin-signout"
        onClick={() => {
          localStorage.removeItem("adminCreds");
          navigate("/admin/login");
        }}
      >
        Sign out
      </button>
      {message && <p className="react-admin-message">{message}</p>}
    </section>
  );
}
