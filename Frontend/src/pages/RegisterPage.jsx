import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, ErrorMessage } from "../components";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("listener");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await register(username, email, password, role);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Registration failed");
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
            Create Account
          </h1>

          {error && (
            <ErrorMessage message={error} onDismiss={() => setError("")} />
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

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
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-white">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="bg-spotify-hover border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
              >
                <option value="listener">Listener</option>
                <option value="artist">Artist</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          {/* Link to Login */}
          <p className="text-center text-spotify-lightText mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-spotify-green hover:text-green-400 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
