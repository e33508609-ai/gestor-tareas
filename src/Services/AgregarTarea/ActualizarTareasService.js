import axios from "axios";

const API_URL = "https://backend-gestor-tareas-9vv2.vercel.app";

export const actualizarTarea = async (id, descripcion, estado, prioridad) => {
    try {
    const response = await axios.put(`${API_URL}/tareas/${id}`, {
      descripcion,
      estado,
      prioridad
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    throw error.response?.data || { error: "Error desconocido" };
  }
}