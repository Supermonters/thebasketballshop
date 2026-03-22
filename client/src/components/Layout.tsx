import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { getCartCount } from "../cart";
import { sendMail, signOut } from "../api";
import { AuthModal } from "./AuthModal";

export function Layout() {
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("TaiKhoanDangNhap") || "");
  const cartCount = useMemo(() => getCartCount(), [username, showAuth]);
  const isItemPage = location.pathname.startsWith("/product/");

  useEffect(() => {
    if (isItemPage) return;

    const win = window as typeof window & {
      googleTranslateElementInit?: () => void;
      google?: {
        translate?: {
          TranslateElement?: new (
            options: { pageLanguage: string },
            elementId: string
          ) => unknown;
        };
      };
    };

    win.googleTranslateElementInit = () => {
      if (!win.google?.translate?.TranslateElement) return;
      if (!document.getElementById("google_translate_element")) return;
      new win.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
    };

    if (win.google?.translate?.TranslateElement) {
      win.googleTranslateElementInit();
      return;
    }

    const existingScript = document.getElementById(
      "google-translate-script"
    ) as HTMLScriptElement | null;
    if (existingScript) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, [isItemPage, location.pathname]);

  async function logout() {
    await signOut();
    localStorage.removeItem("TaiKhoanDangNhap");
    setUsername("");
  }

  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const mailInput = form.elements.namedItem("mail") as HTMLInputElement | null;
    const mail = mailInput?.value || "";
    if (!mail) return;
    await sendMail(mail);
    form.reset();
  }

  return (
    <div id="site-content" className={isItemPage ? "site-content--product" : ""}>
      {!isItemPage && <header className="site-header">
        <div className="container">
          <NavLink to="/" id="branding">
            <img src="/dummy/logo.png" alt="BasketballShop" />
            <small className="site-description">Only Basketball</small>
          </NavLink>
          <nav className="main-navigation">
            <button type="button" className="toggle-menu">
              <span className="sr-only">Open menu</span>
              <i className="fa fa-bars" />
            </button>
            <ul className="menu">
              <li className="menu-item">
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/store">Store</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/xuhuong">Trends</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/news">News</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/about">About</NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/cart">
                  Cart<span id="countItem">({cartCount})</span>
                </NavLink>
              </li>
              <li className="menu-item">
                <NavLink to="/admin/login">Admin</NavLink>
              </li>
              <li className="menu-item">
                {username ? (
                  <button className="welcomeUser" onClick={logout}>
                    Logout {username}
                  </button>
                ) : (
                  <button className="welcomeUser" onClick={() => setShowAuth(true)}>
                    Login
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>}
      <main className={`app-content ${isItemPage ? "app-content--product" : ""}`}>
        <Outlet />
      </main>
      {!isItemPage && <footer className="site-footer">
        <div className="container">
          <img src="/dummy/logo-footer.png" alt="Site Name" />
          <address>
            <p>
              10 Thuy Khue Street, Tay Ho, Hanoi
              <br />
              <a href="tel:9488487853">+91 94884 87853</a>
              <br />
              <a href="mailto:sieunhanham007@gmail.com">sieunhanham007@gmail.com</a>
            </p>
          </address>
          <form className="newsletter-form" onSubmit={subscribe}>
            <input
              type="email"
              name="mail"
              placeholder="Enter your email to get latest NBA updates..."
              required
            />
            <input type="submit" className="button cut-corner" value="Subscribe" />
          </form>
          <div className="social-links">
            <a
              href="https://www.facebook.com/BasketballShop-107593602092447"
              target="_blank"
              rel="noreferrer noopener"
              title="Facebook"
            >
              <i className="fa fa-facebook-square" />
            </a>
            <a href="#" title="Twitter">
              <i className="fa fa-twitter" />
            </a>
            <a href="#" title="Google Plus">
              <i className="fa fa-google-plus" />
            </a>
            <a href="#" title="Pinterest">
              <i className="fa fa-pinterest" />
            </a>
          </div>
          <p className="copy">BasketballShop @ Copyright 2026</p>
        </div>
        <div id="google_translate_element"></div>
      </footer>
      }
      <div className="mobile-menu"></div>
      <div>
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onSignedIn={(name) => setUsername(name)}
        />
      </div>
    </div>
  );
}
