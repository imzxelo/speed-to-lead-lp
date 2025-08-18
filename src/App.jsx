import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from '@emailjs/browser';
import {
  Rocket,
  Zap,
  Sparkles,
  MessageSquare,
  Calendar,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  ArrowRight,
  Building2,
  TimerReset,
  LineChart,
  AlertCircle,
  XCircle,
  TrendingDown,
  Users,
  Clock
} from "lucide-react";

// UI Components
const CTAButton = ({ label = "10分デモを予約", href = "#book", variant = "primary", className = "", icon = true }) => {
  const base = "inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow transition focus:outline-none focus:ring-4";
  const styles = {
    primary: "bg-cyan-500 text-white hover:bg-cyan-400 focus:ring-cyan-200",
    ghost: "bg-white/10 text-white hover:bg-white/20 border border-white/20 focus:ring-white/20",
    lite: "bg-gray-900 text-white hover:bg-black focus:ring-gray-300",
    outline: "bg-transparent text-cyan-600 border border-cyan-600 hover:bg-cyan-50 focus:ring-cyan-100",
  };
  return (
    <a href={href} className={`${base} ${styles[variant]} ${className}`}>
      {icon && <Rocket className="h-5 w-5" />}<span>{label}</span>
    </a>
  );
};

const BadgeDark = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 text-white/80 px-2.5 py-1 text-xs border border-white/10">
    {children}
  </span>
);

