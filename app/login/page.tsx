'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Building2, Mail, Lock, LogIn, AlertCircle, Loader2, Eye, EyeOff, Leaf } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('Kredensial tidak valid. Silakan coba lagi.');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#063B27] via-[#025035] to-[#006A4E] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Ornamen Background Khas PTPN */}
      <div className="absolute top-[-10%] right-[-5%] p-8 opacity-10 rotate-12 pointer-events-none">
        <Leaf size={300} strokeWidth={1} className="text-emerald-100" />
      </div>
      <div className="absolute bottom-[-10%] left-[-5%] p-8 opacity-10 rotate-[-12deg] pointer-events-none">
         <Leaf size={250} strokeWidth={1.5} className="text-emerald-100" />
      </div>

      {/* Kotak Login Premium Putih Bersih */}
      <div className="w-full max-w-[420px] bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10 border border-white/20">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-emerald-50 p-4 rounded-2xl mb-5 shadow-sm border border-emerald-100">
            <Building2 size={36} className="text-[#006A4E]" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-[#006A4E]/10 text-[#006A4E] tracking-widest uppercase border border-[#006A4E]/20">
              Regional 6
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Portal Admin</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">IT Helpdesk PTPN IV</p>
        </div>

        {/* Notifikasi Error */}
        {errorMsg && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-pulse">
            <AlertCircle size={18} />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Email Karyawan</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E]/50 focus:border-[#006A4E] transition-all placeholder:text-slate-300 font-medium text-sm"
                placeholder="Masukkan Email Anda"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1">Kata Sandi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006A4E]/50 focus:border-[#006A4E] transition-all placeholder:text-slate-300 font-medium text-sm"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#006A4E] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#063B27] to-[#006A4E] hover:from-[#025035] hover:to-[#00553F] text-white py-4 rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg shadow-emerald-900/30 active:scale-[0.98] disabled:opacity-70 mt-6 text-xs"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? 'Memverifikasi...' : 'Masuk Ke Sistem'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 IT REGIONAL 6 PTPN IV</p>
        </div>

      </div>
    </div>
  );
}