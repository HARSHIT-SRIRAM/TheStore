import { jwtDecode } from "jwt-decode";

export function getAuthDetails() {
  const token = localStorage.getItem("token");

  if (!token) {
    return { token: null, userId: null, decodedToken: null }; // Return nulls or empty values if no token
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  return {
    token,
    userId,
    decodedToken,
  };
}
