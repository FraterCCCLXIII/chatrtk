import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Eye, EyeOff, MessageSquare, MessageSquareOff, MessageCircleMore, UserCircle2, Edit2, Github, Subtitles, Mic, MicOff, MessageSquarePlus, Radio, X, FileText, Gamepad2, Keyboard as KeyboardIcon, Send, Sparkles } from "lucide-react";
import { Smiley, Robot } from "@phosphor-icons/react";
import { PersonIcon } from "@radix-ui/react-icons";
import { 
  AnimatedMessage, 
  AnimatedCard, 
  AnimatedDiv, 
  MotionDiv, 
  MotionButton, 
  MotionTextarea,
  useFloatingAnimation,
  useFadeIn,
  useSlideIn,
  use3DRotation
} from '../animations';
import TalkingHead from '../TalkingHead/TalkingHead';
import ApiKey from '../settings/ApiKey';
import FaceSelector from '../face/FaceSelector';
import { FaceTheme } from '@/types/face';
import FacialRigEditor, { HeadShape, FaceRigConfig } from '../FacialRigEditor';
import './ChatTalkingHead.css';
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, TextMessage, CardMessage } from "@/lib/types";
import { parseAIResponse, detectExpression } from "@/lib/aiParser";
import { setupTalkify, getTalkifyPlayer } from '@/lib/talkify-setup';
import type { TtsPlayer } from '@/types/talkify';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RTK_ALPHA, managePersonality, getThoughtToExpress, ACTION_SYSTEM_PROMPT } from '@/lib/ai-personality';
import type { AIPersonality, Thought } from '@/lib/types';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import ProjectInfo from '../project/ProjectInfo';
import Games from '../games/Games';
import { detectBrowserLanguage, setLanguagePreference, Language } from '@/lib/languages';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import Hotkeys from '../hotkeys/Hotkeys';
import { useHotkeys } from '@/hooks/useHotkeys';
import SpecialEffects from '../Effects/SpecialEffects';
import Keyboard from '../Keyboard/Keyboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawers, LeftDrawerButton, RightDrawerButton } from '../Drawers/Drawers';
import { useActionRegistry, registerDefaultActions } from '@/lib/actionRegistry';
import { useAIActionHandler } from '@/hooks/useAIActionHandler';
import ResizeHandle from './ResizeHandle';
import { useApiSettings, type ApiSettings } from '@/hooks/useApiSettings';
import { initializeHotkeysState } from '@/lib/hotkeysRegistry';

type Expression = 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';