const BadgeLight = ({ children, color = "bg-gray-100 text-gray-700 border border-gray-200" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${color}`}>
    {children}
  </span>
);

function Stat({ label, to, suffix = "", delay = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0; const d = 900; const startTs = performance.now() + delay;
    const step = (t) => {
      const p = Math.min(1, (t - startTs) / d);
      setVal(Math.round((start + (to - start) * p) * 10) / 10);
      if (p < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, delay]);
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 px-4 py-3 text-white" aria-live="polite">
      <div className="text-3xl font-extrabold tracking-tight">
        {val}{suffix}
      </div>
      <div className="text-xs text-white/70 mt-1">{label}</div>
    </div>
  );
}

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
    <div className="p-6 sm:p-8">{children}</div>
  </div>
);

// Visual Components
const GradientBG = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/30 blur-3xl" />
    <div className="absolute top-40 right-20 h-[320px] w-[320px] rounded-full bg-violet-500/20 blur-3xl" />
    <div className="absolute -bottom-24 left-10 h-[240px] w-[240px] rounded-full bg-emerald-400/20 blur-3xl" />
  </div>
);

function EvidenceChart() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-5 shadow-lg border-2 border-red-200 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 h-32 w-32 bg-red-100 rounded-full opacity-50"/>
      <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
        <AlertCircle className="h-5 w-5 animate-pulse"/>
        <span>致命的な5分の壁</span>
      </div>
      <svg viewBox="0 0 600 250" className="mt-3 w-full" role="img" aria-label="5分経過で返信率が急落するグラフ">
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
          </linearGradient>
          <pattern id="dangerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="none" stroke="#fca5a5" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        
        {/* 背景グリッド */}
        <rect x="0" y="0" width="600" height="250" fill="url(#dangerPattern)"/>
        
        {/* Y軸ラベル */}
        <text x="10" y="35" fontSize="11" fill="#6b7280">100%</text>
        <text x="10" y="85" fontSize="11" fill="#6b7280">75%</text>
        <text x="10" y="135" fontSize="11" fill="#6b7280">50%</text>
        <text x="10" y="185" fontSize="11" fill="#6b7280">25%</text>
        <text x="10" y="235" fontSize="11" fill="#6b7280">0%</text>
        
        {/* X軸ラベル */}
        <text x="50" y="245" fontSize="11" fill="#6b7280">0分</text>
        <text x="150" y="245" fontSize="11" fill="#6b7280">1分</text>
        <text x="250" y="245" fontSize="11" fill="#6b7280">5分</text>
        <text x="350" y="245" fontSize="11" fill="#6b7280">10分</text>
        <text x="450" y="245" fontSize="11" fill="#6b7280">30分</text>
        <text x="550" y="245" fontSize="11" fill="#6b7280">60分</text>
        
        {/* グラフエリア塗りつぶし */}
        <path d="M50 30 L 150 35 L 250 45 L 260 140 L 350 180 L 450 200 L 580 210 L 580 220 L 50 220 Z" fill="url(#grad)" />
        
        {/* メインライン - 急落を強調 */}
        <path d="M50 30 L 150 35 L 250 45 L 260 140 L 350 180 L 450 200 L 580 210" 
              stroke="#dc2626" strokeWidth="3" fill="none" strokeDasharray="0"/>
        
        {/* 急落部分を強調 */}
        <path d="M250 45 L 260 140" stroke="#b91c1c" strokeWidth="4" fill="none"/>
        
        {/* データポイント */}
        <circle cx="50" cy="30" r="4" fill="#dc2626"/>
        <circle cx="150" cy="35" r="4" fill="#dc2626"/>
        <circle cx="250" cy="45" r="5" fill="#b91c1c" className="animate-pulse"/>
        <circle cx="260" cy="140" r="5" fill="#991b1b" className="animate-pulse"/>
        <circle cx="350" cy="180" r="4" fill="#dc2626"/>
        
        {/* 5分の危険ゾーン */}
        <rect x="250" y="20" width="100" height="210" fill="#ef4444" opacity="0.1"/>
        <line x1="250" y1="20" x2="250" y2="220" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5"/>
        
        {/* 警告テキスト */}
        <text x="255" y="15" fontSize="14" fill="#dc2626" fontWeight="bold">5分経過</text>
        
        {/* 急落率表示 */}
        <g transform="translate(280, 90)">
          <rect x="-5" y="-15" width="80" height="30" fill="white" stroke="#dc2626" strokeWidth="2" rx="4"/>
          <text x="35" y="0" fontSize="16" fill="#dc2626" fontWeight="bold" textAnchor="middle">-78%</text>
          <text x="35" y="12" fontSize="10" fill="#dc2626" textAnchor="middle">返信率激減</text>
        </g>
        
        {/* 軸 */}
        <path d="M50 220 L 50 20" stroke="#9ca3af" strokeWidth="1" />
        <path d="M50 220 L 580 220" stroke="#9ca3af" strokeWidth="1" />
      </svg>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white/80 rounded-lg p-2 border border-red-200">
          <div className="text-red-600 font-bold text-lg">1分以内</div>
          <div className="text-gray-600">返信率 92%</div>
        </div>
        <div className="bg-red-100 rounded-lg p-2 border-2 border-red-400 animate-pulse">
          <div className="text-red-700 font-bold text-lg">5分経過</div>
          <div className="text-red-600 font-semibold">返信率 14%</div>
        </div>
        <div className="bg-white/80 rounded-lg p-2 border border-red-200">
          <div className="text-gray-700 font-bold text-lg">30分後</div>
          <div className="text-gray-600">返信率 5%</div>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-red-600 text-white text-center rounded-lg font-semibold text-sm">
        ⚠️ 5分を境に78%の見込み客を失っています
      </div>
    </div>
  );
}

function AgentDemo() {
  const msgs = [
    { who: "user", text: "物件Aの内見できますか？" },
    { who: "agent", text: "はい、最短で明日13:00/16:30/18:00が空いています。ご希望は？" },
    { who: "user", text: "16:30でお願いします。" },
    { who: "agent", text: "承知しました。前日にSMSでリマインドします。ご来店をお待ちしています！" },
  ];
  return (
    <Card className="bg-gradient-to-br from-slate-900 to-black text-white border-slate-800 overflow-hidden">
      <div className="flex items-center gap-2 text-white/80 text-sm"><Sparkles className="h-4 w-4"/>AIエージェント（一次対応→候補提示→確定まで）</div>
      <div className="mt-4 space-y-3">
        <AnimatePresence>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`max-w-[90%] rounded-2xl px-4 py-3 ${m.who === "agent" ? "bg-cyan-500/20 border border-cyan-400/20 ml-auto" : "bg-white/10 border border-white/10"}`}
            >
              <div className="flex items-center gap-2 text-xs mb-1 opacity-80">
                {m.who === "agent" ? <Zap className="h-3.5 w-3.5"/> : <MessageSquare className="h-3.5 w-3.5"/>}
                {m.who === "agent" ? "AI Agent" : "お客様"}
              </div>
              <div className="leading-relaxed">{m.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-white/80">
        <div className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-400"/>一次返信 ≤ 60秒</div>
        <div className="flex items-center gap-1"><Calendar className="h-4 w-4 text-cyan-300"/>候補自動提示</div>
        <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-violet-300"/>前日SMS</div>
      </div>
    </Card>
  );
}

function FAQItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`rounded-2xl border ${open ? "border-cyan-300 bg-cyan-50" : "border-gray-200 bg-white"} p-4 transition`}>
      <button className="w-full flex items-center justify-between text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="font-semibold flex items-center gap-2"><span className="text-cyan-600">Q.</span>{q}</span>
        {open ? <ChevronUp className="h-5 w-5 text-cyan-600"/> : <ChevronDown className="h-5 w-5 text-gray-500"/>}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 text-gray-700">
            <div className="flex items-start gap-2"><span className="text-emerald-600 font-semibold">A.</span><p>{a}</p></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main App Component
export default function App() {
  const [progress, setProgress] = useState(0);
  const [consultOnly, setConsultOnly] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    person: '',
    email: '',
    datetime: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedValue, setExpandedValue] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.company.trim()) errors.company = '会社名を入力してください';
    if (!formData.person.trim()) errors.person = 'ご担当者名を入力してください';
    if (!formData.email.trim()) {
      errors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setFormErrors({});
    
    try {
      // ロリポップサーバーかどうかを判定
      const isLolipop = window.location.hostname === 'rikuzero.jp' || 
                        window.location.hostname === 'www.rikuzero.jp';
      
      if (isLolipop) {
        // PHP/SMTP送信（ロリポップ環境）
        const sendData = {
          name: formData.person,
          email: formData.email,
          company: formData.company,
          datetime: formData.datetime || '後日調整',
          consultOnly: consultOnly ? '1' : '0',
          message: `デモ予約フォームからのお問い合わせ`
        };
        
        const response = await fetch('/send.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          setSubmitSuccess(true);
        } else {
          throw new Error(result.error || '送信に失敗しました');
        }
      } else {
        // EmailJS送信（開発環境/GitHub Pages）
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY");
        
        const templateParams = {
          to_email: 'contact@rikuzero.jp',
          from_name: formData.person,
          company_name: formData.company,
          reply_to: formData.email,
          datetime: formData.datetime || '後日調整',
          consult_only: consultOnly ? 'はい（話だけ聞きたい）' : 'いいえ（デモ希望）',
          message: `
会社名: ${formData.company}
ご担当者名: ${formData.person}
メールアドレス: ${formData.email}
希望日時: ${formData.datetime || '後日調整'}
話だけ聞きたい: ${consultOnly ? 'はい' : 'いいえ'}
          `.trim()
        };
        
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
          templateParams
        );
        
        setSubmitSuccess(true);
      }
      
      console.log('Form submitted:', { ...formData, consultOnly });
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || '送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      setProgress(Math.max(0, Math.min(1, scrolled)));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-gray-900">
      <GradientBG />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center text-white shadow" aria-hidden><Sparkles className="h-5 w-5"/></div>
            <div className="font-bold text-gray-900">リクゼロ</div>
            <BadgeLight color="bg-cyan-50 text-cyan-700 border border-cyan-200">AIエージェント</BadgeLight>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#value" className="hover:text-gray-900">価値</a>
            <a href="#demo" className="hover:text-gray-900">デモ</a>
            <a href="#pricing" className="hover:text-gray-900">価格</a>
            <a href="#faq" className="hover:text-gray-900">FAQ</a>
          </nav>
          <CTAButton />
        </div>
        <div className="h-1 bg-gray-200">
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-600 transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white relative overflow-hidden">
        <GradientBG />
        <div className="px-4 pt-14 pb-10">
          <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              60秒で、反響が売上に変わる。
            </motion.h1>
            <p className="mt-4 text-white/80 text-lg">
              AIエージェントが一次返信→候補提示→確定まで自動化。<br />
              <span className="text-cyan-300 font-semibold">"今"を逃さない</span>仕組みを入れるだけ。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CTAButton />
              <CTAButton variant="ghost" label="3分で流れを見る" href="#demo" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="一次返信中央値" to={60} suffix="秒" />
              <Stat label="来店/内見率" to={20} suffix="%↑" delay={80} />
              <Stat label="再反応率" to={15} suffix="%↑" delay={160} />
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <AgentDemo />
            <div className="mt-4"><EvidenceChart /></div>
          </motion.div>
        </div>
        </div>
        
        {/* Value Props - Same dark background */}
        <div id="value" className="px-4 py-16 border-t border-white/10">
          <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6">
          {[
            { 
              id: 'instant',
              icon: <Zap className="h-6 w-6 text-cyan-400"/>, 
              h: "即レスを標準化", 
              p: "テンプレ・差し込み済みの一次返信を60秒以内に自動送信",
              changes: [
                "反響対応の遅れによる機会損失がゼロに",
                "営業担当者が外出中でも自動で一次対応",
                "「返事が早い会社」という信頼感を獲得"
              ]
            },
            { 
              id: 'schedule',
              icon: <Calendar className="h-6 w-6 text-cyan-400"/>, 
              h: "候補をその場で提示", 
              p: "空き枠から選ぶだけ。内見/来店の確定まで誘導",
              changes: [
                "「後日連絡します」がなくなりその場で確定",
                "日程調整の往復がなくなりスピードアップ",
                "お客様の温度が高いうちにアポ獲得"
              ]
            },
            { 
              id: 'reduce',
              icon: <ShieldCheck className="h-6 w-6 text-cyan-400"/>, 
              h: "ノーショー低減", 
              p: "前日SMSと当日フォローで来訪率を引き上げ",
              changes: [
                "ドタキャン率が大幅に減少（30%→ 5%以下）",
                "空き枠を無駄にしない効率的な営業体制",
                "リマインドによる顧客満足度の向上"
              ]
            }
          ].map((x, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6">
              <div className="flex items-center gap-3">{x.icon}<div className="font-semibold text-white">{x.h}</div></div>
              <p className="text-white/80 mt-2 text-sm">{x.p}</p>
              <button 
                onClick={() => setExpandedValue({...expandedValue, [x.id]: !expandedValue[x.id]})}
                className="mt-4 text-sm text-cyan-300 flex items-center gap-1 hover:text-cyan-200 transition"
              >
                これで何が変わる？
                {expandedValue[x.id] ? <ChevronUp className="h-4 w-4"/> : <ArrowRight className="h-4 w-4"/>}
              </button>
              <AnimatePresence>
                {expandedValue[x.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <ul className="space-y-2">
                        {x.changes.map((change, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-white/90">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0"/>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="px-4 py-16 bg-gradient-to-b from-gray-50 to-white text-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-red-600 font-semibold mb-3">
              <AlertCircle className="h-5 w-5"/>
              現場のリアルな声
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">こんな課題ありませんか？</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Clock className="h-6 w-6"/>,
                color: "from-red-500 to-orange-500",
                borderColor: "border-red-200",
                bgColor: "bg-red-50",
                title: "反響対応が遅い",
                problems: [
                  "担当者が外出中で返信が翌日に",
                  "他社に先を越される",
                  "5分過ぎると返信率が半減"
                ],
                stat: "72%",
                statLabel: "の企業が\n返信遅れを課題に"
              },
              {
                icon: <TrendingDown className="h-6 w-6"/>,
                color: "from-purple-500 to-pink-500",
                borderColor: "border-purple-200",
                bgColor: "bg-purple-50",
                title: "アポ獲得率が低い",
                problems: [
                  "日程調整の往復で温度下がる",
                  "「検討します」で終わる",
                  "具体的な提案ができない"
                ],
                stat: "68%",
                statLabel: "がアポ獲得の\n難しさを実感"
              },
              {
                icon: <XCircle className="h-6 w-6"/>,
                color: "from-blue-500 to-cyan-500",
                borderColor: "border-blue-200",
                bgColor: "bg-blue-50",
                title: "ドタキャン多発",
                problems: [
                  "予約を忘れられる",
                  "リマインドができていない",
                  "空き枠が無駄になる"
                ],
                stat: "30%",
                statLabel: "の予約が\nノーショーに"
              },
              {
                icon: <Users className="h-6 w-6"/>,
                color: "from-green-500 to-emerald-500",
                borderColor: "border-green-200",
                bgColor: "bg-green-50",
                title: "属人化が問題",
                problems: [
                  "特定の人しか対応できない",
                  "休みの日は対応が止まる",
                  "新人には任せられない"
                ],
                stat: "81%",
                statLabel: "が人手不足を\n深刻な課題に"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl ${item.bgColor} ${item.borderColor} border-2 p-5 hover:shadow-lg transition-all`}
              >
                <div className={`absolute -top-3 -right-3 h-12 w-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                  {item.icon}
                </div>
                
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                
                <ul className="space-y-2 mb-4">
                  {item.problems.map((problem, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-extrabold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.stat}
                    </span>
                    <span className="text-xs text-gray-600 whitespace-pre-line">{item.statLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-3">
                これらの課題を放置すると...
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: <TrendingDown className="h-5 w-5"/>, text: "売上機会の損失" },
                  { icon: <Users className="h-5 w-5"/>, text: "競合他社に流出" },
                  { icon: <AlertCircle className="h-5 w-5"/>, text: "現場の疲弊" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-center gap-2 bg-white/20 rounded-xl px-4 py-3">
                    {item.icon}
                    <span className="font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-white/90">
                だからこそ、<span className="font-bold text-yellow-300">リクゼロ</span>が必要です
              </p>
              <div className="mt-6">
                <CTAButton label="今すぐ解決法を見る" href="#demo" variant="ghost" className="font-bold text-lg px-8 py-4"/>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Flow */}
      <section id="demo" className="px-4 py-16 bg-white text-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-cyan-600 font-semibold mb-3">
              <Sparkles className="h-5 w-5"/>
              リクゼロが解決
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">反響→即レス→確定 までの最短ルート</h2>
            <p className="text-gray-600 mt-3">上記の課題を全て解決する3ステップ</p>
          </div>
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            {[
              { 
                icon: <MessageSquare className="h-8 w-8 text-cyan-500"/>,
                title: "Step 1｜反響を捕まえる", 
                p: "メール/フォーム反響を即時に取り込み、重複や迷惑を除外",
                demo: "実際の反響メールを使って取込みを実演"
              },
              { 
                icon: <Sparkles className="h-8 w-8 text-cyan-500"/>,
                title: "Step 2｜AIが会話", 
                p: "テンプレ＋差し込みで一次返信→希望日ヒア→候補提示",
                demo: "AIが60秒以内に返信する様子をライブで確認"
              },
              { 
                icon: <Calendar className="h-8 w-8 text-cyan-500"/>,
                title: "Step 3｜確定まで", 
                p: "予約確定→前日SMS→当日案内。ログ化まで自動",
                demo: "予約管理画面とSMS送信の流れを解説"
              }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4 }}
                className="group"
              >
                <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-cyan-300 shadow-sm hover:shadow-xl transition-all h-full p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-600 font-bold">{s.title}</div>
                      <p className="mt-2 text-gray-700">{s.p}</p>
                      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
                        <div className="flex items-center gap-2 text-xs text-cyan-700 font-semibold">
                          <ArrowRight className="h-4 w-4"/>
                          デモで見れること
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{s.demo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ROI Snapshot */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card>
              <div className="flex items-center gap-2 text-gray-500 text-sm"><LineChart className="h-4 w-4"/>ROIスナップショット（例）</div>
              <ul className="mt-3 text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2"><TimerReset className="h-4 w-4 text-emerald-600"/>一次返信60秒化 → 接続率↑ → 商談母数↑</li>
                <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-cyan-600"/>1店舗あたり来店/内見率 相対+20% を想定</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600"/>No-Show低減（前日SMS）で実来店↑</li>
              </ul>
            </Card>
            <Card>
              <div className="text-sm text-gray-500">想定KPI（導入1–2週間）</div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <div className="text-xs text-gray-500">一次返信中央値</div>
                  <div className="text-2xl font-extrabold mt-1">≤ 60秒</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <div className="text-xs text-gray-500">来店/内見率</div>
                  <div className="text-2xl font-extrabold mt-1">相対 +20%</div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <div className="text-xs text-gray-500">再反応率</div>
                  <div className="text-2xl font-extrabold mt-1">相対 +15%</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center">
            <div className="text-2xl font-bold">10分で全てが分かる</div>
            <p className="mt-2 text-white/90">実際の画面を見ながら、御社のケースでどう使えるかご説明します</p>
            <div className="mt-4"><CTAButton label="デモ枠を確保する" href="#book" variant="ghost"/></div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">価格・期間・保証</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <BadgeLight color="bg-cyan-50 text-cyan-700 border border-cyan-200"><Sparkles className="h-3.5 w-3.5"/>先着5社限定価格</BadgeLight>
            <p className="text-gray-600">通常価格より最大70%OFF + 返金保証付き</p>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl bg-white p-6 border-2 border-cyan-500 shadow-lg ring-2 ring-cyan-100 text-gray-900 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-24 w-24 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full opacity-10"/>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">A｜即レススターター</h3>
                <BadgeLight color="bg-cyan-50 text-cyan-700 border border-cyan-200">限定価格</BadgeLight>
              </div>
              <div className="mt-3">
                <span className="text-gray-400 line-through text-lg">50万円</span>
                <div className="text-4xl font-extrabold tracking-tight text-cyan-600">15<span className="text-2xl align-top">万円</span></div>
              </div>
              <ul className="mt-4 space-y-2 text-gray-700 text-sm">
                {['反響取込の設定','一次返信テンプレ（差し込み）','候補提示リンク生成','前日SMS'].map((t,i)=>(
                  <li key={i} className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/>{t}</li>
                ))}
              </ul>
              <div className="mt-6"><CTAButton label="このプランで相談" href="#book" variant="lite"/></div>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl bg-white p-6 border border-gray-200 shadow ring-1 ring-black/5 text-gray-900">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">B｜内見までPoC</h3>
                <BadgeLight color="bg-emerald-50 text-emerald-700 border border-emerald-200">2週間</BadgeLight>
              </div>
              <div className="mt-3">
                <span className="text-gray-400 line-through text-lg">120万円</span>
                <div className="text-4xl font-extrabold tracking-tight">50<span className="text-2xl align-top">万円</span></div>
              </div>
              <ul className="mt-4 space-y-2 text-gray-700 text-sm">
                {['条件ヒア→代替提案','在庫連携（SS/DB）','内見予約確定・通知','再接触タイマー（48h/7日/30日）'].map((t,i)=>(
                  <li key={i} className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/>{t}</li>
                ))}
              </ul>
              <div className="mt-6"><CTAButton label="このプランで相談" href="#book" variant="lite"/></div>
            </motion.div>
          </div>
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5"/>
              <div>
                <div className="text-gray-900 font-semibold">30日間返金保証</div>
                <p className="text-gray-600 text-sm mt-1">KPI未達の場合は全額返金。リスクなしでお試しいただけます。</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">※返金条件：反響件数の一定以上／カレンダー承認可能／必要設定完了 など。</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">よくある質問</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <FAQItem q="自社だけでも導入できますか？" a="既存ツールの上に被せる構成なので設定は少なめ。初期は当方がテンプレや候補生成を一緒に最適化します。" defaultOpen/>
            <FAQItem q="スパム扱いになりませんか？" a="配信停止導線と送信者情報を明記し、送信量は漸増。文面ABでスパム語を除去して到達率を担保します。"/>
            <FAQItem q="店舗規模が小さいのですが対象？" a="反響が極端に少ない場合は対象外基準を事前に合意。無駄打ちを避けます。"/>
            <FAQItem q="KPIはどう計測？" a="一次返信中央値／来店・内見率／再反応率をダッシュボードで可視化。週1でチューニング。"/>
          </div>
          <div className="mt-8 text-center"><CTAButton label="疑問はデモで確認" href="#book" variant="lite"/></div>
        </div>
      </section>

      {/* Book Demo */}
      <section id="book" className="px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">10分デモを予約</h2>
          <p className="text-gray-600 mt-2">空き枠から選ぶだけ。最短当日で実演。</p>
          <div className="mt-6 rounded-2xl bg-white p-6 border border-gray-200 text-gray-900">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto"/>
                <h3 className="text-2xl font-bold mt-4">送信完了しました</h3>
                <p className="text-gray-600 mt-2">担当者より1営業日以内にご連絡いたします。</p>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({ company: '', person: '', email: '', datetime: '' });
                  }}
                  className="mt-4 text-cyan-600 hover:underline"
                >
                  別の日程で再度予約する
                </button>
              </motion.div>
            ) : (
            <form className="grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-gray-600" htmlFor="company">会社名 <span className="text-red-500">*</span></label>
                <input 
                  id="company" 
                  value={formData.company}
                  onChange={(e) => {
                    setFormData({...formData, company: e.target.value});
                    if (formErrors.company) setFormErrors({...formErrors, company: ''});
                  }}
                  className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                    formErrors.company ? 'border-red-500' : 'border-gray-300'
                  }`} 
                  placeholder="株式会社〇〇"/>
                {formErrors.company && <p className="text-red-500 text-xs mt-1">{formErrors.company}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-600" htmlFor="person">ご担当者名 <span className="text-red-500">*</span></label>
                <input 
                  id="person" 
                  value={formData.person}
                  onChange={(e) => {
                    setFormData({...formData, person: e.target.value});
                    if (formErrors.person) setFormErrors({...formErrors, person: ''});
                  }}
                  className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                    formErrors.person ? 'border-red-500' : 'border-gray-300'
                  }`} 
                  placeholder="山田 太郎"/>
                {formErrors.person && <p className="text-red-500 text-xs mt-1">{formErrors.person}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-600" htmlFor="email">メール <span className="text-red-500">*</span></label>
                <input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (formErrors.email) setFormErrors({...formErrors, email: ''});
                  }}
                  className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`} 
                  placeholder="example@company.jp"/>
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <div className="rounded-xl bg-cyan-50 border border-cyan-200 p-4">
                  <label className="flex items-start gap-3 cursor-pointer" htmlFor="consultOnly">
                    <input 
                      id="consultOnly" 
                      type="checkbox" 
                      className="h-5 w-5 mt-0.5 cursor-pointer accent-cyan-600" 
                      checked={consultOnly} 
                      onChange={(e)=>setConsultOnly(e.target.checked)} 
                    />
                    <div>
                      <div className="font-semibold text-gray-900">まずは話だけ聞きたい</div>
                      <div className="text-sm text-gray-600 mt-1">日時は後日調整します。資料や概要説明を希望の方はこちらを選択してください。</div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600" htmlFor="dt">希望日時（任意）</label>
                <input 
                  id="dt" 
                  type="datetime-local" 
                  value={formData.datetime}
                  onChange={(e) => setFormData({...formData, datetime: e.target.value})}
                  disabled={consultOnly} 
                  className={`mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${consultOnly ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300'}`}/>
                <p className="mt-1 text-xs text-gray-500">※チェック済みの場合は未入力のままでOKです。</p>
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`rounded-2xl px-5 py-3 font-semibold transition ${
                    isSubmitting 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  {isSubmitting ? '送信中...' : '送信して仮押さえ'}
                </button>
                <span className="text-xs text-gray-500 flex items-center gap-1"><PhoneCall className="h-3.5 w-3.5"/>緊急の方は 080-7798-1037</span>
              </div>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <div className="fixed bottom-4 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl bg-cyan-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-2">
            <div className="text-sm sm:text-base font-semibold flex items-center gap-2"><TimerReset className="h-4 w-4"/>今の反響、逃していませんか？ <span className="hidden sm:inline">60秒で変わります。</span></div>
            <CTAButton label="今すぐ枠を確保" href="#book" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-14 px-4 bg-gradient-to-b from-slate-900 to-black">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6 text-white/80">
          <div>
            <div className="text-white font-bold">リクゼロ</div>
            <p className="mt-2 text-sm">反響の一次対応を60秒で。"今"に強い現場をつくる。</p>
            <div className="mt-3 flex items-center gap-2">
              <BadgeDark><Sparkles className="h-3.5 w-3.5"/>先着5社限定</BadgeDark>
              <span className="text-xs text-white/60">残り3枠</span>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-white font-semibold">コンプライアンス</div>
            <ul className="mt-2 space-y-1">
              <li>広告メールはオプトイン／会社宛の公開アドレスに限定</li>
              <li>配信停止リンク・送信者情報を明記</li>
              <li>フォーム規約順守、ログは90日以上保管</li>
            </ul>
          </div>
          <div className="text-sm">
            <div className="text-white font-semibold">お問い合わせ</div>
            <p className="mt-2">contact@rikuzero.jp</p>
            <p className="mt-1">080-7798-1037</p>
            <p className="mt-1 text-xs">平日 10:00-18:00</p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-8 text-xs text-white/60">© {new Date().getFullYear()} リクゼロ</div>
      </footer>
    </div>
  );
} 