export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    rtl: false
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false
  }
];

export const defaultLanguage = languages[0];

// Language detection using browser's language
export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  return languages.find(lang => lang.code === browserLang) || defaultLanguage;
};

// Store language preference in localStorage
export const setLanguagePreference = (language: Language) => {
  localStorage.setItem('preferredLanguage', JSON.stringify(language));
};

export const getLanguagePreference = (): Language => {
  const saved = localStorage.getItem('preferredLanguage');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultLanguage;
    }
  }
  return defaultLanguage;
}; 