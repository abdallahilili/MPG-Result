import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Variables d\'environnement Supabase manquantes.\n' +
    'Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre plateforme de déploiement (Vercel, Netlify, etc.)'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
