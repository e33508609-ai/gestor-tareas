import React, { useState } from 'react';
import Input from '../../Componentes/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuarios } from '../../Services/Login/RegistroService';

const RegistrarUsuario = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const navigate = useNavigate(); // 👈 para redirigir después de registrar
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    try {
      const data = await registrarUsuarios(formData.usuario, formData.password);
      console.log("Respuesta del backend:", data);
      setMensaje(data.mensaje || "Registro exitoso ✅");
      setTipoMensaje("exito");
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setMensaje(err.error || "Error al registrar usuario ❌");
      setTipoMensaje("error");
    }
  };
  const isFormValid = formData.usuario && formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Tarjeta de Registro */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600">Regístrate en nuestra plataforma</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario */}
            <Input
              label="Nombre de Usuario"
              type="text"
              value={formData.usuario}
              onChange={handleChange('usuario')}
              required={true}
              placeholder=" "
              error={errors.usuario}
            />

            {/* Contraseña */}
            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required={true}
              placeholder=" "
              error={errors.password}
            />

            {/* Botón de Registro */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
            >
              Registrarse
            </button>

            {mensaje && (
              <p
                className={`text-center mt-4 font-semibold ${tipoMensaje === "exito" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {mensaje}
              </p>
            )}
            {/* Separador */}
            <div className="relative flex items-center my-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">¿Ya tienes cuenta?</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Link a Login */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-block w-full py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                Iniciar Sesión
              </Link>
            </div>
          </form>
        </div>


      </div>
    </div>
  );
}

export default RegistrarUsuario;