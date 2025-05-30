import { Language } from './languages';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    chatVerbosity: "Chat Verbosity",
    aiWillOnlyRespond: "AI will only respond to your messages",
    aiWillOccasionallyInitiate: "AI will occasionally initiate conversation",
    aiWillRegularlyEngage: "AI will regularly engage in conversation",
    aiWillBeVeryChatty: "AI will be very chatty and initiate frequent conversations",
    typeYourMessage: "Type your message...",
    listening: "Listening...",
    stopAI: "Stop AI",
    stopVoiceInput: "Stop Voice Input",
    startVoiceInput: "Start Voice Input",
    disableAlwaysListen: "Disable Always Listen",
    enableAlwaysListen: "Enable Always Listen",
    sendMessage: "Send message",
    aiIsResponding: "AI is responding...",
    changeLanguage: "Change Language",
    hideHead: "Hide Head",
    showHead: "Show Head",
    hideChat: "Hide Chat",
    showChat: "Show Chat",
    disableVoice: "Disable Voice",
    enableVoice: "Enable Voice",
    settings: "Settings",
    editFacialRig: "Edit Facial Rig",
    hideCaptions: "Hide Captions",
    showCaptions: "Show Captions",
    rtkArcade: "RTK Arcade",
    aboutRTK: "About RTK",
    changeFace: "Change Face"
  },
  ja: {
    chatVerbosity: "チャットの詳細度",
    aiWillOnlyRespond: "AIはメッセージにのみ応答します",
    aiWillOccasionallyInitiate: "AIは時々会話を開始します",
    aiWillRegularlyEngage: "AIは定期的に会話を行います",
    aiWillBeVeryChatty: "AIは非常に活発に会話を開始します",
    typeYourMessage: "メッセージを入力...",
    listening: "聞いています...",
    stopAI: "AIを停止",
    stopVoiceInput: "音声入力を停止",
    startVoiceInput: "音声入力を開始",
    disableAlwaysListen: "常時リスニングを無効化",
    enableAlwaysListen: "常時リスニングを有効化",
    sendMessage: "メッセージを送信",
    aiIsResponding: "AIが応答中...",
    changeLanguage: "言語を変更",
    hideHead: "ヘッドを非表示",
    showHead: "ヘッドを表示",
    hideChat: "チャットを非表示",
    showChat: "チャットを表示",
    disableVoice: "音声を無効化",
    enableVoice: "音声を有効化",
    settings: "設定",
    editFacialRig: "顔のリグを編集",
    hideCaptions: "字幕を非表示",
    showCaptions: "字幕を表示",
    rtkArcade: "RTKアーケード",
    aboutRTK: "RTKについて",
    changeFace: "顔を変更"
  },
  zh: {
    chatVerbosity: "聊天详细度",
    aiWillOnlyRespond: "AI只会回复您的消息",
    aiWillOccasionallyInitiate: "AI偶尔会发起对话",
    aiWillRegularlyEngage: "AI会定期进行对话",
    aiWillBeVeryChatty: "AI会非常活跃地发起对话",
    typeYourMessage: "输入消息...",
    listening: "正在聆听...",
    stopAI: "停止AI",
    stopVoiceInput: "停止语音输入",
    startVoiceInput: "开始语音输入",
    disableAlwaysListen: "禁用持续聆听",
    enableAlwaysListen: "启用持续聆听",
    sendMessage: "发送消息",
    aiIsResponding: "AI正在回复...",
    changeLanguage: "更改语言",
    hideHead: "隐藏头部",
    showHead: "显示头部",
    hideChat: "隐藏聊天",
    showChat: "显示聊天",
    disableVoice: "禁用语音",
    enableVoice: "启用语音",
    settings: "设置",
    editFacialRig: "编辑面部",
    hideCaptions: "隐藏字幕",
    showCaptions: "显示字幕",
    rtkArcade: "RTK游戏",
    aboutRTK: "关于RTK",
    changeFace: "更改面部"
  }
};

export const getTranslation = (key: string, language: Language): string => {
  return translations[language.code]?.[key] || translations.en[key] || key;
};

export default translations; 