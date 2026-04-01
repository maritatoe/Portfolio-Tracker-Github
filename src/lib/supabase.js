import { createClient } from '@supabase/supabase-js'

// Estas variables de entorno deben configurarse en un archivo .env.local
// en la raíz del proyecto.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')
