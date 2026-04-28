import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Clock, 
  BarChart3,
  Wallet,
  ArrowRight,
  TrendingUp,
  UserCheck,
  CreditCard,
  AlertCircle,
  Copy,
  ExternalLink,
  Users,
  Activity,
  ArrowUpRight,
  Loader2,
  MessageCircle,
  Plus,
  Mail,
  QrCode,
  LogOut,
  Smartphone,
  CheckCircle,
  LayoutDashboard,
  Calculator,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { cn, UserData, AppPhase, formatCurrency, LiveActivity } from './lib/utils';
import { translations, Language } from './translations';
import { 
  db, 
  auth, 
  googleProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  OperationType, 
  handleFirestoreError,
  saveUserProfile,
  getUserProfile,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type FirebaseUser,
  type UserProfile,
  storage,
  ref,
  uploadBytes,
  getDownloadURL
} from './lib/firebase';
// Remove the duplicate imports from firebase/auth
import { doc, setDoc, serverTimestamp, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

declare global {
  interface Window {
    btcpay: any;
  }
}

// --- BTCPay Button Component ---
const BTCPayButton = ({ amount, onPreSubmit, onInvoiceCreated }: { amount: number, onPreSubmit?: () => void, onInvoiceCreated?: () => void }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!window.btcpay) {
      const script = document.createElement('script');
      script.src = "https://mainnet.demo.btcpayserver.org/modal/btcpay.js";
      document.getElementsByTagName('head')[0].append(script);
    }
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.btcpay) return;

    if (onPreSubmit) onPreSubmit();

    const formData = new FormData(event.currentTarget);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200 && this.responseText) {
        if (onInvoiceCreated) onInvoiceCreated();
        window.btcpay.appendInvoiceFrame(JSON.parse(this.responseText).invoiceId);
      }
    };
    xhttp.open('POST', event.currentTarget.getAttribute('action')!, true);
    xhttp.send(formData);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center space-y-2">
         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Monto a pagar</p>
         <h4 className="text-4xl font-black text-brand-green">{amount.toFixed(2)} <span className="text-xl text-white/40">USDT</span></h4>
      </div>

      <form 
        ref={formRef}
        method="POST" 
        action="https://mainnet.demo.btcpayserver.org/api/v1/invoices" 
        className="btcpay-form btcpay-form--block w-full flex justify-center"
        onSubmit={handleFormSubmit}
      >
        <input type="hidden" name="storeId" value="EZzuNM6A62kiq5Q9oGfHEPYGLKkKTyyJGx1R9bWmBWXp" />
        <input type="hidden" name="jsonResponse" value="true" />
        <input type="hidden" name="price" value={amount} />
        <input type="hidden" name="currency" value="USD" />

        <div className="submit-container">
          <button type="submit" className="transition-transform hover:scale-105 active:scale-95">
            <img 
              src="https://mainnet.demo.btcpayserver.org/img/paybutton/pay.svg" 
              style={{ width: '209px' }} 
              alt="Pay with BTCPay Server" 
            />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Global Constants ---
const PRIMARY_USDT_LIMIT = 1500;
const MIN_USDT_LIMIT = 750;
const USDT_STEP = 50;
const GUARANTEE_PERCENT = 0.10;

// --- Icons ---
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.046c0 2.123.554 4.197 1.605 6.033L0 24l6.117-1.605a11.81 11.81 0 005.925 1.586h.005c6.634 0 12.045-5.413 12.049-12.048a11.85 11.85 0 00-3.51-8.52z"/>
  </svg>
);

const USDTIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 8h10M12 8v9M9 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// --- Sub-components ---

// --- Fake Activities Generation ---
const firstNames = ["Carlos", "María", "José", "Ana", "Luis", "Elena", "Fernando", "Sofía", "Juan", "Valentina", "Pedro", "Camila", "Andrés", "Mariana", "Ricardo", "Lucía", "Diego", "Martina", "Gabriel", "Isabella", "Mateo", "Paula", "Javier", "Florencia", "Santiago", "Victoria", "Roberto", "Gabriela", "Hugo", "Daniel", "Camila", "Alejandro", "Natalia", "Sebastián", "Laura", "Mateo", "Valentina", "Nicolás", "Catalina", "Dante", "Bianca", "Thiago", "Emma", "Joaquín", "Mía", "Bautista", "Zoe", "Tomás", "Julia", "Ignacio", "Rocío"];
const lastNames = ["García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Sánchez", "Romero", "Sosa", "Torres", "Ramírez", "Ruiz", "Díaz", "Morales", "Ortiz", "Castro", "Ramos", "Álvarez", "Fernández", "Vázquez", "Méndez", "Castillo", "Gómez", "Guzmán", "Mendoza", "Suárez", "Jiménez", "Riva", "Peralta", "Domínguez"];
const countriesList = ["Argentina", "Chile", "Colombia", "México", "Perú", "Uruguay", "Ecuador", "Panamá", "Costa Rica", "Guatemala"];

const countryData: Record<string, { prefix: string, flag: string }> = {
  "Argentina": { prefix: "+54", flag: "🇦🇷" },
  "Chile": { prefix: "+56", flag: "🇨🇱" },
  "Colombia": { prefix: "+57", flag: "🇨🇴" },
  "México": { prefix: "+52", flag: "🇲🇽" },
  "Perú": { prefix: "+51", flag: "🇵🇪" },
  "Uruguay": { prefix: "+598", flag: "🇺🇾" },
  "Ecuador": { prefix: "+593", flag: "🇪🇨" },
  "Panamá": { prefix: "+507", flag: "🇵🇦" },
  "Costa Rica": { prefix: "+506", flag: "🇨🇷" },
  "Guatemala": { prefix: "+502", flag: "🇬🇹" }
};

const generateFakeApproval = (lang: Language) => {
  const name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)].charAt(0) + ".";
  const country = countriesList[Math.floor(Math.random() * countriesList.length)];
  const isPayment = Math.random() > 0.6; // 40% chance of being a payment alert
  const t = translations[lang].live;
  
  if (isPayment) {
    const amount = Math.floor(Math.random() * (300 - 100 + 1) + 100);
    return {
      message: `${t.payment}: ${name} ${t.of} ${country} ${t.paid} ${amount} USDT`,
      amount: amount,
      type: 'payment' as const
    };
  } else {
    const amount = Math.floor(Math.random() * (1500 - 600 + 1) + 600);
    return {
      message: `${t.approval}: ${name} ${t.of} ${country} ${t.received} ${amount} USDT`,
      amount: -amount,
      type: 'approval' as const
    };
  }
};

