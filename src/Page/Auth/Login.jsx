import  { useState } from 'react'
import Input from '../../Componentes/Inputs/Input'
import { ingresarUsuario } from '../../Services/Login/LoginService';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
    const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

   const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await ingresarUsuario(formData.username, formData.password);
      setMensaje(data.mensaje);
       localStorage.setItem("usuarioLogueado", JSON.stringify(data.user));

      navigate("/home");
    } catch (err) {
      setMensaje(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
       
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
         
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-600">Ingresa a tu cuenta para continuar</p>
          </div>

         
          <form onSubmit={handleSubmit} className="space-y-6">
           
            <Input
              label="Usuario o Email"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              required={true}
              placeholder=" "
            />

           
            <Input
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required={true}
              placeholder=" "
            />

           
          

           
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.username || !formData.password}
            >
              Ingresar
            </button>

                {mensaje && (
                     <p className="text-center mt-4 text-sm text-gray-700">{mensaje}</p>
                )}
           
            <div className="relative flex items-center my-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">o</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

           
            <div className="text-center">
              <p className="text-gray-700">
                ¿No tienes una cuenta?{' '}
                <Link to={'/registro'} 
                 
                  className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200 underline underline-offset-2"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  )
}

export default Login