// Add TypeScript declarations for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const ChatTalkingHead: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking'>('happy');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [showHead, setShowHead] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [headHeight, setHeadHeight] = useState(300); // Initial height in pixels
  const { apiSettings, saveApiSettings } = useApiSettings();
  const [isFaceSelectorOpen, setIsFaceSelectorOpen] = useState(false);
  const [isFacialRigEditorOpen, setIsFacialRigEditorOpen] = useState(false);
  const [currentFaceTheme, setCurrentFaceTheme] = useState<FaceTheme>({
    id: 'default',
    name: 'Minty',
    description: 'The classic mint green face',
    previewColor: '#5ddbaf',
    screenColor: '#e2ffe5',
    faceColor: '#5daa77',
    tongueColor: '#ff7d9d',
    eyeColor: '#000000',
    strokeColor: '#333333',
    showStroke: true
  });
  const [currentHeadShape, setCurrentHeadShape] = useState<HeadShape>({
    id: 'rectangle',
    name: 'Rectangle',
    shape: 'rectangle',
  });
  const { toast } = useToast();
  const [showCaptions, setShowCaptions] = useState(false);
  const [captionText, setCaptionText] = useState('');
  const [captionOpacity, setCaptionOpacity] = useState(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [ttsPlayer, setTtsPlayer] = useState<TtsPlayer | null>(null);
  const [isTtsReady, setIsTtsReady] = useState(false);
  const [verbosityLevel, setVerbosityLevel] = useState(0); // 0-100 scale
  const [isVerbosityOpen, setIsVerbosityOpen] = useState(false);
  const verbosityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [personality, setPersonality] = useState<AIPersonality>(RTK_ALPHA);
  const [lastThoughtTime, setLastThoughtTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef('');
  const [isAlwaysListening, setIsAlwaysListening] = useState(false);
  const alwaysListenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastAIMessage, setLastAIMessage] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const aiSpeechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputFocusRef = useRef(false);
  const [isRecordingEnding, setIsRecordingEnding] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSpeechPill, setShowSpeechPill] = useState(false);
  const [isSpecialEffectsOpen, setIsSpecialEffectsOpen] = useState(false);
  const [animationIntensity, setAnimationIntensity] = useState(1);
  const [zoomIntensity, setZoomIntensity] = useState(1);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  // Add voice configuration state
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1.0,
    pitch: 1.7,
    volume: 1.0,
    voice: 'sv-SE' // Default to Swedish (Alva)
  });

  // Initialize action registry
  useEffect(() => {
    registerDefaultActions();
  }, []);

  const { processAIResponse } = useAIActionHandler();

  // Add this near the top of the component, after other state declarations
  useEffect(() => {
    document.documentElement.style.setProperty('--animation-intensity', animationIntensity.toString());
    document.documentElement.style.setProperty('--zoom-intensity', zoomIntensity.toString());
    document.documentElement.setAttribute('data-animation-intensity', animationIntensity.toString());
    
    // Add UI animation classes to elements
    const uiElements = document.querySelectorAll('.control-button, .chat-message, .speech-pill, .input-container, .chat-input, .send-button, .modal-content, .card');
    uiElements.forEach(element => {
      element.classList.add('ui-animate-springy');
    });
  }, [animationIntensity, zoomIntensity]);

  // Mock AI response for testing or when API key isn't configured
  const mockGenerateResponse = useCallback((userInput: string): TextMessage => {
    const responses = [
      "I understand what you're saying. Let me help you with that.",
      "That's an interesting point! Here's what I think about it.",
      "I'm here to assist you with that request.",
      "Let me process that and get back to you with a helpful response.",
      "I'm analyzing your request and will provide a suitable response.",
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: `ai-${Date.now()}`,
      type: 'text',
      text: randomResponse,
      isUser: false,
      expression: 'neutral'
    };
  }, []);

  // Stop AI speech
  const stopAISpeech = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsAISpeaking(false);
  }, []);

  // Generate AI response from API
  const generateAIResponseFromAPI = useCallback(async (userInput: string) => {
    let apiUrl: string;
    let requestBody: any;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // System prompt that includes card format instructions and action system
    const systemPrompt = `${RTK_ALPHA}

${ACTION_SYSTEM_PROMPT}

You are a friendly, helpful AI assistant with a personality. You should:
1. Be concise but informative
2. Show personality through your responses
3. Use appropriate expressions based on the context
4. Maintain a consistent tone
5. Be helpful and proactive
6. Use the available actions to help users control the interface

When asked to perform actions, you MUST include the action in your response using this exact format:
[ACTION]{"type": "ACTION_TYPE", "params": {"paramName": "value"}}[/ACTION]

Available action types:
- OPEN_MODAL: Opens a modal (params: modalId: 'specialEffects' | 'settings' | 'apiSettings' | 'faceSelector' | 'facialRigEditor' | 'games' | 'projectInfo')
- CLOSE_MODAL: Closes a modal (params: modalId: 'current' or specific modal ID)
- TOGGLE_FEATURE: Toggles a feature (params: featureId: 'voice' | 'captions' | 'head' | 'chat' | 'alwaysListen', value?: boolean)
- CHANGE_SETTING: Changes a setting (params: settingId: 'animationIntensity' | 'zoomLevel' | 'voiceRate' | 'voicePitch' | 'voiceVolume', value: number)
- TRIGGER_EFFECT: Triggers an effect (params: effectId: 'pencil' | 'pixelate' | 'scanline' | 'dot', value?: object)

Example responses with actions:
User: "Open the special effects modal"
You: "I'll open the special effects modal for you." [ACTION]{"type": "OPEN_MODAL", "params": {"modalId": "specialEffects"}}[/ACTION]

User: "Turn on the pencil effect"
You: "I'll enable the pencil effect for you." [ACTION]{"type": "TRIGGER_EFFECT", "params": {"effectId": "pencil", "value": {"enabled": true}}}[/ACTION]

User: "Make the head bigger"
You: "I'll increase the head size for you." [ACTION]{"type": "CHANGE_SETTING", "params": {"settingId": "zoomLevel", "value": 2}}[/ACTION]

Your responses should be natural and conversational, while still being efficient and helpful.`;

    // Convert messages to API format
    const apiMessages = messages.map(msg => {
      if (msg.type === 'text') {
        return {
          role: msg.isUser ? "user" : "assistant",
          content: msg.text
        };
      } else if (msg.type === 'card') {
        // For card messages, convert to a text representation for the API
        return {
          role: "assistant",
          content: `I sent a card titled "${msg.title}" with content: "${msg.content}"`
        };
      }
      return null;
    }).filter(Boolean);

    switch (apiSettings.provider) {
      case 'openai':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiSettings.apiKey}`;
        requestBody = {
          model: apiSettings.model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...apiMessages,
            {
              role: "user",
              content: userInput
            }
          ],
          max_tokens: 500
        };
        break;

      case 'claude':
        apiUrl = 'https://api.anthropic.com/v1/messages';
        headers['x-api-key'] = apiSettings.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        requestBody = {
          model: apiSettings.model,
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: `${systemPrompt}\n\nRespond to: ${userInput}`
            }
          ]
        };
        break;
        
      case 'deepseek':
        apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${apiSettings.apiKey}`;
        requestBody = {
          model: apiSettings.model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...apiMessages,
            {
              role: "user",
              content: userInput
            }
          ],
          max_tokens: 500
        };
        break;
        
      case 'local':
        apiUrl = apiSettings.endpoint || 'http://localhost:1234/v1/chat/completions';
        requestBody = {
          model: apiSettings.model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...apiMessages,
            {
              role: "user",
              content: userInput
            }
          ],
          max_tokens: 500
        };
        break;
        
      default:
        throw new Error('Invalid API provider');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    let content;
    switch (apiSettings.provider) {
      case 'claude':
        content = data.content?.[0]?.text || "I'm not sure how to respond to that.";
        break;
      case 'openai':
      case 'deepseek':
      case 'local':
      default:
        content = data.choices?.[0]?.message?.content || "I'm not sure how to respond to that.";
        break;
    }
    
    // Process the AI response to extract any actions
    const processedResponse = await processAIResponse(content);
    
    // Create the AI message
    const aiMessage: TextMessage = {
      id: `ai-${Date.now()}`,
      type: 'text',
      text: processedResponse,
      isUser: false,
      expression: detectExpression(processedResponse)
    };

    return aiMessage;
  }, [apiSettings, messages, processAIResponse, detectExpression]);

  // Generate AI response using the configured API
  const generateAIResponse = useCallback(async (userInput: string) => {
    // Stop any ongoing AI speech
    stopAISpeech();

    // Set loading state for AI response
    setIsAIResponding(true);

    try {
      // Check if API key is configured - if not, use simulator without showing modal
      if (!apiSettings.apiKey) {
        // Add a small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockGenerateResponse(userInput);
      }

      // Use the real API if key is configured
      return await generateAIResponseFromAPI(userInput);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Using simulator mode instead.",
        variant: "destructive",
      });
      
      // Use simulator as fallback
      return mockGenerateResponse(userInput);
    } finally {
      setIsAIResponding(false);
    }
  }, [apiSettings.apiKey, stopAISpeech, toast, generateAIResponseFromAPI, mockGenerateResponse]);

  // Handle sending messages
  const handleSendMessage = useCallback(() => {
    if (inputText.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        type: 'text' as const,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      generateAIResponse(inputText).then(response => {
        setMessages(prev => [...prev, response]);
      });
    }
  }, [inputText, generateAIResponse]);

  // Register hotkeys
  useHotkeys('toggleHead', () => setShowHead(!showHead));
  useHotkeys('toggleChat', () => setShowChat(!showChat));
  useHotkeys('openFaceSelector', () => setIsFaceSelectorOpen(true));
  useHotkeys('openFacialRigEditor', () => setIsFacialRigEditorOpen(true));
  useHotkeys('openSettings', () => setIsModalOpen(true));
  useHotkeys('openGames', () => setIsGamesOpen(true));
  useHotkeys('openProjectInfo', () => setIsProjectInfoOpen(true));
  useHotkeys('toggleVoice', () => toggleVoice());
  useHotkeys('toggleMicrophone', () => toggleVoiceInput());
  useHotkeys('toggleAlwaysListen', () => toggleAlwaysListening());
  useHotkeys('showHotkeys', () => setIsHotkeysOpen(true));
  useHotkeys('closeModal', () => {
    setIsHotkeysOpen(false);
    setIsFaceSelectorOpen(false);
    setIsFacialRigEditorOpen(false);
    setIsModalOpen(false);
    setIsGamesOpen(false);
    setIsProjectInfoOpen(false);
    setIsSpecialEffectsOpen(false);
  });

  // Handle keyboard events for chat input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check if the active element is an input or textarea
    const activeElement = document.activeElement;
    const isInputElement = activeElement instanceof HTMLInputElement || 
                         activeElement instanceof HTMLTextAreaElement ||
                         activeElement?.getAttribute('contenteditable') === 'true';

    // If we're in an input element, don't handle hotkeys
    if (isInputElement) {
      return;
    }

    // Handle chat-specific hotkeys
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Load API settings, face theme, and head shape from localStorage on initial render
  useEffect(() => {
    // Remove the API settings loading since it's now handled by the hook
    const savedFaceTheme = localStorage.getItem('faceTheme');
    if (savedFaceTheme) {
      const theme = JSON.parse(savedFaceTheme);
      setCurrentFaceTheme(theme);
      
      // Set initial background color
      document.body.style.backgroundColor = theme.screenColor;
    } else {
      // Set default background color
      document.body.style.backgroundColor = currentFaceTheme.screenColor;
    }
    
    const savedHeadShape = localStorage.getItem('headShape');
    if (savedHeadShape) {
      setCurrentHeadShape(JSON.parse(savedHeadShape));
    }
  }, []);

  // Initialize Talkify
  useEffect(() => {
    setupTalkify().then(() => {
      const player = getTalkifyPlayer();
      // Set initial voice settings
      player.voice = 'sv-SE'; // Alva
      player.rate = 1.0;
      player.pitch = 1.7;
      player.volume = 1.0;
      setTtsPlayer(player);
      setIsTtsReady(true);
    }).catch(error => {
      console.error('Failed to initialize Talkify:', error);
      toast({
        title: "TTS Error",
        description: "Failed to initialize text-to-speech. Please refresh the page.",
        variant: "destructive",
      });
    });
  }, []);

  // Update the speech recognition error handler
  const handleSpeechError = (event: SpeechRecognitionError) => {
    console.error('Speech recognition error:', event.error);
    
    // Don't show error toast for expected errors
    if (event.error === 'aborted' || event.error === 'no-speech') {
      return;
    }
    
    toast({
      title: "Speech Recognition Error",
      description: event.error,
      variant: "destructive",
    });
    
    setIsListening(false);
    setShowSpeechPill(false);
    setIsRecordingEnding(false);
    setIsSending(false);
  };

  // Update the speech recognition result handler
  const handleSpeechResult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // Always update the displayed transcript, even if it's interim
    const currentTranscript = interimTranscript || finalTranscript;
    if (currentTranscript) {
      setTranscript(currentTranscript);
      setShowSpeechPill(true);
    }

    // Check for stop words in interim transcript
    const lowerTranscript = currentTranscript.toLowerCase();
    if (lowerTranscript.includes('stop') || lowerTranscript.includes('quiet')) {
      stopAllAI();
      return;
    }
    
    // If we have any transcript (even interim), stop AI speech
    if (currentTranscript) {
      stopAISpeech();
    }
    
    // Store the final transcript
    if (finalTranscript) {
      finalTranscriptRef.current = finalTranscript;
      // Send message immediately when we get a final transcript
      const messageToSend = finalTranscript.trim();
      
      // Check if this is likely AI speech being picked up
      if (messageToSend && !isAISpeaking) {
        // Simple similarity check - if the transcript is very similar to the last AI message,
        // it's probably the AI's speech being picked up
        const similarity = calculateSimilarity(messageToSend, lastAIMessage);
        if (similarity < 0.8) { // Only process if similarity is less than 80%
          // Show recording ending animation first
          setIsRecordingEnding(true);
          
          // Add user message using functional update
          const userMessage: TextMessage = {
            id: `user-${Date.now()}`,
            type: 'text',
            text: messageToSend,
            isUser: true
          };
          
          // Clear the input and transcript
          setInputText('');
          setTranscript('');
          finalTranscriptRef.current = '';
          
          // After a short delay, show sending animation
          setTimeout(() => {
            setIsRecordingEnding(false);
            setIsSending(true);
            
            // Generate AI response
            setIsAIResponding(true);
            generateAIResponse(messageToSend)
              .then(response => {
                setMessages(prev => [...prev, userMessage, response]);
              })
              .catch(error => {
                console.error('Error generating response:', error);
                toast({
                  title: "Error",
                  description: "Failed to get response. Using simulator mode instead.",
                  variant: "destructive",
                });
                const response = mockGenerateResponse(messageToSend);
                setMessages(prev => [...prev, userMessage, response]);
              })
              .finally(() => {
                setIsAIResponding(false);
                // Keep the sending animation visible for a moment
                setTimeout(() => {
                  setIsSending(false);
                  setShowSpeechPill(false);
                }, 1000);
              });
          }, 500);
        }
      }
    }
  };

  // Update the speech recognition initialization
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = isAlwaysListening;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = currentLanguage.code;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        finalTranscriptRef.current = '';
        setIsListening(true);
        setIsRecordingEnding(false);
        setIsSending(false);
        setShowSpeechPill(true);
        stopAISpeech();
      };

      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // If we have a final transcript, show the sending animation
        if (finalTranscriptRef.current) {
          setIsRecordingEnding(true);
          setTimeout(() => {
            setIsRecordingEnding(false);
            setIsSending(true);
            
            // Keep the speech pill visible during sending
            setTimeout(() => {
              setIsSending(false);
              setShowSpeechPill(false);
            }, 1000);
          }, 500);
        } else {
          // If no final transcript, just hide the pill
          setShowSpeechPill(false);
        }
        
        // If in always listening mode, restart recognition after a short delay
        if (isAlwaysListening) {
          if (alwaysListenTimeoutRef.current) {
            clearTimeout(alwaysListenTimeoutRef.current);
          }
          alwaysListenTimeoutRef.current = setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (error) {
              console.error('Error restarting speech recognition:', error);
            }
          }, 1000);
        }
      };
    }

    return () => {
      if (alwaysListenTimeoutRef.current) {
        clearTimeout(alwaysListenTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isAlwaysListening, isAISpeaking, lastAIMessage, currentLanguage.code]);

  // Update the useEffect that handles speaking
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.isUser || isSpeaking || !isVoiceEnabled) return;
    
    // Only animate for text messages
    if (lastMessage.type === 'text') {
      setCurrentSpeechText(lastMessage.text);
      setCurrentExpression(lastMessage.expression || 'neutral');
      setIsSpeaking(true);

      // Speak the text using Talkify
      speakText(lastMessage.text).finally(() => {
        setIsSpeaking(false);
      });
    }
  }, [messages, isVoiceEnabled, voiceSettings]);

  // Update caption text when AI is speaking
  useEffect(() => {
    if (isSpeaking && showCaptions) {
      setCaptionText(currentSpeechText);
      setCaptionOpacity(1);
      
      // Fade out after 2 seconds
      const fadeTimer = setTimeout(() => {
        setCaptionOpacity(0);
      }, 2000);

      return () => clearTimeout(fadeTimer);
    }
  }, [isSpeaking, currentSpeechText, showCaptions]);

  // Save API settings
  const handleSaveSettings = (provider: string, apiKey: string, model: string, endpoint?: string) => {
    saveApiSettings(provider, apiKey, model, endpoint);
  };
  
  // Save face theme
  const handleSelectFace = (faceTheme: FaceTheme) => {
    setCurrentFaceTheme(faceTheme);
    localStorage.setItem('faceTheme', JSON.stringify(faceTheme));
    
    // Update the talking head container background color
    const container = document.querySelector('.talking-head-container');
    if (container) {
      (container as HTMLElement).style.backgroundColor = faceTheme.previewColor;
    }
    
    // Dispatch a custom event to notify theme change
    window.dispatchEvent(new Event('storage'));
    
    // Update document body background color
    document.body.style.backgroundColor = faceTheme.previewColor;
    
    // Update CSS variable for background color
    document.documentElement.style.setProperty('--body-bg-color', faceTheme.previewColor);
  };
  
  // Save facial rig changes
  const handleSaveFacialRigChanges = (faceTheme: FaceTheme, headShape: HeadShape, rigConfig?: Partial<FaceRigConfig>) => {
    setCurrentFaceTheme(faceTheme);
    setCurrentHeadShape(headShape);
    
    // Save to localStorage
    localStorage.setItem('faceTheme', JSON.stringify(faceTheme));
    localStorage.setItem('headShape', JSON.stringify(headShape));
    
    // Save rig configuration if provided
    if (rigConfig) {
      localStorage.setItem('faceRigConfig', JSON.stringify(rigConfig));
    }
    
    // Update the talking head container background color
    const container = document.querySelector('.talking-head-container');
    if (container) {
      (container as HTMLElement).style.backgroundColor = faceTheme.previewColor;
    }
    
    // Dispatch a custom event to notify theme change
    window.dispatchEvent(new Event('storage'));
    
    // Update document body background color
    document.body.style.backgroundColor = faceTheme.previewColor;
    
    toast({
      title: "Facial Rig Updated",
      description: "Your customizations have been applied.",
    });
  };

  // Handle card action
  const handleCardAction = (actionString: string) => {
    const [command, param] = actionString.split(':');
    
    switch (command) {
      case 'openModal':
        useActionRegistry.getState().execute('OPEN_MODAL', { modalId: param });
        break;
        
      case 'runFunction':
        if (param === 'demo') {
          // Add a demo card as a response
          const demoCard: CardMessage = {
            id: `demo-card-${Date.now()}`,
            type: 'card',
            isUser: false,
            title: 'Demo Card',
            content: 'This is a demo card created by the action handler.',
            actions: [
              { label: 'Close', action: 'runFunction:dismiss' }
            ]
          };
          setMessages(prev => [...prev, demoCard]);
        } else if (param === 'dismiss') {
          useActionRegistry.getState().execute('CLOSE_MODAL', { modalId: 'current' });
        }
        break;
        
      default:
        console.warn('Unknown action:', actionString);
        toast({
          title: "Unknown Action",
          description: `The action "${actionString}" is not recognized.`,
          variant: "destructive",
        });
    }
  };

  // Toggle visibility of components
  const toggleHead = () => setShowHead(!showHead);
  const toggleChat = () => setShowChat(!showChat);

  // Set CSS variable for head height
  useEffect(() => {
    document.documentElement.style.setProperty('--head-height', `${headHeight}px`);
  }, [headHeight]);

  // Define message bubble colors based on theme
  const userMessageStyle = {
    backgroundColor: `${currentFaceTheme.previewColor}aa`, // Shade of the main background with 67% opacity
    borderRadius: '12px 12px 2px 12px',
    color: '#000000', // Black text for user messages
  };
  
  const aiMessageStyle = {
    backgroundColor: `${currentFaceTheme.screenColor}cc`, // 80% opacity
    borderRadius: '12px 12px 12px 2px',
  };

  // Animation for the app title
  const titleAnimation = useFadeIn();
  const floatingAnimation = useFloatingAnimation();

  // Add scroll to bottom effect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add voice toggle handler
  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    // If voice is being disabled, stop any ongoing speech
    if (isVoiceEnabled && isSpeaking) {
      setIsSpeaking(false);
    }
  };

  // Add verbosity effect with personality-driven thoughts
  useEffect(() => {
    if (verbosityLevel > 0 && isVoiceEnabled) {
      // Clear any existing timer
      if (verbosityTimerRef.current) {
        clearTimeout(verbosityTimerRef.current);
      }

      // Calculate interval based on verbosity level (inverse relationship)
      const interval = Math.max(1000, 10000 - (verbosityLevel * 90)); // 1-10 seconds

      const generatePersonalityMessage = () => {
        // Get recent messages for context
        const recentMessages = messages.slice(-5).map(m => 
          m.type === 'text' ? m.text : m.type === 'card' ? m.content : ''
        ).filter(Boolean);

        // Update personality with current context
        const updatedPersonality = managePersonality(
          personality,
          recentMessages.join(' '),
          recentMessages
        );
        setPersonality(updatedPersonality);

        // Get a thought to express
        const thought = getThoughtToExpress(updatedPersonality);
        
        if (thought && Date.now() - lastThoughtTime > 5000) { // Minimum 5 seconds between thoughts
          const newMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            type: 'text',
            text: thought.content,
            isUser: false,
            expression: detectExpression(thought.content)
          };

          setMessages(prev => [...prev, newMessage]);
          setLastThoughtTime(Date.now());
        }
      };

      // Set up the timer for personality-driven messages
      verbosityTimerRef.current = setInterval(generatePersonalityMessage, interval);

      return () => {
        if (verbosityTimerRef.current) {
          clearTimeout(verbosityTimerRef.current);
        }
      };
    } else if (verbosityTimerRef.current) {
      clearTimeout(verbosityTimerRef.current);
    }
  }, [verbosityLevel, isVoiceEnabled, messages, personality, lastThoughtTime]);

  // Update personality when receiving user messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isUser && lastMessage.type === 'text') {
      const updatedPersonality = managePersonality(
        personality,
        lastMessage.text,
        messages.slice(-5).map(m => m.type === 'text' ? m.text : '')
      );
      setPersonality(updatedPersonality);
    }
  }, [messages]);

  // Helper function to calculate string similarity
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (!str1 || !str2) return 0;
    
    // Convert to lowercase and remove punctuation
    const cleanStr1 = str1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const cleanStr2 = str2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    
    // If strings are identical, return 1
    if (cleanStr1 === cleanStr2) return 1;
    
    // Calculate Levenshtein distance
    const matrix = Array(cleanStr1.length + 1).fill(null).map(() => 
      Array(cleanStr2.length + 1).fill(null)
    );
    
    for (let i = 0; i <= cleanStr1.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= cleanStr2.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= cleanStr1.length; i++) {
      for (let j = 1; j <= cleanStr2.length; j++) {
        const cost = cleanStr1[i - 1] === cleanStr2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const distance = matrix[cleanStr1.length][cleanStr2.length];
    const maxLength = Math.max(cleanStr1.length, cleanStr2.length);
    
    // Return similarity score (1 - normalized distance)
    return 1 - (distance / maxLength);
  };

  // Add function to stop all AI activity
  const stopAllAI = () => {
    stopAISpeech();
    setIsAIResponding(false);
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // Update speech recognition language
    if (recognitionRef.current) {
      recognitionRef.current.lang = language.code;
    }
    // Update TTS voice if available
    if (ttsPlayer) {
      ttsPlayer.voice = language.code;
    }
  };

  // Add voice settings update function
  const updateVoiceSettings = (newSettings: Partial<typeof voiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Update speakText function
  const speakText = async (text: string) => {
    if (!ttsPlayer || !isTtsReady) {
      console.error('TTS not ready');
      return;
    }

    try {
      // Set AI speaking state
      setIsAISpeaking(true);
      setLastAIMessage(text);

      // Configure voice settings
      ttsPlayer.rate = voiceSettings.rate;
      ttsPlayer.pitch = voiceSettings.pitch;
      ttsPlayer.volume = voiceSettings.volume;
      ttsPlayer.voice = voiceSettings.voice;

      // Play the text
      await ttsPlayer.playText(text);
      
      // After TTS finishes, send the message
      if (text.trim()) {
        handleSendMessage();
      }
    } catch (error) {
      console.error('Error speaking text:', error);
      toast({
        title: "TTS Error",
        description: "Failed to speak text. Please check your browser's audio settings.",
        variant: "destructive",
      });
    } finally {
      // Add a small delay before allowing new speech input
      if (aiSpeechTimeoutRef.current) {
        clearTimeout(aiSpeechTimeoutRef.current);
      }
      aiSpeechTimeoutRef.current = setTimeout(() => {
        setIsAISpeaking(false);
      }, 1000);
    }
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Available",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    // If always listening is active, disable it first
    if (isAlwaysListening) {
      setIsAlwaysListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (alwaysListenTimeoutRef.current) {
        clearTimeout(alwaysListenTimeoutRef.current);
      }
    }

    if (isListening) {
      console.log('Stopping speech recognition');
      setIsRecordingEnding(true);
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
      finalTranscriptRef.current = '';
    } else {
      console.log('Starting speech recognition');
      try {
        recognitionRef.current.start();
        setShowSpeechPill(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Error Starting Voice Input",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive",
        });
      }
    }
  };

  // Toggle always listening mode
  const toggleAlwaysListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Input Not Available",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const newMode = !isAlwaysListening;
    setIsAlwaysListening(newMode);

    // If currently in manual recording mode, stop it
    if (isListening) {
      setIsRecordingEnding(true);
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
      finalTranscriptRef.current = '';
    }

    if (newMode) {
      // Start listening
      try {
        recognitionRef.current.continuous = true;
        recognitionRef.current.start();
        setShowSpeechPill(true);
        toast({
          title: "Always Listen Mode",
          description: "Voice recognition is now always active. Speak naturally to send messages.",
        });
      } catch (error) {
        console.error('Error starting always listen mode:', error);
        toast({
          title: "Error Starting Voice Input",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive",
        });
        setIsAlwaysListening(false);
      }
    } else {
      // Stop listening
      recognitionRef.current.continuous = false;
      recognitionRef.current.stop();
      if (alwaysListenTimeoutRef.current) {
        clearTimeout(alwaysListenTimeoutRef.current);
      }
      setShowSpeechPill(false);
      toast({
        title: "Always Listen Mode",
        description: "Voice recognition is now manual. Click the mic button to speak.",
      });
    }
  };

  // Add event listeners for action registry events
  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      const modalId = event.detail;
      switch (modalId) {
        case 'specialEffects':
          setIsSpecialEffectsOpen(true);
          break;
        case 'settings':
          setIsModalOpen(true);
          break;
        case 'apiSettings':
          setIsModalOpen(true);
          break;
        case 'faceSelector':
          setIsFaceSelectorOpen(true);
          break;
        case 'facialRigEditor':
          setIsFacialRigEditorOpen(true);
          break;
        case 'games':
          setIsGamesOpen(true);
          break;
        case 'projectInfo':
          setIsProjectInfoOpen(true);
          break;
      }
    };

    const handleCloseModal = () => {
      setIsSpecialEffectsOpen(false);
      setIsModalOpen(false);
      setIsFaceSelectorOpen(false);
      setIsFacialRigEditorOpen(false);
      setIsGamesOpen(false);
      setIsProjectInfoOpen(false);
    };

    const handleToggleFeature = (event: CustomEvent) => {
      const { feature, value } = event.detail;
      switch (feature) {
        case 'voice':
          setIsVoiceEnabled(value ?? !isVoiceEnabled);
          break;
        case 'captions':
          setShowCaptions(value ?? !showCaptions);
          break;
        case 'head':
          setShowHead(value ?? !showHead);
          break;
        case 'chat':
          setShowChat(value ?? !showChat);
          break;
        case 'alwaysListen':
          setIsAlwaysListening(value ?? !isAlwaysListening);
          break;
      }
    };

    const handleChangeSetting = (event: CustomEvent) => {
      const { setting, value } = event.detail;
      switch (setting) {
        case 'animationIntensity':
          setAnimationIntensity(value);
          break;
        case 'zoomLevel':
          setZoomIntensity(value);
          break;
        case 'voiceRate':
          updateVoiceSettings({ rate: value });
          break;
        case 'voicePitch':
          updateVoiceSettings({ pitch: value });
          break;
        case 'voiceVolume':
          updateVoiceSettings({ volume: value });
          break;
      }
    };

    const handleTriggerEffect = (event: CustomEvent) => {
      const { effect, value } = event.detail;
      // Handle effect triggers here
      // This will need to be connected to your effects state management
      console.log('Effect triggered:', effect, value);
    };

    // Add event listeners
    document.addEventListener('openModal', handleOpenModal as EventListener);
    document.addEventListener('closeModal', handleCloseModal);
    document.addEventListener('toggleFeature', handleToggleFeature as EventListener);
    document.addEventListener('changeSetting', handleChangeSetting as EventListener);
    document.addEventListener('triggerEffect', handleTriggerEffect as EventListener);

    // Cleanup
    return () => {
      document.removeEventListener('openModal', handleOpenModal as EventListener);
      document.removeEventListener('closeModal', handleCloseModal);
      document.removeEventListener('toggleFeature', handleToggleFeature as EventListener);
      document.removeEventListener('changeSetting', handleChangeSetting as EventListener);
      document.removeEventListener('triggerEffect', handleTriggerEffect as EventListener);
    };
  }, [isVoiceEnabled, showCaptions, showHead, showChat, isAlwaysListening]);

  // Initialize hotkeys state
  useEffect(() => {
    initializeHotkeysState();
  }, []);

  return (
    <TooltipProvider>
      <Drawers
        isLeftOpen={isLeftDrawerOpen}
        isRightOpen={isRightDrawerOpen}
        onLeftOpenChange={setIsLeftDrawerOpen}
        onRightOpenChange={setIsRightDrawerOpen}
        showHead={showHead}
        showChat={showChat}
        isVoiceEnabled={isVoiceEnabled}
        showCaptions={showCaptions}
        onToggleHead={toggleHead}
        onToggleChat={toggleChat}
        onToggleVoice={toggleVoice}
        onToggleCaptions={() => setShowCaptions(!showCaptions)}
        onOpenFaceSelector={() => setIsFaceSelectorOpen(true)}
        onOpenFacialRigEditor={() => setIsFacialRigEditorOpen(true)}
        onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
        onOpenGames={() => setIsGamesOpen(true)}
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
        onOpenSpecialEffects={() => setIsSpecialEffectsOpen(true)}
        onOpenApiSettings={() => setIsModalOpen(true)}
      >
        <div className="chat-talking-head">
          <AnimatePresence>
            {isLoading && (
              <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
            )}
          </AnimatePresence>
          
          <MotionDiv 
            className="app-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <LeftDrawerButton onClick={() => setIsLeftDrawerOpen(true)} />
            <svg xmlns="http://www.w3.org/2000/svg" className="rtk-logo" width="24" height="24" viewBox="0 0 173.35 75.11">
              <path d="M86.67 0 0 37.81l86.68 37.3 86.67-37.8L86.67 0zm76.62 37.33L86.67 70.75 10.06 37.78 86.68 4.36l76.61 32.97z" />
              <path d="M128.79 31.06v13.47l10-4.36v4.64l-14.25 6.21V24.57l14.25 6.21v4.64l-10-4.36zm-20-8.72v13.34h7.5v4.25h-7.5v13.33l10-4.36v4.63l-14.25 6.21V15.85l14.25 6.21v4.64l-10-4.36zm-10-9.01v4.65l-10-4.37v53.01l-2.12.92-2.13-.92V13.61l-10 4.36v-4.64l12.13-5.29 12.12 5.29zM65.83 35.05l2.96-1.3V15.84l-14.25 6.22v31.47l4.25 1.85V38.11l3.12-1.37 7.7 23.37 2.84 1.23h.29v.14l2.1.91-9.01-27.34zm-1.29-4.09-5.75 2.51v-8.63l5.75-2.51v8.63zm-30-.18v14.03l4.25 1.85v-4.59h5.75v7.1l4.25 1.85V24.57l-14.25 6.21zm10 7.04h-5.75v-4.26l5.75-2.51v6.77z" />
            </svg>
            ChatRTK
            <a 
              href="https://github.com/paulbloch/chatrtk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 hover:text-primary transition-colors"
              title="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </MotionDiv>

          <MotionDiv 
            className="model-version"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            style={{ color: '#000000' }}
          >
            <span className="text-lg">神字</span> RTK-ALPHA
          </MotionDiv>

          <div className="controls-container">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
            <RightDrawerButton onClick={() => setIsRightDrawerOpen(true)} />
          </div>
          
          {showHead && (
            <>
              <div 
                className="talking-head-container" 
                style={{ 
                  height: `${headHeight}px`,
                  backgroundColor: currentFaceTheme.previewColor
                }}
              >
                <TalkingHead 
                  text={currentSpeechText}
                  speaking={isSpeaking}
                  expression={currentExpression}
                  theme={currentFaceTheme}
                  headShape={currentHeadShape}
                />
                {showCaptions && (
                  <div 
                    className="captions-container"
                    style={{
                      opacity: captionOpacity,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  >
                    <div className="captions-text">
                      {captionText.split('\n').slice(0, 2).join('\n')}
                    </div>
                  </div>
                )}
              </div>
              
              <ResizeHandle 
                onResize={setHeadHeight}
                minHeight={200}
                maxHeight={600}
              />
            </>
          )}
          
          {showChat && (
            <div className="chat-container">
              <ScrollArea className="chat-messages">
                {messages.map((message, index) => (
                  message.type === 'card' ? (
                    <AnimatedCard 
                      key={message.id || index}
                      delay={index * 0.1}
                    >
                      <Card className="w-full max-w-[600px] mx-auto">
                        <CardHeader>
                          <CardTitle>{message.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{message.content}</p>
                        </CardContent>
                        {message.actions && message.actions.length > 0 && (
                          <CardFooter className="flex gap-2">
                            {message.actions.map((action, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                onClick={() => handleCardAction(action.action)}
                                className="hover:scale-105 active:scale-95 transition-transform"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </CardFooter>
                        )}
                      </Card>
                    </AnimatedCard>
                  ) : (
                    <AnimatedMessage 
                      key={message.id || index}
                      isUser={message.isUser}
                      delay={index * 0.05}
                    >
                      <div
                        id={`message-${index}`}
                        className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'} ui-animate-springy`}
                        style={message.isUser ? userMessageStyle : aiMessageStyle}
                      >
                        {message.text}
                      </div>
                    </AnimatedMessage>
                  )
                ))}
                {isAIResponding && (
                  <div id="loading-message" className="chat-message ai-message" style={aiMessageStyle}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentFaceTheme.previewColor }}></div>
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentFaceTheme.previewColor, animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentFaceTheme.previewColor, animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
              </ScrollArea>
            </div>
          )}
          
          <MotionDiv 
            className="input-container ui-animate-springy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="chat-input-wrapper">
              {(isAIResponding || isAISpeaking) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="stop-button"
                      onClick={stopAllAI}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {getTranslation('stopAI', currentLanguage)} (Space)
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVoiceInput}
                    className={`audio-control-button ${isListening ? 'active' : ''}`}
                  >
                    {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isListening ? getTranslation('stopVoiceInput', currentLanguage) : getTranslation('startVoiceInput', currentLanguage)} [m]
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAlwaysListening}
                    className={`audio-control-button ${isAlwaysListening ? 'active' : ''}`}
                  >
                    <Radio className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAlwaysListening ? getTranslation('disableAlwaysListen', currentLanguage) : getTranslation('enableAlwaysListen', currentLanguage)} [a]
                </TooltipContent>
              </Tooltip>

              <MotionTextarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? getTranslation('listening', currentLanguage) : getTranslation('typeYourMessage', currentLanguage)}
                className="chat-input translate-y-[2px]"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isAIResponding}
                    className="send-button"
                  >
                    {isAIResponding ? (
                      <div className="loading-spinner" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {getTranslation('sendMessage', currentLanguage)} [Enter]
                </TooltipContent>
              </Tooltip>
            </div>
            {(showSpeechPill || isListening) && (
              <div className={`speech-pill ${showSpeechPill ? 'visible' : ''}`}>
                <div className="recording-dot" />
                <span>{transcript || getTranslation('listening', currentLanguage)}</span>
                {isRecordingEnding ? (
                  <div className="recording-spinner" />
                ) : isSending ? (
                  <Send className="h-4 w-4 animate-paper-airplane" />
                ) : (
                  <button 
                    className="cancel-recording"
                    onClick={() => {
                      if (recognitionRef.current) {
                        recognitionRef.current.stop();
                      }
                      setIsListening(false);
                      setTranscript('');
                      finalTranscriptRef.current = '';
                      setShowSpeechPill(false);
                    }}
                    title={getTranslation('cancelRecording', currentLanguage)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </MotionDiv>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsKeyboardOpen(true)}
            className="keyboard-trigger"
            data-tooltip={getTranslation('keyboard', currentLanguage)}
          >
            <KeyboardIcon className="h-5 w-5" />
          </Button>

          <ApiKey
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            apiKey={apiSettings.apiKey}
            onApiKeyChange={(key) => {
              // Update the API key in the settings
              saveApiSettings(
                apiSettings.provider,
                key,
                apiSettings.model,
                apiSettings.endpoint
              );
            }}
            onSave={() => {
              // Save the current API settings
              saveApiSettings(
                apiSettings.provider,
                apiSettings.apiKey,
                apiSettings.model,
                apiSettings.endpoint
              );
              setIsModalOpen(false);
            }}
          />

          <FaceSelector
            open={isFaceSelectorOpen}
            onOpenChange={setIsFaceSelectorOpen}
            onSelectFace={handleSelectFace}
            currentFaceTheme={currentFaceTheme.id}
          />
          
          <FacialRigEditor
            open={isFacialRigEditorOpen}
            onOpenChange={setIsFacialRigEditorOpen}
            onSave={handleSaveFacialRigChanges}
            currentFaceTheme={currentFaceTheme}
            currentHeadShape={currentHeadShape}
            voiceSettings={voiceSettings}
            onVoiceSettingsChange={updateVoiceSettings}
          />

          <ProjectInfo
            open={isProjectInfoOpen}
            onOpenChange={setIsProjectInfoOpen}
          />

          <Games
            open={isGamesOpen}
            onOpenChange={setIsGamesOpen}
          />

          <Hotkeys
            open={isHotkeysOpen}
            onOpenChange={setIsHotkeysOpen}
          />

          <SpecialEffects
            open={isSpecialEffectsOpen}
            onOpenChange={setIsSpecialEffectsOpen}
            animationIntensity={animationIntensity}
            onAnimationIntensityChange={setAnimationIntensity}
            zoomIntensity={zoomIntensity}
            onZoomIntensityChange={setZoomIntensity}
          />

          <Keyboard
            open={isKeyboardOpen}
            onOpenChange={setIsKeyboardOpen}
            onKeyPress={(key: string) => {
              if (key === 'Enter') {
                handleSendMessage();
              } else if (key === 'Backspace') {
                setInputText(prev => prev.slice(0, -1));
              } else {
                setInputText(prev => prev + key);
              }
            }}
          />
        </div>
      </Drawers>
    </TooltipProvider>
  );
};

export default ChatTalkingHead;