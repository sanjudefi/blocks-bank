import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  ArrowRight,
  Building2,
  Zap,
  Shield,
  Globe,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const features = [
  {
    icon: Zap,
    title: 'Easy Deployment',
    description: 'Deploy tokenized financial instruments in minutes with a guided configuration wizard.',
  },
  {
    icon: Shield,
    title: 'Smart Contract Automation',
    description: 'Automatically deploy registry, token, treasury, and compliance contracts.',
  },
  {
    icon: Building2,
    title: 'Institution Ready',
    description: 'Designed for banks, funds, and financial institutions with enterprise-grade security.',
  },
  {
    icon: Globe,
    title: 'Open Infrastructure',
    description: 'Open-source platform with customizable deployment across multiple blockchains.',
  },
]

const problems = [
  {
    icon: Clock,
    title: 'Slow Settlement',
    description: 'Traditional finance relies on T+2 or T+3 settlement cycles, locking up capital for days.',
  },
  {
    icon: AlertTriangle,
    title: 'Complex Issuance',
    description: 'Issuing financial instruments requires months of legal work and intermediaries.',
  },
  {
    icon: DollarSign,
    title: 'High Infrastructure Costs',
    description: 'Building and maintaining issuance infrastructure costs millions of dollars annually.',
  },
]

const solutions = [
  {
    icon: CheckCircle2,
    title: 'Deploy Tokenized Instruments',
    description: 'Issue bonds, deposits, and fund shares on blockchain in minutes, not months.',
  },
  {
    icon: CheckCircle2,
    title: 'Automated Smart Contracts',
    description: 'Smart contracts automate compliance, custody, and settlement automatically.',
  },
  {
    icon: CheckCircle2,
    title: 'Instant Settlement',
    description: 'Achieve T+0 settlement with blockchain-native atomic swaps and transfers.',
  },
]

const steps = [
  { step: 1, title: 'Create Organization', description: 'Register your institution and configure your profile.' },
  { step: 2, title: 'Connect Wallet', description: 'Connect your MetaMask wallet for on-chain operations.' },
  { step: 3, title: 'Configure Instrument', description: 'Define your financial instrument parameters and tokenomics.' },
  { step: 4, title: 'Deploy Contracts', description: 'One-click deployment of all required smart contracts.' },
  { step: 5, title: 'Start Issuing Tokens', description: 'Begin issuing and managing tokens to investors.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-background dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-background" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Open Infrastructure for Tokenized Finance</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-5xl mx-auto leading-tight">
            Launch Tokenized Financial Products{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Blocks Bank is an open infrastructure platform that enables financial institutions to issue
            tokenized financial instruments such as bonds, funds, and real estate assets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 text-base px-8 h-12 shadow-lg shadow-blue-500/25">
                Get Started
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                View Documentation
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '$2.4B+', label: 'Assets Tokenized' },
              { value: '150+', label: 'Institutions' },
              { value: '4', label: 'Blockchains' },
              { value: 'T+0', label: 'Settlement' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Problem with Traditional Finance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Legacy financial infrastructure creates unnecessary friction, cost, and delays.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem) => {
              const Icon = problem.icon
              return (
                <Card key={problem.title} className="border-border bg-card">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-xl">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{problem.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Blocks Bank Solution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Blockchain-native infrastructure designed for financial institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution) => {
              const Icon = solution.icon
              return (
                <Card key={solution.title} className="border-border bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{solution.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Financial Institutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to launch and manage tokenized financial products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-border bg-card hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From setup to live tokenized instrument in five simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(10%+2rem)] right-[calc(10%+2rem)] h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800" />

            {steps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 z-10 shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-sm">{step.step}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Tokenizing Financial Assets Today
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Join leading financial institutions already using Blocks Bank to issue tokenized instruments.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-base px-10 h-12 font-semibold shadow-lg">
              Create Organization
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">Blocks Bank</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Blocks Bank. Open-source financial infrastructure.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
