import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface HomeProps {
  username: string;
  userClass: string;
  setSidebarOpen: (open: boolean) => void;
  onOpenThemeEditor: () => void;
  onLogout: () => void;
}

/**
 * Home component for the dashboard screen after login.
 */
export const Home: React.FC<HomeProps> = ({ username, userClass, setSidebarOpen, onOpenThemeEditor, onLogout }) => {
  return (
    <motion.div 
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 bg-black/10 backdrop-blur-md p-12 rounded-[3rem] border border-white/10 shadow-xl text-center"
    >
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ perspective: 1000 }}
        className="mb-4"
      >
        <img 
          src="https://i.ibb.co.com/kVLW5n61/logo-smpn-1-bengkalis-kecil-Copy.png" 
          alt="Logo SMPN 1 Bengkalis" 
          className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="space-y-4">
        <h1 className="text-xl md:text-3xl font-black tracking-normal leading-relaxed">
          Selamat Datang <br/> di Modul Belajar IPA <br/> SMPN 1 Bengkalis
        </h1>
        <div className="space-y-1">
          <p className="text-sm md:text-base opacity-80 font-medium">
            Halo, {username}!
          </p>
          <p className="text-xs md:text-sm font-black text-emerald-400 uppercase tracking-widest">
            Kelas: {userClass}
          </p>
          <p className="text-sm md:text-base opacity-80 font-medium">
            Siap untuk belajar IPA hari ini?
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 pt-0">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="group px-10 py-4 bg-white text-emerald-700 rounded-full font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <span>M U L A I</span>
        </button>
        
        <div className="max-w-md mt-4">
          <p className="text-xs md:text-sm italic opacity-70 font-medium leading-relaxed">
            "Janganlah engkau mengucapkan perkataan yang engkau sendiri tidak suka mendengarnya ketika orang lain mengucapkannya kepadamu."
          </p>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenThemeEditor}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 active:scale-95 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 transition-all flex items-center gap-2"
            >
              <Icons.Palette size={12} />
              <span>Edit Tema</span>
            </button>
            <button 
              onClick={onLogout}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-[10px] font-bold uppercase text-rose-400 tracking-widest rounded-full border border-rose-500/20 transition-all flex items-center gap-2"
            >
              <Icons.LogOut size={12} />
              <span>Keluar</span>
            </button>
          </div>
          
          <p className="text-[10px] font-bold tracking-wide opacity-50">
            Copyright SMPN 1 BENGKALIS
          </p>
        </div>
      </div>
    </motion.div>
  );
};
