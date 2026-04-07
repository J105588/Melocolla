'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Music, Users, Calendar, LogOut, Plus, Edit, Trash2, 
  Save, X, Radio, Newspaper, Upload, Link as LinkIcon, 
  ChevronRight, Menu, Loader2, Eye, Edit3
} from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'

// --- Types ---
type SNSLink = { platform: string; url: string }

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState<'discography' | 'members' | 'events' | 'activities'>('discography')
  const [data, setData] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [quillContent, setQuillContent] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // SNS Links state for modal
  const [snsLinks, setSnsLinks] = useState<SNSLink[]>([])

  // Auto-logout timer (30 minutes)
  const lastActivityRef = useRef<number>(Date.now())
  const LOGOUT_THRESHOLD = 30 * 60 * 1000 

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Activity listener for auto-logout
    const updateActivity = () => { lastActivityRef.current = Date.now() }
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('scroll', updateActivity)

    const timer = setInterval(() => {
      if (Date.now() - lastActivityRef.current > LOGOUT_THRESHOLD) {
        handleLogout()
      }
    }, 60000) // Check every minute

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keydown', updateActivity)
      window.removeEventListener('scroll', updateActivity)
      clearInterval(timer)
    }
  }, [handleLogout])

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

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return
    setOperationLoading(true)
    const { error } = await supabase.from(activeTab).delete().eq('id', id)
    if (error) alert(error.message)
    else fetchData()
    setOperationLoading(false)
  }

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)
      
    if (uploadError) throw uploadError
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)
      
    return publicUrl
  }

  const handleUpsert = async (e: React.FormEvent) => {
    e.preventDefault()
    setOperationLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const payload: any = Object.fromEntries(formData.entries())
    
    // Convert checkbox to boolean
    payload.is_public = formData.get('is_public') === 'on'

    try {
      // File Upload Handling
      const audioFile = formData.get('audio_file') as File
      if (audioFile && audioFile.size > 0) {
        payload.audio_url = await uploadFile(audioFile, 'melocolla-assets')
      }
      delete payload.audio_file

      const imageFile = formData.get('image_file') as File
      if (imageFile && imageFile.size > 0) {
        const url = await uploadFile(imageFile, 'melocolla-assets')
        if (activeTab === 'discography') payload.jacket_url = url
        if (activeTab === 'members') payload.avatar_url = url
        if (activeTab === 'events') payload.jacket_url = url
        if (activeTab === 'activities') payload.image_url = url
      }
      delete payload.image_file

      // SNS Links handling
      if (activeTab === 'members') {
        payload.sns_links = snsLinks
      }

      // Tracklist handling (basic for now)
      if (activeTab === 'discography' && !payload.tracklist) {
        payload.tracklist = editingItem?.tracklist || []
      }

      const { error } = await supabase
        .from(activeTab)
        .upsert({ id: editingItem?.id, ...payload, ...(activeTab === 'activities' ? { content: quillContent } : {}) })

      if (error) throw error

      setIsModalOpen(false)
      setEditingItem(null)
      fetchData()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setOperationLoading(false)
    }
  }

  const openModal = (item: any = null) => {
    setEditingItem(item)
    setSnsLinks(item?.sns_links || [{ platform: 'X', url: '' }])
    setQuillContent(item?.content || '')
    setImagePreview(item?.jacket_url || item?.avatar_url || item?.image_url || null)
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addSnsLink = () => setSnsLinks([...snsLinks, { platform: '', url: '' }])
  const updateSnsLink = (index: number, field: keyof SNSLink, value: string) => {
    const newLinks = [...snsLinks]
    newLinks[index][field] = value
    setSnsLinks(newLinks)
  }
  const removeSnsLink = (index: number) => setSnsLinks(snsLinks.filter((_, i) => i !== index))

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
              disabled={loading}
              className="py-5 bg-brand text-white rounded-2xl font-bold tracking-[0.3em] hover:bg-brand-muted hover:shadow-[0_10px_30px_rgba(96,62,68,0.3)] transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'ACCESS SYSTEM'}
            </button>
          </form>
          <div className="mt-12 w-12 h-px bg-brand/10 mx-auto" />
          <p className="mt-8 text-[10px] text-center text-brand/30 tracking-[0.5em] uppercase font-bold">Melocolla Core</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-brand/20 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="container mx-auto p-4 md:p-12 pb-32">
        <header className="flex justify-between items-center mb-12 px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-brand">
              <Menu size={24} />
            </button>
            <div>
              <div className="flex items-center gap-4 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse shadow-[0_0_10px_#D4AF37]" />
                <h1 className="font-serif text-2xl lg:text-4xl tracking-[0.2em] text-brand uppercase">CORE <span className="text-accent-gold">HUB</span></h1>
              </div>
              <p className="hidden md:block text-[8px] text-brand/40 tracking-[0.5em] uppercase font-mono">{session.user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-2 px-6 py-3 border border-brand/10 rounded-full text-[8px] font-bold tracking-[0.2em] text-brand-muted hover:text-brand hover:border-brand/40 transition-all uppercase"
          >
            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline">DISCONNECT</span>
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Navigation */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl lg:static lg:bg-transparent lg:z-0 lg:w-auto transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} p-8 lg:p-0 flex flex-col gap-3`}>
            <div className="lg:hidden mb-8 border-b border-brand/5 pb-4">
              <span className="font-serif text-xl tracking-widest text-brand font-bold">Menu</span>
            </div>
            
            <TabButton active={activeTab === 'discography'} onClick={() => { setActiveTab('discography'); setIsSidebarOpen(false); }} icon={<Music size={18} />} label="RELEASES" />
            <TabButton active={activeTab === 'members'} onClick={() => { setActiveTab('members'); setIsSidebarOpen(false); }} icon={<Users size={18} />} label="CREATORS" />
            <TabButton active={activeTab === 'events'} onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }} icon={<Calendar size={18} />} label="STREAMS" />
            <TabButton active={activeTab === 'activities'} onClick={() => { setActiveTab('activities'); setIsSidebarOpen(false); }} icon={<Newspaper size={18} />} label="ACTIVITY" />
            
            <div className="mt-12 p-6 rounded-3xl bg-accent-gold/5 border border-accent-gold/10">
              <div className="flex items-center gap-3 mb-4 text-accent-gold">
                <Radio size={16} />
                <span className="text-[10px] font-bold tracking-widest">SYSTEM STATUS</span>
              </div>
              <p className="text-[9px] text-brand/60 leading-relaxed font-mono">
                ENCRYPTED UPLINK ACTIVE.<br />
                DATA PERSISTENCE: 100%.
              </p>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-brand/5 p-6 lg:p-10 min-h-[70vh] shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pb-6 border-b border-brand/5">
              <h2 className="font-serif text-2xl lg:text-3xl tracking-[0.2em] text-brand uppercase">{activeTab}</h2>
              <button 
                onClick={() => openModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand text-white rounded-2xl text-[10px] font-bold tracking-[0.3em] shadow-2xl hover:scale-105 hover:bg-brand-muted transition-all active:scale-95"
              >
                <Plus size={16} />
                REGISTER NEW
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-32 text-brand/20 animate-pulse font-serif tracking-[0.3em]">SYNCHRONIZING...</div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-20">
                <Radio size={48} className="mb-4" />
                <p className="font-serif tracking-widest text-sm uppercase">No Records Found</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {data.map((item) => (
                  <div key={item.id} className="group flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-white border border-brand/5 hover:border-accent-gold/30 hover:shadow-lg transition-all gap-6">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl bg-brand/5 overflow-hidden flex-shrink-0 relative">
                        <img src={item.jacket_url || item.avatar_url || item.image_url || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-serif text-lg tracking-widest text-brand group-hover:text-accent-gold transition-colors truncate">{item.title || item.name || item.event_name}</h3>
                          {!item.is_public && (
                            <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand/40 text-[8px] font-bold tracking-widest">PRIVATE</span>
                          )}
                        </div>
                        <p className="text-[10px] text-brand/40 tracking-[0.2em] uppercase font-mono mt-1">
                          {item.release_date || item.role || item.status || 'Report'}
                          {item.audio_url && <span className="ml-3 text-accent-gold font-bold">● AUDIO ATTACHED</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-brand/5">
                      <button 
                        onClick={() => openModal(item)}
                        className="p-3 text-brand/30 hover:text-brand hover:bg-brand/5 rounded-xl transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        disabled={operationLoading}
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

      {/* Modal for CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-start lg:items-center justify-center p-4 sm:p-6 bg-brand/20 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
           <form onSubmit={handleUpsert} className="w-full max-w-2xl bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-500 my-8">
              <div className="flex justify-between items-center mb-10 border-b border-brand/5 pb-4">
                <h2 className="font-serif text-2xl tracking-[0.2em] text-brand uppercase">
                  {editingItem ? 'EDIT' : 'NEW'} {
                    activeTab === 'discography' ? 'RELEASE' :
                    activeTab === 'members' ? 'CREATOR' :
                    activeTab === 'events' ? 'STREAM' :
                    'ACTIVITY'
                  }
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-brand/20 hover:text-brand transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid gap-6 mb-10 overflow-x-hidden">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Identity</label>
                   <input name="title" defaultValue={editingItem?.title || editingItem?.name || editingItem?.event_name} placeholder="Title/Name" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none focus:ring-1 ring-accent-gold/20" required />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Visual Asset</label>
                      <div className="relative group">
                        <input type="file" name="image_file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                        <div className="w-full p-4 rounded-xl bg-brand/5 border-dashed border-2 border-brand/10 group-hover:border-accent-gold/30 transition-all flex items-center gap-3">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-brand/10" />
                          ) : (
                            <Upload size={16} className="text-brand/30" />
                          )}
                          <span className="text-[10px] text-brand/40 font-bold">{imagePreview ? 'REPLACE IMAGE' : 'UPLOAD IMAGE'}</span>
                        </div>
                      </div>
                   </div>
                   
                   <label className="flex items-center gap-3 p-4 rounded-xl bg-brand/5 cursor-pointer hover:bg-brand/10 transition-colors mt-6 sm:mt-auto">
                     <input type="checkbox" name="is_public" defaultChecked={editingItem ? editingItem.is_public : true} className="w-4 h-4 accent-accent-gold" />
                     <span className="text-[10px] font-bold tracking-[0.2em] text-brand">VISIBLE TO PUBLIC</span>
                   </label>
                </div>

                {activeTab === 'discography' && (
                  <div className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Release Date</label>
                          <input name="release_date" type="date" defaultValue={editingItem?.release_date} className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Audio Source</label>
                          <div className="relative group">
                            <input type="file" name="audio_file" accept="audio/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="w-full p-4 rounded-xl bg-brand/5 border-dashed border-2 border-brand/10 group-hover:border-accent-gold/30 transition-all flex items-center gap-3">
                              <Music size={16} className="text-brand/30" />
                              <span className="text-[10px] text-brand/40 font-bold">UPLOAD AUDIO</span>
                            </div>
                          </div>
                       </div>
                    </div>
                    <textarea name="description" defaultValue={editingItem?.description} placeholder="Composition Details / Credits" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none h-32 text-sm" />
                  </div>
                )}

                {activeTab === 'members' && (
                  <>
                    <input name="role" defaultValue={editingItem?.role} placeholder="Role (e.g. Producer, Vocal)" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none" />
                    <textarea name="bio" defaultValue={editingItem?.bio} placeholder="Creator Biography" className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none h-32 text-sm" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-brand/40 uppercase">Social Connectivity</span>
                        <button type="button" onClick={addSnsLink} className="text-[8px] font-bold bg-accent-gold/10 text-accent-gold px-3 py-1 rounded-full hover:bg-accent-gold/20 transition-all">ADD LINK</button>
                      </div>
                      <div className="grid gap-3">
                        {snsLinks.map((link, index) => (
                          <div key={index} className="flex gap-2 animate-in slide-in-from-left-2 duration-300">
                             <select value={link.platform} onChange={(e) => updateSnsLink(index, 'platform', e.target.value)} className="w-24 p-3 rounded-lg bg-brand/5 border-none outline-none text-[10px] font-bold">
                               <option value="X">X</option>
                               <option value="Youtube">Youtube</option>
                               <option value="Instagram">Instagram</option>
                               <option value="Soundcloud">Soundcloud</option>
                               <option value="Discord">Discord</option>
                             </select>
                             <input value={link.url} onChange={(e) => updateSnsLink(index, 'url', e.target.value)} placeholder="https://..." className="flex-1 p-3 rounded-lg bg-brand/10 border-none outline-none text-[10px]" />
                             <button type="button" onClick={() => removeSnsLink(index)} className="p-3 text-brand/20 hover:text-red-500 transition-colors">
                               <Trash2 size={16} />
                             </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'events' && (
                  <div className="grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">Current Status</label>
                          <select name="status" defaultValue={editingItem?.status || 'upcoming'} className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none appearance-none font-bold text-[10px] tracking-widest">
                            <option value="upcoming">UPCOMING</option>
                            <option value="ongoing">ONGOING</option>
                            <option value="completed">COMPLETED</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase px-1">External Link</label>
                          <input name="link_url" defaultValue={editingItem?.link_url} placeholder="https://youtube.com/..." className="w-full p-4 rounded-xl bg-brand/5 border-none outline-none text-xs" />
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activities' && (
                  <RichTextEditor 
                    initialValue={editingItem?.content || ''} 
                    onChange={setQuillContent}
                  />
                )}
              </div>

              <div className="flex gap-4 sticky bottom-0 bg-white pt-4 border-t border-brand/5">
                <button 
                  type="submit" 
                  disabled={operationLoading}
                  className="flex-1 py-5 bg-brand text-white rounded-2xl font-bold tracking-[0.2em] text-[10px] hover:bg-brand-muted transition-all flex items-center justify-center shadow-xl hover:shadow-brand/20"
                >
                  {operationLoading ? <Loader2 size={16} className="animate-spin" /> : 'COMMIT CHANGES'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-8 py-5 border border-brand/10 rounded-2xl font-bold tracking-[0.2em] text-[10px] hover:bg-brand/5 transition-all uppercase"
                >
                  ABORT
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
      className={`w-full flex items-center gap-5 px-8 py-5 rounded-2xl transition-all tracking-[0.3em] font-bold text-[9px] ${active ? 'bg-brand text-white shadow-[0_15px_30px_rgba(96,62,68,0.15)] scale-[1.02]' : 'text-brand/30 hover:text-brand hover:bg-brand/5'}`}
    >
      <div className={`${active ? 'text-accent-gold' : 'text-brand/40'}`}>{icon}</div>
      {label}
      {active && <ChevronRight size={14} className="ml-auto text-accent-gold/40" />}
    </button>
  )
}
