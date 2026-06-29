import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, ErrorMessage, Loading } from "../components";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-spotify-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-spotify-green font-bold text-3xl">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.6 17.5c-.6.8-1.6 1.3-2.7 1.3-1 0-2-.5-2.6-1.4-2.9 2-7.5 3.2-12.4 1.5-.6-.2-.9-.8-.7-1.4.2-.6.8-.9 1.4-.7 4.1 1.5 8.1.5 10.6-1.7 2.5 1.1 5.8 1.2 8.3.2.6-.3 1.3.1 1.5.6l-.8 1.6zm1.4-3.5c-.7 1-1.9 1.6-3.1 1.6s-2.4-.6-3.1-1.6c-3.5 2.2-9.1 3.5-14.2 1.4-.6-.3-1-.9-.7-1.5.3-.6.9-1 1.5-.7 4.4 1.8 9.1.7 12.3-1.5 3.2 2.2 7.9 3.3 12.3 1.5.6-.3 1.2 0 1.5.7.3.6 0 1.2-.7 1.5-5.1 2.1-10.7.8-14.2-1.4z" />
            </svg>
            <span>Spotify</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-spotify-card rounded-lg p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Login
          </h1>

          {error && (
            <ErrorMessage message={error} onDismiss={() => setError("")} />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Link to Register */}
          <p className="text-center text-spotify-lightText mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-spotify-green hover:text-green-400 font-semibold"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
