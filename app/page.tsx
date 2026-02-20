'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // <-- WAJIB IMPORT SUPABASE DI SINI

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      // 1. Tanya ke Supabase: "Ada sesi login yang masih nyangkut nggak di browser ini?"
      const { data: { session } } = await supabase.auth.getSession();

      // 2. Tunggu 1.5 detik biar Splash Screen yang cantik ini tetap kelihatan
      setTimeout(() => {
        if (session) {
          // Kalau TERNYATA UDAH LOGIN, langsung bablas ke Dashboard! 🚀
          router.push('/dashboard');
        } else {
          // Kalau BELUM LOGIN, baru suruh masuk ke halaman Login 🔒
          router.push('/login');
        }
      }, 1500);
    };

    checkLoginStatus();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#063B27] via-[#025035] to-[#006A4E] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Ornamen Daun Khas PTPN */}
      <div className="absolute top-[-10%] right-[-5%] p-8 opacity-10 rotate-12 pointer-events-none">
        <Leaf size={300} strokeWidth={1} className="text-emerald-100" />
      </div>
      <div className="absolute bottom-[-10%] left-[-5%] p-8 opacity-10 rotate-[-12deg] pointer-events-none">
         <Leaf size={200} strokeWidth={1.5} className="text-emerald-100" />
      </div>

      <div className="z-10 flex flex-col items-center animate-fade-in">
        {/* Logo Kotak Kaca */}
        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl mb-6">
          <Building2 size={56} className="text-emerald-300" />
        </div>
        
        {/* Teks Bersih Tanpa Loading */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="px-3 py-1 rounded text-[10px] font-bold bg-emerald-400/20 text-emerald-200 tracking-wider uppercase border border-emerald-400/30">
              Regional 6
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
            IT HELPDESK
          </h1>
          <p className="text-emerald-100/70 text-sm font-medium tracking-[0.4em] uppercase mt-2">
            PT Perkebunan Nusantara IV REGIONAL 6
          </p>
        </div>
      </div>
    </div>
  );
}