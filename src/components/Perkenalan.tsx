import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, AlertCircle, ArrowRight, Lock, ChevronRight, Trophy, Info as InfoIcon, Zap } from 'lucide-react';
import { perkenalanService } from '../services/perkenalan';
import { Theme } from '../types';
import { googleFormService } from '../services/googleFormService';
import { VideoPlayer } from './VideoPlayer';
import { FinalQuiz } from './FinalQuiz';

interface PerkenalanProps {
  theme: Theme;
  username: string;
  userClass: string;
  searchQuery?: string;
  moduleNumber: number;
  onComplete: () => void;
}

export const Perkenalan: React.FC<PerkenalanProps> = ({ theme, username, userClass, searchQuery, moduleNumber, onComplete }) => {
  const data = React.useMemo(() => perkenalanService.getIntroduction(), []);
  const [activePage, setActivePage] = useState(0);
  const [completedPages, setCompletedPages] = useState<number[]>([]);

  // --- Persistence ---
  useEffect(() => {
    const savedActivePage = localStorage.getItem(`ipa_modul_${moduleNumber}_active_page`);
    const savedCompletedPages = localStorage.getItem(`ipa_modul_${moduleNumber}_completed_pages`);

    if (savedActivePage) {
      setActivePage(parseInt(savedActivePage, 10));
    } else {
      setActivePage(0);
    }
    
    if (savedCompletedPages) {
      try {
        setCompletedPages(JSON.parse(savedCompletedPages));
      } catch (e) {
        console.error("Failed to parse saved completed pages", e);
        setCompletedPages([]);
      }
    } else {
      setCompletedPages([]);
    }
  }, [moduleNumber]);

  useEffect(() => {
    localStorage.setItem(`ipa_modul_${moduleNumber}_active_page`, activePage.toString());
  }, [activePage, moduleNumber]);

  useEffect(() => {
    localStorage.setItem(`ipa_modul_${moduleNumber}_completed_pages`, JSON.stringify(completedPages));
  }, [completedPages, moduleNumber]);

  // Debug: searchQuery === moduleNumber.toString() will be used directly in the render logic to unlock pages
  const isTeacher = username.toLowerCase() === 'gurusmp';
  const isUnlockedGlobally = searchQuery === moduleNumber.toString() || isTeacher;
  
  // Page 1 state
  const [videoWatched, setVideoWatched] = useState(false);
  const [p1Timer, setP1Timer] = useState(20);
  const [p1TimerActive, setP1TimerActive] = useState(false);
  const [p1ShowQuizButton, setP1ShowQuizButton] = useState(false);
  const [p1QuizActive, setP1QuizActive] = useState(false);
  const [p1QuizSelected, setP1QuizSelected] = useState<string | null>(null);
  
  // Page 2 state
  const [p2Timer, setP2Timer] = useState(20); // 20 seconds
  const [p2TimerActive, setP2TimerActive] = useState(false);
  const [p2ShowQuizButton, setP2ShowQuizButton] = useState(false);
  const [p2QuizActive, setP2QuizActive] = useState(false);
  const [p2QuizSelected, setP2QuizSelected] = useState<string | null>(null);

  // Page 3 state
  const [p3Timer, setP3Timer] = useState(20); // 20 seconds
  const [p3TimerActive, setP3TimerActive] = useState(false);
  const [p3ShowQuizButton, setP3ShowQuizButton] = useState(false);
  const [p3QuizActive, setP3QuizActive] = useState(false);
  const [p3QuizSelected, setP3QuizSelected] = useState<string | null>(null);

  // Page 4 state
  const [p4Timer, setP4Timer] = useState(20);
  const [p4TimerActive, setP4TimerActive] = useState(false);
  const [p4QuizActive, setP4QuizActive] = useState(false);
  const [p4QuizSelected, setP4QuizSelected] = useState<string | null>(null);

  // Page 5 state
  const [p5Timer, setP5Timer] = useState(20);
  const [p5TimerActive, setP5TimerActive] = useState(false);
  const [p5QuizActive, setP5QuizActive] = useState(false);
  const [p5QuizSelected, setP5QuizSelected] = useState<string | null>(null);

  // Page 6 state
  const [p6Timer, setP6Timer] = useState(20);
  const [p6TimerActive, setP6TimerActive] = useState(false);
  const [p6QuizActive, setP6QuizActive] = useState(false);
  const [p6QuizSelected, setP6QuizSelected] = useState<string | null>(null);

  // Page 7 state
  const [p7Timer, setP7Timer] = useState(20);
  const [p7TimerActive, setP7TimerActive] = useState(false);
  const [p7QuizActive, setP7QuizActive] = useState(false);
  const [p7QuizSelected, setP7QuizSelected] = useState<string | null>(null);

  // Page 8 state (Media Tanam - previously p9)
  const [p8Timer, setP8Timer] = useState(20);
  const [p8TimerActive, setP8TimerActive] = useState(false);
  const [p8QuizActive, setP8QuizActive] = useState(false);
  const [p8QuizSelected, setP8QuizSelected] = useState<string | null>(null);

  const [finalQuizAnswers, setFinalQuizAnswers] = useState<Record<string, string>>({});
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPopup, setShowPopup] = useState<{ 
    show: boolean; 
    type: 'success' | 'error'; 
    praise?: string;
    message: string 
  }>({
    show: false,
    type: 'success',
    message: ''
  });

  const calculateFinalScore = () => {
    const page = data.pages.find(p => p.isFinalQuiz);
    if (!page || !page.questions) return 0;
    
    let correctCount = 0;
    page.questions.forEach(q => {
      if (finalQuizAnswers[q.id] === q.correctId) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / page.questions.length) * 100);
  };

  const submitToGoogleForm = async () => {
    setIsSubmitting(true);
    const score = calculateFinalScore();

    const result = await googleFormService.submitQuizResult(username, userClass, "Kuis Akhir Perkenalan", score);
    
    setShowPopup({
      show: true,
      type: 'success',
      praise: result.success ? 'Berhasil!' : 'Selesai!',
      message: result.message
    });
    
    setIsSubmitting(false);
  };

  // Timer for Page 1 & 2
  useEffect(() => {
    if (isUnlockedGlobally) {
      setP1Timer(0);
      setP2Timer(0);
      setP3Timer(0);
      setP4Timer(0);
      setP5Timer(0);
      setP6Timer(0);
      setP7Timer(0);
      setP8Timer(0);
      setP1ShowQuizButton(true);
      setP2ShowQuizButton(true);
      setP3ShowQuizButton(true);
      return;
    }

    let interval: any;
    if (activePage === 0 && !completedPages.includes(0) && p1Timer > 0) {
      setP1TimerActive(true);
      interval = setInterval(() => {
        setP1Timer(prev => {
          if (prev <= 1) {
            setP1ShowQuizButton(true);
            setP1TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activePage === 1 && !completedPages.includes(1) && p2Timer > 0) {
      setP2TimerActive(true);
      interval = setInterval(() => {
        setP2Timer(prev => {
          if (prev <= 1) {
            setP2ShowQuizButton(true);
            setP2TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activePage === 2 && !completedPages.includes(2) && p3Timer > 0) {
      setP3TimerActive(true);
      interval = setInterval(() => {
        setP3Timer(prev => {
          if (prev <= 1) {
            setP3ShowQuizButton(true);
            setP3TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activePage === 3 && !completedPages.includes(3) && p4Timer > 0) {
      setP4TimerActive(true);
      interval = setInterval(() => {
        setP4Timer(prev => {
          if (prev <= 1) {
            setP4TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activePage === 4 && !completedPages.includes(4) && p5Timer > 0) {
      setP5TimerActive(true);
      interval = setInterval(() => {
        setP5Timer(prev => {
          if (prev <= 1) {
            setP5TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activePage === 5 && !completedPages.includes(5) && p6Timer > 0) {
      setP6TimerActive(true);
      interval = setInterval(() => {
        setP6Timer(prev => {
          if (prev <= 1) {
            setP6TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activePage === 6 && !completedPages.includes(6) && p7Timer > 0) {
      setP7TimerActive(true);
      interval = setInterval(() => {
        setP7Timer(prev => {
          if (prev <= 1) {
            setP7TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (activePage === 7 && !completedPages.includes(7) && p8Timer > 0) {
      setP8TimerActive(true);
      interval = setInterval(() => {
        setP8Timer(prev => {
          if (prev <= 1) {
            setP8TimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePage, completedPages, p1Timer, p2Timer, p3Timer, p4Timer, p5Timer, p6Timer, p7Timer, p8Timer, isUnlockedGlobally]);

  const handleP1Quiz = (optionId: string) => {
    setP1QuizSelected(optionId);
    const page = data.pages[0];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Wah Bagus!',
        message: 'Kamu siap belajar untuk bekal hidup lebih baik nantinya.'
      });
      setCompletedPages(prev => prev.includes(0) ? prev : [...prev, 0]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Kamu harus belajar lagi dan tetap di halaman sekarang.'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleP2Quiz = (optionId: string) => {
    setP2QuizSelected(optionId);
    const page = data.pages[1];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Tepat Sekali!',
        message: 'Itulah inti dari modul ini — kemandirian pangan.'
      });
      setCompletedPages(prev => prev.includes(1) ? prev : [...prev, 1]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Jawaban kurang tepat, coba pikirkan lagi alasan utamanya.'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleP3Quiz = (optionId: string) => {
    setP3QuizSelected(optionId);
    const page = data.pages[2];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Benar!',
        message: 'Semakin panjang rantai pangan, semakin banyak titik yang bisa bermasalah.'
      });
      setCompletedPages(prev => prev.includes(2) ? prev : [...prev, 2]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Jawaban kurang tepat, perhatikan risiko gangguan pada rantai yang panjang.'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleP4Quiz = (optionId: string) => {
    setP4QuizSelected(optionId);
    const page = data.pages[3];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Tepat!',
        message: 'Ketahanan pangan bukan berarti bebas dari toko sepenuhnya, tapi tidak bergantung sepenuhnya.'
      });
      setCompletedPages(prev => prev.includes(3) ? prev : [...prev, 3]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Jawaban kurang tepat, coba pahami lagi definisi ketahanan pangan keluarga.'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleP5Quiz = (optionId: string) => {
    setP5QuizSelected(optionId);
    const page = data.pages[4];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Benar!',
        message: 'Menanam adalah ibadah yang pahalanya terus mengalir — luar biasa bukan?'
      });
      setCompletedPages(prev => prev.includes(4) ? prev : [...prev, 4]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Jawaban kurang tepat, ingat kembali isi hadis tersebut.'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleP6Quiz = (optionId: string) => {
    setP6QuizSelected(optionId);
    const page = data.pages[5];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Tepat Sekali!',
        message: 'Efisiensi adalah kunci tumpang sari.'
      });
      setCompletedPages(prev => prev.includes(5) ? prev : [...prev, 5]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Jawaban kurang tepat, coba pikirkan lagi keuntungan utamanya.'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleP7Quiz = (optionId: string) => {
    setP7QuizSelected(optionId);
    const page = data.pages[6];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Benar!',
        message: 'Setelah sawi dipanen, ruang itu sepenuhnya milik akar cabai.'
      });
      setCompletedPages(prev => prev.includes(6) ? prev : [...prev, 6]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Jawaban kurang tepat, coba pikirkan lagi hubungan ruang antara sawi dan cabai.'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleP8Quiz = (optionId: string) => {
    setP8QuizSelected(optionId);
    const page = data.pages[7];
    const option = page.quiz.options.find(o => o.id === optionId);
    
    if (option?.isCorrect) {
      setShowPopup({
        show: true,
        type: 'success',
        praise: 'Benar!',
        message: 'Sekam/serbuk membuat media gembur — akar butuh udara, bukan hanya air.'
      });
      setCompletedPages(prev => prev.includes(7) ? prev : [...prev, 7]);
    } else {
      setShowPopup({
        show: true,
        type: 'error',
        message: 'Jawaban kurang tepat, apa fungsi utama bahan yang membuat tanah tidak padat?'
      });
      setTimeout(() => setShowPopup(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handlePopupClick = () => {
    if (showPopup.type === 'success') {
      if (activePage < data.pages.length - 1) {
        setActivePage(activePage + 1);
      } else {
        onComplete();
      }
    }
    setShowPopup(prev => ({ ...prev, show: false }));
  };

  const currentPage = data.pages[activePage];

  // If Module 1 (UH BAB 5 UNSUR), we only show the FinalQuiz and skip materials
  if (moduleNumber === 1 && activePage !== 8) {
    setActivePage(8);
  }

  return (
    <div className="max-w-3xl mx-auto min-h-[80vh] flex flex-col pb-10">
      {/* Tabs - Hidden for Module 1/UH BAB 5 UNSUR as per request to remove materi pages */}
      {moduleNumber !== 1 && (
        <div className="flex justify-center gap-3 mb-8">
          {data.pages.map((page, index) => {
            const isUnlocked = index === 0 || completedPages.includes(index - 1) || isUnlockedGlobally;
            const isActive = activePage === index;
            const isCompleted = completedPages.includes(index);

            return (
              <motion.button
                key={page.id}
                layout
                disabled={!isUnlocked}
                onClick={() => setActivePage(index)}
                className={`h-11 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                  isActive 
                    ? 'bg-white text-indigo-600 shadow-[0_10px_20px_rgba(0,0,0,0.2)] px-6 ring-2 ring-white/20' 
                    : isUnlocked 
                      ? 'bg-white/10 text-white hover:bg-white/20 w-11' 
                      : 'bg-black/20 text-white/20 w-11 cursor-not-allowed'
                }`}
              >
                {isActive ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    {isCompleted && <CheckCircle2 size={16} className="text-emerald-500" />}
                    <span>{index === 8 ? 'Quiz' : `Hal ${index + 1}`}</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className={!isUnlocked ? "opacity-30" : "opacity-80"}>{index + 1}</span>
                  </div>
                )}
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activePage === 0 ? (
            <motion.div 
              key="page1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border-2 border-white/60 shadow-xl max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-3">
                  <h1 
                    className={`text-2xl md:text-3xl font-black tracking-tight ${moduleNumber === 1 && activePage === 0 ? 'text-emerald-900' : ''}`} 
                    style={!(moduleNumber === 1 && activePage === 0) ? { color: theme.accent } : {}}
                  >
                    {currentPage.title}
                  </h1>
                  <p className="text-sm md:text-base font-extrabold italic leading-relaxed max-w-xl mx-auto text-slate-950">
                    "{currentPage.triggerQuestion}"
                  </p>
                </div>

                  <VideoPlayer 
                    url="https://www.youtube.com/embed/LGGnhMoUSbI" 
                    title="KRISIS PANGAN" 
                  />
                <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {currentPage.content}
                </div>

                {(!completedPages.includes(0) || isUnlockedGlobally) && !p1QuizActive && (
                  <div className="flex flex-col items-center gap-4">
                    {(p1Timer > 0 && !isUnlockedGlobally) ? (
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                        <RotateCw size={12} className="animate-spin" />
                        Tonton video... ({p1Timer}s)
                      </div>
                    ) : (
                      <button 
                        onClick={() => setP1QuizActive(true)}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-sm shadow-lg transition-all flex items-center gap-2 animate-bounce"
                      >
                        <span>Jawab Pertanyaan</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {p1QuizActive && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/95 p-6 rounded-3xl shadow-xl space-y-4 max-w-2xl mx-auto border border-white/20"
                >
                  <h2 className="text-sm md:text-base font-black text-slate-800 text-center leading-tight">
                    {currentPage.quiz.question}
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {currentPage.quiz.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleP1Quiz(option.id)}
                        className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${
                          p1QuizSelected === option.id 
                            ? option.isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'
                            : 'border-slate-100 bg-white hover:border-indigo-500'
                        }`}
                      >
                        <span className={`text-xs md:text-sm font-bold leading-snug ${
                          p1QuizSelected === option.id
                            ? option.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                            : 'text-slate-700'
                        }`}>
                          {option.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : activePage === 8 ? (
            <motion.div
              key="finalQuiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FinalQuiz 
                username={username} 
                userClass={userClass} 
                title={moduleNumber === 1 ? 'UH BAB 5 UNSUR' : 'Kuis Akhir Perkenalan'}
                theme={theme}
                onComplete={() => {
                  // Just complete and return to home directly as requested
                  onComplete();
                }}
              />
            </motion.div>
          ) : (
            <motion.div 
              key={`page${activePage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border-2 border-white/60 shadow-xl max-w-2xl mx-auto">
                {currentPage.videoUrl && (
                  <div className="mb-6">
                    <VideoPlayer url={currentPage.videoUrl} title={currentPage.title} />
                  </div>
                )}
                <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {currentPage.content}
                </div>
                
                {/* Tombol Jawab Pertanyaan - Selalu tampil jika kuis belum aktif */}
                {!((activePage === 1 && p2QuizActive) || (activePage === 2 && p3QuizActive) || (activePage === 3 && p4QuizActive) || (activePage === 4 && p5QuizActive) || (activePage === 5 && p6QuizActive) || (activePage === 6 && p7QuizActive) || (activePage === 7 && p8QuizActive)) && (
                  <div className="mt-8 flex flex-col items-center gap-4">
                    {(((activePage === 1 && p2Timer > 0) || (activePage === 2 && p3Timer > 0) || (activePage === 3 && p4Timer > 0) || (activePage === 4 && p5Timer > 0) || (activePage === 5 && p6Timer > 0) || (activePage === 6 && p7Timer > 0) || (activePage === 7 && p8Timer > 0)) && !isUnlockedGlobally && !completedPages.includes(activePage)) ? (
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                        <RotateCw size={14} className="animate-spin" />
                        Baca materi... ({activePage === 1 ? p2Timer : activePage === 2 ? p3Timer : activePage === 3 ? p4Timer : activePage === 4 ? p5Timer : activePage === 5 ? p6Timer : activePage === 6 ? p7Timer : p8Timer}s)
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          if (activePage === 1) setP2QuizActive(true);
                          if (activePage === 2) setP3QuizActive(true);
                          if (activePage === 3) setP4QuizActive(true);
                          if (activePage === 4) setP5QuizActive(true);
                          if (activePage === 5) setP6QuizActive(true);
                          if (activePage === 6) setP7QuizActive(true);
                          if (activePage === 7) setP8QuizActive(true);
                        }}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-sm shadow-lg transition-all flex items-center gap-2 animate-bounce"
                      >
                        <span>{completedPages.includes(activePage) ? 'Lihat/Ulang Pertanyaan' : 'Jawab Pertanyaan'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {((activePage === 1 && p2QuizActive) || (activePage === 2 && p3QuizActive) || (activePage === 3 && p4QuizActive) || (activePage === 4 && p5QuizActive) || (activePage === 5 && p6QuizActive) || (activePage === 6 && p7QuizActive) || (activePage === 7 && p8QuizActive)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/95 p-6 rounded-3xl shadow-xl space-y-4 max-w-2xl mx-auto"
                >
                  <h2 className="text-sm md:text-base font-black text-slate-800 text-center leading-tight">
                    {currentPage.quiz.question}
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {currentPage.quiz.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (activePage === 1) handleP2Quiz(option.id);
                          if (activePage === 2) handleP3Quiz(option.id);
                          if (activePage === 3) handleP4Quiz(option.id);
                          if (activePage === 4) handleP5Quiz(option.id);
                          if (activePage === 5) handleP6Quiz(option.id);
                          if (activePage === 6) handleP7Quiz(option.id);
                          if (activePage === 7) handleP8Quiz(option.id);
                        }}
                        className={`w-full p-3.5 rounded-xl border-2 text-left transition-all ${
                          (activePage === 1 ? p2QuizSelected : activePage === 2 ? p3QuizSelected : activePage === 3 ? p4QuizSelected : activePage === 4 ? p5QuizSelected : activePage === 5 ? p6QuizSelected : activePage === 6 ? p7QuizSelected : p8QuizSelected) === option.id 
                            ? option.isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'
                            : 'border-slate-100 bg-white hover:border-indigo-500'
                        }`}
                      >
                        <span className={`text-xs md:text-sm font-bold leading-snug ${
                          (activePage === 1 ? p2QuizSelected : activePage === 2 ? p3QuizSelected : activePage === 3 ? p4QuizSelected : activePage === 4 ? p5QuizSelected : activePage === 5 ? p6QuizSelected : activePage === 6 ? p7QuizSelected : p8QuizSelected) === option.id
                            ? option.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                            : 'text-slate-700'
                        }`}>
                          {option.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popup Notification */}
      <AnimatePresence>
        {showPopup.show && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={handlePopupClick}
            className="fixed inset-0 flex items-center justify-center z-[100] px-6 cursor-pointer bg-black/20 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{ 
                backgroundColor: showPopup.type === 'success' ? theme.bgMain : '#e11d48',
                borderColor: showPopup.type === 'success' ? theme.accent : '#fb7185'
              }}
              className="p-8 rounded-[2.5rem] shadow-2xl border-2 flex flex-col items-center gap-4 max-w-sm text-center text-white"
            >
              {showPopup.type === 'error' && <AlertCircle size={48} />}
              
              <div className="space-y-2">
                {showPopup.type === 'success' && showPopup.praise && (
                  <h2 className="text-3xl font-black tracking-tight mb-2">{showPopup.praise}</h2>
                )}
                <p className={`font-bold leading-relaxed ${showPopup.type === 'success' ? 'text-base opacity-90' : 'text-lg'}`}>
                  {showPopup.message}
                </p>
              </div>

              {showPopup.type === 'success' && (
                <div className="mt-4 flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest active:scale-95 transition-transform">
                  <span>Lanjut</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex flex-col items-center justify-center text-white text-center px-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <RotateCw size={48} />
            </motion.div>
            <div className="space-y-1">
              <p className="font-black text-xl tracking-tight">Sedang mengirim nilai...</p>
              <p className="text-sm opacity-60 font-medium tracking-wide uppercase">Mohon jangan tutup halaman ini</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RotateCw = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
  </svg>
);
