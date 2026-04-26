'use client'

import { useEffect, useState } from 'react'
import { supabase, type MenuDay, type WeekMenu } from '../../lib/supabase'
import BottomNav from '../../components/BottomNav'
import styles from './menu.module.css'

const EMOJIS = ['🌙', '🌟', '🍀', '⚡', '🎉', '🌹', '☀️']
const DAYS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function MenuPage() {
  const [menu, setMenu] = useState<WeekMenu | null>(null)
  const [loading, setLoading] = useState(false)
  const [addedDays, setAddedDays] = useState<Set<number>>(new Set())
  const [toast, setToast] = useState('')

  useEffect(() => {
    loadSavedMenu()
  }, [])

  async function loadSavedMenu() {
    const { data } = await supabase
      .from('menus')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (data?.week_data) setMenu(data.week_data as WeekMenu)
  }

  async function generateMenu() {
    setLoading(true)
    setAddedDays(new Set())
    try {
      const res = await fetch('/api/menu', { method: 'POST' })
      const data = await res.json()
      if (data.menu) {
        setMenu(data)
        // Save to Supabase
        await supabase.from('menus').insert({ week_data: data })
      }
    } catch (e) {
      // Fallback
      const fallback: WeekMenu = {
        menu: [
          { dia: 'Lunes', comida: 'Lentejas estofadas con chorizo', cena: 'Tortilla de patatas y ensalada', ingredientes: ['Lentejas', 'Chorizo', 'Patatas', 'Huevos', 'Cebolla'] },
          { dia: 'Martes', comida: 'Arroz a la cubana', cena: 'Crema de calabacín con pan', ingredientes: ['Arroz', 'Tomate frito', 'Plátano', 'Huevos', 'Calabacín'] },
          { dia: 'Miércoles', comida: 'Pollo al horno con patatas', cena: 'Gazpacho y queso fresco', ingredientes: ['Pollo', 'Patatas', 'Tomate', 'Pepino', 'Pimiento'] },
          { dia: 'Jueves', comida: 'Pasta carbonara', cena: 'Ensalada de garbanzos', ingredientes: ['Pasta', 'Bacon', 'Nata', 'Garbanzos', 'Parmesano'] },
          { dia: 'Viernes', comida: 'Merluza en salsa verde', cena: 'Pizza casera con mozzarella', ingredientes: ['Merluza', 'Perejil', 'Ajo', 'Mozzarella', 'Harina'] },
          { dia: 'Sábado', comida: 'Fabada asturiana', cena: 'Tabla de quesos y embutidos', ingredientes: ['Fabes', 'Lacón', 'Morcilla', 'Salchichón', 'Queso curado'] },
          { dia: 'Domingo', comida: 'Cocido madrileño', cena: 'Sopa de fideos con jamón', ingredientes: ['Garbanzos', 'Pollo', 'Morcillo', 'Fideos', 'Jamón'] },
        ]
      }
      setMenu(fallback)
      await supabase.from('menus').insert({ week_data: fallback })
    }
    setLoading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function addDayToList(dayIdx: number, day: MenuDay) {
    const { data: existing } = await supabase.from('items').select('name')
    const existingNames = new Set((existing || []).map((i: any) => i.name.toLowerCase()))
    const toAdd = day.ingredientes.filter(ing => !existingNames.has(ing.toLowerCase()))

    if (toAdd.length === 0) {
      showToast('Ya están todos en la lista 👍')
    } else {
      await supabase.from('items').insert(
        toAdd.map(ing => ({ name: ing, category: 'despensa', quantity: 1, done: false, added_by: 'menu' }))
      )
      showToast(`✓ ${toAdd.length} ingredientes añadidos`)
    }

    setAddedDays(prev => new Set(Array.from(prev).concat(dayIdx)))
  }

  async function addAllToList() {
    if (!menu) return
    const { data: existing } = await supabase.from('items').select('name')
    const existingNames = new Set((existing || []).map((i: any) => i.name.toLowerCase()))
    const allIngredients = [...new Set(menu.menu.flatMap(d => d.ingredientes))]
const allIngredients = Array.from(new Set(menu.menu.flatMap(d => d.ingredientes)))    if (toAdd.length === 0) { showToast('Todo ya está en la lista'); return }
    await supabase.from('items').insert(
      toAdd.map(ing => ({ name: ing, category: 'despensa', quantity: 1, done: false, added_by: 'menu' }))
    )
    showToast(`✓ ${toAdd.length} ingredientes añadidos a la lista`)
    setAddedDays(new Set([0, 1, 2, 3, 4, 5, 6]))
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Menú <span>semanal</span> 🍽️</h1>
        <p className={styles.subtitle}>Que la IA decida qué coméis esta semana</p>
      </header>

      <main className={styles.main}>
        <div className={styles.heroCard}>
          <div className={styles.heroText}>
            <div className={styles.heroEmoji}>✨</div>
            <div>
              <div className={styles.heroTitle}>Generador de menú</div>
              <div className={styles.heroSub}>Menú semanal equilibrado y variado para los dos</div>
            </div>
          </div>
          <button className={`${styles.genBtn} ${loading ? styles.loading : ''}`} onClick={generateMenu} disabled={loading}>
            {loading ? '⏳ Cocinando ideas...' : menu ? '🔄 Generar nuevo menú' : '✨ Generar mi menú'}
          </button>
          {menu && (
            <button className={styles.addAllBtn} onClick={addAllToList}>
              🛒 Añadir todo a la lista
            </button>
          )}
        </div>

        {!menu && !loading && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🍳</div>
            <p className={styles.emptyText}>Sin menú todavía</p>
            <p className={styles.emptySub}>Pulsa el botón para inspirarte</p>
          </div>
        )}

        {loading && (
          <div className={styles.loadingState}>
            {['Pensando recetas...', 'Equilibrando nutrición...', 'Añadiendo amor...'].map((t, i) => (
              <div key={i} className={styles.loadingLine} style={{ animationDelay: `${i * 0.4}s` }}>
                <div className={styles.loadingDot} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        )}

        {menu && !loading && menu.menu.map((day, idx) => (
          <div key={idx} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <span className={styles.dayEmoji}>{EMOJIS[idx]}</span>
              <span className={styles.dayName}>{day.dia}</span>
              <button
                className={`${styles.addDayBtn} ${addedDays.has(idx) ? styles.added : ''}`}
                onClick={() => addDayToList(idx, day)}
              >{addedDays.has(idx) ? '✓ Añadido' : '+ Lista'}</button>
            </div>
            <div className={styles.dayBody}>
              <div className={styles.mealRow}>
                <span className={styles.mealLabel}>🌞 Comida</span>
                <span className={styles.mealText}>{day.comida}</span>
              </div>
              <div className={styles.mealRow}>
                <span className={styles.mealLabel}>🌙 Cena</span>
                <span className={styles.mealText}>{day.cena}</span>
              </div>
              <div className={styles.ingredientes}>
                {day.ingredientes.map((ing, i) => (
                  <span key={i} className={styles.ingChip}>{ing}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div style={{ height: 100 }} />
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
      <BottomNav active="menu" />
    </div>
  )
}
