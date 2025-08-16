import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  LineChart
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
    <div className="rounded-2xl bg-white p-5 shadow border border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-500"><BarChart3 className="h-4 w-4"/>反響寿命（5分で急落）</div>
      <svg viewBox="0 0 600 200" className="mt-2 w-full" role="img" aria-label="5分経過で返信率が下がるグラフ">
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d="M20 30 C 120 40, 220 70, 300 120 C 380 160, 480 185, 580 190" stroke="#22d3ee" strokeWidth="3" fill="none" />
        <path d="M20 30 L 20 190 L 580 190" stroke="#e5e7eb" strokeWidth="1" fill="none" />
        <rect x="240" y="20" width="2" height="170" fill="#ef4444" />
        <text x="246" y="36" fontSize="12" fill="#ef4444">5分</text>
      </svg>
      <p className="text-xs text-gray-500 mt-1">5分を超えると返信率/接続率が急落。だから「60秒の一次返信」を標準化します。</p>
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      <GradientBG />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-slate-950/70 border-b border-white/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-cyan-500 grid place-items-center text-white shadow" aria-hidden><Sparkles className="h-5 w-5"/></div>
            <div className="font-bold">Speed‑to‑Lead Ops</div>
            <BadgeDark>AIエージェント</BadgeDark>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#value" className="hover:text-white">価値</a>
            <a href="#demo" className="hover:text-white">デモ</a>
            <a href="#pricing" className="hover:text-white">価格</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
          <CTAButton />
        </div>
        <div className="h-1 bg-white/10">
          <div className="h-1 bg-cyan-400 transition-[width]" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-14 pb-10">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              60秒で、反響が売上に変わる。
            </motion.h1>
            <p className="mt-4 text-white/80 text-lg">AIエージェントが一次返信→候補提示→確定まで自動化。<span className="text-cyan-300 font-semibold">"今"を逃さない</span>仕組みを入れるだけ。</p>
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
      </section>

      {/* Value Props */}
      <section id="value" className="px-4 py-16">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="h-6 w-6 text-cyan-400"/>, h: "即レスを標準化", p: "テンプレ・差し込み済みの一次返信を60秒以内に自動送信" },
            { icon: <Calendar className="h-6 w-6 text-cyan-400"/>, h: "候補をその場で提示", p: "空き枠から選ぶだけ。内見/来店の確定まで誘導" },
            { icon: <ShieldCheck className="h-6 w-6 text-cyan-400"/>, h: "ノーショー低減", p: "前日SMSと当日フォローで来訪率を引き上げ" }
          ].map((x, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-3">{x.icon}<div className="font-semibold">{x.h}</div></div>
              <p className="text-white/80 mt-2 text-sm">{x.p}</p>
              <div className="mt-4 text-sm text-cyan-300 flex items-center gap-1">
                これで何が変わる？<ArrowRight className="h-4 w-4"/>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Flow */}
      <section id="demo" className="px-4 py-16 bg-white text-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-gray-500 text-sm"><Sparkles className="h-4 w-4"/>3ステップで理解</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">反響→即レス→確定 までの最短ルート</h2>
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            {[
              { title: "Step 1｜反響を捕まえる", p: "メール/フォーム反響を即時に取り込み、重複や迷惑を除外" },
              { title: "Step 2｜AIが会話", p: "テンプレ＋差し込みで一次返信→希望日ヒア→候補提示" },
              { title: "Step 3｜確定まで", p: "予約確定→前日SMS→当日案内。ログ化まで自動" }
            ].map((s, i) => (
              <Card key={i} className="hover:shadow-lg transition">
                <div className="text-sm text-gray-500">{s.title}</div>
                <p className="mt-2 text-gray-700">{s.p}</p>
                <div className="mt-4"><a href="#book" className="text-cyan-700 font-semibold hover:underline">この流れでデモする</a></div>
              </Card>
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

          <div className="mt-8 text-center"><CTAButton label="デモ枠を確保する" href="#book" variant="lite"/></div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">価格・期間・保証</h2>
          <p className="text-white/70 mt-2">初回2社は未達返金保証（条件あり）。</p>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ y: -2 }} className="rounded-2xl bg-white p-6 border border-gray-200 shadow ring-1 ring-black/5 text-gray-900">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">A｜即レススターター</h3>
                <BadgeLight>1週間</BadgeLight>
              </div>
              <div className="mt-3 text-4xl font-extrabold tracking-tight">15<span className="text-2xl align-top">万円</span></div>
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
              <div className="mt-3 text-4xl font-extrabold tracking-tight">50<span className="text-2xl align-top">万円</span></div>
              <ul className="mt-4 space-y-2 text-gray-700 text-sm">
                {['条件ヒア→代替提案','在庫連携（SS/DB）','内見予約確定・通知','再接触タイマー（48h/7日/30日）'].map((t,i)=>(
                  <li key={i} className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/>{t}</li>
                ))}
              </ul>
              <div className="mt-6"><CTAButton label="このプランで相談" href="#book" variant="lite"/></div>
            </motion.div>
          </div>
          <p className="mt-4 text-xs text-white/60">※条件例：反響件数の一定以上／カレンダー承認可能／必要設定完了 など。</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-16 bg-white text-gray-900">
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
      <section id="book" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">10分デモを予約</h2>
          <p className="text-white/70 mt-2">空き枠から選ぶだけ。最短当日で実演。</p>
          <div className="mt-6 rounded-2xl bg-white p-6 border border-gray-200 text-gray-900">
            <form className="grid sm:grid-cols-2 gap-4" onSubmit={(e)=>e.preventDefault()}>
              <div>
                <label className="text-sm text-gray-600" htmlFor="company">会社名</label>
                <input id="company" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300" placeholder="株式会社〇〇"/>
              </div>
              <div>
                <label className="text-sm text-gray-600" htmlFor="person">ご担当者名</label>
                <input id="person" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="山田 太郎"/>
              </div>
              <div>
                <label className="text-sm text-gray-600" htmlFor="email">メール</label>
                <input id="email" type="email" className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="example@company.jp"/>
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2" htmlFor="consultOnly">
                  <input id="consultOnly" type="checkbox" className="h-4 w-4" checked={consultOnly} onChange={(e)=>setConsultOnly(e.target.checked)} />
                  話だけ聞きたい（日時は後で調整）
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-gray-600" htmlFor="dt">希望日時（任意）</label>
                <input id="dt" type="datetime-local" disabled={consultOnly} className={`mt-1 w-full rounded-xl border px-3 py-2 ${consultOnly ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300'}`}/>
                <p className="mt-1 text-xs text-gray-500">※チェック済みの場合は未入力のままでOKです。</p>
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <button type="submit" className="rounded-2xl bg-gray-900 text-white px-5 py-3 font-semibold hover:bg-black">送信して仮押さえ</button>
                <span className="text-xs text-gray-500 flex items-center gap-1"><PhoneCall className="h-3.5 w-3.5"/>緊急の方は 03-xxxx-xxxx</span>
              </div>
            </form>
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
      <footer className="py-14 px-4">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6 text-white/80">
          <div>
            <div className="text-white font-bold">Speed‑to‑Lead Ops</div>
            <p className="mt-2 text-sm">反響の一次対応を60秒で。"今"に強い現場をつくる。</p>
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
            <p className="mt-2">demo@example.co.jp</p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-8 text-xs text-white/60">© {new Date().getFullYear()} Speed‑to‑Lead Ops</div>
      </footer>
    </div>
  );
} 