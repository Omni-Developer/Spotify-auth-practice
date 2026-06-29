import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components";
import { PlayerProvider } from "./context/PlayerContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BrowseMusic from "./pages/BrowseMusic";
import BrowseAlbums from "./pages/BrowseAlbums";
import UploadMusic from "./pages/UploadMusic";
import CreateAlbum from "./pages/CreateAlbum";
import ProfilePage from "./pages/ProfilePage";
import AlbumPage from "./pages/AlbumPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/music"
              element={
                <ProtectedRoute>
                  <BrowseMusic />
                </ProtectedRoute>
              }
            />

            <Route
              path="/albums"
              element={
                <ProtectedRoute>
                  <BrowseAlbums />
                </ProtectedRoute>
              }
            />

            <Route
              path="/album/:id"
              element={
                <ProtectedRoute>
                  <AlbumPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload"
              element={
                <ProtectedRoute requireRole="artist">
                  <UploadMusic />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-album"
              element={
                <ProtectedRoute requireRole="artist">
                  <CreateAlbum />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
