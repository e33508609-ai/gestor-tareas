import axios from "axios";
const API_URL = "https://backend-gestor-tareas-9vv2.vercel.app";

export const agregarTarea = async (tarea) => {
    try {
        const response = await axios.post(`${API_URL}/tareas`, tarea);
        return response.data;
    } catch (error) {
        console.error("Error al agregar tarea:", error);
        throw error.response?.data || { error: "Error desconocido" };
    }
}