const LiveActivityBanner = ({ onActivity, lang }: { onActivity: (amount: number) => void, lang: Language }) => {
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Sound initialization
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current.volume = 0.2;
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const activityData = generateFakeApproval(lang);
      const newActivity: LiveActivity = {
        id: Math.random().toString(36).substr(2, 9),
        message: activityData.message,
        timestamp: new Date()
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 1));
      playSound();
      onActivity(activityData.amount);
    }, 15000); // Slower frequency
    return () => clearInterval(interval);
  }, [onActivity, lang]);

  return (
    <div className="fixed bottom-24 left-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {activities.map(act => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className="glass-dark px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-bold text-white shadow-2xl border-white/20"
          >
            <div className="w-2 h-2 rounded-full bg-brand-green" />
            {act.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ onAction, phase, lang, setLang, onHome, user, onLogout }: { 
  onAction: () => void, 
  phase: AppPhase,
  lang: Language,
  setLang: (l: Language) => void,
  onHome: () => void,
  user: FirebaseUser | null,
  onLogout: () => void
}) => {
  const [scrolled, setScrolled] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50",
      scrolled ? "bg-brand-dark/40 backdrop-blur-2xl py-0" : "bg-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div 
        onClick={onHome}
        className="flex items-center group cursor-pointer transition-all active:scale-95 px-0"
      >
        <img 
          src="https://i.imgur.com/iFbEpvv.png" 
          alt="CrediCryp Logo" 
          className="h-12 md:h-16 w-auto object-contain hover:opacity-80 transition-opacity"
          loading="lazy"
        />
      </div>
      
      {phase === 'landing' && (
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-white/50">
          {/* Links removed as per request */}
        </div>
      )}

      <div className="flex items-center gap-2 lg:gap-3">
        {phase === 'landing' && (
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <button 
                  onClick={onAction}
                  className="flex-1 sm:flex-none sm:px-6 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all active:scale-95 whitespace-nowrap min-w-[120px]"
                >
                  {t.login}
                </button>
                <button 
                  onClick={onAction}
                  className="flex-1 sm:flex-none sm:px-6 py-2.5 bg-brand-green text-white rounded-xl text-sm font-bold shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap min-w-[120px]"
                >
                  {t.register}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Shield className="w-4 h-4 text-brand-green" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{lang === 'es' ? 'Conectado' : 'Connected'}</p>
                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{user.displayName || user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="relative group ml-1">
              <button 
                className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                title="Select Language / Seleccionar Idioma"
              >
                <Globe className="w-6 h-6" />
              </button>
              
              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="bg-brand-dark border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[140px] backdrop-blur-xl">
                  <button 
                    onClick={() => setLang('es')}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl text-xs font-bold text-left transition-colors flex items-center justify-between",
                      lang === 'es' ? "bg-brand-green text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    Español {lang === 'es' && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={cn(
                      "w-full px-4 py-2 rounded-xl text-xs font-bold text-left transition-colors flex items-center justify-between",
                      lang === 'en' ? "bg-brand-green text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    English {lang === 'en' && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {phase === 'dashboard' && (
          <div className="flex items-center gap-3">
            <button 
              onClick={onLogout}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <div className="relative group">
              <button 
                className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <Globe className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                <div className="bg-brand-dark border border-white/10 rounded-xl p-1.5 shadow-2xl min-w-[120px] backdrop-blur-xl">
                  <button 
                    onClick={() => setLang('es')}
                    className={cn(
                      "w-full px-3 py-1.5 rounded-lg text-[10px] font-bold text-left transition-colors flex items-center justify-between",
                      lang === 'es' ? "bg-brand-green text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    ES {lang === 'es' && <CheckCircle2 className="w-2.5 h-2.5" />}
                  </button>
                  <button 
                    onClick={() => setLang('en')}
                    className={cn(
                      "w-full px-3 py-1.5 rounded-lg text-[10px] font-bold text-left transition-colors flex items-center justify-between",
                      lang === 'en' ? "bg-brand-green text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    EN {lang === 'en' && <CheckCircle2 className="w-2.5 h-2.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </nav>
  );
};

const LoanCalculator = ({ lang, onStart }: { lang: Language, onStart: (amount: number) => void }) => {
  const t = translations[lang].calculator;
  const [loanAmount, setLoanAmount] = useState(PRIMARY_USDT_LIMIT);
  const currency = 'USDT';
  const cryptoAsset = 'BTC';

  const prices: Record<string, number> = {
    'BTC': 65000,
    'ETH': 3500,
    'SOL': 150,
    'BNB': 600
  };

  const ltv = 0.5; // 50%
  const collateralNeeded = (loanAmount / ltv) / (prices[cryptoAsset] || 1);

  return (
    <section className="py-32 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-8">
        <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
          {t.title}
        </h2>
        <p className="text-xl text-white/60 leading-relaxed max-w-xl">
          {t.subtitle}
        </p>
        
        <div className="space-y-4 pt-8">
          {[
            { icon: <Shield className="w-5 h-5 text-brand-green" />, text: t.noCreditChecks },
            { icon: <Clock className="w-5 h-5 text-brand-green" />, text: t.instantApproval },
            { icon: <Globe className="w-5 h-5 text-brand-green" />, text: t.noSelling }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white/80 font-medium">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="glass rounded-[3rem] p-10 bg-brand-dark/60 shadow-2xl space-y-8">
          <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t.loanAmount} ({currency})</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={loanAmount} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLoanAmount(val);
                  }}
                  onBlur={() => {
                    if (loanAmount < 750) setLoanAmount(750);
                  }}
                  min="750"
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-[1.5rem] text-3xl font-black text-white outline-none focus:border-brand-green transition-all"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-xl pointer-events-none">
                  {currency}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t.collateral} ({cryptoAsset})</label>
              <div className="relative">
                <div className="w-full bg-white/5 border border-white/10 p-6 rounded-[1.5rem] text-3xl font-black text-white/60">
                  {collateralNeeded.toFixed(4)}
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-xl pointer-events-none">
                  {cryptoAsset}
                </div>
              </div>
            </div>

            <div className="p-6 bg-brand-green/20 rounded-2xl flex items-center justify-between border border-brand-green/20">
              <span className="text-white/60 font-bold">{t.ltv}</span>
              <span className="text-brand-green font-black text-xl">50%</span>
            </div>

            <button 
              onClick={() => onStart(loanAmount)}
              className="w-full py-6 bg-brand-green text-white rounded-[1.5rem] font-black text-xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-1 active:scale-95"
            >
              {t.cta}
            </button>
        </div>
      </div>
    </section>
  );
};

const BenefitsSection = ({ lang, onStart }: { lang: Language, onStart: (amount?: number) => void }) => {
  const t = translations[lang].benefits;
  const benefits = [
    { icon: <CreditCard className="w-6 h-6" />, text: t.benefit1 },
    { icon: <Zap className="w-6 h-6" />, text: t.benefit2 },
    { icon: <TrendingUp className="w-6 h-6" />, text: t.benefit3 },
  ];

  return (
    <section className="py-32 bg-brand-dark border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left: Image */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img 
            src="https://i.imgur.com/bCZuyMu.png" 
            alt="Lifestyle Fintech" 
            className="relative w-full h-[500px] object-cover rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]"
          />
        </motion.div>

        {/* Right: Content */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              {t.title}
            </h2>
            <p className="text-lg text-white/40 leading-relaxed max-w-lg">
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-0">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-6 py-6 border-b border-white/5 last:border-0 group">
                <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                  {benefit.icon}
                </div>
                <span className="text-lg font-semibold text-white/60 group-hover:text-white transition-colors">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onStart()}
            className="flex items-center gap-2 px-8 py-4 border-2 border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            {t.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang].testimonials;
  const [expanded, setExpanded] = useState(false);
  
  const displayedTestimonials = expanded ? t.items : t.items.slice(0, 3);

  return (
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          {t.title}
        </h2>
        <div className="w-20 h-1.5 bg-brand-green mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {displayedTestimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.handle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              layout
              className="glass p-8 rounded-[2rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex flex-col h-full shadow-lg group"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full border-2 border-brand-green/20 group-hover:border-brand-green transition-colors"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-white/30 text-xs">{testimonial.handle}</p>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed italic flex-grow">
                "{testimonial.text}"
              </p>
              <div className="mt-6 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="w-1 h-1 bg-brand-green rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="px-10 py-4 glass border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all active:scale-95"
        >
          {expanded ? t.viewLess : t.viewMore}
        </button>
      </div>
    </section>
  );
};

const FAQSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
          {t.title}
        </h2>
        <div className="w-20 h-1.5 bg-brand-green rounded-full" />
        <p className="text-white/40 text-lg max-w-sm">
          {lang === 'es' 
            ? "Todo lo que necesitas saber antes de empezar a usar tu crédito."
            : "Everything you need to know before you start using your credit."}
        </p>
      </div>

      <div className="space-y-4">
        {t.items.map((item, i) => (
          <div key={i} className="border-b border-white/5 last:border-0 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full py-6 flex items-center justify-between text-left group"
            >
              <span className={cn(
                "text-lg font-bold transition-all duration-300",
                openIndex === i ? "text-brand-green" : "text-white/80 group-hover:text-white"
              )}>
                {item.q}
              </span>
              <div className={cn(
                "w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300",
                openIndex === i ? "bg-brand-green border-brand-green text-white rotate-45" : "text-white/40"
              )}>
                <Plus className="w-4 h-4" />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="pb-8"
                >
                  <p className="text-white/60 leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = ({ lang, onStart }: { lang: Language, onStart: (amount?: number) => void }) => {
  const t = translations[lang].finalCta;
  return (
    <section className="relative w-full py-32 md:py-48 flex items-center overflow-hidden bg-brand-dark border-t border-white/5">
      {/* Background Image - Contained and shifted to avoid overlapping text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center lg:justify-end pointer-events-none opacity-40 lg:pr-20">
        <img 
          src="https://i.imgur.com/SWZFVFc.png" 
          alt="Background Texture" 
          className="w-full max-w-4xl h-auto object-contain scale-75 md:scale-90"
        />
        {/* Gradient overlay to blend with the rest of the dark background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl space-y-10 text-center"
        >
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight">
              {t.title}
            </h2>
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => onStart()}
              className="w-full sm:w-auto px-12 py-5 bg-brand-green text-white rounded-2xl font-black text-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              {t.register} <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FooterBlock = ({ lang }: { lang: Language }) => {
  const t = translations[lang].footerBlock;
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) return;
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  return (
    <section className="bg-brand-dark py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 md:gap-32 items-stretch">
            {/* Newsletter */}
            <div className="space-y-8 flex flex-col justify-center">
                <h3 className="text-2xl font-black text-white leading-snug">
                    {t.newsletterTitle}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input 
                          type="email" 
                          placeholder={t.emailPlaceholder}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isSubscribed || isSubscribing}
                          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-transparent rounded-xl focus:border-white/20 focus:bg-brand-dark/40 transition-all outline-none text-white disabled:opacity-50"
                        />
                    </div>
                    <button 
                      onClick={handleSubscribe}
                      disabled={isSubscribed || isSubscribing || !email}
                      className={cn(
                        "px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all min-w-[160px]",
                        isSubscribed 
                          ? "bg-brand-green/20 text-brand-green border border-brand-green/20" 
                          : "bg-white text-brand-dark hover:bg-white/90 disabled:opacity-50"
                      )}
                    >
                        {isSubscribing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isSubscribed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> {t.success}
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4" /> {t.subscribe}
                          </>
                        )}
                    </button>
                </div>
            </div>

            {/* App Promotion */}
            <div className="lg:border-l lg:border-white/5 lg:pl-32 flex flex-col justify-center space-y-8">
                <h3 className="text-2xl font-black text-white leading-snug">
                    {t.appTitle}
                </h3>
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="h-14 w-44 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 opacity-30 grayscale cursor-not-allowed">
                        <span className="text-xs font-bold text-white/50">App Store</span>
                    </div>
                    <div className="h-14 w-44 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 opacity-30 grayscale cursor-not-allowed">
                        <span className="text-xs font-bold text-white/50">Google Play</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

const MetricsSection = ({ lang }: { lang: Language }) => {
  const t = translations[lang].metrics;
  const metrics = [
    { label: t.processed, value: "+120M USDT" },
    { label: t.countries, value: "8" },
    { label: t.approval, value: "99.2%" },
    { label: t.support, value: "24/7" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {metrics.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-center group"
          >
            <p className="text-3xl md:text-5xl font-black text-white mb-2 group-hover:text-brand-green transition-colors">{m.value}</p>
            <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em]">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Landing = ({ onStart, funds, lang }: { onStart: (amount?: number) => void, funds: number, lang: Language }) => {
  const t = translations[lang].hero;
  const tf = translations[lang].funds;
  return (
    <div className="min-h-screen pt-20 overflow-hidden relative">
      {/* Hero Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-[1000px] z-0 pointer-events-none"
        style={{ 
          backgroundImage: 'url(https://i.imgur.com/0tEHdR4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark" />
      </div>

      
      <section className="relative px-6 pt-24 pb-32 max-w-7xl mx-auto flex flex-col items-center z-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 text-center max-w-5xl leading-[0.95]"
        >
          {t.title.split('USDT')[0]}<span className="text-brand-green">USDT</span>{t.title.split('USDT')[1]}<br />
          {t.subtitle}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl text-center mb-12 leading-relaxed"
        >
          {t.description}
        </motion.p>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="flex flex-col items-center gap-6"
        >
          <button
            onClick={() => onStart()}
            className="group relative px-12 py-6 bg-brand-green text-white rounded-2xl text-xl font-bold shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-1 active:scale-95"
          >
            <span className="flex items-center gap-3">
              {t.cta} <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
          
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-white/40 text-sm font-medium">
              <Users className="w-4 h-4" /> {t.socialProof}
            </div>
            <ChevronDown className="w-6 h-6 text-brand-green/40 animate-bounce-subtle" />
          </div>
        </motion.div>

        {/* Metrics Section */}
        <MetricsSection lang={lang} />

        <div className="w-full max-w-4xl relative group">
          <div className="absolute -inset-px bg-gradient-to-r from-brand-green/30 to-transparent rounded-[2.5rem] p-[1px] opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative overflow-hidden glass rounded-[2.5rem] bg-brand-dark/40 px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
            
            <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
               <div className="w-16 h-16 rounded-[1.25rem] bg-brand-green/10 border border-brand-green/20 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <USDTIcon className="w-10 h-10 text-brand-green" />
               </div>
               <div className="space-y-1 text-center md:text-left">
                  <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em] inline-block px-3 py-1 bg-brand-green/10 rounded-full mb-2">
                    {tf.subtitle}
                  </p>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">{tf.title}</h4>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={funds}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="text-4xl font-black text-white tracking-tighter"
                    >
                      {formatCurrency(funds)}
                    </motion.p>
                  </AnimatePresence>
               </div>
            </div>

            <div className="h-16 w-px bg-white/5 hidden md:block" />

            <div className="flex flex-col items-center md:items-end gap-2 relative z-10 w-full md:w-auto">
               <div className="flex items-center gap-2 px-4 py-2 bg-brand-green/20 border border-brand-green/20 rounded-xl">
                 <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                 <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">Global Vault Active</span>
               </div>
               <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Verified by Chainlink Oracle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <LoanCalculator lang={lang} onStart={onStart} />

      {/* Benefits Section */}
      <BenefitsSection lang={lang} onStart={onStart} />
      
      {/* Testimonials Section */}
      <TestimonialsSection lang={lang} />

      {/* FAQ Section */}
      <FAQSection lang={lang} />
      
      {/* Final CTA Section */}
      <FinalCTA lang={lang} onStart={onStart} />

      {/* Footer Block (Newsletter & App) */}
      <FooterBlock lang={lang} />

    </div>
  );
};

const AuthChoice = ({ lang, onCreate, onLoginSuccess }: { lang: Language, onCreate: () => void, onLoginSuccess: () => void }) => {
  const t = translations[lang].onboarding;
  const [mode, setMode] = useState<'choice' | 'login'>('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onLoginSuccess();
    } catch (err: any) {
      setError(t.errorAuth);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass rounded-[3rem] p-8 lg:p-10 border-white/10 bg-brand-dark/40 shadow-2xl flex flex-col items-center gap-8 text-center"
      >
        <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center">
          <Shield className="w-10 h-10 text-brand-green" />
        </div>
        
        {mode === 'choice' ? (
          <>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-white">{t.authTitle}</h2>
              <p className="text-white/40 text-lg leading-relaxed">
                {t.authSubtitle}
              </p>
            </div>

            <div className="flex flex-col w-full gap-4 pt-4">
              <button 
                onClick={onCreate}
                className="w-full py-6 bg-brand-green text-white rounded-2xl font-black text-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                <Plus className="w-6 h-6" /> {t.createAccount}
              </button>
              
              <button 
                onClick={() => setMode('login')}
                className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6" /> {t.alreadyHaveAccount}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-white">{t.signIn}</h2>
              <p className="text-white/40 text-lg leading-relaxed">
                {t.loginSubtitle}
              </p>
            </div>

            <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-4">
              <div className="space-y-4">
                <div className="text-left space-y-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-green/50 transition-all font-medium"
                  />
                </div>
                <div className="text-left space-y-1.5">
                  <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{lang === 'es' ? 'Contraseña' : 'Password'}</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-brand-green/50 transition-all font-medium"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-green text-white rounded-2xl font-black text-lg hover:shadow-[0_15px_40px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : t.signIn}
              </button>

              <button 
                type="button"
                onClick={() => setMode('choice')}
                className="text-white/40 hover:text-white transition-all font-bold text-sm mt-2"
              >
                {lang === 'es' ? 'Volver atrás' : 'Go back'}
              </button>
            </form>
          </>
        )}

        <div className="pt-8 border-t border-white/5 w-full">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
            {lang === 'es' 
              ? "Seguridad institucional de alto nivel. Tus datos están protegidos por encriptación de grado militar."
              : "High-level institutional security. Your data is protected by military-grade encryption."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Onboarding = ({ onComplete, lang, onBackToAuth, initialEmail = '' }: { onComplete: (data: UserData, uid?: string) => void, lang: Language, onBackToAuth: () => void, initialEmail?: string }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<UserData & { password?: string, confirmPassword?: string }>({ 
    nombre: '', apellido: '', dni: '', email: initialEmail, whatsapp: '', pais: '', codPostal: '', documentType: 'DNI', password: '', confirmPassword: '' 
  });
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const t = translations[lang].onboarding;

  const next = async () => {
    setError(null);
    if (step === 1) {
      if (!data.pais || !data.nombre || !data.apellido || !data.dni || !data.documentType) return;
    }
    if (step === 2) {
      if (!data.email || !data.whatsapp) return;
      if (!auth.currentUser) {
        if (!data.password || data.password.length < 8) {
          setError(t.passwordTooShort);
          return;
        }
        if (data.password !== data.confirmPassword) {
          setError(t.passwordMismatch);
          return;
        }
      }
    }
    
    if (step < 3) setStep(step + 1);
    else {
      if (!aceptoTerminos) return;
      setIsCreatingAccount(true);
      try {
        let finalUid = auth.currentUser?.uid;
        if (!finalUid) {
          const trimmedEmail = data.email.trim();
          const trimmedPassword = data.password?.trim() || '';
          const userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
          finalUid = userCred.user.uid;
        }
        const { password, confirmPassword, ...profileData } = data;
        profileData.email = profileData.email.trim();
        const randomLimit = Math.floor(Math.random() * 5) * USDT_STEP + 1300; // Limits: 1300, 1350, 1400, 1450, 1500
        await saveUserProfile(finalUid, { ...profileData, role: 'user', limitValue: randomLimit });
        onComplete({ ...profileData, limitValue: randomLimit }, finalUid);
      } catch (err: any) {
        console.error("Registration error:", err);
        if (err.message === 'DNI_EXISTS') setError(t.errorDniExists);
        else if (err.message === 'WHATSAPP_EXISTS') setError(t.errorWhatsappExists);
        else if (err.code === 'auth/email-already-in-use') setError(t.errorEmailExists);
        else if (err.code === 'auth/operation-not-allowed') setError(lang === 'es' ? 'Error: El proveedor de Email/Password no está habilitado en Firebase.' : 'Error: Email/Password provider not enabled in Firebase.');
        else setError(err.message || t.errorAuth);
      } finally {
        setIsCreatingAccount(false);
      }
    }
  };

  const back = () => { if (step > 1) setStep(step - 1); };
  const update = (field: string, val: string) => { 
    if (field === 'pais') {
      const countryInfo = countryData[val];
      setData({ ...data, [field]: val, whatsapp: countryInfo ? countryInfo.prefix : data.whatsapp });
    } else {
      setData({ ...data, [field]: val }); 
    }
  };

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 max-w-4xl mx-auto flex flex-col items-center justify-center">
      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full glass rounded-[3rem] p-8 lg:p-12 border-white/10 shadow-2xl relative overflow-hidden" >
        <div className="absolute top-0 right-0 p-8">
           <p className="text-[10px] text-brand-green font-black tracking-widest">{t.step} {step} / 3</p>
        </div>
        <h2 className="text-4xl font-black text-white mb-4">{t.title}</h2>
        <p className="text-white/40 mb-10 font-medium">
          {step === 1 && (lang === 'es' ? 'Completá tus datos básicos de identidad.' : 'Complete your basic identity data.')}
          {step === 2 && (lang === 'es' ? 'Establecé tu acceso y contacto seguro.' : 'Set up your access and secure contact.')}
          {step === 3 && (lang === 'es' ? 'Revisá y aceptá los términos legales.' : 'Review and accept legal terms.')}
        </p>
        <div className="space-y-6">
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{(t as any).country}</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all" 
                  value={data.pais} 
                  onChange={(e) => update('pais', e.target.value)}
                >
                  <option value="" disabled className="bg-brand-dark">{(t as any).selectCountry}</option>
                  {countriesList.map(c => (
                    <option key={c} value={c} className="bg-brand-dark">{c}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{(t as any).documentType}</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => update('documentType', 'DNI')}
                    className={cn(
                      "py-4 rounded-xl font-bold transition-all border",
                      data.documentType === 'DNI' 
                        ? "bg-brand-green border-brand-green text-white" 
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                  >
                    {(t as any).dniOption}
                  </button>
                  <button 
                    onClick={() => update('documentType', 'PASSPORT')}
                    className={cn(
                      "py-4 rounded-xl font-bold transition-all border",
                      data.documentType === 'PASSPORT' 
                        ? "bg-brand-green border-brand-green text-white" 
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                  >
                    {(t as any).passportOption}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{t.name}</label>
                <input placeholder={lang === 'es' ? 'Nombre' : 'First Name'} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all" value={data.nombre} onChange={(e) => update('nombre', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{t.lastName}</label>
                <input placeholder={lang === 'es' ? 'Apellido' : 'Last Name'} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all" value={data.apellido} onChange={(e) => update('apellido', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">
                  {data.documentType === 'DNI' 
                    ? (lang === 'es' ? 'Número de DNI' : 'DNI Number') 
                    : (lang === 'es' ? 'Número de Pasaporte' : 'Passport Number')}
                </label>
                <input 
                  placeholder={(t as any).documentPlaceholder} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all" 
                  value={data.dni} 
                  onChange={(e) => update('dni', e.target.value)} 
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{t.contact}</label>
                <input placeholder="tu@email.com" type="email" disabled={!!auth.currentUser} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all disabled:opacity-50" value={data.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{t.whatsapp}</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-lg">{data.pais ? countryData[data.pais]?.flag : '🌐'}</span>
                    <span className="text-white/60 font-bold border-r border-white/10 pr-3 mr-1">{data.pais ? countryData[data.pais]?.prefix : '+'}</span>
                  </div>
                  <input 
                    placeholder="Número de WhatsApp" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-28 pr-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all" 
                    value={data.whatsapp.startsWith(data.pais ? (countryData[data.pais]?.prefix || '') : '') ? data.whatsapp.slice((data.pais ? (countryData[data.pais]?.prefix || '') : '').length) : data.whatsapp} 
                    onChange={(e) => {
                      const prefix = data.pais ? (countryData[data.pais]?.prefix || '') : '';
                      const digits = e.target.value.replace(/\D/g, '');
                      update('whatsapp', prefix + digits);
                    }} 
                  />
                </div>
              </div>
              {!auth.currentUser && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest ml-1">{t.passwordPlaceholder}</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all" value={data.password} onChange={(e) => update('password', e.target.value)} />
                  </div>
                  <div className="space-y-2 pt-6">
                    <input type="password" placeholder={t.confirmPasswordPlaceholder} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-brand-green transition-all" value={data.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                  </div>
                </>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-2xl max-h-60 overflow-y-auto text-sm text-white/60 leading-relaxed space-y-4">
                 <p className="font-bold text-white uppercase tracking-wider">{lang === 'es' ? 'Contrato de Adhesión' : 'Terms of Service'}</p>
                 <p>{lang === 'es' ? 'Al registrarte, aceptás los términos y condiciones de CrediCryp. Esto incluye el acceso a tu línea de crédito prendaria basada en activos blockchain.' : 'By registering, you accept CrediCryp\'s terms and conditions. This includes access to your pledge credit line based on blockchain assets.'}</p>
              </div>
              <label className="flex items-center gap-4 cursor-pointer group">
                <input type="checkbox" className="w-6 h-6 rounded-lg bg-white/5 border-white/10 checked:bg-brand-green transition-all" checked={aceptoTerminos} onChange={(e) => setAceptoTerminos(e.target.checked)} />
                <span className="text-sm text-white/40 group-hover:text-white transition-all font-medium">{t.legal}</span>
              </label>
            </div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold font-mono">
              {error}
            </motion.div>
          )}
          <div className="mt-12 flex gap-4">
            <button onClick={step > 1 ? back : onBackToAuth} className="px-8 py-5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all w-1/3" > {t.back} </button>
            <button onClick={next} disabled={isCreatingAccount || (step === 1 && (!data.nombre || !data.dni)) || (step === 2 && (!data.email || !data.whatsapp || (!auth.currentUser && !data.password))) || (step === 3 && !aceptoTerminos)} className="flex-1 py-5 bg-brand-green text-white font-bold rounded-2xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0" >
              {isCreatingAccount ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : (step < 3 ? t.next : t.finish)}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Assessment = ({ onApproved, lang }: { onApproved: () => void, lang: Language }) => {
  const [progress, setProgress] = useState(0);
  const t = translations[lang].assessment;
  const [status, setStatus] = useState(t.start);
  
  const steps = [
    { threshold: 20, message: t.identity },
    { threshold: 45, message: t.blockchain },
    { threshold: 70, message: t.viability },
    { threshold: 90, message: t.resolution },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 1.2;
        const currentStep = steps.find(s => next < s.threshold);
        if (currentStep) setStatus(currentStep.message);
        
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onApproved, 800);
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-[1000px] z-0 pointer-events-none"
        style={{ 
          backgroundImage: 'url(https://i.imgur.com/0tEHdR4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark" />
      </div>

      <div className="relative z-10">
        <div className="relative mb-16">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           className="w-32 h-32 border-2 border-white/5 border-t-brand-green rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
           <Activity className="w-10 h-10 text-brand-green" />
        </div>
      </div>
      
      <h2 className="text-3xl font-black text-white mb-2">{status}</h2>
      <p className="text-white/40 mb-12 uppercase tracking-widest text-xs font-bold">{t.subtitle}</p>
      
      <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
           className="h-full bg-brand-green shadow-[0_0_15px_rgba(16,185,129,0.8)]"
           style={{ width: `${progress}%` }}
        />
      </div>
      <span className="block mt-4 text-xs font-mono text-brand-green">{progress.toFixed(0)}%</span>
      </div>
    </div>
  );
};

const Result = ({ onNext, initialAmount, lang, userData, onGoToDashboard, onStartKYC }: { onNext: (amount: number) => void, initialAmount: number, lang: Language, userData: UserData, onGoToDashboard: () => void, onStartKYC: () => void }) => {
  const [step, setStep] = useState<'config' | 'wallet'>('config');
  const userLimit = userData.limitValue || PRIMARY_USDT_LIMIT;
  const [requestedAmount, setRequestedAmount] = useState(Math.min(initialAmount, userLimit));
  const [installments, setInstallments] = useState(12);
  const [wallet, setWallet] = useState('');
  const t = translations[lang].result;

  // Reactively track initialAmount if it changes (e.g. from App state)
  useEffect(() => {
    setRequestedAmount(Math.min(initialAmount, userLimit));
  }, [initialAmount, userLimit]);

  const interestRate = 0.02 + (installments * 0.005); // More installments = more interest
  const monthlyPayment = (requestedAmount * (1 + interestRate)) / installments;

  if (step === 'wallet') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Hero Background Image */}
        <div 
          className="absolute top-0 left-0 w-full h-[1000px] z-0 pointer-events-none"
          style={{ 
            backgroundImage: 'url(https://i.imgur.com/0tEHdR4.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark" />
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 glass rounded-[3rem] p-10 border-white/10 bg-brand-dark/40 shadow-2xl w-full max-w-xl mx-auto">
          <div className="w-16 h-16 bg-brand-green/20 rounded-2xl flex items-center justify-center mb-8 mx-auto">
            <Wallet className="w-8 h-8 text-brand-green" />
          </div>
          <h2 className="text-3xl font-black text-white mb-6">{t.withdrawalConfig}</h2>
          
          <div className="space-y-4 mb-10 text-left">
            <div className="p-4 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl flex gap-3">
              <AlertCircle className="w-6 h-6 text-brand-yellow shrink-0" />
              <p className="text-[10px] font-bold text-brand-yellow uppercase tracking-widest leading-normal">
                {t.mandatoryNotice}
              </p>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3">
              <Lock className="w-6 h-6 text-red-500 shrink-0" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-normal">
                {t.securityNotice}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2">{t.walletLabel}</label>
            <input 
              type="text" 
              placeholder="0x..." 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-brand-green outline-none transition-all text-white font-mono text-sm"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />
          </div>

          <button
            onClick={() => onNext(requestedAmount)}
            disabled={!wallet || wallet.length < 20}
            className="w-full mt-10 py-6 bg-brand-green text-white rounded-2xl font-black text-xl hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {t.confirmAndActivate}
          </button>
        </motion.div>
      </div>
    );
  }

  const tActivation = translations[lang].activation;

  return (
    <div className="min-h-screen py-32 px-6 flex flex-col items-center relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-[1000px] z-0 pointer-events-none"
        style={{ 
          backgroundImage: 'url(https://i.imgur.com/0tEHdR4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark" />
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        className="relative z-10 w-20 h-20 bg-brand-green rounded-2xl flex items-center justify-center mb-8 shadow-2xl"
      >
        <CheckCircle2 className="text-white w-10 h-10" />
      </motion.div>
      
      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="text-left">
            <h2 className="text-brand-green font-black text-2xl mb-4">{t.welcome.replace('{name}', userData.nombre)}</h2>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{t.approved.split('Aprobado')[0]}<span className="text-brand-green">{lang === 'es' ? 'Aprobado' : 'Approved'}</span>{t.approved.split('Aprobado')[1]}</h1>
            <p className="text-white/40 leading-relaxed">
              {t.approvedDesc}
            </p>
          </div>

          {/* KYC Level 2 Upsell Notice */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-brand-green/5 border border-brand-green/20 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 group hover:bg-brand-green/10 transition-colors"
          >
            <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center shrink-0">
               <UserCheck className="w-8 h-8 text-brand-green" />
            </div>
            <div className="flex-grow space-y-4 text-center sm:text-left">
               <div className="space-y-1">
                 <h4 className="font-bold text-white text-lg">¿Necesitas un límite mayor?</h4>
                 <p className="text-white/50 text-xs leading-relaxed">
                   Si realizas la <span className="text-brand-green font-bold">Verificación Nivel 2</span>, puedes acceder a límites de hasta <span className="text-white font-black">5,000 USDT</span> de forma inmediata.
                 </p>
               </div>
               <button 
                 onClick={onStartKYC}
                 className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-brand-green/20 transition-all active:scale-95"
               >
                 Iniciar Verificación KYC <UserCheck className="w-4 h-4" />
               </button>
            </div>
          </motion.div>

          <div className="glass rounded-[3rem] p-8 border-white/10 space-y-8 bg-brand-dark/40 shadow-2xl">
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                       <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2">{t.loanAmount}</label>
                       <span className="text-2xl font-black text-white">{formatCurrency(requestedAmount)}</span>
                     </div>
                     <input 
                       type="range" 
                       min="750" 
                       max={userLimit} 
                       step="50"
                       className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
                       value={requestedAmount < 750 ? 750 : requestedAmount}
                       onChange={(e) => setRequestedAmount(parseInt(e.target.value))}
                     />
                     <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                       <span>Min: $750</span>
                       <span>Max: {formatCurrency(userLimit)}</span>
                     </div>
                  </div>

            <div className="space-y-4">
               <div className="flex justify-between items-end">
                 <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-2">{t.term}</label>
                 <span className="text-2xl font-black text-white">{installments} {t.installments}</span>
               </div>
               <div className="grid grid-cols-4 gap-2">
                 {[3, 6, 9, 12].map(n => (
                   <button
                    key={n}
                    onClick={() => setInstallments(n)}
                    className={cn(
                      "py-3 rounded-xl font-bold text-sm transition-all",
                      installments === n ? "bg-brand-green text-white shadow-lg shadow-brand-green/20" : "bg-white/5 text-white/40 hover:bg-white/10"
                    )}
                   >
                     {n} m
                   </button>
                 ))}
               </div>
               <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                 {t.interest} +{(interestRate * 100).toFixed(1)}% {lang === 'es' ? 'anual' : 'annual'}
               </p>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass rounded-[3rem] p-10 border-white/10 sticky top-32"
        >
           <h3 className="text-xl font-bold text-white mb-8">{t.summary}</h3>
           <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-white/40 text-sm">{t.capital}</span>
                <span className="text-white font-bold">{formatCurrency(requestedAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-white/5">
                <span className="text-white/40 text-sm">{t.systemInterest}</span>
                <span className="text-white font-bold">{formatCurrency(requestedAmount * interestRate)}</span>
              </div>
              <div className="flex justify-between items-center py-8">
                <div className="text-left">
                  <span className="text-brand-green text-xs font-black uppercase tracking-widest block mb-1">{t.monthlyPayment}</span>
                  <p className="text-3xl font-black text-white">{formatCurrency(monthlyPayment)}</p>
                </div>
              </div>
           </div>

           <button
            onClick={() => setStep('wallet')}
            className="w-full mt-8 py-6 bg-brand-green text-white rounded-2xl font-black text-lg hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            {t.cta} <ArrowRight className="w-5 h-5" />
          </button>
          <button 
             onClick={onGoToDashboard}
             className="w-full mt-4 py-4 bg-white/5 border border-white/10 text-white/60 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <LayoutDashboard className="w-5 h-5" /> {t.miPanel}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

const Activation = ({ onActivated, loanAmount, lang }: { onActivated: () => void, loanAmount: number, lang: Language }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [hasStartedPayment, setHasStartedPayment] = useState(false);
  const [isOpeningPayment, setIsOpeningPayment] = useState(false);
  const [timer, setTimer] = useState(900); // 15 min
  const [confirming, setConfirming] = useState(false);
  const [paymentDetected, setPaymentDetected] = useState(false);
  const t = translations[lang].activation;

  const guaranteeAmount = loanAmount * GUARANTEE_PERCENT;

  useEffect(() => {
    if (isPaying && timer > 0) {
      const t = setInterval(() => setTimer(v => v - 1), 1000);
      return () => clearInterval(t);
    }
  }, [isPaying, timer]);

  const handleVerify = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      onActivated();
    }, 2000);
  };

  const handlePaymentClick = () => {
    setIsOpeningPayment(true);
    // Simulate loading/opening payment window
    setTimeout(() => {
      setIsOpeningPayment(false);
      setHasStartedPayment(true);
      setIsPaying(true);
    }, 2000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 flex flex-col items-center relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-[1000px] z-0 pointer-events-none"
        style={{ 
          backgroundImage: 'url(https://i.imgur.com/0tEHdR4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark" />
      </div>

      <div className="relative z-10 w-full max-w-3xl glass rounded-[3.5rem] border-white/5 overflow-hidden bg-brand-dark/20 shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
        <div className="p-12 border-b border-white/5">
           <h2 className="text-4xl font-black text-white mb-6">{t.title}</h2>
           <p className="text-white/40 leading-relaxed max-w-xl">
             {lang === 'es' ? (
               <>Para activar tu línea de crédito de {formatCurrency(loanAmount)}, se requiere un <span className="text-white font-bold">depósito de garantía del 10%</span> el cual se abona como colateral en <span className="text-brand-yellow font-bold">BTC</span>. Este depósito es 100% reembolsable una vez finalizado el uso del crédito.</>
             ) : (
               <>To activate your credit line of {formatCurrency(loanAmount)}, a <span className="text-white font-bold">10% security deposit</span> is required, which is paid as <span className="text-brand-yellow font-bold">BTC</span> collateral. This deposit is 100% refundable upon completion of credit use.</>
             )}
           </p>
        </div>

        <AnimatePresence mode="wait">
          {!isPaying ? (
            <motion.div key="prepay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 space-y-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 glass bg-white/5 rounded-[2.5rem] border-white/10">
                   <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">{lang === 'es' ? 'Línea de Crédito' : 'Credit Line'}</p>
                   <p className="text-3xl font-black text-white">{formatCurrency(loanAmount)}</p>
                </div>
                <div className="p-8 glass bg-brand-green/10 rounded-[2.5rem] border-brand-green/20">
                   <p className="text-xs font-bold text-brand-green uppercase tracking-widest mb-3">{t.guarantee}</p>
                   <p className="text-3xl font-black text-white">{formatCurrency(guaranteeAmount)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                 <AlertCircle className="w-6 h-6 text-brand-green shrink-0" />
                 <p className="text-sm text-white/60 leading-relaxed">
                   {lang === 'es' 
                     ? "La garantía se deposita como colateral en BTC y se bloquea automáticamente en el contrato de liquidez. Este proceso asegura tu línea y reduce los intereses mensuales al mínimo histórico."
                     : "The guarantee is deposited as BTC collateral and automatically locked in the liquidity contract. This process secures your line and reduces monthly interest to an all-time low."}
                 </p>
              </div>

              <button
                onClick={() => setIsPaying(true)}
                className="w-full py-6 bg-brand-green text-white rounded-2xl font-black text-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95"
              >
                {lang === 'es' ? 'Pagar Garantía vía BTCPay' : 'Pay Guarantee via BTCPay'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="paying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 flex flex-col items-center">
              <div className="mb-10 lg:p-10 glass bg-brand-dark/40 rounded-[3rem] shadow-[0_0_60px_rgba(16,185,129,0.1)] border border-white/10 w-full max-w-sm flex flex-col items-center">
                 {isOpeningPayment ? (
                   <div className="flex flex-col items-center gap-4 py-8">
                      <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
                      <p className="text-xs font-black text-white/40 uppercase tracking-widest">{lang === 'es' ? 'Abriendo Ventana de Pago...' : 'Opening Payment Window...'}</p>
                   </div>
                 ) : (
                   <div className="w-full flex justify-center">
                      <BTCPayButton 
                        amount={guaranteeAmount} 
                        onPreSubmit={() => setIsOpeningPayment(true)}
                        onInvoiceCreated={() => {
                          setIsOpeningPayment(false);
                          setHasStartedPayment(true);
                        }}
                      />
                   </div>
                 )}
              </div>

              {hasStartedPayment && !isOpeningPayment && (
                <div className="w-full max-w-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                        <span className="text-xs font-black text-white/40 uppercase">{lang === 'es' ? 'Esperando Confirmación' : 'Waiting Confirmation'}</span>
                    </div>
                    <span className="text-sm font-mono text-white/80">{formatTime(timer)}</span>
                  </div>
                  
                  {paymentDetected ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-12 h-12 bg-brand-green/20 rounded-full flex items-center justify-center transition-all">
                        <CheckCircle2 className="w-8 h-8 text-brand-green" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-brand-green uppercase tracking-widest">{lang === 'es' ? '¡Pago Detectado!' : 'Payment Detected!'}</p>
                        <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tighter">{lang === 'es' ? 'Procesando acreditación en tu cuenta...' : 'Processing accreditation to your account...'}</p>
                      </div>
                    </div>
                  ) : confirming ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
                      <div className="text-center">
                        <span className="text-sm font-bold text-white uppercase tracking-widest block mb-1">
                          {t.confirming}
                        </span>
                        <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                          Node Confirmation in progress
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button 
                        onClick={handleVerify}
                        className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-green hover:bg-brand-green/5 text-white/60 hover:text-brand-green text-xs font-black uppercase tracking-[0.2em] transition-all group"
                      >
                        {t.verify}
                      </button>
                      <p className="text-[9px] text-white/20 text-center uppercase font-bold tracking-widest leading-relaxed">
                        {lang === 'es' 
                          ? "Si ya realizaste la transferencia y el modal no se cerró solo, hacé clic en verificar para sincronizar manualmente tu saldo."
                          : "If you have already made the transfer and the modal did not close by itself, click verify to manually synchronize your balance."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- KYC Flow Components ---

const KYCStep1 = ({ data, onChange, onNext, lang }: { data: any, onChange: (field: string, value: string) => void, onNext: () => void, lang: Language }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Nombre completo</label>
        <input 
          type="text" 
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          placeholder="Juan Pérez"
          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-brand-green transition-all"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Fecha de nacimiento</label>
        <input 
          type="date" 
          value={data.dob}
          onChange={(e) => onChange('dob', e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-brand-green transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Tipo de Doc.</label>
          <select 
            value={data.documentType}
            onChange={(e) => onChange('documentType', e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-brand-green transition-all"
          >
            <option value="ID">Documento de Identidad (ID/DNI)</option>
            <option value="PASSPORT">Pasaporte</option>
            <option value="LICENSE">Licencia de Conducir</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-2">Número de Doc.</label>
          <input 
            type="text" 
            value={data.documentNumber}
            onChange={(e) => onChange('documentNumber', e.target.value)}
            placeholder="12345678"
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-brand-green transition-all"
          />
        </div>
      </div>
      <button 
        onClick={onNext}
        disabled={!data.fullName || !data.dob || !data.documentNumber}
        className="w-full py-5 bg-brand-green text-white rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-brand-green/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
      >
        Continuar
      </button>
    </div>
  );
};

const ImageUpload = ({ label, onUpload, previewUrl, lang }: { label: string, onUpload: (file: File) => void, previewUrl?: string, lang: Language }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">{label}</p>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="aspect-[4/3] w-full bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-brand-green/40 hover:bg-white/10 transition-all overflow-hidden relative"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
               <Smartphone className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-xs font-bold text-white/40">Tocar para tomar foto o subir</p>
          </>
        )}
      </div>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

const KYCFlow = ({ user, lang, onComplete }: { user: FirebaseUser, lang: Language, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    documentType: 'ID',
    documentNumber: ''
  });
  const [files, setFiles] = useState<{ docFront?: File, docBack?: File, selfie?: File }>({});
  const [previews, setPreviews] = useState<{ docFront?: string, docBack?: string, selfie?: string }>({});
  const [phase, setPhase] = useState<'form' | 'uploading' | 'simulating' | 'pending'>('form');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFieldUpdate = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: 'docFront' | 'docBack' | 'selfie', file: File) => {
    setFiles(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const startSubmission = async () => {
    if (!files.docFront || !files.docBack || !files.selfie) return;
    setPhase('uploading');
    
    try {
      // 1. Upload to Storage
      const frontRef = ref(storage, `kyc/${user.uid}/document_front.jpg`);
      const backRef = ref(storage, `kyc/${user.uid}/document_back.jpg`);
      const selfieRef = ref(storage, `kyc/${user.uid}/selfie.jpg`);
      
      await uploadBytes(frontRef, files.docFront);
      setUploadProgress(30);
      const frontUrl = await getDownloadURL(frontRef);
      
      await uploadBytes(backRef, files.docBack);
      setUploadProgress(60);
      const backUrl = await getDownloadURL(backRef);
      
      await uploadBytes(selfieRef, files.selfie);
      setUploadProgress(90);
      const selfieUrl = await getDownloadURL(selfieRef);
      
      // 2. Save to Firestore
      const kycDoc = doc(db, 'kyc', user.uid);
      await setDoc(kycDoc, {
        userId: user.uid,
        ...formData,
        documentImageUrl: frontUrl,
        documentBackImageUrl: backUrl,
        selfieImageUrl: selfieUrl,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setUploadProgress(100);
      
      // 3. Simulated Analysis Delay
      setPhase('simulating');
      setTimeout(() => {
        onComplete(); // Auto-redirect to dashboard
      }, 1500); // Shortened duration

    } catch (error) {
      console.error("KYC Submission Error:", error);
      setPhase('form');
    }
  };

  if (phase === 'pending') {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl glass rounded-[3.5rem] p-12 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-brand-yellow/10 rounded-3xl flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-brand-yellow" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tight">Validación en Revisión</h2>
            <p className="text-white/40 leading-relaxed font-medium">
              Tu información fue enviada correctamente. Nuestro equipo está revisando tu identidad para habilitar tu límite de <span className="text-brand-green font-bold">5000 USDT</span>.
            </p>
            <p className="text-brand-yellow text-sm font-bold bg-brand-yellow/5 py-3 rounded-xl px-4 border border-brand-yellow/10">
              Te avisaremos por WhatsApp una vez que tu KYC se encuentre aprobado.
            </p>
          </div>
          
          <div className="p-6 bg-white/5 rounded-3xl space-y-4 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-bold text-white/80">Documentación recibida</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-green" />
              <span className="text-sm font-bold text-white/80">Biometría facial enviada</span>
            </div>
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-brand-yellow animate-spin" />
              <span className="text-sm font-bold text-brand-yellow">Revisión manual en proceso</span>
            </div>
          </div>

          <a 
            href={`https://wa.me/1234567890?text=Hola,%20ya%20envié%20mi%20verificación%20KYC%20en%20la%20plataforma.%20¿Podrían%20revisarla?`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform active:scale-95"
          >
            <MessageCircle className="w-6 h-6" /> Acelerar vía WhatsApp
          </a>
          
          <button 
            onClick={onComplete}
            className="w-full py-4 text-white/20 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
          >
            Volver al Panel
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'simulating' || phase === 'uploading') {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-10 w-full max-w-sm"
        >
          <div className="relative">
            <Loader2 className="w-24 h-24 text-brand-green animate-spin mx-auto opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-10 h-10 text-brand-green animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-white">Procesando Identidad...</h2>
            {phase === 'uploading' && (
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden max-w-[200px] mx-auto">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-brand-green"
                />
              </div>
            )}
            <div className="space-y-3">
               {[
                 { label: 'Documentación cargada', delay: 0 },
                 { label: 'Análisis biométrico facial', delay: 1200 },
                 { label: 'Preparando revisión manual', delay: 2400 }
               ].map((item, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: item.delay / 1000 }}
                   className="flex items-center gap-3 justify-center text-white/40 text-[10px] font-black uppercase tracking-widest"
                 >
                   <CheckCircle2 className="w-4 h-4 text-brand-green" /> {item.label}
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-8">
           <div>
             <h2 className="text-3xl font-black text-white">Verificación KYC</h2>
             <p className="text-white/40 text-sm font-bold">Paso {step} de 4</p>
           </div>
           <div className="flex gap-2">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={cn(
                  "w-3 h-3 rounded-full transition-all duration-500",
                  step >= s ? "bg-brand-green" : "bg-white/10"
                )} />
              ))}
           </div>
        </div>

        <div className="mb-8 p-4 bg-brand-green/10 border border-brand-green/20 rounded-2xl flex items-center gap-3">
           <Zap className="w-5 h-5 text-brand-green shrink-0" />
           <p className="text-[10px] text-white font-black uppercase tracking-widest">
             Completa estos pasos para desbloquear tu límite mensual de <span className="text-brand-green">5000 USDT</span>
           </p>
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass rounded-[3.5rem] p-10 space-y-10"
        >
          {step === 1 && (
            <KYCStep1 
              data={formData} 
              lang={lang} 
              onChange={handleFieldUpdate} 
              onNext={() => setStep(2)} 
            />
          )}

          {step === 2 && (
            <div className="space-y-8">
              <ImageUpload 
                label="Frente del Documento de Identidad" 
                lang={lang} 
                previewUrl={previews.docFront}
                onUpload={(f) => handleFileUpload('docFront', f)} 
              />
              <button 
                onClick={() => setStep(3)}
                disabled={!files.docFront}
                className="w-full py-5 bg-brand-green text-white rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-brand-green/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                Siguiente
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <ImageUpload 
                label="Dorso del Documento de Identidad" 
                lang={lang} 
                previewUrl={previews.docBack}
                onUpload={(f) => handleFileUpload('docBack', f)} 
              />
              <button 
                onClick={() => setStep(4)}
                disabled={!files.docBack}
                className="w-full py-5 bg-brand-green text-white rounded-2xl font-black text-lg hover:shadow-lg hover:shadow-brand-green/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                Siguiente
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <ImageUpload 
                label="Selfie en Tiempo Real (Rostro visible)" 
                lang={lang} 
                previewUrl={previews.selfie}
                onUpload={(f) => handleFileUpload('selfie', f)} 
              />
              <div className="p-4 bg-brand-green/10 border border-brand-green/20 rounded-2xl flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                 <p className="text-[10px] text-white/60 leading-relaxed font-bold uppercase tracking-widest">
                   Asegúrate de que tu rostro coincida con el documento. Esto garantiza el desbloqueo de los <span className="text-white">5000 USDT</span> de límite.
                 </p>
              </div>
              <button 
                onClick={startSubmission}
                disabled={!files.selfie}
                className="w-full py-6 bg-brand-green text-white rounded-2xl font-black text-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all active:scale-95 disabled:opacity-50"
              >
                Finalizar y Enviar
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const Dashboard = ({ userData, lang, creditLine, onRecalculate, kycData, onStartKYC }: { userData: UserData, lang: Language, creditLine?: any, onRecalculate: () => void, kycData?: any, onStartKYC: () => void }) => {
  const t = translations[lang].dashboard;
  const metricsT = translations[lang].metrics;
  const actT = translations[lang].activation;

  const handleWithdraw = () => {
    if (!creditLine) {
      onRecalculate(); // Go to setup process
      return;
    }
    
    if (creditLine.status === 'pending') {
      alert(lang === 'es' ? 'Tu depósito de garantía está bajo revisión manual. Te avisaremos por WhatsApp.' : 'Your guarantee deposit is under manual review. We will notify you via WhatsApp.');
      return;
    }

    if (creditLine.status === 'awaiting_deposit') {
      alert(lang === 'es' ? 'Debes completar el pago de la garantía para activar tu línea de crédito. Revisa la sección de "Activación".' : 'You must complete the guarantee payment to activate your credit line. Check the "Activation" section.');
      return;
    }

    if (creditLine.status === 'rejected') {
      onRecalculate();
      return;
    }

    if (creditLine.status !== 'active') {
      setWithdrawError(t.errorWithdraw);
      setTimeout(() => setWithdrawError(null), 8000);
    } else {
      // Real withdrawal logic would go here
      alert(lang === 'es' ? 'Procesando retiro a tu billetera configurada.' : 'Processing withdrawal to your configured wallet.');
    }
  };

  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const displayLimit = userData.limitValue || PRIMARY_USDT_LIMIT;
  const displayAmount = creditLine?.amount || displayLimit;
  const displayStatus = creditLine?.status || 'NO_CREDIT';

  return (
    <div className="min-h-screen pt-28 px-6 pb-20 relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-[1000px] z-0 pointer-events-none"
        style={{ 
          backgroundImage: 'url(https://i.imgur.com/0tEHdR4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/80 to-brand-dark" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <AnimatePresence>
          {withdrawError && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6"
            >
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-3xl backdrop-blur-xl shadow-2xl flex items-start gap-4">
                <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
                <p className="text-sm font-bold leading-relaxed">{withdrawError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Side */}
        <div className="lg:col-span-8 space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <h1 className="text-4xl font-black text-white mb-2">{lang === 'es' ? 'Bienvenido' : 'Welcome'}, {userData.nombre}</h1>
              <button 
                onClick={onRecalculate}
                className="text-xs font-black text-brand-green uppercase tracking-widest px-4 py-2 bg-brand-green/10 border border-brand-green/20 rounded-xl hover:bg-brand-green/20 transition-all flex items-center gap-2"
              >
                <Calculator className="w-3 h-3" /> {t.viewLimit}
              </button>
            </div>
            {displayStatus === 'awaiting_deposit' && (
              <div className="bg-brand-yellow/10 border border-brand-yellow/20 p-5 rounded-[2rem] max-w-sm relative overflow-hidden group">
                 <div className="relative">
                   <div className="flex items-center gap-3 mb-2">
                     <Clock className="w-4 h-4 text-brand-yellow" />
                     <p className="text-xs font-black text-brand-yellow uppercase tracking-widest">{lang === 'es' ? 'Acreditación en curso' : 'Accreditation in progress'}</p>
                   </div>
                   <p className="text-[11px] text-white/80 leading-relaxed font-bold">
                     {lang === 'es' 
                       ? "Tu depósito ha sido detectado. Una vez confirmado por la red blockchain, los fondos de tu crédito se liberarán automáticamente para su retiro."
                       : "Your deposit has been detected. Once confirmed by the blockchain network, your credit funds will be automatically released for withdrawal."}
                   </p>
                 </div>
              </div>
            )}
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            {/* KYC Status Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="glass rounded-[3rem] p-10 border-white/10 relative overflow-hidden group"
            >
               <div className="relative z-10">
                 <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Verificación de Identidad</p>
                 <div className="flex items-center gap-4 mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      kycData?.status === 'approved' ? "bg-brand-green/20 text-brand-green" :
                      kycData?.status === 'pending' ? "bg-brand-yellow/20 text-brand-yellow" :
                      "bg-white/5 text-white/20"
                    )}>
                      {kycData?.status === 'approved' ? <ShieldCheck className="w-6 h-6" /> :
                       kycData?.status === 'pending' ? <Clock className="w-6 h-6" /> :
                       <ShieldAlert className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {kycData?.status === 'approved' ? 'Identidad Verificada' :
                         kycData?.status === 'pending' ? 'KYC en Revisión' :
                         'Aumenta tu Límite'}
                      </h4>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-tight">
                        {kycData?.status === 'approved' ? 'Acceso a 5000 USDT Habilitado' :
                         kycData?.status === 'pending' ? 'Habilitando 5000 USDT' :
                         'Obtén hasta 5000 USDT de crédito'}
                      </p>
                    </div>
                 </div>

                 {(!kycData || kycData.status === 'not_started') ? (
                   <button 
                     onClick={onStartKYC}
                     className="w-full py-4 bg-brand-green text-white rounded-2xl font-black text-sm hover:shadow-lg hover:shadow-brand-green/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     Validar identidad <UserCheck className="w-4 h-4" />
                   </button>
                 ) : kycData.status === 'pending' ? (
                   <a 
                     href={`https://wa.me/1234567890?text=Hola,%20ya%20envié%20mi%20verificación%20KYC%20en%20la%20plataforma.%20¿Podrían%20revisarla?`}
                     target="_blank"
                     rel="noreferrer"
                     className="w-full py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-all font-sans"
                   >
                     Acelerar Verificación <WhatsAppIcon className="w-4 h-4" />
                   </a>
                 ) : (
                    <div className="py-4 border border-brand-green/20 bg-brand-green/5 rounded-2xl text-center">
                       <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em]">Verificación Completada</span>
                    </div>
                 )}
               </div>
            </motion.div>

            {/* Balance Card */}
            <div className="glass rounded-[3rem] p-10 h-full flex flex-col justify-between shadow-2xl bg-gradient-to-br from-brand-green/10 via-brand-dark/80 to-brand-purple/10 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 blur-3xl -mr-16 -mt-16 group-hover:bg-brand-green/20 transition-colors" />
              <div className="relative">
                 <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{lang === 'es' ? 'Balance Principal' : 'Main Balance'}</p>
                 <h3 className="text-5xl font-black text-white mb-2">{formatCurrency(displayAmount)}</h3>
                 <div className={cn(
                     "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase",
                     displayStatus === 'active' 
                       ? "bg-brand-green/20 text-brand-green" 
                       : displayStatus === 'awaiting_deposit' 
                         ? "bg-brand-yellow/20 text-brand-yellow"
                         : "bg-white/10 text-white/40"
                   )}>
                     <CheckCircle2 className="w-3 h-3" /> {
                       displayStatus === 'active' ? t.statusActive : 
                       displayStatus === 'awaiting_deposit' ? t.statusAwaiting : t.statusPending
                     }
                   </div>
                </div>
                <div className="mt-12 flex gap-3">
                  <button 
                    onClick={handleWithdraw}
                    className="flex-1 py-4 bg-white text-brand-dark rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform active:scale-95"
                  >
                    {lang === 'es' ? 'Retirar' : 'Withdraw'} <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button className="p-4 glass rounded-2xl hover:bg-white/10 transition-colors">
                    <Wallet className="w-5 h-5 text-white" />
                  </button>
                </div>
            </div>

            {/* Collateral Card */}
            {displayStatus !== 'NO_CREDIT' && displayStatus !== 'approved' && (
              <div className="glass rounded-[3rem] p-10 flex flex-col justify-between border-white/5">
                <div>
                   <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{lang === 'es' ? 'Garantía Bloqueada' : 'Locked Collateral'}</p>
                   <h3 className="text-3xl font-black text-white mb-6">{formatCurrency(displayAmount * GUARANTEE_PERCENT)}</h3>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                      <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-brand-green" />
                   </div>
                   <div className="flex items-center gap-2 text-brand-green">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-black tracking-widest">{lang === 'es' ? 'Resguardo Institucional' : 'Institutional Safeguard'}</span>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity */}
          {displayStatus !== 'NO_CREDIT' && (
            <div className="glass rounded-[3rem] p-10 border-white/5">
              <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                {t.history}
              </h4>
              <div className="space-y-6">
                {(displayStatus === 'active' || displayStatus === 'awaiting_deposit') ? (
                  <>
                    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-green/10 text-brand-green">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{lang === 'es' ? "Activación de línea" : "Line activation"}</p>
                          <p className="text-xs text-white/30">{lang === 'es' ? "Hace unos momentos" : "Just now"}</p>
                        </div>
                      </div>
                      <p className="text-sm font-mono font-black text-white">+ {formatCurrency(displayAmount)}</p>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-green/10 text-brand-green">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{lang === 'es' ? "Depósito de garantía" : "Security deposit"}</p>
                          <p className="text-xs text-white/30">{lang === 'es' ? "En verificación" : "Verifying"}</p>
                        </div>
                      </div>
                      <p className="text-sm font-mono font-black text-white">- {formatCurrency(displayAmount * GUARANTEE_PERCENT)}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-white/20 text-center py-10 font-bold italic">{lang === 'es' ? 'No hay movimientos registrados' : 'No transactions recorded'}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass rounded-[3rem] p-8 border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-bold text-white">{actT.support}</h4>
                <div className="w-2 h-2 rounded-full bg-brand-green" />
              </div>
              <p className="text-xs text-white/40 mb-6">{actT.supportDesc}</p>
              <a 
                href="https://wa.me/1234567890" 
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#25D366]/20 transition-all font-sans"
              >
                <WhatsAppIcon className="w-4 h-4" /> {actT.whatsappBtn}
              </a>
           </div>
        </div>
      </div>
    </div>
  </div>
  );
};

// --- App Root ---

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfileState] = useState<any | null>(null);
  const [creditData, setCreditData] = useState<any | null>(null);
  const [kycData, setKycData] = useState<any | null>(null);
  const [funds, setFunds] = useState(425850);
  const [selectedLoanAmount, setSelectedLoanAmount] = useState(PRIMARY_USDT_LIMIT);

  useEffect(() => {
    let unsubscribeCredit: any = null;
    let unsubscribeKYC: any = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfileState(profile);
        
        // Listen to credit data
        const creditDoc = doc(db, 'credits', firebaseUser.uid);
        unsubscribeCredit = onSnapshot(creditDoc, (snapshot) => {
           if (snapshot.exists()) {
             const data = snapshot.data();
             setCreditData(data);
             setSelectedLoanAmount(data.amount);
           }
        }, (error) => {
           handleFirestoreError(error, OperationType.GET, `credits/${firebaseUser.uid}`);
        });

        // Listen to KYC data
        const kycDoc = doc(db, 'kyc', firebaseUser.uid);
        unsubscribeKYC = onSnapshot(kycDoc, (snapshot) => {
           if (snapshot.exists()) {
             setKycData(snapshot.data());
           } else {
             setKycData(null);
           }
        }, (error) => {
           handleFirestoreError(error, OperationType.GET, `kyc/${firebaseUser.uid}`);
        });

        if (profile) {
          const limit = profile.limitValue || PRIMARY_USDT_LIMIT;
          // If the profile exists, we usually go to dashboard.
          // BUT if we are currently in onboarding or assessment, we don't want to hijack the flow.
          if (phase === 'landing' || phase === 'auth_choice') {
            setPhase('dashboard');
          }
          setUserData({
            nombre: profile.nombre,
            apellido: profile.apellido,
            dni: profile.dni,
            email: profile.email,
            whatsapp: profile.whatsapp || '',
            pais: profile.pais || '',
            codPostal: profile.codPostal || '',
            limitValue: limit
          });
          if (phase !== 'result' && phase !== 'activation') {
            setSelectedLoanAmount(limit);
          }
        } else {
          if (phase === 'landing' || phase === 'auth_choice') setPhase('onboarding');
        }
      } else {
        setUserProfileState(null);
        setUserData(null);
        setCreditData(null);
        // Reset selected amount to default for new users
        setSelectedLoanAmount(PRIMARY_USDT_LIMIT);
        if (unsubscribeCredit) unsubscribeCredit();
        if (unsubscribeKYC) unsubscribeKYC();
        if (phase === 'dashboard' || phase === 'kyc' || phase === 'assessment' || phase === 'result' || phase === 'activation') setPhase('landing');
      }
      setLoading(false);
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeCredit) unsubscribeCredit();
      if (unsubscribeKYC) unsubscribeKYC();
    };
  }, [phase]);

  const t = translations[lang].activation; // For the WhatsApp Help
  const legalT = translations[lang].dashboard; // For footer

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPhase('landing');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const startKYC = useCallback(() => {
    if (kycData) {
      // If already pending or approved, we just show dashboard (which has status card)
      // or we can jump to a status page. For now, let's allow jumping into KYCFlow
      // and it will handle the "pending" view based on its internal logic or kycData
      setPhase('kyc');
    } else {
      setPhase('kyc');
    }
  }, [kycData]);

  const startOnboarding = useCallback((amount?: number) => {
    if (user) {
      setPhase('onboarding');
      if (amount) {
        setSelectedLoanAmount(Math.min(amount, userData?.limitValue || PRIMARY_USDT_LIMIT * 3.33)); // 3.33 * 1500 = 5000 approx
      }
    } else {
      setPhase('auth_choice');
    }
  }, [user, userData]);

  const completeOnboarding = useCallback(async (data: UserData, uid?: string) => {
    const targetUid = uid || user?.uid;
    if (targetUid) {
      // Profile is already saved in Onboarding component now to ensure persistence
      const profile = await getUserProfile(targetUid);
      setUserProfileState(profile);
      setUserData(data);
      
      // Sync selected loan amount with the newly generated limit if it exceeds it
      if (data.limitValue) {
        setSelectedLoanAmount(prev => Math.min(prev, data.limitValue!));
      }
      
      // Force Assessment phase
      setPhase('assessment');
    } else {
      console.error("No user found to complete onboarding");
    }
  }, [user]);
  const approveCredit = useCallback(async () => {
    if (user && userData) {
      try {
        const creditDoc = doc(db, 'credits', user.uid); // Simplified: one credit per user
        const limit = userData.limitValue || PRIMARY_USDT_LIMIT;
        const finalAmount = Math.min(selectedLoanAmount, limit);
        
        await setDoc(creditDoc, {
          userId: user.uid,
          amount: finalAmount,
          status: 'approved',
          kycLevel: 1,
          limitValue: limit,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        setPhase('result');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `credits/${user.uid}`);
      }
    }
  }, [user, userData, selectedLoanAmount]);

  const goToActivation = useCallback((amount: number) => {
    setSelectedLoanAmount(amount);
    setPhase('activation');
  }, []);

  const completeActivation = useCallback(async () => {
    if (user) {
      try {
        const creditDoc = doc(db, 'credits', user.uid);
        await setDoc(creditDoc, { 
          status: 'awaiting_deposit',
          updatedAt: serverTimestamp() 
        }, { merge: true });
        setPhase('dashboard');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `credits/${user.uid}`);
      }
    }
  }, [user]);

  const handleActivity = useCallback((amount: number) => {
    setFunds(prev => prev + amount);
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark selection:bg-brand-green/30 selection:text-white transition-colors duration-500">
      <Navbar 
        phase={phase} 
        onAction={startOnboarding} 
        lang={lang} 
        setLang={setLang} 
        onHome={() => setPhase('landing')}
        user={user}
        onLogout={handleLogout}
      />
      <LiveActivityBanner onActivity={handleActivity} lang={lang} />
      
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[60] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <WhatsAppIcon className="w-8 h-8" />
        <span className="absolute right-full mr-4 px-4 py-2 bg-brand-dark border border-white/10 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {t.help}
        </span>
      </a>
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Landing onStart={startOnboarding} funds={funds} lang={lang} />
            </motion.div>
          )}
          
          {phase === 'auth_choice' && (
            <motion.div key="auth_choice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <AuthChoice 
                lang={lang} 
                onCreate={() => setPhase('onboarding')}
                onLoginSuccess={() => {
                  // Phase transition will be handled by onAuthStateChanged
                }}
              />
            </motion.div>
          )}

          {phase === 'onboarding' && (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Onboarding onComplete={completeOnboarding} lang={lang} onBackToAuth={() => setPhase('auth_choice')} initialEmail={user?.email || ''} />
            </motion.div>
          )}
          
          {phase === 'assessment' && (
            <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Assessment onApproved={approveCredit} lang={lang} />
            </motion.div>
          )}
          
          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Result 
                onNext={goToActivation} 
                initialAmount={selectedLoanAmount} 
                lang={lang} 
                userData={userData!} 
                onGoToDashboard={() => setPhase('dashboard')} 
                onStartKYC={startKYC}
              />
            </motion.div>
          )}
          
          {phase === 'activation' && (
            <motion.div key="activation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Activation onActivated={completeActivation} loanAmount={selectedLoanAmount} lang={lang} />
            </motion.div>
          )}
          
          {phase === 'dashboard' && userData && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard 
                userData={userData!} 
                lang={lang} 
                creditLine={creditData} 
                onRecalculate={() => setPhase('result')}
                kycData={kycData}
                onStartKYC={startKYC}
              />
            </motion.div>
          )}

          {phase === 'kyc' && user && (
            <motion.div key="kyc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <KYCFlow 
                user={user} 
                lang={lang} 
                onComplete={() => setPhase('dashboard')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Background Elements */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
         <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-brand-green/5 blur-[150px] rounded-full animate-slow-spin" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-purple/5 blur-[120px] rounded-full animate-float" />
      </div>

      <footer className="relative py-20 border-t border-white/5 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
           <div className="flex items-center gap-3 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">
              <img 
                src="https://i.imgur.com/iFbEpvv.png" 
                alt="CrediCryp Logo" 
                className="h-10 w-auto"
                loading="lazy"
              />
              <span className="font-black text-[10px] uppercase tracking-[0.3em] text-white/50">Institutional Grade</span>
           </div>
           <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest leading-loose">
             {legalT.legalNotice}
           </p>
        </div>
      </footer>
    </div>
  );
}
