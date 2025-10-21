import React, { useEffect, useState } from "react";
import { Nav } from "../../Componentes/Nav/Nav";
import Panel from "../../Componentes/Panel/Panel";
import { Card } from "../../Componentes/Cards/Card";
import { Tbl } from "../../Componentes/Tbl/Tbl";
import Input from "../../Componentes/Inputs/Input";
import { Select } from "../../Componentes/Inputs/Select";
import { TextTarea } from "../../Componentes/Inputs/TextTarea";
import { agregarTarea } from "../../Services/AgregarTarea/AgregarTareaService";
import { obtenerTareas } from "../../Services/AgregarTarea/ObtenerTareasService";
import { actualizarTarea } from "../../Services/AgregarTarea/ActualizarTareasService";
import { eliminarTarea } from "../../Services/AgregarTarea/EliminarTareaService";
import Swal from "sweetalert2";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [usuarios, setUsuarios] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "pendiente",
    prioridad: "media",
    fecha_creacion: "",
    fecha_vencimiento: "",
  });
  const [mensaje, setMensaje] = useState();
  const [tareas, setTareas] = useState([]);
  const [Editar, setEditar] = useState(false);
  const [tareaEditar, setTareaEditar] = useState(null);

  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [mostrarOrden, setMostrarOrden] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [orden, setOrden] = useState("");
  const [tareasFiltradas, setTareasFiltradas] = useState([]);

  const totalTareas = tareas.length;
  const completadas = tareas.filter(t => t.estado === "completada").length;
  const enProgreso = tareas.filter(t => t.estado === "en progreso").length;
  const pendientes = tareas.filter(t => t.estado === "pendiente").length;
  const porcentajeCompletadas = totalTareas ? Math.round((completadas / totalTareas) * 100) : 0;
  const porcentajePendientes = 100 - porcentajeCompletadas;

  const alta = tareas.filter(t => t.prioridad === "alta").length;
  const media = tareas.filter(t => t.prioridad === "media").length;
  const baja = tareas.filter(t => t.prioridad === "baja").length;

  const totalPrioridades = alta + media + baja;
  const pctAlta = totalPrioridades ? Math.round((alta / totalPrioridades) * 100) : 0;
  const pctMedia = totalPrioridades ? Math.round((media / totalPrioridades) * 100) : 0;
  const pctBaja = totalPrioridades ? Math.round((baja / totalPrioridades) * 100) : 0;

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
        if (usuario) {
          const data = await obtenerTareas(usuario.id);

          const tareasFormateadas = data.map(t => ({
            ...t,
            fecha_vencimiento: t.fecha_vencimiento
              ? new Date(t.fecha_vencimiento).toLocaleDateString("es-CO")
              : "",
            fecha_creacion: t.fecha_creacion
              ? new Date(t.fecha_creacion).toLocaleDateString("es-CO")
              : "",
          }));

          setTareas(tareasFormateadas);
        }
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      }
    };

    fetchTareas();
  }, []);


  useEffect(() => {
    let filtradas = [...tareas];


    if (filtroEstado) {
      filtradas = filtradas.filter(
        (t) => t.estado.toLowerCase() === filtroEstado.toLowerCase()
      );
    }


    if (orden === "fecha") {
      filtradas.sort(
        (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      );
    } else if (orden === "prioridad") {
      const prioridadOrden = { alta: 1, media: 2, baja: 3 };
      filtradas.sort(
        (a, b) => prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad]
      );
    }

    setTareasFiltradas(filtradas);
  }, [filtroEstado, orden, tareas]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
      if (!usuario) {
        Swal.fire({
          title: "Sesión no iniciada",
          text: "Debes iniciar sesión antes de crear una tarea.",
          icon: "warning",
          confirmButtonColor: "#0e54e2",
        });
        return;
      }

      if (Editar && tareaEditar) {
        await actualizarTarea(
          tareaEditar.id,
          formData.descripcion,
          formData.estado,
          formData.prioridad
        );

        setTareas((prev) =>
          prev.map((t) =>
            t.id === tareaEditar.id
              ? { ...t, descripcion: formData.descripcion, estado: formData.estado, prioridad: formData.prioridad }
              : t
          )
        );

        Swal.fire({
          title: "Tarea actualizada",
          text: "La tarea fue modificada correctamente.",
          icon: "success",
          confirmButtonColor: "#0e54e2",
        });
      } else {
        const nuevaTarea = {
          ...formData,
          id_usuario: usuario.id,
        };

        const tareaCreada = await agregarTarea(nuevaTarea);

        const tareaFormateada = {
          ...nuevaTarea,
          id: tareaCreada.idTarea,
          usuario: usuario.usuario,
          fecha_creacion: new Date().toLocaleDateString("es-CO"),
        };

        setTareas((prev) => [tareaFormateada, ...prev]);

        Swal.fire({
          title: "Tarea creada",
          text: "La tarea fue registrada correctamente.",
          icon: "success",
          confirmButtonColor: "#0e54e2",
        });
      }

      setShowPanel(false);
      setEditar(false);
      setTareaEditar(null);
      setFormData({
        titulo: "",
        descripcion: "",
        estado: "pendiente",
        prioridad: "media",
        fecha_creacion: "",
        fecha_vencimiento: "",
      });
    } catch (error) {
      console.error("Error al guardar la tarea:", error);

      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la tarea. Intenta nuevamente.",
        icon: "error",
        confirmButtonColor: "#e20e0e",
      });
    }
  };

  const handleEliminarTarea = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la tarea permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e20e0e",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        await eliminarTarea(id);
        setTareas((prevTareas) => prevTareas.filter((t) => t.id !== id));

        Swal.fire({
          title: "Eliminada",
          text: "La tarea fue eliminada correctamente.",
          icon: "success",
          confirmButtonColor: "#0e54e2",
        });
      } catch (error) {
        console.error("Error al eliminar tarea:", error);

        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la tarea. Intenta nuevamente.",
          icon: "error",
          confirmButtonColor: "#e20e0e",
        });
      }
    }
  };

  const togglePanel = () => setShowPanel(!showPanel);

  const closePanel = () => {
    setShowPanel(false);
    setEditar(false);
    setTareaEditar(null);
    setFormData({
      titulo: "",
      descripcion: "",
      estado: "pendiente",
      prioridad: "media",
      fecha_creacion: "",
      fecha_vencimiento: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">

      <Nav />


      <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Dashboard de Tareas
            </h1>
            <p className="text-slate-600 text-lg">
              Resumen general y gestión de tareas
            </p>
          </div>


          <button
            onClick={togglePanel}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:rotate-90 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Crear Nueva Tarea</span>
          </button>
        </div>


        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Total Tareas</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{totalTareas}</p>
              <p className="text-sm text-slate-500 mt-2">Tareas registradas</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Completadas</h3>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{completadas}</p>
              <p className="text-sm text-slate-500 mt-2">{porcentajeCompletadas}% del total</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">En Progreso</h3>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{enProgreso}</p>
              <p className="text-sm text-slate-500 mt-2">Tareas en proceso</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-medium">Pendientes</h3>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{pendientes}</p>
              <p className="text-sm text-slate-500 mt-2">Por comenzar</p>
            </div>
          </div>
        </section>


        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          <div className="xl:col-span-2 space-y-8">

            <section className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Gestión de Tareas
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Lista completa de todas tus tareas
                  </p>
                </div>
                <div className="relative flex gap-2">
                  {/* FILTRAR */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setMostrarFiltro(!mostrarFiltro);
                        setMostrarOrden(false);
                      }}
                      className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      Filtrar
                    </button>

                    {mostrarFiltro && (
                      <div className="absolute mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                        {["todos", "pendiente", "en progreso", "completada"].map((estado) => (
                          <button
                            key={estado}
                            onClick={() => {
                              setFiltroEstado(estado === "todos" ? "" : estado);
                              setMostrarFiltro(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${filtroEstado === estado ? "bg-slate-200 font-medium" : ""
                              }`}
                          >
                            {estado === "todos"
                              ? "Todos"
                              : estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ORDENAR */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setMostrarOrden(!mostrarOrden);
                        setMostrarFiltro(false);
                      }}
                      className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    >
                      Ordenar
                    </button>

                    {mostrarOrden && (
                      <div className="absolute mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            setOrden("fecha");
                            setMostrarOrden(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${orden === "fecha" ? "bg-slate-200 font-medium" : ""
                            }`}
                        >
                          Fecha de creación
                        </button>
                        <button
                          onClick={() => {
                            setOrden("prioridad");
                            setMostrarOrden(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${orden === "prioridad" ? "bg-slate-200 font-medium" : ""
                            }`}
                        >
                          Prioridad
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Tbl
                columns={[
                  { header: "Título", accessor: "titulo" },
                  { header: "Descripción", accessor: "descripcion" },
                  {
                    header: "Estado",
                    accessor: "estado",
                    render: (tarea) => {
                      const estadoConfig = {
                        "pendiente": { color: "bg-red-100 text-red-800", label: "Pendiente" },
                        "en progreso": { color: "bg-yellow-100 text-yellow-800", label: "En Progreso" },
                        "completada": { color: "bg-green-100 text-green-800", label: "Completada" }
                      };
                      const config = estadoConfig[tarea.estado] || { color: "bg-gray-100 text-gray-800", label: tarea.estado };
                      return (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      );
                    }
                  },
                  {
                    header: "Prioridad",
                    accessor: "prioridad",
                    render: (tarea) => {
                      const prioridadConfig = {
                        "alta": { color: "bg-red-100 text-red-800", label: "Alta" },
                        "media": { color: "bg-yellow-100 text-yellow-800", label: "Media" },
                        "baja": { color: "bg-green-100 text-green-800", label: "Baja" }
                      };
                      const config = prioridadConfig[tarea.prioridad] || { color: "bg-gray-100 text-gray-800", label: tarea.prioridad };
                      return (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          {config.label}
                        </span>
                      );
                    }
                  },
                   {
      header: "Creación",
      accessor: "fecha_creacion",
      render: (tarea) => (
        <span className="text-sm text-slate-700">{tarea.fecha_creacion}</span>
      ),
    },
    {
      header: "Vencimiento",
      accessor: "fecha_vencimiento",
      render: (tarea) => (
        <span
          className={`text-sm ${
            tarea.fecha_vencimiento === "Sin fecha"
              ? "text-slate-400 italic"
              : "text-slate-700"
          }`}
        >
          {tarea.fecha_vencimiento}
        </span>
      ),
    },
                  {
                    header: "Acciones",
                    render: (tarea) => (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditar(true);
                            setTareaEditar(tarea);
                            setFormData({
                              ...tarea,
                              fecha_creacion: tarea.fecha_creacion
                                ? new Date(tarea.fecha_creacion.split("/").reverse().join("-")).toISOString().split("T")[0]
                                : "",
                              fecha_vencimiento: tarea.fecha_vencimiento
                                ? new Date(tarea.fecha_vencimiento.split("/").reverse().join("-")).toISOString().split("T")[0]
                                : "",
                            });
                            setShowPanel(true);
                          }}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarTarea(tarea.id)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={tareasFiltradas}
              />
            </section>
          </div>


          <div className="space-y-8">

            <section className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                Progreso General
              </h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="339.292"
                        strokeDashoffset={339.292 * (1 - porcentajeCompletadas / 100)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">{porcentajeCompletadas}%</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mt-4 font-medium">Tareas Completadas</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Completadas</span>
                    <span className="font-semibold text-slate-800">{completadas}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">En Progreso</span>
                    <span className="font-semibold text-slate-800">{enProgreso}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Pendientes</span>
                    <span className="font-semibold text-slate-800">{pendientes}</span>
                  </div>
                </div>
              </div>
            </section>


            <section className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                Distribución por Prioridad
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700 font-medium">Alta</span>
                    <span className="text-slate-600 text-sm">{pctAlta}% ({alta})</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pctAlta}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700 font-medium">Media</span>
                    <span className="text-slate-600 text-sm">{pctMedia}% ({media})</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pctMedia}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700 font-medium">Baja</span>
                    <span className="text-slate-600 text-sm">{pctBaja}% ({baja})</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pctBaja}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Panel for Creating/Editing Tasks */}
      <Panel isOpen={showPanel} onClose={closePanel}>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {Editar ? "Editar Tarea" : "Crear Nueva Tarea"}
            </h3>
            <p className="text-slate-600 text-sm">
              {Editar
                ? "Modifica la información de la tarea seleccionada"
                : "Completa los detalles para registrar una nueva tarea en el sistema"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Título de la tarea"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange("titulo")}
              placeholder="Ej. Diseñar interfaz principal"
              disabled={Editar}
            />

            <TextTarea
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange("descripcion")}
              placeholder="Escribe una breve descripción de la tarea..."
              rows={4}
              maxLength={300}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange("estado")}
                options={[
                  { label: "Pendiente", value: "pendiente" },
                  { label: "En progreso", value: "en progreso" },
                  { label: "Completada", value: "completada" },
                ]}
                placeholder="Selecciona el estado"
              />

              <Select
                label="Prioridad"
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange("prioridad")}
                disabled={Editar}
                options={[
                  { label: "Alta", value: "alta" },
                  { label: "Media", value: "media" },
                  { label: "Baja", value: "baja" },
                ]}
                placeholder="Selecciona la prioridad"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Fecha de creación"
                name="fecha_creacion"
                value={formData.fecha_creacion}
                onChange={handleChange("fecha_creacion")}
                disabled={Editar}
              />
              <Input
                type="date"
                label="Fecha de vencimiento"
                name="fecha_vencimiento"
                value={formData.fecha_vencimiento}
                onChange={handleChange("fecha_vencimiento")}
                disabled={Editar}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={closePanel}
                className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all shadow-md hover:shadow-lg"
              >
                {Editar ? "Actualizar Tarea" : "Crear Tarea"}
              </button>
            </div>
          </form>
          {mensaje && (
            <p className="text-center text-sm text-slate-700 mt-2">{mensaje}</p>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default Home;