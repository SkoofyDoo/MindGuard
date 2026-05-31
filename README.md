# MindGuard

**Персональный мультимодальный AI-компаньон по эмоциональному благополучию.**

«Дым, а не огонь» — лёгкий, премиальный, успокаивающий опыт на 1–2 минуты. Никакого давления и медицинской тяжести. Только красота, прозрачность и лёгкие инсайты.

## Phase 1 (текущий статус)

- Полностью рабочий **Live Demo** с реальной клиентской обработкой видео
- Автоматический выбор лучших кадров по резкости (чистая JS-реализация Laplacian variance)
- Красивый PipelineVisualizer, показывающий, что именно происходит с данными
- Высококачественные мок-результаты (эмпатичные тексты + советы + графики)
- Премиум тёмная тема с лаймовыми акцентами (#00ff9d)

Всё работает **полностью в браузере**. Никакие видео не уходят на сервер.

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте http://localhost:3000 — и сразу переходите в `/demo`.

## Развёртывание на Vercel (рекомендуется для тестирования на телефоне)

Самый простой и надёжный способ протестировать приложение на реальном устройстве:

1. Установи Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Залогинься:
   ```bash
   vercel login
   ```

3. Задеплой проект:
   ```bash
   vercel
   ```

4. После деплоя ты получишь публичную HTTPS-ссылку (например `https://mindguard-xxx.vercel.app`).

5. Открой эту ссылку на телефоне → перейди в `/demo`.

**Преимущества:**
- Полноценный HTTPS (важно для камеры на iOS)
- Не нужно ничего настраивать локально
- Можно тестировать на любом устройстве из любой сети

Повторный деплой:
```bash
vercel --prod
```

## Ключевые технические решения Phase 1

- Next.js 16 + React 19 + TypeScript
- 100% клиентская нарезка и скоринг кадров (MediaRecorder + Canvas + чистый JS)
- Framer Motion + Recharts + shadcn/ui
- Zero-knowledge подход уже виден в демо (PipelineVisualizer)

## Дальше

См. подробный план в `.grok/sessions/.../plan.md`

Следующие этапы (после валидации):
- Полноценная история + тренды с локальным хранилищем
- Реальная AES-256-GCM шифрование с passphrase пользователя
- Настоящий бэкенд + LangGraph (Vision + Audio + Text агенты)
- Self-pricing форма + Resend

## Философия

Никаких «пациентов». Только люди, которые хотят лучше понимать себя — красиво, спокойно и приватно.

---

MindGuard • 2026

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
