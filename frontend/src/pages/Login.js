import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../api/api";

const initialSignupState = {
  name: "",
  email: "",
  password: "",
  role: "member"
};

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupData, setSignupData] = useState(initialSignupState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleLogin = async () => {
    setLoading(true);
    resetMessages();

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupChange = (event) => {
    const { name, value } = event.target;

    setSignupData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSignup = async () => {
    setLoading(true);
    resetMessages();

    try {
      await signupUser(signupData);
      setSuccess("Account created successfully. Please sign in.");
      setMode("login");
      setEmail(signupData.email);
      setPassword("");
      setSignupData(initialSignupState);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <p className="eyebrow">Team Task Manager</p>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="helper-text">
            {mode === "login"
              ? "Sign in to manage projects and keep your team on track."
              : "Create an account as an admin or member to join the workspace."}
          </p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "secondary-button is-active" : "secondary-button"}
            onClick={() => {
              setMode("login");
              resetMessages();
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "signup" ? "secondary-button is-active" : "secondary-button"}
            onClick={() => {
              setMode("signup");
              resetMessages();
            }}
          >
            Sign Up
          </button>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {success ? <p className="success-text">{success}</p> : null}

        {mode === "login" ? (
          <div className="form-stack">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        ) : (
          <div className="form-stack">
            <input
              name="name"
              placeholder="Full name"
              value={signupData.name}
              onChange={handleSignupChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
            />

            <input
              name="password"
              placeholder="Password"
              type="password"
              value={signupData.password}
              onChange={handleSignupChange}
            />

            <select
              name="role"
              value={signupData.role}
              onChange={handleSignupChange}
              className="input-select"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>

            <button onClick={handleSignup} disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
