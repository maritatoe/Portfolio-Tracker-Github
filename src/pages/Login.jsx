import { supabase } from '../lib/supabase'
import { TrendingUp, ShieldCheck } from 'lucide-react'

export default function Login() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
    if (error) {
      console.error('Error al iniciar sesión:', error.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600">
          <TrendingUp className="w-12 h-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Portfolio Tracker
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Gestiona tus inversiones de forma inteligente
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-100">
          <div className="space-y-6">
            <div>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <img
                  className="h-5 w-5 mr-3"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                Continuar con Google
              </button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    Seguridad garantizada
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center text-sm text-slate-500 mt-6">
               <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
               Tus datos están protegidos y son privados
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
