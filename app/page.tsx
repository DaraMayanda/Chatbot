'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, CheckCircle, Clock, AlertCircle, Hash, User } from 'lucide-react';

// Sesuai struktur tabel database kamu
type Ticket = {
  id: string;
  ticket_code: string; // Tambahan baru
  phone_number: string;
  sender_name: string; // Tambahan baru
  issue_details: string;
  status: string;
  created_at: string;
  division: string;
};

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setIsRefreshing(true);
    // Ambil data dari tabel 'tickets'
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error:', error);
    else setTickets(data || []);
    setLoading(false);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await supabase.from('tickets').update({ status: newStatus }).eq('id', id);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-700 ring-1 ring-red-500/30';
      case 'PROSES': return 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-500/30'; // Sesuaikan dgn database (ON_PROCESS -> PROSES)
      case 'SELESAI': return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-500/30'; // (DONE -> SELESAI)
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Admin Helpdesk PTPN</h1>
            <p className="text-slate-500">Monitoring & Tindak Lanjut Laporan</p>
          </div>
          <button 
            onClick={fetchTickets}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm uppercase font-bold">
                <tr>
                  <th className="p-5">Tiket & Waktu</th>
                  <th className="p-5">Pelapor</th>
                  <th className="p-5">Detail Keluhan</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Memuat data...</td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">Belum ada tiket masuk.</td></tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1 font-mono text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs w-fit">
                            <Hash size={12}/> {t.ticket_code || '---'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(t.created_at).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                           <User size={16} className="text-slate-400"/>
                           {t.sender_name || 'Tanpa Nama'}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">+{t.phone_number}</div>
                      </td>
                      <td className="p-5 max-w-md">
                        <p className="line-clamp-2">{t.issue_details}</p>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeStyle(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2">
                          {t.status === 'OPEN' && (
                            <button onClick={() => updateStatus(t.id, 'PROSES')} className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-200 border border-yellow-200">
                              Proses
                            </button>
                          )}
                          {t.status !== 'SELESAI' && (
                            <button onClick={() => updateStatus(t.id, 'SELESAI')} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-200 border border-emerald-200">
                              Selesai
                            </button>
                          )}
                          {t.status === 'SELESAI' && <span className="text-emerald-600 text-xs italic">Tuntas</span>}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}