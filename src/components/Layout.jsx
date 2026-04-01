import { Outlet, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LayoutDashboard, LogOut, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Layout({ session }) {
  const navigate = useNavigate()
  const user = session?.user

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error al cerrar sesión')
    } else {
      toast.success('Sesión cerrada')
      navigate('/login')
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <Briefcase className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-lg tracking-tight">Mi Portafolio</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link 
            to="/" 
            className="flex items-center px-3 py-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Panel Control
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="mb-4">
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4">
          <div className="flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-indigo-600" />
            <span className="font-bold">Mi Portafolio</span>
          </div>
          <button onClick={handleSignOut} className="text-slate-500 hover:text-slate-700">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
