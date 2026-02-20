'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- TAMBAHAN: Buat pindah halaman
import { supabase } from '@/lib/supabase';
import { 
  RefreshCw, Building2, Inbox, Hash, Calendar, Phone, 
  Briefcase, CheckCircle2, Clock, AlertCircle, Activity,
  ChevronRight, ChevronLeft, Ticket as TicketIcon, Leaf,
  LogOut, Loader2 // <-- TAMBAHAN: Ikon untuk Logout dan Loading
} from 'lucide-react';

// --- TIPE DATA ---
type Ticket = {
  id: number;
  ticket_code: string; 
  phone_number: string;
  sender_name: string; 
  division: string | null;
  issue_details: string;
  status: string;
  created_at: string;
};

export default function DashboardPage() { // <-- Ubah nama fungsi biar rapi jadi DashboardPage
  const router = useRouter(); // <-- TAMBAHAN
  
  // --- STATE AUTH ---
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- STATE DATA ---
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'OPEN').length,
    process: tickets.filter(t => t.status === 'PROSES').length,
    done: tickets.filter(t => t.status === 'SELESAI').length,
  };

  // --- 1. FUNGSI CEK KEAMANAN & LOGIN ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login'); // Tendang ke halaman login kalau belum masuk
      } else {
        setIsCheckingAuth(false); // Aman, tampilkan halaman
      }
    };
    checkUser();
  }, [router]);

  // --- 2. FUNGSI LOGOUT ---
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  // --- FUNGSI AMBIL DATA ---
  const fetchTickets = async () => {
    setLoading(true);
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setTickets(data || []);
    setLoading(false);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    // Hanya jalankan fetch kalau sudah lolos cek login
    if (!isCheckingAuth) {
      fetchTickets();
      const interval = setInterval(fetchTickets, 30000); 
      return () => clearInterval(interval);
    }
  }, [isCheckingAuth]);

  const updateStatus = async (id: number, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    const { error } = await supabase.from('tickets').update({ status: newStatus }).eq('id', id);
    if (error) fetchTickets();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).replace('.', ':');
  };

  // --- LOGIKA PAGINASI ---
  const indexOfLastTicket = currentPage * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // --- PREMIUN STATUS BADGE ---
  const StatusBadge = ({ status }: { status: string }) => {
    const s = status?.toUpperCase() || '';
    if (s === 'OPEN') return (
      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-600 border-l-4 border-rose-500 shadow-sm uppercase tracking-wider mx-auto">
        <AlertCircle size={12} strokeWidth={3} /> Menunggu
      </span>
    );
    if (s === 'PROSES') return (
      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-600 border-l-4 border-amber-500 shadow-sm uppercase tracking-wider mx-auto">
        <Activity size={12} strokeWidth={3} /> Diproses
      </span>
    );
    return (
      <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500 shadow-sm uppercase tracking-wider mx-auto">
        <CheckCircle2 size={12} strokeWidth={3} /> Selesai
      </span>
    );
  };

  // --- TAMPILAN LOADING SEBELUM MUNCUL DASHBOARD ---
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#006A4E] mb-4" />
        <p className="text-sm font-bold text-slate-500 animate-pulse tracking-widest uppercase">Memverifikasi Akses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-800">
      
      {/* === HEADER PREMIUM === */}
      <div className="bg-gradient-to-br from-[#063B27] via-[#025035] to-[#006A4E] text-white shadow-2xl overflow-hidden relative border-b-4 border-[#009A66]/50">
        
        <div className="absolute top-[-20%] right-[-5%] p-8 opacity-5 rotate-12 pointer-events-none">
            <Leaf size={240} strokeWidth={1} />
        </div>
        <div className="absolute bottom-[-10%] right-[15%] p-8 opacity-10 rotate-[-12deg] pointer-events-none">
            <TicketIcon size={120} strokeWidth={1.5} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex gap-5 items-center">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <Building2 size={32} className="text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 text-emerald-200 tracking-wider uppercase border border-emerald-400/30">Regional 6</span>
                 <span className="text-emerald-100/70 text-[11px] font-bold tracking-[0.2em] uppercase">PT PERKEBUNAN NUSANTARA IV</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-sm">Helpdesk Monitoring</h1>
              <p className="text-emerald-100/60 text-xs font-medium uppercase tracking-widest mt-1">Sistem Pelaporan IT & Infrastruktur</p>
            </div>
          </div>

          {/* === TOMBOL HEADER (Update & Logout) === */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { fetchTickets(); setCurrentPage(1); }}
              disabled={isRefreshing || loading}
              className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl transition-all shadow-lg shadow-black/10 active:scale-95 border border-white/20"
            >
              <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-bold tracking-wide hidden md:block">Update Data</span>
            </button>

            {/* TOMBOL LOGOUT BARU */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group flex items-center gap-2 bg-rose-500/20 hover:bg-rose-500 backdrop-blur-sm text-rose-100 px-5 py-3 rounded-xl transition-all shadow-lg shadow-black/10 active:scale-95 border border-rose-500/50 hover:border-rose-500 disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
              <span className="text-sm font-bold tracking-wide">{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 md:p-10 -mt-8">
        
        {/* === STATS CARDS === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-20">
            {[
              { label: 'Total Tiket', val: stats.total, icon: Hash, color: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
              { label: 'Menunggu', val: stats.open, icon: AlertCircle, color: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' },
              { label: 'Diproses', val: stats.process, icon: Clock, color: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' },
              { label: 'Selesai', val: stats.done, icon: CheckCircle2, color: 'text-[#006A4E]', border: 'border-emerald-100', dot: 'bg-[#006A4E]' },
            ].map((s, idx) => (
              <div key={idx} className={`bg-white p-5 rounded-2xl border ${s.border} shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
                    <h3 className={`text-3xl font-black ${s.color}`}>{s.val}</h3>
                    <div className={`h-1 w-6 ${s.dot} mt-2 rounded-full opacity-40 group-hover:w-10 transition-all`}></div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-white transition-colors">
                    <s.icon size={20} className={s.color} />
                  </div>
                </div>
              </div>
            ))}
        </div>

       {/* === MAIN TABLE CARD === */}
       <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gradient-to-r from-[#063B27] to-[#006A4E] text-white">
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] border-r border-white/10">Tiket</th>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] border-r border-white/10">Pelapor</th>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] border-r border-white/10">Bidang</th>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] border-r border-white/10">Detail Masalah</th>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] border-r border-white/10">Status</th>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em]">Tindakan</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {currentTickets.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50 transition-all">
                    
                    <td className="px-6 py-4 align-middle border-r border-slate-50">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono text-slate-900 font-bold text-sm tracking-tight">{t.ticket_code}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                          {formatDate(t.created_at)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle border-r border-slate-50">
                      <div className="flex flex-col items-center">
                          <span className="font-bold text-slate-800 text-sm">{t.sender_name || 'Anonymous'}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{t.phone_number}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle border-r border-slate-50">
                        <div className="flex justify-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-full border border-slate-200">
                              <div className="w-1 h-1 rounded-full bg-emerald-500"></div> {t.division || '-'}
                          </span>
                        </div>
                    </td>

                    <td className="px-6 py-4 align-middle text-left border-r border-slate-50">
                      <div className="p-2 mx-auto max-w-[250px]">
                          <p className="text-slate-600 text-xs leading-relaxed italic line-clamp-2 text-center">
                              "{t.issue_details}"
                          </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle border-r border-slate-50">
                      <div className="flex justify-center">
                         <StatusBadge status={t.status} />
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex justify-center max-w-[140px] mx-auto">
                        {t.status !== 'SELESAI' ? (
                          <button 
                            onClick={() => updateStatus(t.id, 'SELESAI')} 
                            className="flex items-center justify-center gap-2 bg-[#006A4E] hover:bg-[#00553F] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 w-full"
                          >
                            <CheckCircle2 size={12} /> Selesaikan
                          </button>
                        ) : (
                           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">✓ Selesai</span>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* === PAGINATION CONTROLS === */}
          {tickets.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Menampilkan <span className="text-slate-800 font-bold">{indexOfFirstTicket + 1}</span> - <span className="text-slate-800 font-bold">{Math.min(indexOfLastTicket, tickets.length)}</span> dari <span className="text-slate-800 font-bold">{tickets.length}</span> tiket
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-[#006A4E] hover:text-white hover:border-[#006A4E] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center px-4 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                  Halaman {currentPage} / {totalPages || 1}
                </div>
                <button 
                  onClick={nextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-[#006A4E] hover:text-white hover:border-[#006A4E] disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 px-4">
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">IT Infrastruktur</span>
                <div className="h-4 w-[1px] bg-slate-300"></div>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-500">Helpdesk Regional 6</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 PTPN IV All Rights Reserved</p>
        </div>

      </div>
    </div>
  );
}