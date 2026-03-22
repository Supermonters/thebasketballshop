import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api";

export function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const hrefs = [
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css",
      "/legacy-admin/style.css",
    ];
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
    try {
      await adminLogin(username, password);
      localStorage.setItem("adminCreds", JSON.stringify({ username, password }));
      navigate("/admin/product");
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <section className="react-admin-login">
      <div className="container">
        <div className="react-admin-row">
          <div className="login-box">
            <div className="login-key">
              <i className="fa fa-key" aria-hidden="true" />
            </div>
            <div className="login-title">ADMIN PANEL</div>
            <div className="login-form">
              <form onSubmit={submit}>
                <div className="form-group">
                  <label className="form-control-label">USERNAME</label>
                  <input
                    type="text"
                    className="form-control"
                    title="Admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-control-label">PASSWORD</label>
                  <input
                    type="password"
                    className="form-control"
                    title="Admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="loginbttm">
                  <div className="login-btm login-button">
                    <button type="submit" className="btn btn-outline-primary">
                      LOGIN
                    </button>
                  </div>
                </div>
              </form>
              {message && <p className="react-admin-message">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
