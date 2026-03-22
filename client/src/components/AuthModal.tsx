import { useState } from "react";
import { signIn, signUp } from "../api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSignedIn: (username: string) => void;
};

export function AuthModal({ isOpen, onClose, onSignedIn }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  async function handleSignUp() {
    try {
      const result = await signUp({ username, email, password });
      setMessage(result.message);
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  async function handleSignIn() {
    try {
      const result = await signIn({ email, password });
      localStorage.setItem("TaiKhoanDangNhap", result.username);
      onSignedIn(result.username);
      onClose();
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  return (
    <div id="id01" className="modal react-modal-open" onClick={onClose}>
      <div className="modal-content animate" onClick={(e) => e.stopPropagation()}>
        <div className="imgcontainer">
          <span className="close" title="Close Modal" onClick={onClose}>
            &times;
          </span>
          <img
            src="https://cdn.vox-cdn.com/thumbor/NPS8CcrYyJrfAkCKRXRCx7YSsGU=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/15970326/devine_lebron_washed_getty_ringer.jpg"
            alt="Avatar"
            className="avatar"
          />
        </div>
        <div className="homchua">
          <label>
            <b>Username</b>
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
          />
          <label>
            <b>Email</b>
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <label>
            <b>Password</b>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
          <div className="button-thing">
            <div className="btn draw-border">
              <button type="button" className="button-53" onClick={handleSignUp}>
                SignUp
              </button>
            </div>
            <div className="btn draw-border">
              <button type="button" className="button-53" onClick={handleSignIn}>
                Login
              </button>
            </div>
          </div>
          {message && <p className="auth-message">{message}</p>}
        </div>
        <div className="homchua auth-footer">
          <button type="button" className="cancelbtn button-54" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
