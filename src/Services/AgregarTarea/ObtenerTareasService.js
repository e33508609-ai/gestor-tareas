import axios from "axios";

const API_URL = "https://backend-gestor-tareas-9vv2.vercel.app";

export const obtenerTareas = async (id_usuario) => {
    try {
        const response = await axios.get(`${API_URL}/tareas/${id_usuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        throw error.response?.data || { error: "Error desconocido" };
    }
}