import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
const [usuario, setUsuario] = useState(null);
  const toggleMenu = () => setOpen(!open);

  const handleCerrarSesion = () => {
     localStorage.removeItem("usuarioLogueado");
    navigate("/");
  };

    useEffect(() => {
   
    const userData = localStorage.getItem("usuarioLogueado");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="bg-[#0b42b1] text-white shadow-lg px-6 py-4 flex justify-between items-center relative">
      <h1 className="text-xl font-semibold">Gestor de Tareas</h1>

    
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
        >
          <span>Mi cuenta</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#E4E7EB] z-10 overflow-hidden">
            <div className="p-3 border-b border-[#E4E7EB]">
            <span className="text-[#1a1a1a]">{usuario ? usuario.usuario : "Mi cuenta"}</span>
             
            </div>
            
            <button
              onClick={handleCerrarSesion}
              className="flex items-center gap-2 w-full text-left px-4 py-3 text-[#FF6B6B] hover:bg-[#F5F7FA] transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>

     
      {open && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setOpen(false)}
        />
      )}
    </nav>
  );
};