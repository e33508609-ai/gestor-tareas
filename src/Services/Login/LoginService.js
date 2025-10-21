import axios from "axios";

const API_URL = "https://backend-gestor-tareas-9vv2.vercel.app"; 


export const ingresarUsuario = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      usuario: username,
      password: password,
    });
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Error de conexión con el servidor");
    }
  }
};
