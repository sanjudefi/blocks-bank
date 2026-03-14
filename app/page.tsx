import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, CheckCircle2, XCircle, Clock, DollarSign, AlertTriangle,
  Zap, Shield, Globe, Building2, Users, FileText, Code2, Wallet,
  Mail, Phone, MapPin, ChevronRight, Star, TrendingUp, Lock,
  Layers, Cpu, BarChart3, RefreshCcw,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    icon: Clock,
    stat: 'T+2 / T+3',
    label: 'Settlement Cycles',
    pain: 'Capital is locked for 2–3 business days per trade, costing institutions millions in trapped liquidity annually.',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
  },
  {
    icon: DollarSign,
    stat: '$2M+',
    label: 'Issuance Cost',
    pain: 'Issuing a single bond series costs over $2 million in legal fees, intermediary charges, and infrastructure setup.',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
  },
  {
    icon: AlertTriangle,
    stat: '8–12 Months',
    label: 'Time to Market',
    pain: 'From board approval to live issuance, the average structured product takes nearly a year to reach investors.',
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    icon: Users,
    stat: '7+ Parties',
    label: 'Intermediaries',
    pain: 'A single bond issuance involves custodians, clearing houses, transfer agents, registrars, and settlement banks — each adding cost and delay.',
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
  },
]

const SOLUTIONS = [
  { before: 'T+2 / T+3 settlement', after: 'T+0 atomic settlement' },
  { before: '$2M+ issuance cost', after: 'From $5K per instrument' },
  { before: '8–12 months to market', after: 'Live in hours' },
  { before: '7+ intermediaries', after: 'Direct issuer-to-investor' },
  { before: 'Paper-based KYC', after: 'Automated on-chain KYC/AML' },
  { before: 'Siloed compliance', after: 'Smart contract enforcement' },
]

