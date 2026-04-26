import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Item = {
  id: string
  name: string
  category: string
  quantity: number
  done: boolean
  added_by: string
  created_at: string
}

export type MenuDay = {
  dia: string
  comida: string
  cena: string
  ingredientes: string[]
}

export type WeekMenu = {
  menu: MenuDay[]
}
