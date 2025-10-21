import axios from "axios";

const API_URL = "https://backend-gestor-tareas-9vv2.vercel.app";


export const eliminarTarea = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/tareas/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
        throw error.response?.data || { error: "Error desconocido" };
    }
};