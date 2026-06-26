import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginUser } from "../services/AuthService";
import "../styles/Login.css";
import Navbar from "../components/home/NavBar";
import { showSuccess, showError } from "../utils/toast";
import { login } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import Footer from "../components/home/Footer";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function validateForm() {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    const emailPattern =
      /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;

    if (!emailPattern.test(email)) {
      setError("Enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  }

  function navigateByRole(roleId: number) {
    switch (roleId) {
      case 1:
        navigate("/admin-dashboard");
        break;

      case 2:
        navigate("/doctor-dashboard");
        break;

      case 3:
        navigate("/patient-dashboard");
        break;

      case 4:
        navigate("/nurse-dashboard");
        break;

      default:
        setError("Invalid user role");
    }
  }

  async function handleLogin(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const data = await LoginUser({ email, password });

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role_id", data.user.role_id.toString());
        localStorage.setItem("user_id", data.user.id.toString());

        dispatch(
          login({
            token: data.token,
            userId: data.user.id,
            roleId: data.user.role_id,
          }),
        );
        showSuccess("Login Successfull");

        navigateByRole(data.user.role_id);
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      showError("Login Unsuccessfull");
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-division">
      <section>
        <Navbar />
        <div className="login-container">
          <h1>Login</h1>

          <form onSubmit={handleLogin} data-testid="login-form">
            {" "}
            <div>
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button className="loginbutton" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="register-link">
              New user?{" "}
              <Link to="/patient-registration" className="register-link">
                Register
              </Link>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Login;
