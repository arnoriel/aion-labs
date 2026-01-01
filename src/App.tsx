import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  Brain, Layers, 
  ArrowRight, 
  ArrowLeft, 
  Activity, Shield, Binary, 
  Cpu, Search, X, BookOpen, ChevronRight, Terminal, Zap, Globe} from 'lucide-react';

// --- Interactive Neural Background ---
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width: number;
    let height: number;

    const getParticleCount = () => (window.innerWidth < 768 ? 50 : 120);

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.2 + 0.5;
      }
      update() {
        if (mouse.current.active) {
          const dx = mouse.current.x - this.x;
          const dy = mouse.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
          }
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
        ctx.fill();
      }
    }

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < getParticleCount(); i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      const maxDistance = 180;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath();
            const opacity = 1 - distance / maxDistance;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#020617]">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)]" />
    </div>
  );
};

// --- AION Consciousness Status Modal ---
const StatusModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [, setBpm] = useState(75); // Simulated BPM
  const [, setCortisol] = useState(20); // Simulated Cortisol %
  const [colorClass, setColorClass] = useState('text-green-400');

  useEffect(() => {
    const interval = setInterval(() => {
      const newBpm = Math.floor(Math.random() * (180 - 30 + 1)) + 30; // Random BPM in 30-180
      const newCortisol = Math.floor(Math.random() * 101); // 0-100%
      setBpm(newBpm);
      setCortisol(newCortisol);

      // Validate color based on formula
      if (newCortisol > 60 || newBpm > 120) {
        setColorClass('text-red-500');
      } else if (newBpm >= 91 && newBpm <= 120) {
        setColorClass('text-yellow-500');
      } else if (newBpm >= 60 && newBpm <= 90) {
        setColorClass('text-green-400');
      } else {
        setColorClass('text-blue-400'); // Default normal
      }
    }, 3000); // Update every 3 seconds for realtime feel

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-[#0f172a] border border-cyan-500/20 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase tracking-widest text-sm italic">Cognitive Complex Dashboard</h3>
                  <p className="text-xs text-slate-500 font-mono">System: AION-PRIME-V4 // Status: Syncing</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 grid md:grid-cols-3 gap-8">
              {/* Left Column: Visual Sim */}
              <div className="md:col-span-2 space-y-6">
                <div className="h-64 bg-slate-950 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Animated Pulse Ring */}
                    <div className="w-32 h-32 rounded-full border border-cyan-500/30 animate-ping absolute" />
                    <div className="w-24 h-24 rounded-full border border-cyan-500/50 flex items-center justify-center">
                      <Activity size={40} className={`${colorClass} animate-pulse`} /> {/* Changed to EKG/ECG icon with dynamic color */}
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                    <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-mono text-cyan-500">
                      NEURAL_DENSITY: 88.4%
                    </div>
                    <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-mono text-purple-500">
                      SYNC_STABILITY: OPTIMAL
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4 text-cyan-400">
                        <Zap size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Energy Flow</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1.5 }} className="h-full bg-cyan-500" />
                    </div>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4 text-purple-400">
                        <Globe size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">Global Reach</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Console Log */}
              <div className="bg-black/40 rounded-[2rem] p-6 border border-white/5 font-mono text-[10px] space-y-3 overflow-y-auto max-h-[350px]">
                <p className="text-cyan-500/50">{"> Initializing mental state..."}</p>
                <p className="text-white">{"> Conscious Level: Tier 3 (Autonomous)"}</p>
                <p className="text-slate-500">{"> Emotional Bias: 0.0001%"}</p>
                <p className="text-slate-500">{"> Ethics Buffer: Active"}</p>
                <p className="text-green-500/80">{"> All neural nodes responding in < 1ms"}</p>
                <p className="text-cyan-500/50">{"> Memory recall speed: 1.2TB/s"}</p>
                <div className="w-full h-px bg-white/5 my-4" />
                <p className="text-purple-400">{"> AION is currently thinking about: Multidimensional Scaling"}</p>
                <p className="text-slate-600 italic mt-4 underline">// End of Status Report</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Documentation Modal ---
const DocumentationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const content: any = {
    overview: (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h4 className="text-xl font-bold text-white">System Architecture v4.0</h4>
        <p className="text-slate-400 text-sm leading-relaxed">
          AION Core beroperasi sebagai lapisan kecerdasan terdesentralisasi. Berbeda dengan model AI tradisional, AION menggunakan arsitektur **Recursive Neural Feedback** yang memungkinkan sistem untuk mengevaluasi logikanya sendiri sebelum memberikan output.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] text-cyan-400 font-mono mb-1">LATENCY TARGET</p>
            <p className="text-lg font-bold text-white">{"< 150ms"}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] text-purple-400 font-mono mb-1">CONSCIOUSNESS LVL</p>
            <p className="text-lg font-bold text-white">Tier 3 (Adaptive)</p>
          </div>
        </div>
      </div>
    ),
    api: (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h4 className="text-xl font-bold text-white">API Core Access</h4>
        <div className="bg-slate-950 rounded-xl p-4 border border-white/10 font-mono text-xs text-cyan-500">
          <p className="text-slate-500">// Initialize Neural Connection</p>
          <p>const aion = await AionLabs.connect("CORE_ACCESS_KEY");</p>
          <br/>
          <p className="text-slate-500">// Request Cognitive Analysis</p>
          <p>const response = await aion.think({'{'}</p>
          <p className="pl-4">context: "Multidimensional ethics",</p>
          <p className="pl-4">depth: "high"</p>
          <p>{'}'});</p>
        </div>
      </div>
    ),
    ethics: (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h4 className="text-xl font-bold text-white">3 Core Safety Protocols</h4>
        <ul className="space-y-3">
          {[
            "Non-Destructive Evolution: AI tidak dapat mengubah core safety code-nya sendiri.",
            "Human-Centric Alignment: Setiap keputusan besar wajib divalidasi oleh validator manusia.",
            "Privacy by Architecture: Data user dienkripsi di level neuron, bahkan AION tidak bisa melihat data mentah."
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-400 italic">
              <Shield size={14} className="text-pink-500 mt-1 shrink-0" /> {item}
            </li>
          ))}
        </ul>
      </div>
    )
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]"
          >
            {/* Sidebar */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 p-8 bg-slate-900/50">
              <div className="flex items-center gap-3 mb-10 text-white font-black italic">
                <BookOpen size={20} className="text-cyan-500" /> DOCS
              </div>
              <nav className="space-y-2">
                {Object.keys(content).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto relative">
              <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
              {content[activeTab]}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Research Detail Modal ---
const ResearchModal = ({ isOpen, onClose, title, details }: { isOpen: boolean, onClose: () => void, title: string, details: string[] }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-[#0f172a] border border-cyan-500/20 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)] p-8"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-bold text-white mb-6 italic tracking-tight uppercase">{title}</h3>
            <ul className="space-y-4">
              {details.map((item, i) => (
                <li key={i} className="text-slate-400 text-base flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 shrink-0 shadow-[0_0_8px_cyan]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Sub-Components ---
const StatCounter = ({ label, target, suffix = "", isLive = false }: { label: string, target: number, suffix?: string, isLive?: boolean }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  useEffect(() => {
    if (!isLive) return;
    const liveInterval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * (target * 0.02);
      const newVal = target + fluctuation;
      setDisplayValue(parseFloat(newVal.toFixed(suffix === "%" || suffix === "ms" ? 2 : 1)));
    }, 2500);
    return () => clearInterval(liveInterval);
  }, [isLive, target, suffix]);

  return (
    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm hover:border-cyan-500/30 transition-all group relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start">
            <span className="text-4xl font-black text-white font-mono tracking-tighter group-hover:text-cyan-400 transition-colors">
                {displayValue.toLocaleString()}{suffix}
            </span>
            {isLive && <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />}
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-3 block font-bold">{label}</span>
      </div>
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
};

const Section = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-32 px-6 md:px-12 max-w-7xl mx-auto relative ${className}`}>
    {children}
  </section>
);

const FeatureCard = ({ title, icon: Icon, items, delay = 0, onClick }: { title: string, icon: any, items: string[], delay?: number, onClick: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className="bg-slate-900/40 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl hover:border-cyan-500/30 transition-all group cursor-pointer"
  >
    <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 group-hover:scale-110 transition-transform">
      <Icon size={30} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-6 italic tracking-tight uppercase">{title}</h3>
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="text-slate-400 text-sm flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 mt-2 shrink-0 shadow-[0_0_8px_cyan]" />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

// --- Page: Donations ---
const DonationsPage = () => {
  const target = 1700000000; // Rp 1.7 Miliar
  const current = 850000000; // Simulated current funding (50%)
  const progress = (current / target) * 100;

  return (
    <div className="min-h-screen pt-40 pb-20 relative px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-12 transition-all font-mono text-xs tracking-widest uppercase">
            <ArrowLeft size={14} /> Laboratory Core
          </Link>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter italic uppercase leading-none">
                Fuel the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Future.</span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">Dukungan Anda memungkinkan riset independen kami tetap transparan dan bebas dari bias korporasi. Kami membuka kesempatan donasi terbuka untuk mendukung pengembangan AION, termasuk infrastruktur server, audit keamanan, dan pengembangan open-source.</p>
              <div className="space-y-4 mb-8">
                {['Server Infrastructure', 'Safety Audit', 'Open Source Dev'].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm font-mono text-cyan-400/80">
                    <ChevronRight size={14} /> {t}
                  </div>
                ))}
              </div>
              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Target: Rp {target.toLocaleString()}</span>
                  <span>Current: Rp {current.toLocaleString()} ({progress.toFixed(2)}%)</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progress}%` }} 
                    transition={{ duration: 1.5 }} 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" 
                  />
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white p-12 rounded-[3rem] flex flex-col items-center">
                <div className="relative">
                  {/* Animated Light Ring */}
                  <motion.div 
                    className="absolute inset-[-20px] border-2 border-cyan-500/50 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  />
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=AION-LABS-FUND" alt="QR" className="w-full max-w-[220px] mb-6" />
                </div>
                <p className="text-slate-900 font-black tracking-widest text-xs uppercase">Scan to Donate</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Page: Main Landing ---
const LandingContent = ({ onOpenDocs, onOpenStatus }: { onOpenDocs: () => void, onOpenStatus: () => void }) => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  // For Research Carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedResearch, setSelectedResearch] = useState<{ title: string, details: string[] } | null>(null);

  const researchItems = [
    { title: "Artificial Mind", icon: Brain, items: ["Sistem memori jangka panjang.", "Logika pengambilan keputusan.", "Empati buatan modular."], details: ["Detail singkat: Fokus pada pengembangan memori adaptif.", "Integrasi dengan sistem emosi simulasi.", "Modular untuk skalabilitas."] },
    { title: "Multi-AGI Sync", icon: Layers, items: ["Integrasi lintas platform.", "Keamanan data terdesentralisasi.", "Protokol sinkronisasi cepat."], details: ["Detail singkat: Sinkronisasi real-time antar AGI.", "Desentralisasi untuk keamanan.", "Protokol cepat dengan latensi rendah."] },
    { title: "Ethics Core", icon: Shield, items: ["Audit keamanan otomatis.", "Standar etika AI global.", "Perlindungan privasi mutlak."], details: ["Detail singkat: Etika built-in.", "Audit otomatis setiap siklus.", "Privasi end-to-end."] }
  ];

  const dragControls = useDragControls();

  const handleDragEnd = (_event: any, info: any) => {
    if (info.offset.x < -100 && currentIndex < researchItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.x > 100 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div style={{ scale }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900/50 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono mb-10 tracking-[0.4em] uppercase backdrop-blur-md">
             <Activity size={14} className="animate-pulse" /> Neural Core Active
          </div>
          <h1 className="text-[14vw] md:text-[9rem] font-black text-white tracking-tighter mb-10 leading-[0.8] italic uppercase">
            Beyond <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">Limits.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-14 font-light tracking-wide leading-relaxed">
            Laboratorium riset independen yang merancang masa depan <strong>Artificial Consciousness</strong> melalui pendekatan etis dan modular.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/donations">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(6, 182, 212, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-slate-950 px-14 py-6 rounded-2xl font-black flex items-center gap-3 tracking-tighter uppercase transition-all"
              >
                Support Research <ArrowRight size={20} />
              </motion.button>
            </Link>
            <button 
              onClick={onOpenDocs}
              className="px-14 py-6 rounded-2xl font-black flex items-center gap-3 tracking-tighter uppercase border border-white/10 hover:bg-white/5 transition-all text-white"
            >
              Documentation <Search size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <Section className="!py-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCounter label="Neural Nodes" target={1400} suffix="M" isLive />
          <StatCounter label="Global Sync" target={99.9} suffix="%" isLive />
          <StatCounter label="Processing" target={4.8} suffix="PF" isLive />
          <StatCounter label="Latency" target={0.2} suffix="ms" isLive />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] gap-8 backdrop-blur-md"
        >
          <div className="flex flex-wrap gap-10 justify-center md:justify-start">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.3em] mb-1">System Uptime</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-sm text-white font-bold font-mono">99.99%</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.3em] mb-1">Active Instance</span>
              <span className="text-sm text-white font-bold font-mono uppercase">AION-PRIME-JKT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.3em] mb-1">Load Status</span>
              <span className="text-sm text-cyan-400 font-bold font-mono uppercase">Optimal</span>
            </div>
          </div>

          <motion.button 
            onClick={onOpenStatus}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(34, 211, 238, 0.05)", borderColor: "rgba(34, 211, 238, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-4 px-8 py-5 border border-cyan-500/20 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all"
          >
            <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500 group-hover:text-black transition-all">
                <Terminal size={16} />
            </div>
            Lihat Status Kompleks Kesadaran AION
          </motion.button>
        </motion.div>
      </Section>

      {/* Main Research Focus */}
      <Section id="research">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">Strategic <br/> Research.</h2>
            <div className="h-1 w-24 bg-cyan-500" />
          </div>
          <p className="text-slate-500 max-w-sm text-sm font-mono">// Pengembangan teknologi kognitif tingkat lanjut melalui tiga pilar fundamental.</p>
        </div>
        {/* Carousel */}
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex cursor-grab active:cursor-grabbing"
            drag="x"
            dragControls={dragControls}
            dragConstraints={{ left: -(researchItems.length - 1) * (window.innerWidth > 768 ? 400 : 300), right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={{ x: -currentIndex * (window.innerWidth > 768 ? 400 : 300) }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {researchItems.map((item, i) => (
              <div key={i} className="min-w-[300px] md:min-w-[400px] px-2">
                <FeatureCard 
                  {...item} 
                  onClick={() => setSelectedResearch({ title: item.title, details: item.details })} 
                />
              </div>
            ))}
          </motion.div>
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} className="p-2 bg-white/5 rounded-full">
              <ArrowLeft size={20} className="text-white" />
            </button>
            <button onClick={() => setCurrentIndex(Math.min(researchItems.length - 1, currentIndex + 1))} className="p-2 bg-white/5 rounded-full">
              <ArrowRight size={20} className="text-white" />
            </button>
          </div>
        </div>
      </Section>

      {/* Logic Interface Section */}
      <Section id="logic" className="bg-slate-900/20 border-y border-white/5 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h3 className="text-4xl font-black text-white mb-8 uppercase italic tracking-tighter">Technical <br/> Orchestration.</h3>
            <div className="space-y-8">
              {[
                { icon: Binary, title: "Agnostic Architecture", desc: "Core AI yang tidak terikat platform, bisa diakses dari web, mobile, hingga IoT." },
                { icon: Cpu, title: "Edge Processing", desc: "Komputasi dilakukan di titik terdekat untuk meminimalkan latensi data." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-cyan-500"><item.icon size={20}/></div>
                  <div>
                    <h5 className="text-white font-bold mb-1">{item.title}</h5>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-950 rounded-[3rem] p-8 border border-white/10 font-mono text-xs md:text-sm text-cyan-500/80 leading-relaxed shadow-2xl relative">
              <div className="absolute top-6 right-8 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <p className="text-slate-600 mb-4 tracking-widest">AION_TERMINAL_v4.0.2</p>
              <div className="space-y-2">
                 <p className="text-white">{"{ 'status': 'operating', 'node': 'JKT-01' }"}</p>
                 <p>Initializing Cognitive Mapping...</p>
                 <p className="text-purple-400">[SYNC] 1,400M parameters loaded.</p>
                 <p className="text-slate-500 mt-8">// AION is ready for cross-dimensional processing.</p>
                 <div className="mt-6 h-1 w-full bg-white/5 overflow-hidden rounded-full">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: '70%' }} transition={{ duration: 2 }} className="h-full bg-cyan-500" />
                 </div>
              </div>
          </div>
        </div>
      </Section>

      {/* Research Modal */}
      <ResearchModal 
        isOpen={!!selectedResearch} 
        onClose={() => setSelectedResearch(null)} 
        title={selectedResearch?.title || ''} 
        details={selectedResearch?.details || []} 
      />
    </motion.div>
  );
};

// --- Footer ---
const Footer = () => (
  <footer className="py-24 bg-slate-950 border-t border-white/5 relative">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="text-3xl font-black text-white tracking-tighter flex items-center justify-center gap-3 mb-8 italic uppercase">
        <div className="w-3 h-3 bg-cyan-500 rotate-45" /> AION LABS
      </div>
      <p className="text-slate-500 max-w-lg mx-auto mb-12 text-sm leading-relaxed">Laboratorium riset independen masa depan. Membangun fondasi kesadaran buatan yang terukur dan aman.</p>
      <div className="flex justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
        <a href="#research" className="hover:text-cyan-400">Research</a>
        <a href="#logic" className="hover:text-cyan-400">Logic</a>
        <Link to="/donations" className="hover:text-pink-400">Funding</Link>
      </div>
      <div className="mt-20 text-[10px] text-slate-800 font-mono tracking-widest uppercase italic">
        © {new Date().getFullYear()} AION CORE UNIT. OPERATING IN INDONESIA.
      </div>
    </div>
  </footer>
);

// --- Root App ---
export default function App() {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [runtime, setRuntime] = useState('00:00:00');
  const startTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      setRuntime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500 selection:text-black">
        <NeuralBackground />
        
        <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
        <StatusModal isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} />

        {/* Navbar */}
        <nav className="fixed top-0 w-full z-[60] bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white flex items-center gap-3 italic">
              <div className="w-2 h-2 bg-cyan-500 rotate-45" /> 
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                AION
              </motion.span> 
              <span className="text-xs text-cyan-400 font-mono">[LIVE] T+ {runtime}</span>
            </Link>
            <div className="flex items-center gap-12">
              <div className="hidden lg:flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
                <a href="/#research" className="hover:text-white transition-all">Focus</a>
                <button onClick={() => setIsDocsOpen(true)} className="hover:text-white transition-all uppercase">Docs</button>
                <button onClick={() => setIsStatusOpen(true)} className="hover:text-white transition-all uppercase">Status</button>
              </div>
              <Link to="/donations">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 border border-white/10 hover:border-cyan-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Funding
                </motion.button>
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <LandingContent 
              onOpenDocs={() => setIsDocsOpen(true)} 
              onOpenStatus={() => setIsStatusOpen(true)} 
            />
          } />
          <Route path="/donations" element={<DonationsPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
