
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Eye, EyeOff, MessageSquare, MessageSquareOff, MessageCircleMore, UserCircle2, Edit2 } from "lucide-react";
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
import { HeadSelectorModal, HeadTheme } from '../HeadSelectorModal/HeadSelectorModal';
import { AnimatedHeadSelectorModal, AnimatedHeadTheme } from '../AnimatedHeadSelectorModal/AnimatedHeadSelectorModal';
import FacialRigEditor, { HeadShape, FaceRigConfig } from '../FacialRigEditor';
import './ChatTalkingHead.css';
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, TextMessage, CardMessage } from "@/lib/types";
import { parseAIResponse, detectExpression } from "@/lib/aiParser";

interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}

const ChatTalkingHead: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-message',
      type: 'text',
      text: "Hello! I'm running in simulator mode since no API key is configured. You can still chat with me and try out all the features!",
      isUser: false,
      expression: 'happy'
    } as TextMessage,
    {
      id: 'welcome-card',
      type: 'card',
      title: 'ChatRTK Simulator',
      content: 'Try these commands to see what I can do:\n- "help" - Show available commands\n- "weather" - Show a weather card\n- "recipe" - Get a recipe\n- "tasks" - Create a task list\n- "features" - Learn about my capabilities',
      isUser: false,
      actions: [
        { label: 'Show Demo Card', action: 'runFunction:demo' },
        { label: 'Settings', action: 'openModal:settings' }
      ]
    } as CardMessage
  ]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking'>('happy');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  const [isHeadSelectorOpen, setIsHeadSelectorOpen] = useState(false);
  const [isAnimatedHeadSelectorOpen, setIsAnimatedHeadSelectorOpen] = useState(false);
  const [currentAnimatedHeadTheme, setCurrentAnimatedHeadTheme] = useState<AnimatedHeadTheme>({
    id: 'rtk-100',
    name: 'RTK-100',
    description: 'The original talking head',
    config: {
      head: {
        x: 0,
        y: 0,
        width: 220,
        height: 160,
        fillColor: '#5daa77',
        strokeColor: '#333333',
        strokeWidth: 8,
        borderRadius: '20px'
      },
      leftEye: {
        x: 30,
        y: 40,
        width: 12,
        height: 12,
        fillColor: '#000000',
        strokeColor: 'transparent',
        strokeWidth: 0,
        borderRadius: '50%'
      },
      rightEye: {
        x: 70,
        y: 40,
        width: 12,
        height: 12,
        fillColor: '#000000',
        strokeColor: 'transparent',
        strokeWidth: 0,
        borderRadius: '50%'
      },
      mouth: {
        x: 50,
        y: 60,
        width: 60,
        height: 30,
        fillColor: '#5daa77',
        strokeColor: '#333333',
        strokeWidth: 1,
        borderRadius: '15px'
      }
    }
  });
  const [isFacialRigEditorOpen, setIsFacialRigEditorOpen] = useState(false);
  const [currentFaceTheme, setCurrentFaceTheme] = useState<FaceTheme>({
    id: 'default',
    name: 'Minty',
    description: 'The classic mint green face',
    previewColor: '#5ddbaf',
    screenColor: '#e2ffe5',
    faceColor: '#5daa77',
    tongueColor: '#ff7d9d',
  });
  const [currentHeadShape, setCurrentHeadShape] = useState<HeadShape>({
    id: 'rectangle',
    name: 'Rectangle',
    shape: 'rectangle',
  });
  const { toast } = useToast();

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

  // We've removed the auto-scroll effect as requested
  // This allows the user to manually scroll through the messages

  // Detect when AI is speaking and set the current text
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.isUser || isSpeaking) return;
    
    // Only animate for text messages
    if (lastMessage.type === 'text') {
      setCurrentSpeechText(lastMessage.text);
      setCurrentExpression(lastMessage.expression || 'neutral');
      setIsSpeaking(true);

      // Auto-stop talking after a delay based on message length
      const speakingTime = Math.max(2000, lastMessage.text.length * 50);
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, speakingTime);

      return () => clearTimeout(timer);
    }
  }, [messages]);

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
  
  // Save head theme
  const handleSelectHead = (headTheme: HeadTheme) => {
    // Update the face theme with the head theme colors
    const updatedFaceTheme: FaceTheme = {
      ...currentFaceTheme,
      id: headTheme.id,
      name: headTheme.name,
      description: headTheme.description,
      previewColor: headTheme.previewColor,
      screenColor: headTheme.screenColor,
      faceColor: headTheme.faceColor,
      tongueColor: headTheme.tongueColor
    };
    
    // Update the head shape
    const updatedHeadShape: HeadShape = headTheme.headShape;
    
    // Save the updated face theme and head shape
    setCurrentFaceTheme(updatedFaceTheme);
    setCurrentHeadShape(updatedHeadShape);
    
    // Save to localStorage
    localStorage.setItem('faceTheme', JSON.stringify(updatedFaceTheme));
    localStorage.setItem('headShape', JSON.stringify(updatedHeadShape));
    
    // Update the talking head container background color
    const container = document.querySelector('.talking-head-container');
    if (container) {
      (container as HTMLElement).style.backgroundColor = headTheme.previewColor;
    }
    
    // Dispatch a custom event to notify theme change
    window.dispatchEvent(new Event('storage'));
    
    // Update document body background color
    document.body.style.backgroundColor = headTheme.previewColor;
    
    // Update CSS variable for background color
    document.documentElement.style.setProperty('--body-bg-color', headTheme.previewColor);
    
    toast({
      title: "Head Theme Updated",
      description: `Now using the ${headTheme.name} theme.`,
    });
  };
  
  // Save animated head theme
  const handleSelectAnimatedHead = (theme: AnimatedHeadTheme) => {
    setCurrentAnimatedHeadTheme(theme);
    
    // Save to localStorage
    localStorage.setItem('animatedHeadTheme', JSON.stringify(theme));
    
    // Show toast notification
    toast({
      title: `${theme.name} head selected`,
      description: `The ${theme.name} head style has been applied.`,
      duration: 3000
    });
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

  // Handle user message submission
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

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

    setIsLoading(true);

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
      setIsLoading(false);
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
      const newHeight = Math.max(100, Math.min(600, moveEvent.clientY - 100)); // Min 100px, max 600px
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
    color: '#fff', // White text for better contrast
  };
  
  const aiMessageStyle = {
    backgroundColor: `${currentFaceTheme.screenColor}cc`, // 80% opacity
    borderRadius: '12px 12px 12px 2px',
  };

  // Animation for the app title
  const titleAnimation = useFadeIn();
  const floatingAnimation = useFloatingAnimation();
  
  return (
    <div>
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
      </MotionDiv>
      <MotionDiv 
        className="model-version"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
      >
        RTK-100
      </MotionDiv>
      <div className="controls-container">
        <MotionButton 
          variant="ghost" 
          size="icon" 
          onClick={toggleHead}
          title={showHead ? "Hide talking head" : "Show talking head"}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {showHead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </MotionButton>
        <MotionButton 
          variant="ghost" 
          size="icon" 
          onClick={toggleChat}
          title={showChat ? "Hide chat" : "Show chat"}
          whileHover={{ scale: 1.2, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {showChat ? <MessageSquareOff className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        </MotionButton>
        <MotionButton 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsFaceSelectorOpen(true)}
          title="Change theme"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <UserCircle2 className="h-4 w-4" />
        </MotionButton>
        <MotionButton 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsFacialRigEditorOpen(true)}
          title="Edit facial rig"
          whileHover={{ scale: 1.2, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Edit2 className="h-4 w-4" />
        </MotionButton>
        <MotionButton 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsModalOpen(true)}
          title="Settings"
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Settings className="h-4 w-4" />
        </MotionButton>
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
              animatedTheme={currentAnimatedHeadTheme}
            />
          </div>
          
          <div 
            className="resize-handle"
            onMouseDown={handleResizeStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="resize-handle-line"></div>
            <div className="resize-handle-dots">
              <div className="resize-dot"></div>
              <div className="resize-dot"></div>
              <div className="resize-dot"></div>
            </div>
          </div>
        </>
      )}
      
      {showChat && (
        <div className="chat-container">
          <ScrollArea className="chat-messages">
            {messages.map((message, index) => (
              message.type === 'card' ? (
                <AnimatedCard key={message.id || index}>
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
                          <MotionButton
                            key={idx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            variant="outline"
                            onClick={() => handleCardAction(action.action)}
                          >
                            {action.label}
                          </MotionButton>
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
            {isLoading && (
              <div id="loading-message" className="chat-message ai-message" style={aiMessageStyle}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentFaceTheme.previewColor }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentFaceTheme.previewColor, animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentFaceTheme.previewColor, animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
      
      <MotionDiv 
        className="input-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <MotionTextarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <MotionButton 
          onClick={handleSendMessage} 
          className="send-button"
          disabled={isLoading}
          variant="default"
          size="icon"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isLoading ? '...' : <MessageCircleMore className="h-5 w-5" />}
        </MotionButton>
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
      
      <HeadSelectorModal
        open={isHeadSelectorOpen}
        onOpenChange={setIsHeadSelectorOpen}
        onSelectHead={handleSelectHead}
      />
      
      <AnimatedHeadSelectorModal
        isOpen={isAnimatedHeadSelectorOpen}
        onClose={() => setIsAnimatedHeadSelectorOpen(false)}
        onSelectHead={handleSelectAnimatedHead}
        currentHeadId={currentAnimatedHeadTheme.id}
      />
      
      <FacialRigEditor
        open={isFacialRigEditorOpen}
        onOpenChange={setIsFacialRigEditorOpen}
        onSave={handleSaveFacialRigChanges}
        currentFaceTheme={currentFaceTheme}
        currentHeadShape={currentHeadShape}
      />
    </div>
  );
};

export default ChatTalkingHead;
