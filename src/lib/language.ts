export const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'tr': 'Turkish',
    'nl': 'Dutch',
    'pl': 'Polish',
    'sv': 'Swedish',
    'da': 'Danish',
    'fi': 'Finnish',
    'no': 'Norwegian',
    'cs': 'Czech',
    'el': 'Greek',
    'he': 'Hebrew',
    'hu': 'Hungarian',
    'id': 'Indonesian',
    'ms': 'Malay',
    'ro': 'Romanian',
    'sk': 'Slovak',
    'th': 'Thai',
    'uk': 'Ukrainian',
    'vi': 'Vietnamese'
  };
  
  return languages[code] || code;
};

export const getLanguageCode = (name: string): string => {
  const languageMap: Record<string, string> = {
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Portuguese': 'pt',
    'Russian': 'ru',
    'Chinese': 'zh',
    'Japanese': 'ja',
    'Korean': 'ko',
    'Arabic': 'ar',
    'Hindi': 'hi',
    'Turkish': 'tr',
    'Dutch': 'nl',
    'Polish': 'pl',
    'Swedish': 'sv',
    'Danish': 'da',
    'Finnish': 'fi',
    'Norwegian': 'no',
    'Czech': 'cs',
    'Greek': 'el',
    'Hebrew': 'he',
    'Hungarian': 'hu',
    'Indonesian': 'id',
    'Malay': 'ms',
    'Romanian': 'ro',
    'Slovak': 'sk',
    'Thai': 'th',
    'Ukrainian': 'uk',
    'Vietnamese': 'vi'
  };
  
  return languageMap[name] || name;
}; 