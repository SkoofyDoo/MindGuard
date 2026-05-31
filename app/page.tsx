'use client';

import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Roadmap } from '@/components/Roadmap';
import { SelfPricingForm } from '@/components/SelfPricingForm';

export default function MindGuardLanding() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-[#f1f5f9]">
      {/* Top nav */}
      <nav className="border-b border-[#272b33] bg-[#0a0b0f]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-semibold tracking-tight text-xl">MindGuard</div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#how" className="hover:text-[#85edb2] transition-colors">{t.landing.nav.how}</a>
            <a href="#philosophy" className="hover:text-[#85edb2] transition-colors">{t.landing.nav.philosophy}</a>
            <a href="/demo" className="text-[#00ff9d] hover:text-[#85edb2]">{t.landing.nav.demo} →</a>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 text-center">
        <div className="inline-flex rounded-full border border-[#272b33] bg-[#121317] px-4 py-1 text-[10px] sm:text-xs tracking-[2px] sm:tracking-[3px] text-[#85edb2] mb-5 sm:mb-6">
          {t.landing.hero.badge}
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-[72px] leading-[1.05] sm:leading-[1.05] md:leading-[82px] font-semibold tracking-[-2.5px] sm:tracking-[-3.5px] md:tracking-[-4.2px] mb-5 sm:mb-6 whitespace-pre-line">
          {t.landing.hero.title}
        </h1>
        <p className="max-w-md sm:max-w-lg mx-auto text-xl sm:text-2xl text-[#94a3b8] tracking-tight whitespace-pre-line">
          {t.landing.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 px-2">
          <a href="/demo" className="btn-lime inline-flex h-12 sm:h-14 items-center justify-center rounded-2xl px-8 sm:px-12 text-base sm:text-lg font-medium">
            {t.landing.hero.ctaDemo}
          </a>
          <a href="#waitlist" className="inline-flex h-12 sm:h-14 items-center justify-center rounded-2xl border border-[#272b33] px-6 sm:px-10 text-base sm:text-lg hover:bg-[#121317]">
            {t.landing.hero.ctaWaitlist}
          </a>
        </div>
        <div className="text-[10px] sm:text-xs mt-4 sm:mt-5 text-[#64748b] px-4">{t.landing.hero.note}</div>
      </div>

      {/* Trust / Pipeline teaser */}
      <div id="how" className="border-t border-[#272b33] bg-[#121317] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="uppercase tracking-[2px] sm:tracking-[3px] text-[10px] sm:text-xs text-[#85edb2] mb-3 sm:mb-4">{(t as any).landing?.transparencyBadge || 'TRANSPARENCY — TRUST FOUNDATION'}</div>
          <div className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6 sm:mb-10">{t.landing.how.title}</div>
          
          {/* Mini Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-sm">
            {t.landing.how.steps.map((step, index) => (
              <div key={index} className="card p-5 sm:p-6">
                <div className="text-[#00ff9d] text-[10px] sm:text-xs mb-3 sm:mb-4 tracking-widest">{step.num}</div>
                <div className="font-medium text-lg sm:text-xl mb-1">{step.title}</div>
                <div className="text-[#64748b] text-sm">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div id="philosophy" className="max-w-3xl mx-auto px-5 sm:px-6 py-14 sm:py-20 text-center">
        <div className="text-[#85edb2] tracking-[2px] sm:tracking-[2.5px] text-xs sm:text-sm mb-3">{t.landing.philosophy.label}</div>
        <div className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-1px] sm:tracking-[-1.5px] leading-none mb-6 sm:mb-9 whitespace-pre-line">
          {t.landing.philosophy.title}
        </div>
        <div className="text-xl sm:text-2xl text-[#94a3b8] leading-tight whitespace-pre-line">
          {t.landing.philosophy.text}
        </div>
      </div>

      {/* Roadmap */}
      <Roadmap />

      {/* Self-Pricing + Feedback + Waitlist */}
      <div id="waitlist" className="border-t border-[#272b33] bg-[#121317] py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-5 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <div className="text-[#85edb2] text-[10px] sm:text-xs tracking-[2px] sm:tracking-[3px] mb-3 sm:mb-4">{(t as any).landing?.selfPricingBadge || (t as any).landing?.selfPricing?.title || 'SELF-PRICING + FEEDBACK'}</div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.8px] sm:tracking-[-1.2px] mb-4">
              { (t as any).landing?.selfPricing?.title || 'How much would MindGuard be worth to you?' }
            </h3>
            <p className="text-[#94a3b8] max-w-md sm:max-w-lg mx-auto text-sm sm:text-base">
              { (t as any).landing?.selfPricing?.subtitle || 
                'Choose a comfortable price and leave your feedback. This helps us design the product correctly.' }
            </p>
          </div>

          <SelfPricingForm />
        </div>
      </div>

      <footer className="border-t border-[#272b33] py-8 sm:py-9 text-center text-[10px] sm:text-xs text-[#64748b] px-4">
        {t.landing.footer}
      </footer>
    </div>
  );
}
