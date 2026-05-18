import React from 'react';
import { motion } from 'motion/react';
import { GardenDecorations } from './GardenDecorations';

interface LoginProps {
  username: string;
  setUsername: (name: string) => void;
  userClass: string;
  setUserClass: (className: string) => void;
  onLogin: (e: React.FormEvent) => void;
}

/**
 * Login component for the name input screen.
 */
export const Login: React.FC<LoginProps> = ({ username, setUsername, userClass, setUserClass, onLogin }) => {
  const classes = ['8A', '8B', '8C', '8D'];

  return (
    <div id="app-wrapper" className="w-full h-screen overflow-auto leaf-pattern relative" style={{ background: '#05332e', fontFamily: "'Nunito', sans-serif" }}>
      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="bg-black/20 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-2xl max-w-2xl w-full flex flex-col items-center">
          {/* Title */}
          <div className="fade-up-d1 flex flex-col items-center gap-4 mb-6">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ perspective: 1000 }}
            >
              <img 
                src="https://i.ibb.co.com/kVLW5n61/logo-smpn-1-bengkalis-kecil-Copy.png" 
                alt="Logo SMPN 1 Bengkalis" 
                className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <h1 id="hero-title" className="text-2xl md:text-3xl font-black leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#e8f5e0' }}>
              Selamat Datang <br/> di Modul Belajar IPA <br/> SMPN 1 Bengkalis
            </h1>
          </div>

          {/* Subtitle */}
          <div className="fade-up-d2 space-y-2">
            <p id="hero-subtitle" className="italic text-base md:text-lg max-w-lg leading-relaxed mx-auto" style={{ color: '#a7d9a0' }}>
              “Ke sekolah bukan hanya mempelajari buku, tetapi belajar tentang Disiplin, Tanggung Jawab, dan Saling Menghargai”
            </p>
          </div>

          {/* Name & Class Input Section */}
          <div className="fade-up-d3 mt-4 w-full max-w-sm">
            <form onSubmit={onLogin} className="flex flex-col gap-4">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan nama Anda" 
                className="w-full px-6 py-4 rounded-xl text-center text-lg font-semibold border-2 transition-all outline-none uppercase" 
                style={{ background: 'rgba(255,255,255,0.95)', borderColor: '#14b8a6', color: '#05332e' }}
                autoComplete="off"
                spellCheck="false"
                required
              /> 

              {username.toLowerCase() !== 'gurusmp' && (
                <select
                  value={userClass}
                  onChange={(e) => setUserClass(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl text-center text-lg font-semibold border-2 transition-all outline-none appearance-none cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.95)', borderColor: '#14b8a6', color: '#05332e' }}
                  required
                >
                  <option value="" disabled>Pilih Kelas</option>
                  {classes.map(c => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </select>
              )}

              <button 
                type="submit" 
                className="btn-garden pulse-glow inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl text-xl font-bold tracking-wide mt-2" 
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', cursor: 'pointer' }}
              > 
                <span>MASUK</span> 
              </button>
            </form>
          </div>

          {/* Tagline */}
          <p id="tagline" className="fade-up-d3 mt-8 text-sm tracking-widest uppercase" style={{ color: '#689e9a' }}>
            🌱 Jujur Itu butuh Usaha 🌱
          </p>
          <p className="fade-up-d3 mt-2 text-[10px] font-bold tracking-wide" style={{ color: '#14b8a6' }}>
            Copyright SMPN 1 BENGKALIS
          </p>
        </div>
      </main>
    </div>
  );
};
