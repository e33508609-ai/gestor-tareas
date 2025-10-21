import axios from "axios";

const API_URL = "https://backend-gestor-tareas-9vv2.vercel.app"; 

export const registrarUsuarios = async (usuario, password) => {
  try {
    const response = await axios.post(`${API_URL}/registro`, { usuario, password });
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error.response?.data || { error: "Error desconocido" };
  }
};
