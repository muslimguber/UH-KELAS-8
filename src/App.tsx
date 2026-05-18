import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { 
  Menu, 
  X, 
  Home as HomeIcon, 
  BookOpen, 
  Trophy, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Palette,
  ArrowLeft,
  RotateCw,
  Award,
  BarChart3,
  User,
  Lock
} from 'lucide-react';
import { Material, Theme, UserProgress } from './types';
import { THEME_PRESETS, ALL_MATERIALS } from './constants';
import { IconComponent } from './components/IconComponent';
import { SidebarItem } from './components/SidebarItem';
import { StatCard } from './components/StatCard';
import { Dialog } from './components/Dialog';
import { ColorInput } from './components/ColorInput';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Hasil } from './components/Hasil';
import { homeService } from './services/home';
import { Perkenalan } from './components/Perkenalan';
import { VideoPlayer } from './components/VideoPlayer';
import { googleFormService } from './services/googleFormService';

const App = () => {
  // --- State ---
  const [username, setUsername] = useState<string>('');
  const [userClass, setUserClass] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'home' | 'material' | 'quiz' | 'resume' | 'modul'>('home');
  const [activeModule, setActiveModule] = useState<number>(1);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(THEME_PRESETS[4]);
  const [showThemeEditor, setShowThemeEditor] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Progress State
  const [progress, setProgress] = useState<UserProgress>({
    completedMaterials: [],
    isIntroductionCompleted: false,
    highScores: {},
    quizHistory: [],
    username: ''
  });

  // Quiz State
  const [quizState, setQuizState] = useState<{
    currentQuestionIndex: number;
    score: number;
    answers: Record<number, string>;
    showResult: boolean;
    feedback: { questionId: number; isCorrect: boolean } | null;
  }>({
    currentQuestionIndex: 0,
    score: 0,
    answers: {},
    showResult: false,
    feedback: null
  });

  // --- Effects ---
  useEffect(() => {
    const savedUser = homeService.getUser();
    const savedClass = localStorage.getItem('ipa_user_class');
    const savedProgress = homeService.getProgress();
    const savedTheme = localStorage.getItem('ipa_theme');
    const savedView = localStorage.getItem('ipa_current_view');
    const savedActiveModule = localStorage.getItem('ipa_active_module');
    const savedMaterialId = localStorage.getItem('ipa_selected_material_id');

    if (savedUser) {
      setUsername(savedUser);
      if (savedClass) setUserClass(savedClass);
      setIsLoggedIn(true);
    }
    if (savedProgress) {
      setProgress(savedProgress);
    }
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
    if (savedView) {
      setCurrentView(savedView as any);
    }
    if (savedActiveModule) {
      setActiveModule(parseInt(savedActiveModule, 10));
    }
    if (savedMaterialId) {
      setSelectedMaterialId(savedMaterialId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ipa_active_module', activeModule.toString());
  }, [activeModule]);

  useEffect(() => {
    if (isLoggedIn) {
      homeService.saveUser(username);
      localStorage.setItem('ipa_user_class', userClass);
    }
  }, [isLoggedIn, username, userClass]);

  useEffect(() => {
    homeService.saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('ipa_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ipa_current_view', currentView);
  }, [currentView]);

  useEffect(() => {
    if (selectedMaterialId) {
      localStorage.setItem('ipa_selected_material_id', selectedMaterialId);
    } else {
      localStorage.removeItem('ipa_selected_material_id');
    }
  }, [selectedMaterialId]);

  // --- Derived Data ---
  const selectedMaterial = useMemo(() => 
    ALL_MATERIALS.find(m => m.id === selectedMaterialId) || null
  , [selectedMaterialId]);

  const totalProgressPercent = useMemo(() => {
    if (ALL_MATERIALS.length === 0) return 0;
    return Math.round((progress.completedMaterials.length / ALL_MATERIALS.length) * 100);
  }, [progress.completedMaterials]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toUpperCase();
    const isGuru = cleanUsername === 'GURUSMP';
    
    if (cleanUsername && (isGuru || userClass.trim())) {
      if (isGuru) setUserClass('GURU');
      
      // If logging in with a different name than stored in progress, reset progress and clear all module progress
      if (progress.username && progress.username !== cleanUsername) {
        // Clear all module-specific progress
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('ipa_')) {
            localStorage.removeItem(key);
          }
        });

        setProgress({
          completedMaterials: [],
          isIntroductionCompleted: false,
          highScores: {},
          quizHistory: [],
          username: cleanUsername
        });
      } else {
        setProgress(prev => ({ ...prev, username: cleanUsername }));
      }
      
      setIsLoggedIn(true);
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    // Reset States
    setIsLoggedIn(false);
    setUsername('');
    setUserClass('');
    setCurrentView('home');
    setSelectedMaterialId(null);
    setProgress({
      completedMaterials: [],
      isIntroductionCompleted: false,
      highScores: {},
      quizHistory: [],
      username: ''
    });

    // Clear all storage with Prefix 'ipa_'
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ipa_')) {
        localStorage.removeItem(key);
      }
    });
    setShowLogoutConfirm(false);
  };

  const selectMaterial = (id: string) => {
    setSelectedMaterialId(id);
    setCurrentView('material');
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const startQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      answers: {},
      showResult: false,
      feedback: null
    });
    setCurrentView('quiz');
  };

  const submitToRekap = async (materialTitle: string, score: number) => {
    await googleFormService.submitQuizResult(username, userClass, materialTitle, score);
  };

  const handleAnswer = (questionId: number, optionId: string) => {
    if (quizState.feedback) return;

    const currentQuestion = selectedMaterial?.quiz[quizState.currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = optionId === currentQuestion.correctAnswer;
    
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionId },
      feedback: { questionId, isCorrect },
      score: isCorrect ? prev.score + (100 / (selectedMaterial?.quiz.length || 1)) : prev.score
    }));

    // Wait and move to next or finish
    setTimeout(() => {
      if (quizState.currentQuestionIndex < (selectedMaterial?.quiz.length || 0) - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          feedback: null
        }));
      } else {
        const finalScore = isCorrect 
          ? quizState.score + (100 / (selectedMaterial?.quiz.length || 1)) 
          : quizState.score;
        
        setQuizState(prev => ({ ...prev, showResult: true, feedback: null }));
        
        // Submit to Google Form Rekap
        if (selectedMaterial) {
          submitToRekap(selectedMaterial.title, Math.round(finalScore));
        }

        // Update Progress
        if (selectedMaterialId) {
          setProgress(prev => {
            const newCompleted = prev.completedMaterials.includes(selectedMaterialId)
              ? prev.completedMaterials
              : [...prev.completedMaterials, selectedMaterialId];
            
            const currentBest = prev.highScores[selectedMaterialId] || 0;
            const newHighScores = {
              ...prev.highScores,
              [selectedMaterialId]: Math.max(currentBest, Math.round(finalScore))
            };

            const newAttempt = {
              materialId: selectedMaterialId,
              score: Math.round(finalScore),
              date: new Date().toLocaleString('id-ID')
            };

            return { 
              ...prev, 
              completedMaterials: newCompleted, 
              highScores: newHighScores,
              quizHistory: [newAttempt, ...(prev.quizHistory || [])]
            };
          });
        }
      }
    }, 1000);
  };

  const shareToWhatsApp = () => {
    if (!selectedMaterial) return;
    const score = progress.highScores[selectedMaterial.id] || 0;
    let status = 'Masih harus belajar lagi';
    if (score === 100 || score >= 90) {
      status = 'Amazing';
    } else if (score >= 80) {
      status = 'Tuntas';
    }

    const text = `*HASIL KUIS IPA SMP - ${selectedMaterial.title.toUpperCase()}*%0A%0A*Nama:* ${username}%0A*Skor:* ${score}/100%0A*Status:* ${status}%0A%0ARajin Pangkal PANDAI..`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // --- Components ---
  
  // 1. Landing Screen
  if (!isLoggedIn) {
    return (
      <Login 
        username={username} 
        setUsername={setUsername} 
        userClass={userClass}
        setUserClass={setUserClass}
        onLogin={handleLogin} 
      />
    );
  }

  // 2. Main App Layout
  return (
    <div 
      className="min-h-screen flex font-sans transition-colors duration-500"
      style={{ backgroundColor: theme.bgMain, color: theme.textMain }}
    >
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ x: (sidebarOpen && currentView !== 'material') ? 0 : -300 }}
        className={`${currentView === 'material' ? 'hidden' : 'fixed md:relative'} w-[230px] h-screen z-50 flex flex-col transition-colors duration-500 shadow-2xl md:shadow-none`}
        style={{ backgroundColor: theme.bgSidebar, color: theme.textSidebar }}
      >
        {/* Sidebar Header */}
        <div className="pt-6 pb-2.5 px-2.5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <motion.button 
              onClick={() => {
                setCurrentView('home');
                setSidebarOpen(false);
              }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            >
              {!logoError ? (
                <img 
                  src="https://i.ibb.co.com/kVLW5n61/logo-smpn-1-bengkalis-kecil-Copy.png" 
                  alt="Logo SMPN 1 Bengkalis" 
                  className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Icons.School size={18} className="text-white/70" />
              )}
            </motion.button>
            <div>
              <h2 className="font-black text-[11px] tracking-tight leading-none uppercase">UJIAN ONLINE</h2>
              <p className="text-[8px] opacity-60 font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Ilmu Pengetahuan Alam</p>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors"
              title="Tutup Sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Header Quick Menu (Home Button & User Info) */}
          <div className="flex items-center gap-2 mb-3">
            <button 
              onClick={() => {
                setCurrentView('home');
                setSidebarOpen(false);
              }}
              className={`flex-none flex items-center justify-center p-2 rounded-lg transition-all ${currentView === 'home' ? 'bg-white/20 shadow-lg' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
              title="Halaman Utama"
            >
              <HomeIcon size={16} />
            </button>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase truncate">{username}</p>
              <p className="text-[8px] font-bold opacity-60 uppercase truncate">Kelas: {userClass}</p>
            </div>
            {searchQuery === '1111' && (
              <a 
                href="https://accounts.google.com/SignOutOptions?continue=https://aistudio.google.com/apps/1d64e8db-7e15-4e52-8a3d-96a86eb7f1b2?showAssistant=true"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSidebarOpen(false)}
                className="flex-1 flex items-center justify-center p-1.5 rounded-lg transition-all hover:bg-white/5 opacity-60 hover:opacity-100"
                title="Login Akun"
              >
                <User size={16} />
              </a>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Icons.Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-2.5 text-[10px] font-bold outline-none focus:border-white/20 transition-all placeholder:opacity-40"
            />
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3 custom-scrollbar">
          {/* Main Menu */}
          <div className="space-y-0.5">
            <label className="px-3 text-[9px] font-black opacity-40 uppercase tracking-[0.2em] mb-1.5 block">Modul Belajar</label>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num, idx) => {
              const isLocked = num > 1;
              return (
                <React.Fragment key={num}>
                  <button 
                    onClick={() => {
                      if (!isLocked) {
                        setActiveModule(num);
                        setCurrentView('modul');
                        setSidebarOpen(false);
                      }
                    }}
                    disabled={isLocked}
                    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all ${currentView === 'modul' && activeModule === num ? 'bg-white/20 shadow-lg' : isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentView === 'modul' && activeModule === num ? 'bg-white text-indigo-600' : 'bg-white/10'}`}>
                      {isLocked ? <Icons.Lock size={16} /> : (
                        currentView === 'modul' && activeModule === num ? <Icons.BookOpen size={18} /> : (
                          !logoError ? (
                            <img 
                              src="https://i.ibb.co.com/kVLW5n61/logo-smpn-1-bengkalis-kecil-Copy.png" 
                              alt="Logo SMP" 
                              className="w-5 h-5 object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Icons.School size={16} className="opacity-50" />
                          )
                        )
                      )}
                    </div>
                    <span className="font-bold text-sm">{num === 1 ? 'UH BAB 5 UNSUR' : `MODUL ${num}`}</span>
                  </button>
                  {idx < 7 && (
                    <div className="mx-6 my-0.5">
                      <div 
                        className="h-[2px] w-full bg-white/30" 
                        style={{ clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)' }} 
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            <div className="mx-4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
          </div>

          {/* Materials - Hidden as per request to remove specific items which were the only ones */}
          {ALL_MATERIALS.length > 0 && (
            <div className="space-y-1">
              <label className="px-3 text-[9px] font-black opacity-40 uppercase tracking-[0.2em] mb-1.5 block">Materi Belajar</label>
              {ALL_MATERIALS
                .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((m, index) => {
                const isUnlocked = progress.isIntroductionCompleted && (
                  index === 0 || progress.completedMaterials.includes(ALL_MATERIALS[index - 1].id)
                );

                return (
                  <React.Fragment key={m.id}>
                    <SidebarItem 
                      icon={<IconComponent name={m.icon} size={16} />} 
                      label={m.title} 
                      active={selectedMaterialId === m.id && (currentView === 'material' || currentView === 'quiz')} 
                      onClick={() => {
                        selectMaterial(m.id);
                        setSidebarOpen(false);
                      }}
                      theme={theme}
                      indicator={progress.completedMaterials.includes(m.id)}
                      disabled={!isUnlocked}
                    />
                    {index < ALL_MATERIALS.length - 1 && (
                      <div className="mx-4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10">
          <div className="px-3 pb-12 pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-1">
              <button 
                onClick={() => {
                  setShowThemeEditor(true);
                  setSidebarOpen(false);
                }}
                className="flex-1 flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100"
                title="Editor Tema"
              >
                <Palette size={16} />
              </button>
              <button 
                onClick={() => {
                  setShowAbout(true);
                  setSidebarOpen(false);
                }}
                className="flex-1 flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-all opacity-60 hover:opacity-100"
                title="Tentang Aplikasi"
              >
                <Info size={16} />
              </button>
            </div>
            <button 
              onClick={() => {
                setShowLogoutConfirm(true);
                setSidebarOpen(false);
              }}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 group active:scale-[0.98]"
            >
              <LogOut size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Keluar</span>
            </button>
          </div>
          <div className="h-6" />
        </div>
      </motion.aside>

      {/* Floating Menu Trigger */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed left-0 top-1/2 -translate-y-1/2 w-[30px] h-[150px] bg-black/30 backdrop-blur-md rounded-r-2xl border border-l-0 border-white/10 flex items-center justify-center z-[60] hover:bg-black/40 transition-all group shadow-[10px_0_30px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {!logoError ? (
              <motion.img 
                src="https://i.ibb.co.com/kVLW5n61/logo-smpn-1-bengkalis-kecil-Copy.png" 
                alt="Logo"
                animate={{ rotateY: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Icons.School size={16} className="text-white/60 group-hover:text-white/90 transition-colors" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative flex flex-col">
        
        {/* Content View */}
        <div className={`flex-1 ${currentView === 'material' || currentView === 'modul' ? 'p-4 md:p-6' : 'p-6 md:p-10'} max-w-5xl mx-auto w-full relative z-10`}>
          <AnimatePresence mode="wait">
            {currentView === 'modul' && (
              <motion.div
                key={`modul-${activeModule}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Perkenalan 
                  theme={theme} 
                  username={username}
                  userClass={userClass}
                  searchQuery={searchQuery}
                  moduleNumber={activeModule}
                  onComplete={() => {
                    setProgress(prev => {
                      const completedModules = prev.completedMaterials || []; // Abuse completedMaterials for modules for now or use isIntroductionCompleted
                      return { ...prev, isIntroductionCompleted: true };
                    });
                    setCurrentView('home');
                  }} 
                />
              </motion.div>
            )}

            {currentView === 'home' && (
              <Home 
                username={username} 
                userClass={userClass}
                setSidebarOpen={setSidebarOpen} 
                onOpenThemeEditor={() => setShowThemeEditor(true)}
                onLogout={() => setShowLogoutConfirm(true)}
              />
            )}

            {currentView === 'material' && selectedMaterial && (
              <motion.div 
                key="material"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 pb-12 relative z-10 bg-black/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-xl"
              >
                {selectedMaterial.videoUrl && (
                  <VideoPlayer url={selectedMaterial.videoUrl} title={selectedMaterial.title} />
                )}

                <div className="prose prose-invert prose-slate max-w-none">
                  <h1 className="text-3xl font-black tracking-tight mb-4">{selectedMaterial.title}</h1>
                  {!selectedMaterial.Component && (
                    <div className="text-lg leading-relaxed opacity-90 whitespace-pre-line mb-8">
                      {selectedMaterial.content}
                    </div>
                  )}
                  {selectedMaterial.Component && <selectedMaterial.Component />}
                </div>

                {/* Start Quiz Button at the bottom */}
                <div className="pt-8 border-t border-white/10 flex justify-center">
                  <button 
                    onClick={startQuiz}
                    className="group relative px-12 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-black text-xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.6)] hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                  >
                    <Icons.Zap size={24} className="group-hover:animate-pulse" />
                    <span>Mulai Kuis Sekarang</span>
                  </button>
                </div>
              </motion.div>
            )}

            {currentView === 'quiz' && selectedMaterial && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-2xl mx-auto w-full py-10 bg-black/10 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-xl"
              >
                {!quizState.showResult ? (
                  <div className="space-y-8">
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((quizState.currentQuestionIndex + 1) / selectedMaterial.quiz.length) * 100}%` }}
                      />
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white">
                      <div className="mb-4 text-center">
                        <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">
                          Soal {quizState.currentQuestionIndex + 1} / {selectedMaterial.quiz.length}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-8 leading-tight text-center">
                        {selectedMaterial.quiz[quizState.currentQuestionIndex].text}
                      </h2>

                      <div className="space-y-3">
                        {selectedMaterial.quiz[quizState.currentQuestionIndex].options.map((opt) => {
                          const isSelected = quizState.answers[selectedMaterial.quiz[quizState.currentQuestionIndex].id] === opt.id;
                          const isFeedback = quizState.feedback?.questionId === selectedMaterial.quiz[quizState.currentQuestionIndex].id;
                          const isCorrect = opt.id === selectedMaterial.quiz[quizState.currentQuestionIndex].correctAnswer;

                          let btnClass = "w-full p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group ";
                          
                          if (isFeedback) {
                            if (isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-700 ";
                            else if (isSelected) btnClass += "bg-rose-50 border-rose-500 text-rose-700 ";
                            else btnClass += "bg-slate-50 border-slate-100 text-slate-400 ";
                          } else {
                            btnClass += "bg-slate-50 border-transparent text-slate-700 hover:border-indigo-500 hover:bg-white ";
                          }

                          return (
                            <button 
                              key={opt.id}
                              disabled={!!quizState.feedback}
                              onClick={() => handleAnswer(selectedMaterial.quiz[quizState.currentQuestionIndex].id, opt.id)}
                              className={btnClass}
                            >
                              <span>{opt.text}</span>
                              {isFeedback && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                              {isFeedback && isSelected && !isCorrect && <X size={20} className="text-rose-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-indigo-100 border border-indigo-50 text-center space-y-8"
                  >
                    <div className="relative inline-block">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-200"
                      >
                        <Trophy size={64} />
                      </motion.div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      >
                        <Award size={24} />
                      </motion.div>
                    </div>

                    <div>
                      <h2 className="text-3xl font-black text-slate-800 mb-2">Kuis Selesai!</h2>
                      <p className="text-slate-500 font-medium">Kamu telah menyelesaikan materi {selectedMaterial.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Skor Kamu</div>
                        <div className="text-3xl font-black text-indigo-600">{Math.round(quizState.score)}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Terbaik</div>
                        <div className="text-3xl font-black text-emerald-600">{progress.highScores[selectedMaterial.id] || 0}</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => setCurrentView('material')}
                        className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Kembali ke Materi
                      </button>
                      <button 
                        onClick={shareToWhatsApp}
                        className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2"
                      >
                        Kirim Nilai ke Guru
                      </button>
                    </div>
                    <button 
                      onClick={startQuiz}
                      className="w-full py-3 text-slate-400 font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCw size={16} /> Coba Lagi
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {currentView === 'resume' && (
              <motion.div 
                key="resume"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10"
              >
                <Hasil 
                  progress={progress} 
                  allMaterials={ALL_MATERIALS} 
                  theme={theme}
                  onSelectMaterial={selectMaterial}
                  onStartQuiz={(id) => {
                    setSelectedMaterialId(id);
                    startQuiz();
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Dialogs --- */}

      {/* Theme Editor */}
      <Dialog 
        show={showThemeEditor} 
        onClose={() => setShowThemeEditor(false)} 
        title="Kustomisasi Tema"
        icon={<Palette size={24} className="text-white" />}
        maxWidth="max-w-md"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pilihan Warna Cepat</label>
            <div className="flex gap-3">
              {[
                { name: 'Hijau Toska Gelap', color: '#05332e', accent: '#14b8a6' },
                { name: 'Magenta', color: '#a8007b', accent: '#ff8fdf' },
                { name: 'Biru Navy', color: '#003385', accent: '#3b82f6' },
                { name: 'Hutan', color: '#033003', accent: '#4ade80' },
                { name: 'Grape', color: '#410052', accent: '#d8b4fe' },
                { name: 'Indigo', color: '#1e1b4b', accent: '#818cf8' },
                { name: 'Rose', color: '#4c0519', accent: '#fb7185' },
                { name: 'Hitam', color: '#000000', accent: '#ffffff' }
              ].map(p => (
                <button 
                  key={p.name}
                  onClick={() => {
                    // Darken sidebar logic
                    const darken = (hex: string, amount: number) => {
                      let r = parseInt(hex.substring(1, 3), 16);
                      let g = parseInt(hex.substring(3, 5), 16);
                      let b = parseInt(hex.substring(5, 7), 16);
                      r = Math.max(0, Math.floor(r * (1 - amount)));
                      g = Math.max(0, Math.floor(g * (1 - amount)));
                      b = Math.max(0, Math.floor(b * (1 - amount)));
                      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    };
                    const sidebarColor = darken(p.color, 0.3);

                    setTheme({
                      name: p.name,
                      bgMain: p.color,
                      bgSidebar: sidebarColor,
                      accent: p.accent,
                      textMain: '#e8f5e0',
                      textSidebar: '#e8f5e0',
                      isDark: true
                    });
                  }} 
                  className={`w-10 h-10 rounded-2xl border-2 transition-all group relative overflow-hidden ${theme.bgMain === p.color ? 'border-white scale-110 shadow-lg' : 'border-white/10 hover:border-white/30'}`}
                  style={{ backgroundColor: p.color }}
                  title={p.name}
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Kustomisasi Manual</label>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-white/60">Warna Background</span>
                <ColorInput 
                  label="Background" 
                  value={theme.bgMain} 
                  onChange={(v) => {
                    // Function to slightly darken a hex color
                    const darken = (hex: string, amount: number) => {
                      let r = parseInt(hex.substring(1, 3), 16);
                      let g = parseInt(hex.substring(3, 5), 16);
                      let b = parseInt(hex.substring(5, 7), 16);
                      r = Math.max(0, Math.floor(r * (1 - amount)));
                      g = Math.max(0, Math.floor(g * (1 - amount)));
                      b = Math.max(0, Math.floor(b * (1 - amount)));
                      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    };

                    const sidebarColor = darken(v, 0.3); // 30% darker

                    setTheme({
                      ...theme, 
                      bgMain: v, 
                      bgSidebar: sidebarColor, 
                      accent: v === '#000000' ? '#ffffff' : '#ffffff', // Default white accent for dark
                      textMain: '#ffffff',
                      textSidebar: '#ffffff',
                      name: 'Custom'
                    });
                  }} 
                />
              </div>
            </div>
          </div>

          <p className="text-[9px] text-white/30 font-medium text-center italic">
            Warna utama dan teks akan menyesuaikan secara otomatis untuk kenyamanan Anda.
          </p>
        </div>
      </Dialog>

      {/* About Dialog */}
      <Dialog 
        show={showAbout} 
        onClose={() => setShowAbout(false)} 
        hideHeader={true}
        maxWidth="max-w-sm"
      >
        <div className="space-y-6 text-center">
          <motion.div 
            animate={{ rotateY: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="flex justify-center"
            style={{ perspective: 1000 }}
          >
            {!logoError ? (
              <img 
                src="https://i.ibb.co.com/kVLW5n61/logo-smpn-1-bengkalis-kecil-Copy.png" 
                alt="Logo SMPN 1 Bengkalis" 
                className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Icons.School size={48} />
              </div>
            )}
          </motion.div>
          
          <div className="space-y-3">
            <p className="font-bold text-white/60 text-xs uppercase tracking-widest">Aplikasi ini dibuat oleh:</p>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">MUSLIM, S.Pd</h3>
              <div className="text-sm font-bold text-white/80 space-y-0.5">
                <p>Guru Mata Pelajaran IPA</p>
                <p>SMPN 1 BENGKALIS RIAU</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Copyright SMPN 1 Bengkalis</p>
          </div>
        </div>
      </Dialog>

      {/* Logout Confirmation */}
      <Dialog 
        show={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        maxWidth="max-w-[320px]"
        hideHeader={true}
        customBg="bg-gradient-to-b from-slate-900/90 to-slate-800/95 backdrop-blur-xl border border-white/10"
      >
        <div className="p-8 text-center">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-rose-500/30 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-3xl flex items-center justify-center shadow-xl rotate-3">
              <Icons.AlertTriangle size={40} className="text-white drop-shadow-lg" />
            </div>
          </div>
          
          <div className="space-y-3 mb-8">
            <h3 className="text-xl font-black text-white tracking-tight">Yakin ingin keluar?</h3>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Sesi belajar Anda akan dihentikan dan nama Anda akan dihapus dari perangkat ini.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-2xl font-black shadow-[0_10px_25px_rgba(244,63,94,0.3)] hover:shadow-[0_15px_35px_rgba(244,63,94,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-wider text-xs"
            >
              Ya, Keluar Sekarang
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full py-3 text-slate-400 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest"
            >
              Kembali Belajar
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default App;
