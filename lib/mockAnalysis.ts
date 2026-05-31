/**
 * MindGuard — High-quality Mock Analysis Engine (Phase 1)
 * 
 * Produces beautiful, empathetic, believable results instantly.
 * These are carefully written archetypes + light randomization.
 * 
 * When we move to real AI (Phase 3), this file becomes the fallback + test fixture.
 */

import type { CheckInResult, EmotionScores } from './video/types';
import type { Language } from '@/lib/i18n/translations';

function slightVariation(base: number, variance = 6): number {
  return Math.max(8, Math.min(92, Math.round(base + (Math.random() - 0.5) * variance * 2)));
}

// Full multilingual mock archetypes
const MOCK_ARCHETYPES: Record<Language, Array<Omit<CheckInResult, 'id' | 'date'>>> = {
  ru: [
    {
      overall: "Спокойный, с тёплыми акцентами",
      headline: "День прошёл ровно и с ощущением опоры.",
      summary: "Вы говорили спокойно и размеренно. В голосе почти не было напряжения, а на лице преобладало мягкое внимание к себе. Есть лёгкая усталость, но она приятная — после выполненного дела, а не выгорания.",
      scores: { calm: 78, joy: 64, anxiety: 18, fatigue: 41, frustration: 12, hope: 71 },
      valenceTimeline: [
        { t: 0.1, v: 0.35, a: 0.28 }, { t: 0.3, v: 0.48, a: 0.31 },
        { t: 0.5, v: 0.52, a: 0.35 }, { t: 0.7, v: 0.41, a: 0.29 }, { t: 0.9, v: 0.55, a: 0.33 },
      ],
      advice: [
        {
          id: 'a1', title: '10 минут тишины после 20:00',
          body: 'Просто посидеть без телефона. Это позволит нервной системе окончательно «выдохнуть» после дня.',
          why: 'Ваш голос и микродвижения уже показывают хорошую способность к саморегуляции. Маленькая ритуальная пауза усилит её.',
          category: 'mindset'
        },
        {
          id: 'a2', title: 'Короткая прогулка без цели',
          body: '15–20 минут в любом темпе, без аудио. Просто смотреть вокруг.',
          why: 'Низкий уровень тревоги + хорошая база спокойствия = идеальное окно для «фонового» восстановления дофамина.',
          category: 'movement'
        }
      ],
      bestPractices: [
        "Вечерний «цифровой закат» за 40 минут до сна",
        "Одно физическое действие утром (даже растяжка 4 минуты)",
        "Фиксировать одно маленькое «я доволен» перед сном"
      ],
      primaryEmotion: 'calm'
    },
    {
      overall: "Лёгкая тревога под маской усталости",
      headline: "Вы устали, но под усталостью прячется беспокойство.",
      summary: "Темп речи чуть выше обычного, много коротких пауз. На лице чаще появлялись микронапряжения вокруг глаз и рта. Тема «не успеваю» и «что будет дальше» звучала несколько раз.",
      scores: { calm: 34, joy: 29, anxiety: 67, fatigue: 72, frustration: 48, hope: 41 },
      valenceTimeline: [
        { t: 0.1, v: -0.1, a: 0.55 }, { t: 0.35, v: -0.25, a: 0.62 },
        { t: 0.55, v: -0.18, a: 0.48 }, { t: 0.75, v: -0.32, a: 0.71 }, { t: 0.92, v: -0.08, a: 0.51 },
      ],
      advice: [
        {
          id: 'b1', title: '«Сброс тревоги» 4-7-8',
          body: '3–4 цикла дыхания перед любым следующим делом. Вдох 4, задержка 7, выдох 8.',
          why: 'Ваш темп речи и микродвижения лица показывают активацию симпатической системы. Это быстрый способ вернуть парасимпатику.',
          category: 'breath'
        },
        {
          id: 'b2', title: 'Одна «достаточно хорошая» задача',
          body: 'Сегодня выберите только одну вещь, которую вы сделаете «достаточно хорошо», а не идеально.',
          why: 'Высокая тревога часто связана с перфекционизмом и страхом не успеть. Снижение планки даёт быстрый эффект.',
          category: 'mindset'
        }
      ],
      bestPractices: [
        "Утром записывать 3 вещи, которые «уже достаточно»",
        "Техника «помидор» с обязательным 5-мин перерывом",
        "Вечером — 2 минуты «что я отпускаю сегодня»"
      ],
      primaryEmotion: 'anxiety'
    },
    {
      overall: "Тёплая, чуть грустная благодарность",
      headline: "Внутри много чувств, и все они по-своему важные.",
      summary: "Вы говорили тихо и тепло. Были моменты, когда голос чуть дрожал — не от страха, а от ценности того, о чём вы рассказывали. Лицо часто расслаблялось в лёгкой улыбке.",
      scores: { calm: 61, joy: 58, anxiety: 29, fatigue: 44, frustration: 19, hope: 79 },
      valenceTimeline: [
        { t: 0.15, v: 0.22, a: 0.38 }, { t: 0.4, v: 0.38, a: 0.29 },
        { t: 0.6, v: 0.19, a: 0.41 }, { t: 0.8, v: 0.45, a: 0.33 }, { t: 0.95, v: 0.51, a: 0.27 },
      ],
      advice: [
        {
          id: 'c1', title: 'Написать короткое «спасибо» кому-то',
          body: 'Не обязательно отправлять. Просто написать от руки или в заметках — 3–4 предложения.',
          why: 'Ваша речь уже содержит много благодарности. Перевод этого в текст усиливает ощущение связи.',
          category: 'connection'
        }
      ],
      bestPractices: [
        "Вечерняя практика «одно маленькое чудо сегодня»",
        "Раз в неделю — 15 минут на воспоминание о важном человеке",
        "Хранить 3–4 «якорных» сообщения или фото на видном месте"
      ],
      primaryEmotion: 'hope'
    }
  ],

  en: [
    {
      overall: "Calm with warm undertones",
      headline: "The day went smoothly with a sense of grounding.",
      summary: "You spoke calmly and steadily. There was almost no tension in your voice, and your face showed soft self-awareness. There's a light, pleasant fatigue — the kind that comes after meaningful work, not burnout.",
      scores: { calm: 78, joy: 64, anxiety: 18, fatigue: 41, frustration: 12, hope: 71 },
      valenceTimeline: [
        { t: 0.1, v: 0.35, a: 0.28 }, { t: 0.3, v: 0.48, a: 0.31 },
        { t: 0.5, v: 0.52, a: 0.35 }, { t: 0.7, v: 0.41, a: 0.29 }, { t: 0.9, v: 0.55, a: 0.33 },
      ],
      advice: [
        {
          id: 'a1', title: '10 minutes of silence after 8 PM',
          body: 'Simply sit without your phone. This helps your nervous system fully exhale after the day.',
          why: 'Your voice and micro-movements already show good self-regulation capacity. A small ritual pause will strengthen it.',
          category: 'mindset'
        },
        {
          id: 'a2', title: 'A short aimless walk',
          body: '15–20 minutes at any pace, without audio. Just look around.',
          why: 'Low anxiety + good baseline calm = perfect window for background dopamine recovery.',
          category: 'movement'
        }
      ],
      bestPractices: [
        "Digital sunset 40 minutes before bed",
        "One physical action in the morning (even 4-minute stretching)",
        "Note one small “I'm satisfied” before sleep"
      ],
      primaryEmotion: 'calm'
    },
    {
      overall: "Mild anxiety masked as fatigue",
      headline: "You're tired, but restlessness hides beneath the exhaustion.",
      summary: "Your speech pace was slightly faster than usual, with many short pauses. Micro-tensions frequently appeared around your eyes and mouth. The theme of 'not having enough time' and 'what comes next' came up several times.",
      scores: { calm: 34, joy: 29, anxiety: 67, fatigue: 72, frustration: 48, hope: 41 },
      valenceTimeline: [
        { t: 0.1, v: -0.1, a: 0.55 }, { t: 0.35, v: -0.25, a: 0.62 },
        { t: 0.55, v: -0.18, a: 0.48 }, { t: 0.75, v: -0.32, a: 0.71 }, { t: 0.92, v: -0.08, a: 0.51 },
      ],
      advice: [
        {
          id: 'b1', title: '“Anxiety reset” 4-7-8 breathing',
          body: 'Do 3–4 breathing cycles before any next task. Inhale 4, hold 7, exhale 8.',
          why: 'Your speech tempo and facial micro-movements show sympathetic activation. This is a fast way to return to parasympathetic state.',
          category: 'breath'
        },
        {
          id: 'b2', title: 'One “good enough” task',
          body: 'Today, choose only one thing you will do “good enough” instead of perfectly.',
          why: 'High anxiety is often tied to perfectionism and fear of not finishing everything. Lowering the bar brings quick relief.',
          category: 'mindset'
        }
      ],
      bestPractices: [
        "Write down 3 things that are 'already enough' in the morning",
        "Pomodoro technique with mandatory 5-min breaks",
        "Evening: 2 minutes of 'what I release today'"
      ],
      primaryEmotion: 'anxiety'
    },
    {
      overall: "Warm, slightly melancholic gratitude",
      headline: "There are many feelings inside, and all of them matter in their own way.",
      summary: "You spoke softly and warmly. There were moments when your voice trembled slightly — not from fear, but from the value of what you were sharing. Your face often relaxed into a gentle smile.",
      scores: { calm: 61, joy: 58, anxiety: 29, fatigue: 44, frustration: 19, hope: 79 },
      valenceTimeline: [
        { t: 0.15, v: 0.22, a: 0.38 }, { t: 0.4, v: 0.38, a: 0.29 },
        { t: 0.6, v: 0.19, a: 0.41 }, { t: 0.8, v: 0.45, a: 0.33 }, { t: 0.95, v: 0.51, a: 0.27 },
      ],
      advice: [
        {
          id: 'c1', title: 'Write a short “thank you” to someone',
          body: 'You don’t have to send it. Just write 3–4 sentences by hand or in notes.',
          why: 'Your speech already contains a lot of gratitude. Putting it into text strengthens the feeling of connection.',
          category: 'connection'
        }
      ],
      bestPractices: [
        "Evening practice: 'one small miracle today'",
        "Once a week — 15 minutes remembering an important person",
        "Keep 3–4 'anchor' messages or photos in a visible place"
      ],
      primaryEmotion: 'hope'
    }
  ],

  de: [
    {
      overall: "Ruhig mit warmen Untertönen",
      headline: "Der Tag verlief ausgeglichen mit einem Gefühl von Bodenhaftung.",
      summary: "Du hast ruhig und gleichmäßig gesprochen. Fast keine Anspannung in der Stimme, im Gesicht zeigte sich eine sanfte Selbstwahrnehmung. Es gibt eine leichte, angenehme Müdigkeit – die Art, die nach sinnvoller Arbeit kommt, nicht nach Burnout.",
      scores: { calm: 78, joy: 64, anxiety: 18, fatigue: 41, frustration: 12, hope: 71 },
      valenceTimeline: [
        { t: 0.1, v: 0.35, a: 0.28 }, { t: 0.3, v: 0.48, a: 0.31 },
        { t: 0.5, v: 0.52, a: 0.35 }, { t: 0.7, v: 0.41, a: 0.29 }, { t: 0.9, v: 0.55, a: 0.33 },
      ],
      advice: [
        {
          id: 'a1', title: '10 Minuten Stille nach 20 Uhr',
          body: 'Einfach ohne Handy dasitzen. Das hilft deinem Nervensystem, nach dem Tag richtig auszuatmen.',
          why: 'Deine Stimme und Mikrobewegungen zeigen bereits gute Selbstregulationsfähigkeit. Eine kleine rituelle Pause wird sie stärken.',
          category: 'mindset'
        },
        {
          id: 'a2', title: 'Ein kurzer zielloser Spaziergang',
          body: '15–20 Minuten in beliebigem Tempo, ohne Audio. Einfach um dich schauen.',
          why: 'Wenig Angst + gute Grundruhe = perfektes Fenster für background Dopamin-Erholung.',
          category: 'movement'
        }
      ],
      bestPractices: [
        "Digitaler Sonnenuntergang 40 Minuten vor dem Schlafengehen",
        "Eine körperliche Handlung am Morgen (auch 4-minütiges Dehnen)",
        "Notiere abends ein kleines „Ich bin zufrieden“"
      ],
      primaryEmotion: 'calm'
    },
    {
      overall: "Leichte Angst maskiert als Müdigkeit",
      headline: "Du bist müde, aber unter der Erschöpfung verbirgt sich Unruhe.",
      summary: "Dein Sprechtempo war etwas schneller als sonst, mit vielen kurzen Pausen. Mikroanspannungen tauchten häufig um Augen und Mund auf. Das Thema „nicht genug Zeit“ und „was kommt als Nächstes“ kam mehrmals vor.",
      scores: { calm: 34, joy: 29, anxiety: 67, fatigue: 72, frustration: 48, hope: 41 },
      valenceTimeline: [
        { t: 0.1, v: -0.1, a: 0.55 }, { t: 0.35, v: -0.25, a: 0.62 },
        { t: 0.55, v: -0.18, a: 0.48 }, { t: 0.75, v: -0.32, a: 0.71 }, { t: 0.92, v: -0.08, a: 0.51 },
      ],
      advice: [
        {
          id: 'b1', title: '„Angst-Reset“ 4-7-8 Atmung',
          body: 'Mache 3–4 Atemzyklen vor jeder nächsten Aufgabe. Einatmen 4, Halten 7, Ausatmen 8.',
          why: 'Dein Sprechtempo und Gesichtsmikrobewegungen zeigen sympathische Aktivierung. Das ist ein schneller Weg zurück in den parasympathischen Zustand.',
          category: 'breath'
        },
        {
          id: 'b2', title: 'Eine „gut genug“ Aufgabe',
          body: 'Wähle heute nur eine Sache, die du „gut genug“ statt perfekt machst.',
          why: 'Hohe Angst hängt oft mit Perfektionismus und Angst, nicht alles zu schaffen, zusammen. Die Latte etwas zu senken bringt schnelle Entlastung.',
          category: 'mindset'
        }
      ],
      bestPractices: [
        "Morgens 3 Dinge aufschreiben, die „schon genug“ sind",
        "Pomodoro-Technik mit verpflichtenden 5-Min-Pausen",
        "Abends: 2 Minuten „was ich heute loslasse“"
      ],
      primaryEmotion: 'anxiety'
    },
    {
      overall: "Warme, leicht wehmütige Dankbarkeit",
      headline: "In dir sind viele Gefühle, und alle sind auf ihre Weise wichtig.",
      summary: "Du hast leise und warm gesprochen. Es gab Momente, in denen deine Stimme leicht zitterte – nicht aus Angst, sondern aus Wertschätzung für das, was du geteilt hast. Dein Gesicht entspannte sich oft zu einem sanften Lächeln.",
      scores: { calm: 61, joy: 58, anxiety: 29, fatigue: 44, frustration: 19, hope: 79 },
      valenceTimeline: [
        { t: 0.15, v: 0.22, a: 0.38 }, { t: 0.4, v: 0.38, a: 0.29 },
        { t: 0.6, v: 0.19, a: 0.41 }, { t: 0.8, v: 0.45, a: 0.33 }, { t: 0.95, v: 0.51, a: 0.27 },
      ],
      advice: [
        {
          id: 'c1', title: 'Schreibe jemandem ein kurzes „Danke“',
          body: 'Du musst es nicht abschicken. Schreibe einfach 3–4 Sätze von Hand oder in Notizen.',
          why: 'Deine Sprache enthält bereits viel Dankbarkeit. Das Aufschreiben verstärkt das Gefühl der Verbundenheit.',
          category: 'connection'
        }
      ],
      bestPractices: [
        "Abendpraxis: „Ein kleines Wunder heute“",
        "Einmal pro Woche 15 Minuten an eine wichtige Person denken",
        "3–4 „Anker“-Nachrichten oder Fotos an einem sichtbaren Ort aufbewahren"
      ],
      primaryEmotion: 'hope'
    }
  ]
};

