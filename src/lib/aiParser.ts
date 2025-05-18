import { ChatMessage, Expression } from "./types";

// Generate a simple ID for messages
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Detect expression from text content (copied from ChatTalkingHead)
export const detectExpression = (content: string): Expression => {
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

// Parse AI response to extract card data if present
export const parseAIResponse = (content: string): ChatMessage => {
  // Check if the response contains a card directive
  const cardMatch = content.match(/\[CARD\](.*?)\[\/CARD\]/s);
  
  if (cardMatch) {
    try {
      const cardData = JSON.parse(cardMatch[1]);
      return {
        id: generateId(),
        type: "card",
        isUser: false,
        title: cardData.title || "Card",
        content: cardData.content || "",
        actions: cardData.actions || []
      };
    } catch (error) {
      console.error("Failed to parse card data:", error);
      // Fall back to text message
    }
  }
  
  // Default to text message
  return {
    id: generateId(),
    type: "text",
    isUser: false,
    text: content,
    expression: detectExpression(content)
  };
};