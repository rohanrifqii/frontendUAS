import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../lib/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.user.id_role === 2) {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
      
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Login gagal");
        return;
      }

      setError("Login gagal");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      {error && <p>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Login"}
      </button>
    </form>
  );
}

export default Login;