export function generateMockResult(durationSeconds: number, lang: Language = 'en'): CheckInResult {
  const archetypes = MOCK_ARCHETYPES[lang] || MOCK_ARCHETYPES['en'];
  const archetypeIndex = Math.random() < 0.55 ? 0 : Math.floor(Math.random() * archetypes.length);
  const base = archetypes[archetypeIndex];

  const fatigueBoost = Math.max(0, Math.min(18, (durationSeconds - 42) * 0.6));

  const scores: EmotionScores = {
    calm: slightVariation(base.scores.calm),
    joy: slightVariation(base.scores.joy),
    anxiety: slightVariation(base.scores.anxiety),
    fatigue: Math.min(88, slightVariation(base.scores.fatigue + fatigueBoost)),
    frustration: slightVariation(base.scores.frustration),
    hope: slightVariation(base.scores.hope),
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const factor = 310 / total;
  Object.keys(scores).forEach((k) => {
    (scores as any)[k] = Math.round((scores as any)[k] * factor);
  });

  const date = new Date().toISOString();

  return {
    id: `mock-${Date.now()}`,
    date,
    overall: base.overall,
    headline: base.headline,
    summary: base.summary,
    scores,
    valenceTimeline: base.valenceTimeline.map(p => ({
      ...p,
      v: Math.max(-0.6, Math.min(0.75, p.v + (Math.random() - 0.5) * 0.12)),
    })),
    advice: base.advice,
    bestPractices: base.bestPractices,
    primaryEmotion: base.primaryEmotion,
  };
}