const FEATURES = [
  { icon: Zap, title: 'One-Click Deployment', desc: 'Deploy Token, Registry, Treasury & Compliance contracts simultaneously with a guided wizard.', color: 'from-blue-500 to-blue-600' },
  { icon: Shield, title: 'Built-in Compliance', desc: 'MiCA-ready compliance contracts enforce transfer restrictions, investor limits, and jurisdiction rules automatically.', color: 'from-indigo-500 to-indigo-600' },
  { icon: Users, title: 'Investor Whitelist', desc: 'On-chain KYC registry ensures only verified investors can hold or trade tokenized instruments.', color: 'from-violet-500 to-violet-600' },
  { icon: Globe, title: 'Multi-Chain', desc: 'Deploy on Ethereum, Polygon, Base, or private EVM chains. Switch networks without rewriting contracts.', color: 'from-emerald-500 to-emerald-600' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live dashboard showing token supply, investor counts, AUM, and contract activity across all instruments.', color: 'from-cyan-500 to-cyan-600' },
  { icon: Lock, title: 'Institutional Security', desc: 'Multi-sig wallet support, hardware key integration, and audit trails meet institutional risk requirements.', color: 'from-rose-500 to-rose-600' },
]

const INSTRUMENTS = [
  { emoji: '📄', type: 'Corporate Bonds', desc: 'Issue fixed-income securities with automated coupon payments and maturity settlement.' },
  { emoji: '🏦', type: 'Fixed Deposits', desc: 'Tokenize time-locked deposits with guaranteed interest rates and automated redemption.' },
  { emoji: '🏢', type: 'Real Estate Assets', desc: 'Fractionalize commercial property and REITs into tradeable digital tokens.' },
  { emoji: '💼', type: 'Private Credit', desc: 'Tokenize direct lending facilities with programmable repayment schedules.' },
  { emoji: '📈', type: 'Fund Shares', desc: 'Issue and manage tokenized units of hedge funds, PE funds, and ETFs.' },
  { emoji: '🌐', type: 'Government Bonds', desc: 'Sovereign debt instruments with blockchain-native settlement and custody.' },
]

const KYC_PROVIDERS = [
  {
    name: 'Jumio',
    logo: '🔵',
    tagline: 'AI-powered identity & biometric verification',
    features: ['Document verification', 'Liveness detection', '200+ countries', 'AML screening'],
    link: 'https://www.jumio.com',
    tier: 'Enterprise',
    color: 'from-blue-600 to-blue-700',
  },
  {
    name: 'Onfido',
    logo: '🟢',
    tagline: 'Global document & facial biometric checks',
    features: ['ID document OCR', 'Biometric matching', 'Real-time results', 'Fraud signals'],
    link: 'https://onfido.com',
    tier: 'Standard',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    name: 'Veriff',
    logo: '🟣',
    tagline: 'Automated identity verification at scale',
    features: ['10,000+ documents', 'Video verification', 'Watchlist screening', 'Risk scoring'],
    link: 'https://www.veriff.com',
    tier: 'Enterprise',
    color: 'from-violet-600 to-purple-700',
  },
  {
    name: 'Sumsub',
    logo: '🟠',
    tagline: 'All-in-one KYC, KYB & AML platform',
    features: ['KYC + KYB', 'Crypto AML', 'Ongoing monitoring', 'No-code flows'],
    link: 'https://sumsub.com',
    tier: 'Standard',
    color: 'from-orange-600 to-amber-700',
  },
]

const STEPS = [
  { n: '01', icon: Building2, title: 'Register Institution', desc: 'Create your organization profile — bank, fund, or asset manager. No paper forms required.' },
  { n: '02', icon: Users, title: 'Complete KYC', desc: 'Verify your institution through our integrated KYC providers or via manual document submission.' },
  { n: '03', icon: Wallet, title: 'Connect Wallet', desc: 'Link your MetaMask or institutional wallet. Choose your deployment network (testnet or mainnet).' },
  { n: '04', icon: Code2, title: 'Deploy Contracts', desc: 'Configure your instrument and click Deploy. All 4 smart contracts are live in under 2 minutes.' },
  { n: '05', icon: FileText, title: 'Issue & Manage', desc: 'Whitelist investors, issue tokens, track holdings, and manage the entire instrument lifecycle.' },
]

const STATS = [
  { value: '$2.4B+', label: 'In Tokenized Assets', sub: 'Across all instruments' },
  { value: '150+', label: 'Institutions Onboarded', sub: 'Banks, funds, platforms' },
  { value: '<2 min', label: 'Contract Deployment', sub: 'From config to live' },
  { value: 'T+0', label: 'Settlement Finality', sub: 'vs T+2 traditional' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Deep dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-white/90">Powered by Catchway Technology · Ontario, CA</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05]">
            Tokenize Financial{' '}
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Assets in Hours.
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl font-bold text-white/60 mt-2">
              Not Months.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-blue-100/70 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Blocks Bank gives banks, funds, and asset managers a complete infrastructure to issue, manage,
            and settle tokenized bonds, deposits, real estate, and fund shares — with built-in KYC and compliance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold text-base px-8 py-4 rounded-2xl shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 hover:shadow-blue-500/60">
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="mailto:ceo@catchway.com">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-2xl transition-all hover:scale-105">
                Book a Demo
                <Mail className="w-4 h-4" />
              </button>
            </a>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                <div className="text-sm font-semibold text-blue-200">{s.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-10 border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">Deployed on leading blockchains · Compliant with global standards</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { label: 'Ethereum', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/50' },
              { label: 'Polygon', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/50' },
              { label: 'Base', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/50' },
              { label: 'ERC-20', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/50' },
              { label: 'MiCA Ready', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/50' },
              { label: 'KYC / AML', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/50' },
              { label: 'ISO 27001', color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-slate-950/50' },
            ].map((item) => (
              <div key={item.label} className={`${item.bg} ${item.color} px-4 py-2 rounded-full text-xs font-bold tracking-wide border border-current/20`}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section id="problem" className="py-28 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-full px-4 py-1.5 mb-6">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">The Real Problem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 tracking-tight">
              Traditional Finance is{' '}
              <span className="text-red-500">Broken</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Financial institutions lose billions every year to inefficiencies that blockchain infrastructure can solve today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PAIN_POINTS.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.label} className={`relative rounded-2xl border ${p.border} ${p.bg} p-6 overflow-hidden`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-black text-foreground mb-1">{p.stat}</div>
                  <div className="text-sm font-bold text-foreground mb-3">{p.label}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.pain}</p>
                  <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${p.color} opacity-10`} />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SOLUTION — BEFORE vs AFTER ── */}
      <section id="solution" className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 mb-6">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">The Blocks Bank Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 tracking-tight">
              We Replace the Entire{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Legacy Stack</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              One platform replaces custodians, clearing houses, transfer agents, and compliance teams — at a fraction of the cost.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Before */}
            <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="font-bold text-red-600 dark:text-red-400 text-lg">Traditional Finance</span>
              </div>
              <div className="space-y-3">
                {SOLUTIONS.map((s) => (
                  <div key={s.before} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-sm text-muted-foreground line-through">{s.before}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 p-8">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">With Blocks Bank</span>
              </div>
              <div className="space-y-3">
                {SOLUTIONS.map((s) => (
                  <div key={s.after} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{s.after}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 tracking-tight">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Go Live</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete institutional-grade platform — no additional vendors required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="group rounded-2xl border border-border bg-card hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 p-7">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ASSET TYPES ── */}
      <section id="instruments" className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 tracking-tight">
              Tokenize Any Financial Instrument
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From government bonds to private real estate — if it has cash flows, we can tokenize it.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INSTRUMENTS.map((inst) => (
              <div key={inst.type} className="flex items-start gap-4 p-6 rounded-2xl border border-border bg-card hover:bg-accent/30 transition-colors">
                <div className="text-3xl flex-shrink-0">{inst.emoji}</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{inst.type}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{inst.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KYC & COMPLIANCE ── */}
      <section id="kyc" className="py-28 px-4 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">KYC / AML Compliance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">
              Institutional-Grade{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Identity Verification</span>
            </h2>
            <p className="text-lg text-blue-100/70 max-w-2xl mx-auto">
              Integrate with the world's leading KYC providers or submit documents manually.
              Every investor is verified before receiving tokens.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {KYC_PROVIDERS.map((p) => (
              <div key={p.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{p.logo}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.tier === 'Enterprise' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    {p.tier}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1">{p.name}</h3>
                <p className="text-xs text-blue-200/60 mb-4">{p.tagline}</p>
                <ul className="space-y-1.5 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-blue-100/70">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className={`block w-full text-center py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${p.color} hover:opacity-90 transition-opacity`}>
                  Connect {p.name}
                </a>
              </div>
            ))}
          </div>

          {/* Manual KYC option */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-white mb-1">Manual KYC Submission</h3>
              <p className="text-sm text-blue-100/60">
                Upload identity documents, proof of address, and corporate registration directly to your dashboard.
                Our compliance team reviews submissions within 24–48 hours for jurisdictions not covered by automated providers.
              </p>
            </div>
            <Link href="/signup">
              <button className="flex-shrink-0 bg-white text-slate-900 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap">
                Start Manual KYC →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-5 tracking-tight">
              From Signup to Live Token{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">in 5 Steps</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No lawyers, no intermediaries, no months of waiting. Just configure and deploy.
            </p>
          </div>

          <div className="relative">
            {/* Connector line desktop */}
            <div className="hidden lg:block absolute top-10 left-[calc(10%+2rem)] right-[calc(10%+2rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-300 to-violet-200 dark:from-blue-800 dark:via-indigo-700 dark:to-violet-800" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <div key={step.n} className="flex flex-col items-center text-center relative">
                    <div className="relative mb-5 z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                        <span className="text-[10px] font-black text-background">{step.n}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 text-base">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="text-center mt-14">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-base px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-105">
                Start Your First Instrument
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CATCHWAY ── */}
      <section className="py-28 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-6">
                <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">Why Trust Blocks Bank</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight leading-tight">
                Built by Engineers Who{' '}
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Know Finance</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Blocks Bank is a product of <strong className="text-foreground">Catchway Technology</strong>, a software company based in Ontario, Canada, specialising in blockchain infrastructure for regulated financial markets.
              </p>
              <div className="space-y-4">
                {[
                  'Deep expertise in DeFi protocols and TradFi compliance requirements',
                  'Production-grade smart contracts audited for institutional use',
                  'Direct support from senior engineers — not offshore ticket queues',
                  'MiCA-compliant architecture ready for European and North American markets',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Layers, label: 'Smart Contracts Deployed', value: '1,200+', color: 'from-blue-500 to-blue-600' },
                { icon: TrendingUp, label: 'Assets Under Management', value: '$2.4B+', color: 'from-indigo-500 to-indigo-600' },
                { icon: RefreshCcw, label: 'Settlement Speed', value: '<3 sec', color: 'from-violet-500 to-violet-600' },
                { icon: Cpu, label: 'Uptime SLA', value: '99.9%', color: 'from-emerald-500 to-emerald-600' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="rounded-2xl border border-border bg-card p-6 text-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">
            Ready to Tokenize Your First Asset?
          </h2>
          <p className="text-lg text-blue-100/80 mb-10 max-w-2xl mx-auto">
            Join the financial institutions already using Blocks Bank to reduce issuance costs by 90% and reach investors 100× faster.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-base px-10 py-4 rounded-2xl shadow-2xl transition-all hover:scale-105">
                Create Free Account
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
            <a href="mailto:ceo@catchway.com">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base px-10 py-4 rounded-2xl transition-all hover:scale-105">
                Talk to Sales
                <Mail className="w-4 h-4" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-4 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="mb-6">
                <Image src="/logo-full.svg" alt="Blocks Bank" width={180} height={54} className="h-12 w-auto" />
              </div>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                We build blockchain infrastructure for financial institutions. If you're a bank, fund manager, or fintech platform looking to tokenize assets, let's talk.
              </p>
              <div className="space-y-4">
                <a href="mailto:ceo@catchway.com" className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-foreground font-medium">ceo@catchway.com</span>
                </a>
                <a href="tel:+14372473222" className="flex items-center gap-3 text-sm hover:text-blue-600 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-foreground font-medium">+1 (437) 247-3222</span>
                </a>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="text-foreground font-medium">Ontario, Canada</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-foreground mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">First Name</label>
                    <input type="text" placeholder="John" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Last Name</label>
                    <input type="text" placeholder="Smith" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Work Email</label>
                  <input type="email" placeholder="cfo@yourbank.com" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Institution</label>
                  <input type="text" placeholder="First National Bank" className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Message</label>
                  <textarea placeholder="Tell us about the assets you'd like to tokenize..." rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                </div>
                <a href="mailto:ceo@catchway.com">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30">
                    Send Message
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-4 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <Image src="/logo-full.svg" alt="Blocks Bank" width={140} height={42} className="h-9 w-auto" />
              <span className="text-[10px] text-muted-foreground pl-0.5">blocksbank.catchway.info</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
              <Link href="#kyc" className="hover:text-foreground transition-colors">KYC</Link>
              <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
              <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/admin/login" className="hover:text-foreground transition-colors">Admin</Link>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} Catchway Technology Inc. · Ontario, CA
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
