import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { Toaster } from 'react-hot-toast'

// Pages & Components
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={!session ? <Login /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={session ? <Layout session={session} /> : <Navigate to="/login" />}
          >
            <Route index element={<Dashboard session={session} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
