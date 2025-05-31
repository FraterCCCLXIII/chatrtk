import { useCallback } from 'react';
import { useActionRegistry, ActionType, ActionParams } from '@/lib/actionRegistry';

interface AIResponse {
  response: string;
  action?: {
    type: ActionType;
    params: ActionParams;
  };
}

export const useAIActionHandler = () => {
  const { execute } = useActionRegistry();

  const handleAIResponse = useCallback(async (message: string): Promise<AIResponse> => {
    // Here you would integrate with your AI service
    // For now, we'll use a simple pattern matching system
    const lowerMessage = message.toLowerCase();

    // Example pattern matching
    if (lowerMessage.includes('open') && lowerMessage.includes('special effects')) {
      return {
        response: "I'll open the special effects modal for you.",
        action: {
          type: 'OPEN_MODAL',
          params: { modalId: 'specialEffects' }
        }
      };
    }

    if (lowerMessage.includes('close') && lowerMessage.includes('special effects')) {
      return {
        response: "I'll close the special effects modal.",
        action: {
          type: 'CLOSE_MODAL',
          params: { modalId: 'specialEffects' }
        }
      };
    }

    if (lowerMessage.includes('turn on') && lowerMessage.includes('pencil effect')) {
      return {
        response: "I'll enable the pencil effect for you.",
        action: {
          type: 'TRIGGER_EFFECT',
          params: { 
            effectId: 'pencil',
            value: { enabled: true }
          }
        }
      };
    }

    // Add more pattern matching as needed

    // If no action is matched, just return the response
    return {
      response: message
    };
  }, [execute]);

  const processAIResponse = useCallback(async (message: string) => {
    const { response, action } = await handleAIResponse(message);
    
    if (action) {
      execute(action.type, action.params);
    }
    
    return response;
  }, [handleAIResponse, execute]);

  return {
    processAIResponse
  };
}; 