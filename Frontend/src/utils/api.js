// Base API URL - adjust if backend runs on different port
const API_BASE_URL = "http://localhost:3000/api";

/**
 * Generic fetch wrapper with auth headers
 */
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body,
    headers: customHeaders = {},
    ...rest
  } = options;

  const token = localStorage.getItem("token");

  const isFormData = body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),

    ...(token && {
      Authorization: `Bearer ${token}`,
    }),

    ...customHeaders,
  };

  try {
    const config = {
      method,
      headers,
      ...rest,
    };

    if (body && method !== "GET") {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    const contentType = response.headers.get("content-type");

    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = {
        message: "Invalid response from server",
      };
    }

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Auth-specific API calls
 */
export const authAPI = {
  register: (username, email, password, role = "listener") =>
    apiCall("/auth/register", {
      method: "POST",
      body: { username, email, password, role },
    }),

  login: (email, password) =>
    apiCall("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  logout: () => {
    // Backend typically handles this via cookie; frontend just clears state
    localStorage.removeItem("token");
  },

  getProfile: () =>
    apiCall("/auth/profile", {
      method: "GET",
    }),

  updateProfile: (bio, profilePic) => {
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    return apiCall("/auth/profile", {
      method: "POST",
      body: formData,
    });
  },
};

/**
 * Music API calls
 */
/**
 * Music API calls
 */
export const musicAPI = {
  // Get all music
  getAllMusic: () =>
    apiCall("/music/all", {
      method: "GET",
    }),

  // Get all albums
  getAllAlbums: () =>
    apiCall("/music/albums", {
      method: "GET",
    }),

  // Get single album
  getAlbumById: (id) =>
    apiCall(`/music/album/${id}`, {
      method: "GET",
    }),

  // Upload music
  uploadMusic: (title, file, coverImage, artist) => {
    const formData = new FormData();

    console.log("=== UPLOAD MUSIC DEBUG ===");
    console.log("Title:", title);
    console.log("File object:", file);
    console.log("File size:", file?.size);
    console.log("File type:", file?.type);
    console.log("Cover image:", coverImage);
    console.log("Cover size:", coverImage?.size);
    console.log("=========================");

    formData.append("title", title);
    formData.append("file", file);
    formData.append("coverImage", coverImage);
    formData.append("artist", artist);

    return apiCall("/music/upload", {
      method: "POST",
      body: formData,
    });
  },

  // Create album
  createAlbum: (title, musicIds, artist) =>
    apiCall("/music/album", {
      method: "POST",
      body: {
        title,
        musicIds,
        artist,
      },
    }),

  // Create album with cover image
  createAlbumWithCover: (formData) =>
    apiCall("/music/album", {
      method: "POST",
      body: formData,
    }),
};
