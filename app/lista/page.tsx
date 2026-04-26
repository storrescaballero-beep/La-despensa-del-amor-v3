'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase, type Item } from '../../lib/supabase'
import BottomNav from '../../components/BottomNav'
import styles from './lista.module.css'

const CATS = [
  { id: 'fruta',     label: 'Fruta y verdura', emoji: '🥦' },
  { id: 'carne',     label: 'Carne y pescado',  emoji: '🥩' },
  { id: 'lacteos',   label: 'Lácteos',           emoji: '🥛' },
  { id: 'panaderia', label: 'Pan y bollería',    emoji: '🍞' },
  { id: 'despensa',  label: 'Despensa',           emoji: '🥫' },
  { id: 'limpieza',  label: 'Limpieza',           emoji: '🧹' },
  { id: 'bebidas',   label: 'Bebidas',            emoji: '🧃' },
  { id: 'otros',     label: 'Otros',              emoji: '📦' },
]

const CAT_COLORS: Record<string, string> = {
  fruta: '#388E3C', carne: '#C2185B', lacteos: '#F57C00',
  panaderia: '#795548', despensa: '#0288D1', limpieza: '#7B1FA2',
  bebidas: '#0097A7', otros: '#607D8B',
}

export default function Lista() {
  const [items, setItems] = useState<Item[]>([])
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState('otros')
  const [filterCat, setFilterCat] = useState('todo')
  const [addedBy, setAddedBy] = useState<'yo' | 'pareja'>('yo')
  const [syncing, setSyncing] = useState(false)
  const [toast, setToast] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Load items + realtime
  useEffect(() => {
    loadItems()

    const channel = supabase
      .channel('items-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
        loadItems()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function loadItems() {
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setItems(data)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function addItem() {
    const name = newName.trim()
    if (!name) return
    setSyncing(true)
    await supabase.from('items').insert({
      name, category: newCat, quantity: 1, done: false, added_by: addedBy
    })
    setNewName('')
    setSyncing(false)
    showToast('✓ Añadido')
    inputRef.current?.focus()
  }

  async function toggleDone(item: Item) {
    await supabase.from('items').update({ done: !item.done }).eq('id', item.id)
  }

  async function changeQty(item: Item, delta: number) {
    const qty = Math.max(1, item.quantity + delta)
    await supabase.from('items').update({ quantity: qty }).eq('id', item.id)
  }

  async function deleteItem(id: string) {
    await supabase.from('items').delete().eq('id', id)
  }

  async function clearDone() {
    const doneIds = items.filter(i => i.done).map(i => i.id)
    if (doneIds.length === 0) return
    await supabase.from('items').delete().in('id', doneIds)
    showToast(`🗑️ ${doneIds.length} productos eliminados`)
  }

  const filtered = filterCat === 'todo' ? items : items.filter(i => i.category === filterCat)
  const pending = filtered.filter(i => !i.done)
  const done = filtered.filter(i => i.done)

  // Group pending by category
  const grouped: Record<string, Item[]> = {}
  pending.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = []
    grouped[item.category].push(item)
  })

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>La Despensa<br /><span>del Amor</span> 🛒</h1>
          <div className={styles.stats}>
            <div className={styles.statBadge}>
              <span className={styles.statNum}>{items.filter(i => !i.done).length}</span>
              <span className={styles.statLabel}>pendientes</span>
            </div>
            <div className={`${styles.statBadge} ${styles.statDone}`}>
              <span className={styles.statNum}>{items.filter(i => i.done).length}</span>
              <span className={styles.statLabel}>en el carro</span>
            </div>
          </div>
        </div>
        {/* Who am I */}
        <div className={styles.userSelect}>
          <button
            className={`${styles.userBtn} ${addedBy === 'yo' ? styles.userActive : ''}`}
            onClick={() => setAddedBy('yo')}
          >👤 Soy yo</button>
          <button
            className={`${styles.userBtn} ${addedBy === 'pareja' ? styles.userActive : ''}`}
            onClick={() => setAddedBy('pareja')}
          >💑 Mi pareja</button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Add item */}
        <div className={styles.addSection}>
          <div className={styles.addBar}>
            <input
              ref={inputRef}
              className={styles.addInput}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="¿Qué falta en casa?"
            />
            <button className={styles.addBtn} onClick={addItem} disabled={syncing}>
              {syncing ? '…' : '+'}
            </button>
          </div>
          <div className={styles.catSelect}>
            {CATS.map(c => (
              <button
                key={c.id}
                className={`${styles.catChip} ${newCat === c.id ? styles.catActive : ''}`}
                style={newCat === c.id ? { background: CAT_COLORS[c.id] + '22', borderColor: CAT_COLORS[c.id], color: CAT_COLORS[c.id] } : {}}
                onClick={() => setNewCat(c.id)}
              >{c.emoji} {c.label}</button>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className={styles.filterScroll}>
          <button
            className={`${styles.filterChip} ${filterCat === 'todo' ? styles.filterActive : ''}`}
            onClick={() => setFilterCat('todo')}
          >🔍 Todo</button>
          {CATS.map(c => (
            <button
              key={c.id}
              className={`${styles.filterChip} ${filterCat === c.id ? styles.filterActive : ''}`}
              onClick={() => setFilterCat(filterCat === c.id ? 'todo' : c.id)}
            >{c.emoji} {c.label}</button>
          ))}
        </div>

        {/* Items list */}
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🧺</div>
            <p className={styles.emptyText}>La despensa está vacía</p>
            <p className={styles.emptySub}>Añade lo que necesitéis</p>
          </div>
        )}

        {Object.entries(grouped).map(([catId, catItems]) => {
          const cat = CATS.find(c => c.id === catId)
          return (
            <div key={catId}>
              <div className={styles.sectionLabel}>
                <span>{cat?.emoji} {cat?.label || catId}</span>
              </div>
              {catItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onToggle={() => toggleDone(item)}
                  onQty={(d) => changeQty(item, d)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </div>
          )
        })}

        {done.length > 0 && (
          <div>
            <div className={styles.sectionLabel}>
              <span>✓ En el carro ({done.length})</span>
            </div>
            {done.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={() => toggleDone(item)}
                onQty={(d) => changeQty(item, d)}
                onDelete={() => deleteItem(item.id)}
              />
            ))}
            <button className={styles.clearBtn} onClick={clearDone}>
              🗑️ Vaciar carro
            </button>
          </div>
        )}

        <div style={{ height: 100 }} />
      </main>

      {toast && <div className={styles.toast}>{toast}</div>}
      <BottomNav active="lista" />
    </div>
  )
}

function ItemCard({ item, onToggle, onQty, onDelete }: {
  item: Item
  onToggle: () => void
  onQty: (d: number) => void
  onDelete: () => void
}) {
  const cat = CATS.find(c => c.id === item.category)
  const color = CAT_COLORS[item.category] || '#607D8B'
  return (
    <div className={`${styles.item} ${item.done ? styles.itemDone : ''}`}>
      <button
        className={`${styles.check} ${item.done ? styles.checked : ''}`}
        style={item.done ? { background: color, borderColor: color } : {}}
        onClick={onToggle}
      >{item.done ? '✓' : ''}</button>
      <div className={styles.itemBody}>
        <div className={styles.itemName}>{item.name}</div>
        <div className={styles.itemMeta}>
          <span className={styles.catDot} style={{ background: color }} />
          {cat?.emoji} {cat?.label} · {item.added_by === 'yo' ? 'tú' : 'tu pareja'}
        </div>
      </div>
      <div className={styles.qty}>
        <button className={styles.qtyBtn} onClick={() => onQty(-1)}>−</button>
        <span className={styles.qtyNum}>{item.quantity}</span>
        <button className={styles.qtyBtn} onClick={() => onQty(1)}>+</button>
      </div>
      <button className={styles.delBtn} onClick={onDelete}>×</button>
    </div>
  )
}
