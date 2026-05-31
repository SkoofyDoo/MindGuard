'use client';

import { useTranslation, languages, languageNames, languageFlags } from '@/lib/i18n';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageSwitcher() {
  const { lang, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-[#272b33] bg-[#121317] px-4 py-2 text-sm hover:border-[#3a3f4a] transition-colors"
      >
        <span className="text-base">{languageFlags[lang]}</span>
        <span className="hidden sm:inline">{languageNames[lang]}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#64748b]" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full z-50 mt-2 w-44 rounded-2xl border border-[#272b33] bg-[#121317] py-1 shadow-xl"
            >
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLanguage(l);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#1a1c22] ${
                    l === lang ? 'text-[#00ff9d]' : 'text-[#f1f5f9]'
                  }`}
                >
                  <span className="text-lg">{languageFlags[l]}</span>
                  <span>{languageNames[l]}</span>
                  {l === lang && <span className="ml-auto text-xs text-[#85edb2]">✓</span>}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
