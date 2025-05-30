import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Eye, EyeOff, MessageSquare, MessageSquareOff, MessageCircleMore, UserCircle2, Edit2, Github, Subtitles, Mic, MicOff, MessageSquarePlus, Radio, X, FileText } from "lucide-react";
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
import ApiKeyModal from '../ApiKeyModal/ApiKeyModal';
import FaceSelectorModal, { FaceTheme } from '../FaceSelectorModal/FaceSelectorModal';
import FacialRigEditor, { HeadShape, FaceRigConfig } from '../FacialRigEditor';
import './ChatTalkingHead.css';
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, TextMessage, CardMessage } from "@/lib/types";
import { parseAIResponse, detectExpression } from "@/lib/aiParser";
import { setupTalkify, getTalkifyPlayer } from '@/lib/talkify-setup';
import type { TtsPlayer } from '@/types/talkify';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RTK_ALPHA, managePersonality, getThoughtToExpress } from '@/lib/ai-personality';
import type { AIPersonality, Thought } from '@/lib/types';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import ProjectInfoModal from '../ProjectInfoModal/ProjectInfoModal';

type Expression = 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';

interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}

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
  const [isDragging, setIsDragging] = useState(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o',
    endpoint: ''
  });
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

  // Add voice configuration state
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: 'en-US' // Default voice
  });

  // Load API settings, face theme, and head shape from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('apiSettings');
    if (savedSettings) {
      setApiSettings(JSON.parse(savedSettings));
    }
    
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
      setTtsPlayer(getTalkifyPlayer());
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

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = isAlwaysListening;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        finalTranscriptRef.current = '';
        setIsListening(true);
        stopAISpeech();
      };

      recognitionRef.current.onresult = (event) => {
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

        // Check for stop words in interim transcript
        const lowerTranscript = (interimTranscript || finalTranscript).toLowerCase();
        if (lowerTranscript.includes('stop') || lowerTranscript.includes('quiet')) {
          stopAllAI();
          return;
        }

        // Update the displayed transcript
        setTranscript(interimTranscript || finalTranscript);
        
        // If we have any transcript (even interim), stop AI speech
        if (interimTranscript || finalTranscript) {
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
              // Add user message
              const userMessage: TextMessage = {
                id: `user-${Date.now()}`,
                type: 'text',
                text: messageToSend,
                isUser: true
              };
              setMessages(prev => [...prev, userMessage]);
              
              // Clear the input and transcript
              setInputText('');
              setTranscript('');
              finalTranscriptRef.current = '';
              
              // Generate AI response
              setIsAIResponding(true);
              generateAIResponse(messageToSend)
                .then(response => {
                  setMessages(prev => [...prev, response]);
                })
                .catch(error => {
                  console.error('Error generating response:', error);
                  toast({
                    title: "Error",
                    description: "Failed to get response. Using simulator mode instead.",
                    variant: "destructive",
                  });
                  const response = mockGenerateResponse(messageToSend);
                  setMessages(prev => [...prev, response]);
                })
                .finally(() => {
                  setIsAIResponding(false);
                });
            } else {
              console.log('Filtered out likely AI speech:', messageToSend);
            }
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: event.error,
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
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
  }, [isAlwaysListening, isAISpeaking, lastAIMessage]);

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

    if (newMode) {
      // Start listening
      try {
        recognitionRef.current.continuous = true;
        recognitionRef.current.start();
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
      toast({
        title: "Always Listen Mode",
        description: "Voice recognition is now manual. Click the mic button to speak.",
      });
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

    if (isListening) {
      console.log('Stopping speech recognition');
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
      finalTranscriptRef.current = '';
    } else {
      console.log('Starting speech recognition');
      try {
        recognitionRef.current.start();
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

  // We've removed the auto-scroll effect as requested
  // This allows the user to manually scroll through the messages

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

  // Add function to stop AI speech
  const stopAISpeech = () => {
    if (ttsPlayer) {
      ttsPlayer.stop();
      setIsAISpeaking(false);
      if (aiSpeechTimeoutRef.current) {
        clearTimeout(aiSpeechTimeoutRef.current);
      }
    }
  };

  // Add voice settings update function
  const updateVoiceSettings = (newSettings: Partial<typeof voiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  };

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
    const newSettings = { provider, apiKey, model, endpoint };
    setApiSettings(newSettings);
    localStorage.setItem('apiSettings', JSON.stringify(newSettings));
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
        if (param === 'settings') {
          setIsModalOpen(true);
        }
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
          // Do nothing, just acknowledge the action
          toast({
            title: "Action Received",
            description: "Dismiss action processed successfully.",
          });
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

  // Update handleSendMessage to use isAIResponding
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Stop any ongoing AI speech
    stopAISpeech();

    // Add user message
    const userMessage: TextMessage = {
      id: `user-${Date.now()}`,
      type: 'text',
      text: inputText,
      isUser: true
    };
    setMessages([...messages, userMessage]);
    
    // Store the input and clear it
    const userInput = inputText;
    setInputText('');

    // Set loading state for AI response
    setIsAIResponding(true);

    try {
      // Check if API key is configured - if not, use simulator without showing modal
      if (!apiSettings.apiKey) {
        // Add a small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = mockGenerateResponse(userInput);
        setMessages(prev => [...prev, response]);
      } else {
        // Use the real API if key is configured
        const response = await generateAIResponse(userInput);
        setMessages(prev => [...prev, response]);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Using simulator mode instead.",
        variant: "destructive",
      });
      
      // Use simulator as fallback
      const response = mockGenerateResponse(userInput);
      setMessages(prev => [...prev, response]);
    } finally {
      setIsAIResponding(false);
    }
  };

  // Generate AI response using the configured API
  const generateAIResponse = async (userInput: string): Promise<ChatMessage> => {
    // If no API key, use mock response
    if (!apiSettings.apiKey) {
      return mockGenerateResponse(userInput);
    }

    try {
      let apiUrl: string;
      let requestBody: any;
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // System prompt that includes card format instructions
      const systemPrompt = `You are a helpful assistant with emotions. Express happiness, sadness, surprise, anger, or thoughtfulness in your responses. Keep responses concise.

IMPORTANT: When asked to create a card, you MUST use the exact format below:

[CARD]{"title": "Card Title", "content": "Card content", "actions": [{"label": "Button Text", "action": "command:param"}]}[/CARD]

Do not describe creating a card - actually create one using the [CARD] format. The entire JSON object must be valid and enclosed in the [CARD] tags.

Available commands for actions:
- openModal:settings - Opens the settings modal
- runFunction:demo - Shows a demo card
- runFunction:dismiss - Dismisses/acknowledges an action

Example card formats:
1. Simple card:
[CARD]{"title": "Weather in New York", "content": "Currently 72°F and Sunny\\nHigh: 74°F\\nLow: 58°F"}[/CARD]

2. Card with actions:
[CARD]{"title": "Task List", "content": "- Create prototype\\n- Test functionality\\n- Deploy to production", "actions": [{"label": "Mark Complete", "action": "runFunction:dismiss"}, {"label": "Settings", "action": "openModal:settings"}]}[/CARD]

When asked about cards, weather, recipes, or any structured information, respond with a properly formatted card.`;

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
          return mockGenerateResponse(userInput);
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
      
      // Parse the response to potentially extract card data
      return parseAIResponse(content);
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };

  // Mock AI response for testing or when API key isn't configured
  const mockGenerateResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase();
    
    // For demo purposes, return different types of cards based on user input
    if (lowerInput.includes('card') || lowerInput.includes('demo')) {
      return parseAIResponse(`[CARD]{"title": "Demo Card", "content": "This is a demo card that shows how interactive cards work in the chat interface.", "actions": [{"label": "Show Another", "action": "runFunction:demo"}, {"label": "Settings", "action": "openModal:settings"}]}[/CARD]`);
    }
    
    // Task list card
    if (lowerInput.includes('task') || lowerInput.includes('todo') || lowerInput.includes('to-do')) {
      return parseAIResponse(`[CARD]{"title": "Task List", "content": "- Create card prototype\\n- Implement card parser\\n- Add interactive buttons\\n- Style the cards\\n- Test with different content", "actions": [{"label": "Mark Complete", "action": "runFunction:dismiss"}, {"label": "Add Task", "action": "runFunction:demo"}]}[/CARD]`);
    }
    
    // Weather card
    if (lowerInput.includes('weather') || lowerInput.includes('forecast')) {
      return parseAIResponse(`[CARD]{"title": "Weather Forecast", "content": "New York, NY\\n\\nCurrently: 72°F, Sunny\\nHigh: 75°F\\nLow: 58°F\\n\\nTomorrow: Partly cloudy, 70°F", "actions": [{"label": "Refresh", "action": "runFunction:demo"}]}[/CARD]`);
    }
    
    // Recipe card
    if (lowerInput.includes('recipe') || lowerInput.includes('cook') || lowerInput.includes('food')) {
      return parseAIResponse(`[CARD]{"title": "Simple Pasta Recipe", "content": "Ingredients:\\n- 1 lb pasta\\n- 2 cups marinara sauce\\n- 1 cup cheese\\n- Salt and pepper\\n\\nInstructions:\\n1. Cook pasta according to package\\n2. Heat sauce in a pan\\n3. Mix pasta and sauce\\n4. Top with cheese", "actions": [{"label": "Save Recipe", "action": "runFunction:dismiss"}]}[/CARD]`);
    }
    
    // Help card
    if (lowerInput.includes('help') || lowerInput.includes('assist') || lowerInput.includes('support')) {
      return parseAIResponse(`[CARD]{"title": "ChatRTK Help", "content": "Here are some things you can ask me about:\\n\\n- Ask for a recipe\\n- Check the weather\\n- Create a task list\\n- Show a demo card\\n- Change my expression (try: happy, sad, angry, surprised)\\n- Ask about my features", "actions": [{"label": "Show Demo", "action": "runFunction:demo"}, {"label": "Settings", "action": "openModal:settings"}]}[/CARD]`);
    }
    
    // Features card
    if (lowerInput.includes('feature') || lowerInput.includes('what can you do') || lowerInput.includes('capability')) {
      return parseAIResponse(`[CARD]{"title": "ChatRTK Features", "content": "- Interactive talking head with facial expressions\\n- Customizable appearance themes\\n- Interactive cards with buttons\\n- Responsive chat interface\\n- Animated expressions\\n- API integration (requires key)\\n- Local simulator mode", "actions": [{"label": "Try a Demo", "action": "runFunction:demo"}]}[/CARD]`);
    }
    
    // Detect expression from user input (simplified for demo)
    let response: string;
    let expression: Expression = 'neutral';
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      response = "Hello there! How can I assist you today? Try asking me about recipes, weather, or tasks!";
      expression = 'happy';
    } else if (lowerInput.includes('sad') || lowerInput.includes('bad') || lowerInput.includes('sorry')) {
      response = "I'm sorry to hear that. Is there anything I can do to help? Maybe a funny joke would cheer you up?";
      expression = 'sad';
    } else if (lowerInput.includes('wow') || lowerInput.includes('amazing') || lowerInput.includes('really')) {
      response = "That's amazing! I'm surprised and excited to hear about it. Tell me more!";
      expression = 'surprised';
    } else if (lowerInput.includes('angry') || lowerInput.includes('mad') || lowerInput.includes('upset')) {
      response = "I understand your frustration. Let's try to resolve this issue together. Deep breaths help!";
      expression = 'angry';
    } else if (lowerInput.includes('think') || lowerInput.includes('question') || lowerInput.includes('how')) {
      response = "That's an interesting question. Let me think about that for a moment... I'm running in simulator mode, so I don't have access to real-time data, but I can show you some demo responses!";
      expression = 'thinking';
    } else if (lowerInput.includes('joke') || lowerInput.includes('funny')) {
      response = "Why don't scientists trust atoms? Because they make up everything! 😄";
      expression = 'happy';
    } else if (lowerInput.includes('name') || lowerInput.includes('who are you')) {
      response = "I'm ChatRTK, a talking head chat interface with expressive animations. I'm currently running in simulator mode since no API key is configured.";
      expression = 'happy';
    } else if (lowerInput.includes('thank')) {
      response = "You're very welcome! Is there anything else I can help you with today?";
      expression = 'happy';
    } else if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
      response = "Goodbye! Have a wonderful day. Come back anytime you want to chat!";
      expression = 'happy';
    } else if (lowerInput.includes('happy') || lowerInput.includes('smile') || lowerInput.includes('joy')) {
      response = "That makes me happy to hear! I'm smiling right now. Positive emotions are wonderful!";
      expression = 'happy';
    } else if (lowerInput.includes('surprise') || lowerInput.includes('shocked')) {
      response = "Wow! That's quite surprising! I didn't expect that at all!";
      expression = 'surprised';
    } else if (lowerInput.includes('time') || lowerInput.includes('date')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. Note that I'm running in simulator mode, so this is your device's time.`;
      expression = 'neutral';
    } else if (lowerInput.includes('api') || lowerInput.includes('key')) {
      response = "To use me with a real AI model, you'll need to configure an API key. Click the settings icon in the top right corner to set up your API credentials.";
      expression = 'thinking';
    } else {
      // Default response for anything else
      const defaultResponses = [
        "I see. Tell me more about what you're looking for.",
        "That's interesting! Would you like to see a demo of what I can do?",
        "I'm running in simulator mode right now. Try asking me about recipes, weather, or tasks!",
        "Interesting point! What else would you like to discuss?",
        "I'm here to help! Try saying 'help' to see what I can do.",
        "I'm listening. Feel free to ask me about my features or try different expressions!"
      ];
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      expression = 'neutral';
    }

    return {
      id: `ai-${Date.now()}`,
      type: 'text',
      text: response,
      isUser: false,
      expression: expression
    };
  };

  // Handle resizing of the talking head container
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Calculate new height with a minimum of 200px to ensure head is visible
      const newHeight = Math.max(200, Math.min(600, moveEvent.clientY - 100));
      setHeadHeight(newHeight);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Toggle visibility of components
  const toggleHead = () => setShowHead(!showHead);
  const toggleChat = () => setShowChat(!showChat);

  // Detect expression from text content
  const detectExpression = (content: string): 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking' => {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('happy') || lowerContent.includes('glad') || lowerContent.includes('wonderful') || 
        lowerContent.includes('excellent') || lowerContent.includes('great')) {
      return 'happy';
    } else if (lowerContent.includes('sad') || lowerContent.includes('sorry') || lowerContent.includes('unfortunate') || 
               lowerContent.includes('regret')) {
      return 'sad';
    } else if (lowerContent.includes('wow') || lowerContent.includes('amazing') || lowerContent.includes('surprising') || 
               lowerContent.includes('unexpected') || lowerContent.includes('interesting')) {
      return 'surprised';
    } else if (lowerContent.includes('angry') || lowerContent.includes('frustrating') || lowerContent.includes('upset') || 
               lowerContent.includes('annoying')) {
      return 'angry';
    } else if (lowerContent.includes('think') || lowerContent.includes('consider') || lowerContent.includes('perhaps') || 
               lowerContent.includes('maybe') || lowerContent.includes('possibly')) {
      return 'thinking';
    } else {
      return 'neutral';
    }
  };

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

  return (
    <div>
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
        RTK-100
      </MotionDiv>
      <div className="controls-container">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsProjectInfoOpen(true)}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip="About RTK"
        >
          <FileText className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFaceSelectorOpen(true)}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip="Change Face"
        >
          <Smiley className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHead(!showHead)}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip={showHead ? "Hide Head" : "Show Head"}
        >
          {showHead ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowChat(!showChat)}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip={showChat ? "Hide Chat" : "Show Chat"}
        >
          {showChat ? <MessageSquareOff className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleVoice}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip={isVoiceEnabled ? "Disable Voice" : "Enable Voice"}
        >
          {isVoiceEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsModalOpen(true)}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFacialRigEditorOpen(true)}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip="Edit Facial Rig"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowCaptions(!showCaptions)}
          className="hover:scale-105 active:scale-95 transition-transform"
          data-tooltip={showCaptions ? "Hide Captions" : "Show Captions"}
        >
          <Subtitles className={`h-4 w-4 ${showCaptions ? 'text-primary' : ''}`} />
        </Button>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVerbosityOpen(!isVerbosityOpen)}
            className={`hover:scale-105 active:scale-95 transition-transform ${verbosityLevel > 0 ? 'text-primary' : ''}`}
            data-tooltip="Chat Verbosity"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
          {isVerbosityOpen && (
            <div className="absolute right-0 top-full mt-2 p-4 bg-white rounded-lg shadow-lg border w-64 z-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="verbosity">Chat Verbosity</Label>
                  <span className="text-sm text-muted-foreground">{verbosityLevel}%</span>
                </div>
                <Slider
                  id="verbosity"
                  min={0}
                  max={100}
                  step={1}
                  value={[verbosityLevel]}
                  onValueChange={([value]) => setVerbosityLevel(value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  {verbosityLevel === 0 
                    ? "AI will only respond to your messages"
                    : verbosityLevel < 30 
                    ? "AI will occasionally initiate conversation"
                    : verbosityLevel < 70 
                    ? "AI will regularly engage in conversation"
                    : "AI will be very chatty and initiate frequent conversations"}
                </p>
              </div>
            </div>
          )}
        </div>
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
          
          <div 
            className="resize-handle"
            onMouseDown={handleResizeStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="resize-handle-line"></div>
          </div>
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
                    className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'}`}
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
        className="input-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="chat-input-wrapper">
          {(isAIResponding || isAISpeaking) && (
            <button 
              className="stop-button"
              onClick={stopAllAI}
              title="Stop AI"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceInput}
            className={`audio-control-button ${isListening ? 'active' : ''}`}
            data-tooltip={isListening ? "Stop Voice Input" : "Start Voice Input"}
          >
            {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAlwaysListening}
            className={`audio-control-button ${isAlwaysListening ? 'active' : ''}`}
            data-tooltip={isAlwaysListening ? "Disable Always Listen" : "Enable Always Listen"}
          >
            <Radio className="h-5 w-5" />
          </Button>
          <MotionTextarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message..."}
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
          <Button 
            onClick={handleSendMessage} 
            className="send-button"
            disabled={isAIResponding}
            variant="default"
            size="icon"
            data-tooltip={isAIResponding ? "AI is responding..." : "Send message"}
          >
            {isAIResponding ? (
              <div className="loading-spinner" />
            ) : (
              <MessageCircleMore className="h-5 w-5" />
            )}
          </Button>
        </div>
        {isListening && transcript && (
          <div className="absolute bottom-full mb-2 left-0 right-0 text-center text-sm text-muted-foreground">
            {transcript}
            {finalTranscriptRef.current && (
              <div className="text-xs text-primary mt-1">
                (Final transcript: {finalTranscriptRef.current})
              </div>
            )}
          </div>
        )}
      </MotionDiv>

      <ApiKeyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveSettings}
        currentProvider={apiSettings.provider}
        currentApiKey={apiSettings.apiKey}
        currentModel={apiSettings.model}
        currentEndpoint={apiSettings.endpoint}
      />

      <FaceSelectorModal
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

      <ProjectInfoModal
        open={isProjectInfoOpen}
        onOpenChange={setIsProjectInfoOpen}
      />
    </div>
  );
};

export default ChatTalkingHead;
