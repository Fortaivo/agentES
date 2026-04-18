import React, { useState } from 'react';
import { Crown, Facebook, Mail } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-yellow-400">
          <Crown size={64} />
        </div>
        <div className="absolute bottom-20 right-20 text-yellow-400">
          <Crown size={48} />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-4 bg-gradient-to-b from-yellow-100 to-amber-200 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-amber-800 mb-2">EMPIRE STRIKE</h1>
              <div className="w-full h-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded" />
            </div>

            <div className="bg-gradient-to-b from-amber-100 to-yellow-200 p-6 rounded-lg border-2 border-yellow-600">
              <h2 className="text-2xl font-bold text-amber-800 text-center mb-6">
                {isRegister ? 'REGISTRARSE' : 'ENTRAR'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-800 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full p-3 border-2 border-yellow-600 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-amber-800 font-semibold mb-2">
                    Contrasena
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full p-3 border-2 border-yellow-600 rounded bg-amber-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold py-3 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
                >
                  {isRegister ? 'CREAR CUENTA' : 'ENTRAR AL IMPERIO'}
                </button>
              </form>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Facebook size={20} />
                  {isRegister ? 'Registrarse' : 'Entrar'} con Facebook
                </button>

                <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Mail size={20} />
                  {isRegister ? 'Registrarse' : 'Entrar'} con Google
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-amber-600 text-xs mb-2">Razas disponibles:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {['Elfos', 'Elfos Oscuros', 'Enanos', 'Humanos', 'No Muertos', 'Orcos'].map((raza) => (
                    <span
                      key={raza}
                      className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-yellow-300"
                    >
                      {raza}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-amber-800 hover:text-amber-900 font-semibold"
                >
                  {isRegister ? 'Ya tienes cuenta? Inicia sesion' : 'Nuevo jugador? Registrate'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 p-8 bg-gradient-to-br from-yellow-200 to-amber-300">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-amber-800 mb-4 text-center">
                JUEGO DE ESTRATEGIA BELICA
              </h3>
              <div className="bg-amber-100 p-4 rounded-lg border border-yellow-600">
                <p className="text-amber-800 text-center leading-relaxed">
                  Juego militar de estrategia que te lleva a un mundo de fantasia
                  donde eres el controlador total de un imperio entero.
                </p>
                <br />
                <p className="text-amber-800 text-center leading-relaxed">
                  Elige una raza entre orcos, humanos, elfos, no muertos, enanos
                  y elfos oscuros para establecer tu imperio.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">
                CAPTURAS DE PANTALLA
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-800 h-24 rounded-lg flex items-center justify-center">
                  <span className="text-amber-200 text-xs">Vista de Ciudad</span>
                </div>
                <div className="bg-amber-800 h-24 rounded-lg flex items-center justify-center">
                  <span className="text-amber-200 text-xs">Gestion de Heroes</span>
                </div>
                <div className="bg-amber-800 h-24 rounded-lg flex items-center justify-center">
                  <span className="text-amber-200 text-xs">Campo de Batalla</span>
                </div>
                <div className="bg-amber-800 h-24 rounded-lg flex items-center justify-center">
                  <span className="text-amber-200 text-xs">Mapa Mundial</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">
                RANKINGS DE HOY
              </h4>
              <div className="bg-amber-100 p-4 rounded-lg border border-yellow-600">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-800">1. Imperio Dorado</span>
                    <span className="text-amber-600 font-bold">15,432</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-800">2. Reino del Norte</span>
                    <span className="text-amber-600 font-bold">14,567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-800">3. Fortaleza Elfica</span>
                    <span className="text-amber-600 font-bold">13,892</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
