import { jwtDecode } from "jwt-decode";

export const obtenerUsuarioActual = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);
  
    return {
      id: decoded.id || decoded.userId,
      usuario: decoded.usuario || decoded.username,
    };
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};
