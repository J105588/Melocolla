'use client'

import { useState, useEffect } from 'react'
import { supabase, Discography, Member } from '@/lib/supabase'
import { Music, Users, Calendar, LogOut, Plus, Edit, Trash2, Save, X, Radio } from 'lucide-react'

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'discography' | 'members' | 'events'>('discography')
  const [data, setData] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) fetchData()
  }, [session, activeTab])

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(activeTab)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error(error)
    else setData(data || [])
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return
    const { error } = await supabase.from(activeTab).delete().eq('id', id)
    if (error) alert(error.message)
    else fetchData()
  }

  const handleUpsert = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const payload: any = Object.fromEntries(formData.entries())
    
    // Convert checkbox to boolean
    payload.is_public = formData.get('is_public') === 'on'

    // JSON fields handling
    if (activeTab === 'discography' && payload.tracklist) {
      try { payload.tracklist = JSON.parse(payload.tracklist) } catch (e) { payload.tracklist = [] }
    }
    if (activeTab === 'members' && payload.sns_links) {
      try { payload.sns_links = JSON.parse(payload.sns_links) } catch (e) { payload.sns_links = [] }
    }

    const { error } = await supabase
      .from(activeTab)
      .upsert({ id: editingItem?.id, ...payload })

    if (error) alert(error.message)
    else {
      setIsModalOpen(false)
      setEditingItem(null)
      fetchData()
    }
  }

  if (loading && !session) return <div className="min-h-screen flex items-center justify-center font-serif tracking-[0.4em] text-brand bg-white animate-pulse">RESONATING...</div>

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="parallax-bg opacity-20 blur-[120px] bg-accent-gold/30" />
        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-12 rounded-[2rem] border border-brand/5 shadow-2xl relative z-10">
          <h1 className="font-serif text-3xl tracking-[0.3em] text-brand mb-12 text-center">ADMIN <span className="text-accent-gold">LOGIN</span></h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <input 
              type="email" 
              placeholder="Email" 
              className="px-8 py-5 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all tracking-widest text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="px-8 py-5 rounded-2xl bg-brand/5 border border-transparent focus:border-accent-gold outline-none transition-all tracking-widest text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="py-5 bg-brand text-white rounded-2xl font-bold tracking-[0.3em] hover:bg-brand-muted hover:shadow-[0_10px_30px_rgba(96,62,68,0.3)] transition-all"
            >
              ACCESS SYSTEM
            </button>
          </form>
          <div className="mt-12 w-12 h-px bg-brand/10 mx-auto" />
          <p className="mt-8 text-[10px] text-center text-brand/30 tracking-[0.5em] uppercase font-bold">Melocolla Core</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 pb-32">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 px-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-3 h-3 rounded-full bg-accent-gold animate-pulse shadow-[0_0_10px_#D4AF37]" />
              <h1 className="font-serif text-4xl tracking-[0.2em] text-brand">DISTRIBUTION <span className="text-accent-gold">HUB</span></h1>
            </div>
            <p className="text-[10px] text-brand/40 tracking-[0.5em] uppercase font-mono">{session.user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-3 px-8 py-4 border border-brand/10 rounded-full text-[10px] font-bold tracking-[0.3em] text-brand-muted hover:text-brand hover:border-brand/40 transition-all"
          >
            <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
            DISCONNECT
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 flex flex-col gap-3">
            <TabButton active={activeTab === 'discography'} onClick={() => setActiveTab('discography')} icon={<Music size={18} />} label="RELEASES" />
            <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={18} />} label="CREATORS" />
            <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={18} />} label="STREAMS" />
            
            <div className="mt-12 p-6 rounded-3xl bg-accent-gold/5 border border-accent-gold/10">
              <div className="flex items-center gap-3 mb-4 text-accent-gold">
                <Radio size={16} />
                <span className="text-[10px] font-bold tracking-widest">REALTIME STATUS</span>
              </div>
              <p className="text-[10px] text-brand/60 leading-relaxed font-mono">
                CONNECTED TO CLOUD.<br />
                UPDATES PUSHED IN REALTIME.
              </p>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-brand/5 p-10 min-h-[70vh] shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-12 pb-6 border-b border-brand/5">
              <h2 className="font-serif text-3xl tracking-[0.2em] text-brand uppercase">{activeTab}</h2>
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="flex items-center gap-3 px-8 py-4 bg-brand text-white rounded-2xl text-[10px] font-bold tracking-[0.3em] shadow-2xl hover:scale-105 hover:bg-brand-muted transition-all active:scale-95"
              >
                <Plus size={16} />
                REGISTER NEW
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-32 text-brand/20 animate-pulse font-serif tracking-[0.3em]">SYNCHRONIZING...</div>
            ) : (
              <div className="grid gap-6">
                {data.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-6 rounded-2xl bg-white border border-brand/5 hover:border-accent-gold/30 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-brand/5 overflow-hidden flex-shrink-0">
                        <img src={item.jacket_url || item.avatar_url || item.thumbnail_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-lg tracking-widest text-brand group-hover:text-accent-gold transition-colors">{item.title || item.name || item.event_name}</h3>
                          {!item.is_public && (
                            <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand/40 text-[8px] font-bold tracking-widest">PRIVATE</span>
                          )}
                        </div>
                        <p className="text-[10px] text-brand/40 tracking-[0.2em] uppercase font-mono">{item.release_date || item.role || item.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                        className="p-3 text-brand/30 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 text-brand/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal for CRUD (Basic Placeholder for brevity, but functional) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-brand/20 backdrop-blur-md animate-in fade-in duration-300">
           <form onSubmit={handleUpsert} className="w-full max-w-xl bg-white p-12 rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-500">
              <h2 className="font-serif text-2xl tracking-[0.2em] text-brand mb-10 border-b border-brand/5 pb-4">
                {editingItem ? 'EDIT' : 'NEW'} {activeTab.toUpperCase()}
              </h2>
              
              <div className="grid gap-6 mb-10">
                <input name="title" defaultValue={editingItem?.title || editingItem?.name || editingItem?.event_name} placeholder="Title/Name" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none focus:ring-1 ring-accent-gold/20" required />
                <input name="jacket_url" defaultValue={editingItem?.jacket_url || editingItem?.avatar_url || editingItem?.thumbnail_url} placeholder="Image URL (Supabase Storage)" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none text-xs" />
                
                <label className="flex items-center gap-3 p-4 rounded-xl bg-brand/5 cursor-pointer hover:bg-brand/10 transition-colors">
                  <input type="checkbox" name="is_public" defaultChecked={editingItem ? editingItem.is_public : true} className="w-4 h-4 accent-accent-gold" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-brand">MAKE PUBLIC</span>
                </label>

                {activeTab === 'discography' && (
                  <>
                    <input name="release_date" type="date" defaultValue={editingItem?.release_date} className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none" />
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Description" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none h-32" />
                  </>
                )}

                {activeTab === 'members' && (
                  <>
                    <input name="role" defaultValue={editingItem?.role} placeholder="Role (e.g. Producer, Vocal)" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none" />
                    <textarea name="bio" defaultValue={editingItem?.bio} placeholder="Biography" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none h-32" />
                    <div className="flex flex-col gap-2">
                      <span className="text-[8px] font-bold tracking-[0.2em] text-brand/40 px-4 uppercase">SNS Links (JSON Format)</span>
                      <textarea 
                        name="sns_links" 
                        defaultValue={editingItem ? JSON.stringify(editingItem.sns_links, null, 2) : '[\n  {"platform": "X", "url": ""},\n  {"platform": "Youtube", "url": ""}\n]'} 
                        placeholder='[{"platform": "X", "url": "https://..."}]'
                        className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none font-mono text-[10px] min-h-[100px]" 
                      />
                    </div>
                  </>
                )}

                {activeTab === 'events' && (
                  <>
                    <select name="status" defaultValue={editingItem?.status || 'upcoming'} className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none appearance-none">
                      <option value="upcoming">UPCOMING</option>
                      <option value="ongoing">ONGOING</option>
                      <option value="completed">COMPLETED</option>
                    </select>
                    <input name="link_url" defaultValue={editingItem?.link_url} placeholder="Event/Stream URL" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none" />
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" className="flex-1 py-4 bg-brand text-white rounded-xl font-bold tracking-[0.2em] text-xs hover:bg-brand-muted transition-all">
                  SAVE CHANGES
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 border border-brand/10 rounded-xl font-bold tracking-[0.2em] text-xs hover:bg-brand/5 transition-all">
                  CANCEL
                </button>
              </div>
           </form>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-5 px-10 py-6 rounded-3xl transition-all tracking-[0.4em] font-bold text-[10px] ${active ? 'bg-brand text-white shadow-[0_20px_40px_rgba(96,62,68,0.2)] scale-[1.05]' : 'text-brand/30 hover:text-brand hover:bg-brand/5'}`}
    >
      {icon}
      {label}
    </button>
  )
}
