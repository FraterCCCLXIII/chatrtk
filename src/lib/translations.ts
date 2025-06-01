import { Language } from '@/core/i18n/languages';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    faceSelector: 'Select Face Theme',
    aboutRTK: 'About ChatRTK',
    projectDescription: 'A chat interface with an animated avatar that can speak and express emotions.',
    features: 'Features',
    feature1: 'Real-time speech synthesis',
    feature2: 'Facial expressions and animations',
    feature3: 'Customizable face themes',
    feature4: 'Multi-language support',
    credits: 'Credits',
    creditsText: 'Built with React, TypeScript, and Tailwind CSS.',
    settings: 'Settings',
    appMenu: 'App Menu',
  },
  ja: {
    faceSelector: '顔のテーマを選択',
    aboutRTK: 'ChatRTKについて',
    projectDescription: '話して感情を表現できるアニメーションアバター付きのチャットインターフェース。',
    features: '機能',
    feature1: 'リアルタイム音声合成',
    feature2: '表情とアニメーション',
    feature3: 'カスタマイズ可能な顔のテーマ',
    feature4: '多言語対応',
    credits: 'クレジット',
    creditsText: 'React、TypeScript、Tailwind CSSで構築。',
    settings: '設定',
    appMenu: 'アプリメニュー',
  },
  // Add more languages as needed
};

export const getTranslation = (key: string, language: Language): string => {
  const languageTranslations = translations[language.code] || translations.en;
  return languageTranslations[key] || key;
}; 