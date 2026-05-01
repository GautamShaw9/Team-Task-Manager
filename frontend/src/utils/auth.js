export const getToken = () => localStorage.getItem("token");

export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    const encoded = `${normalized}${padding}`;
    const decoded = atob(encoded);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getCurrentUser = () => decodeToken(getToken());
