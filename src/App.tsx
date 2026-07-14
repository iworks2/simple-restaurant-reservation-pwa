import { useState, useEffect, type FormEvent } from 'react'
import {
  UtensilsCrossed,
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Trash2,
  Plus,
  List,
  CheckCircle2,
} from 'lucide-react'

interface Reservation {
  id: string
  date: string
  time: string
  partySize: number
  name: string
  phone: string
  note: string
  createdAt: number
}

const STORAGE_KEY = 'reservations'
const TIME_SLOTS = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
]

function validateReservation(form: typeof initialForm) {
  return (
    form.date &&
    form.time &&
    form.partySize > 0 &&
    form.name.trim().length > 0 &&
    form.phone.trim().length > 0
  )
}

const initialForm = {
  date: '',
  time: TIME_SLOTS[0],
  partySize: 2,
  name: '',
  phone: '',
  note: '',
}

export default function App() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [view, setView] = useState<'form' | 'list'>('form')
  const [form, setForm] = useState(initialForm)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load reservations from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setReservations(JSON.parse(raw))
      } catch {
        // ignore corrupted storage
      }
    }
  }, [])

  // Save reservations to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
  }, [reservations])

  // Handle form input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'partySize' ? Number(value) : value,
    }))
    setError(null)
  }

  // Handle reservation submission
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateReservation(form)) {
      setError('全ての必須項目を入力してください。')
      return
    }
    const newReservation: Reservation = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    setReservations((prev) => [newReservation, ...prev])
    setForm(initialForm)
    setSaved(true)
    setError(null)
    setTimeout(() => setSaved(false), 1500)
  }

  // Handle reservation deletion
  function handleDelete(id: string) {
    setReservations((prev) => prev.filter((r) => r.id !== id))
  }

  // UI
  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <header className="w-full max-w-xl mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <UtensilsCrossed className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tight">レストラン・アリア 予約</h1>
        </div>
        <p className="text-textSecondary text-sm">簡単な予約管理アプリです。</p>
        <div className="mt-4 flex gap-2">
          <button
            className={`rounded-xl px-4 py-2 font-semibold transition ${
              view === 'form'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-surface text-textSecondary hover:bg-primary hover:text-white'
            }`}
            onClick={() => setView('form')}
            aria-label="予約する"
          >
            <Plus className="inline-block mr-1" /> 予約する
          </button>
          <button
            className={`rounded-xl px-4 py-2 font-semibold transition ${
              view === 'list'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-surface text-textSecondary hover:bg-primary hover:text-white'
            }`}
            onClick={() => setView('list')}
            aria-label="予約一覧"
          >
            <List className="inline-block mr-1" /> 予約一覧
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-xl bg-surface rounded-xl shadow-lg p-6">
        {view === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" htmlFor="date">
                  <Calendar className="inline-block mr-1" /> 日付
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" htmlFor="time">
                  <Clock className="inline-block mr-1" /> 時間
                </label>
                <select
                  name="time"
                  id="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" htmlFor="partySize">
                  <Users className="inline-block mr-1" /> 人数
                </label>
                <input
                  type="number"
                  name="partySize"
                  id="partySize"
                  min={1}
                  max={20}
                  value={form.partySize}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  <User className="inline-block mr-1" /> 名前
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                <Phone className="inline-block mr-1" /> 電話番号
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="note">
                メモ
              </label>
              <textarea
                name="note"
                id="note"
                value={form.note}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background text-text px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                placeholder="ご要望など"
              />
            </div>
            {error && (
              <div className="text-error text-sm font-semibold">{error}</div>
            )}
            <button
              type="submit"
              className="w-full mt-2 rounded-xl bg-primary text-white font-bold py-3 shadow-lg transition hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="予約を保存"
            >
              <CheckCircle2 className="inline-block mr-2" /> 予約を保存
            </button>
            {saved && (
              <div className="flex items-center justify-center mt-2 text-success font-semibold animate-fade-in">
                <CheckCircle2 className="inline-block mr-1" /> 保存しました！
              </div>
            )}
          </form>
        ) : (
          <div>
            {reservations.length === 0 ? (
              <div className="text-textSecondary text-center py-8">
                予約はありません。
              </div>
            ) : (
              <ul className="space-y-4">
                {reservations.map((r) => (
                  <li
                    key={r.id}
                    className="bg-background rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{r.date}</span>
                        <Clock className="w-5 h-5 text-secondary" />
                        <span>{r.time}</span>
                        <Users className="w-5 h-5 text-accent" />
                        <span>{r.partySize}名</span>
                      </div>
                      <div className="flex items-center gap-2 text-textSecondary text-sm mb-1">
                        <User className="w-4 h-4" />
                        <span>{r.name}</span>
                        <Phone className="w-4 h-4" />
                        <span>{r.phone}</span>
                      </div>
                      {r.note && (
                        <div className="text-xs text-textSecondary mt-1">
                          <span className="font-semibold">メモ:</span> {r.note}
                        </div>
                      )}
                    </div>
                    <button
                      className="mt-2 md:mt-0 md:ml-4 rounded-xl bg-error text-white px-4 py-2 font-semibold shadow hover:bg-warning transition"
                      onClick={() => handleDelete(r.id)}
                      aria-label="予約を削除"
                    >
                      <Trash2 className="inline-block mr-1" /> 削除
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
      <footer className="w-full max-w-xl mt-8 text-center text-xs text-textSecondary">
        &copy; {new Date().getFullYear()} レストラン・アリア
      </footer>
    </div>
  )
}
