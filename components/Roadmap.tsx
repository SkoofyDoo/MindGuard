'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Rocket } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export function Roadmap() {
  const { t, lang } = useTranslation();

  const isRussian = lang === 'ru';
  const roadmap = (t as any).roadmap || {};

  // Preserve the original rich Russian version exactly as the user liked it.
  // For other languages, use translated data from translations.

  const hardcodedRussianPhases = [
    {
      phase: 'Фаза 1',
      status: 'Сейчас',
      title: 'База и первое впечатление',
      description: 'Красивый лендинг, полноценное демо с локальной обработкой видео, выбор лучших кадров и элегантные результаты.',
      items: ['Лендинг + Waitlist', 'Демо с записью и умным выбором кадров', 'Визуализация метрик и советов', 'Многоязычность (RU/EN/DE)'],
    },
    {
      phase: 'Фаза 2',
      status: 'Скоро',
      title: 'История и приватность',
      description: 'Сохранение истории чек-инов, долгосрочные тренды, полное шифрование на устройстве и тонкие настройки приватности.',
      items: ['История чек-инов и тренды', 'AES-256 шифрование с passphrase', 'Настройки и управление данными', 'Улучшенная обработка видео'],
    },
    {
      phase: 'Фаза 3',
      status: 'В планах',
      title: 'Настоящий ИИ',
      description: 'Глубокий мультимодальный анализ с помощью LangGraph (зрение + голос + текст) для значительно более точных инсайтов.',
      items: ['Vision + Audio + Text агенты', 'LangGraph мультиагентная система', 'Реальный бэкенд', 'Значительно более точные инсайты'],
    },
    {
      phase: 'Фаза 4',
      status: 'В планах',
      title: 'Масштабирование',
      description: 'Аккаунты, синхронизация между устройствами с end-to-end шифрованием, живое ценообразование и публичный запуск.',
      items: ['Аккаунты + E2EE синхронизация', 'Живое ценообразование (Stripe)', 'Публичный запуск продукта', 'Партнёрства и интеграции'],
    },
  ];

  const translatedRoadmap = (t as any).roadmap;
  const phases = isRussian 
    ? hardcodedRussianPhases 
    : (translatedRoadmap?.phases || hardcodedRussianPhases);

  const getStatusIcon = (status: string) => {
    if (status === 'Сейчас' || status === 'Current' || status === 'Aktuell') return <Rocket className="h-4 w-4" />;
    if (status === 'Скоро' || status === 'Soon' || status === 'Bald') return <Clock className="h-4 w-4" />;
    return <Check className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Сейчас' || status === 'Current' || status === 'Aktuell') return 'bg-[#00ff9d] text-[#0a0b0f]';
    if (status === 'Скоро' || status === 'Soon' || status === 'Bald') return 'bg-[#facc15] text-[#0a0b0f]';
    return 'bg-[#272b33] text-[#94a3b8]';
  };

  const getStatusLabel = (statusKey: string) => {
    return roadmap.status?.[statusKey] || statusKey;
  };

  return (
    <section className="border-t border-[#272b33] bg-[#0a0b0f] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-[#85edb2] text-xs tracking-[3px] mb-3">ПРОЗРАЧНОСТЬ</div>
          <h2 className="text-5xl font-semibold tracking-[-1.5px] mb-4">{(isRussian ? 'План развития' : roadmap.title) || 'Roadmap'}</h2>
          <p className="text-xl text-[#94a3b8] max-w-md mx-auto">
            { (isRussian ? 'Что мы планируем сделать в ближайшее время' : roadmap.subtitle) || 'What we plan to build in the near future' }
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase: any, index: number) => (
            <motion.div
              key={phase.key || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="group relative rounded-3xl border border-[#272b33] bg-[#121317] p-8 transition-all hover:border-[#3a3f4a]"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-[#85edb2] tracking-wider">{phase.phase}</span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium ${getStatusColor(phase.status || phase.statusKey)}`}>
                      {getStatusIcon(phase.status || phase.statusKey)}
                      {phase.status || getStatusLabel(phase.statusKey)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold tracking-tight mb-3">{phase.title}</h3>
                  <p className="text-[#c5d0e0] max-w-2xl">{phase.description}</p>

                  <ul className="mt-5 space-y-2 text-sm text-[#94a3b8]">
                    {phase.items.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 block h-1 w-1 rounded-full bg-[#85edb2]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="hidden md:flex flex-col items-end justify-between self-stretch">
                  <div className="text-right">
                    <div className="text-xs text-[#64748b]">{roadmap.phaseLabel || 'PHASE'}</div>
                    <div className="text-6xl font-semibold tracking-tighter text-[#272b33] group-hover:text-[#3a3f4a] transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center text-xs text-[#64748b]">
          {roadmap.disclaimer || 'The plan may change. We actively listen to feedback from early users.'}
        </div>
      </div>
    </section>
  );
}
