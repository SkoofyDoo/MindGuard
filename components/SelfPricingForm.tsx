'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

const PRICE_OPTIONS = ['$5/mo', '$9/mo', '$15/mo'];

export function SelfPricingForm() {
  const { t } = useTranslation();
  const sp = (t as any).landing?.selfPricing || {};

  const [selectedPrice, setSelectedPrice] = useState('$9/mo');
  const [customPrice, setCustomPrice] = useState('');
  const [feedback, setFeedback] = useState('');
  const [joinWaitlist, setJoinWaitlist] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const finalPrice = selectedPrice === 'other' ? customPrice || 'Not specified' : selectedPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: finalPrice,
          feedback: feedback.trim(),
          joinWaitlist,
          name: name.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Что-то пошло не так. Попробуйте ещё раз.');
      }
    } catch (err) {
      setError('Ошибка соединения. Проверьте интернет и попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">🎉</div>
        <h4 className="text-3xl font-semibold tracking-tight mb-4">
          {sp.successTitle || 'Спасибо большое!'}
        </h4>
        <p className="text-[#c5d0e0] max-w-md mx-auto mb-6">
          {joinWaitlist 
            ? (sp.successWaitlist || 'Вы подписаны на Waitlist и получаете пожизненную скидку 50%.')
            : (sp.successThanks || 'Спасибо за фидбек!')
          }
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFeedback('');
            setName('');
            setEmail('');
          }}
          className="text-sm text-[#85edb2] underline underline-offset-4 hover:text-[#00ff9d]"
        >
          {sp.sendAgain || 'Отправить ещё один фидбек'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Price Selection */}
      <div>
        <label className="block text-sm font-medium text-[#94a3b8] mb-3 tracking-wider">
          {sp.priceLabel || 'Выберите комфортный для вас ценник'}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRICE_OPTIONS.map((price) => (
            <button
              key={price}
              type="button"
              onClick={() => setSelectedPrice(price)}
              className={`px-6 py-4 rounded-2xl border text-lg font-medium transition-all ${
                selectedPrice === price
                  ? 'border-[#00ff9d] bg-[#00ff9d]/10 text-[#00ff9d]'
                  : 'border-[#272b33] hover:border-[#3a3f4a] hover:bg-[#1a1c22]'
              }`}
            >
              {price}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedPrice('other')}
            className={`px-6 py-4 rounded-2xl border text-lg font-medium transition-all ${
              selectedPrice === 'other'
                ? 'border-[#00ff9d] bg-[#00ff9d]/10 text-[#00ff9d]'
                : 'border-[#272b33] hover:border-[#3a3f4a] hover:bg-[#1a1c22]'
            }`}
          >
            {sp.other || 'Other'}
          </button>
        </div>

        {selectedPrice === 'other' && (
          <input
            type="text"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            placeholder={sp.otherPlaceholder || "Например: $12/мес или $99 разово"}
            className="mt-3 w-full rounded-2xl border border-[#272b33] bg-[#0a0b0f] px-5 py-3 text-lg focus:border-[#00ff9d] focus:outline-none"
            required
          />
        )}
      </div>

      {/* Feedback */}
      <div>
        <label className="block text-sm font-medium text-[#94a3b8] mb-3 tracking-wider">
          {sp.feedbackLabel || 'Ваш фидбек или комментарий (опционально)'}
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder={sp.feedbackPlaceholder || "Что для вас важно в таком продукте? Что бы вы хотели видеть?"}
          className="w-full rounded-2xl border border-[#272b33] bg-[#0a0b0f] px-5 py-4 text-base focus:border-[#00ff9d] focus:outline-none resize-y"
        />
      </div>

      {/* Waitlist + 50% discount */}
      <div className="rounded-2xl border border-[#272b33] bg-[#0a0b0f] p-6">
        <label className="flex items-start gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={joinWaitlist}
            onChange={(e) => setJoinWaitlist(e.target.checked)}
            className="mt-1 h-5 w-5 accent-[#00ff9d]"
          />
          <div className="text-left">
            <div className="font-medium text-lg">
              {sp.joinWaitlist || 'Подписаться на Waitlist'}
            </div>
            <div className="text-[#c5d0e0] mt-1 text-sm leading-relaxed">
              {sp.waitlistDiscount || 'Пользователи из Waitlist получают пожизненную скидку 50% на MindGuard при запуске.'}
            </div>
          </div>
        </label>
      </div>

      {/* Contact info (optional but useful) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={sp.namePlaceholder || "Ваше имя (опционально)"}
          className="rounded-2xl border border-[#272b33] bg-[#0a0b0f] px-5 py-3 focus:border-[#00ff9d] focus:outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={sp.emailPlaceholder || "Email (опционально)"}
          className="rounded-2xl border border-[#272b33] bg-[#0a0b0f] px-5 py-3 focus:border-[#00ff9d] focus:outline-none"
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center">{error || sp.error}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || (selectedPrice === 'other' && !customPrice)}
        className="w-full rounded-2xl bg-[#00ff9d] py-4 text-xl font-medium text-[#0a0b0f] transition-all hover:bg-[#85edb2] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (sp.submitting || 'Отправляем...') : (sp.submit || 'Отправить фидбек')}
      </button>

      <p className="text-center text-xs text-[#64748b]">
        {sp.privacyNote || 'All data is sent directly to the project owner.'}
      </p>
    </form>
  );
}
