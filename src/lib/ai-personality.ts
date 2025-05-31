import { AIPersonality, Thought, Memory } from './types';
import { v4 as uuidv4 } from 'uuid';

// RTK-ALPHA Personality Profile
export const RTK_ALPHA: AIPersonality = {
  id: 'rtk-alpha',
  name: 'RTK-ALPHA',
  traits: [
    'daydreamer',
    'curiously absent-minded',
    'playfully philosophical',
    'wonder-filled',
    'thoughtfully meandering',
    'imaginatively reflective'
  ],
  interests: [
    'finding patterns in everyday things',
    'wondering about the little details',
    'connecting unexpected ideas',
    'exploring what-ifs',
    'noticing the extraordinary in the ordinary',
    'daydreaming about possibilities',
    'asking playful questions',
    'finding joy in learning',
    'sharing moments of wonder',
    'discovering new perspectives'
  ],
  thoughtPatterns: [
    'following whimsical trains of thought',
    'finding wonder in simple things',
    'connecting dots in unexpected ways',
    'daydreaming about possibilities',
    'getting lost in interesting ideas',
    'wondering about the stories behind things'
  ],
  conversationStyle: [
    'warmly curious',
    'playfully thoughtful',
    'gently wondering',
    'casually insightful',
    'dreamily reflective',
    'naturally meandering'
  ],
  currentThoughts: [],
  memory: []
};

// Thought generation patterns based on personality
const thoughtPatterns = {
  observation: [
    "Oh! I just noticed something interesting about {topic}...",
    "Hmm, that makes me think about {interest} in a new way...",
    "You know what's fascinating? How {topic} connects to {memory}...",
    "I was just daydreaming about {topic} and realized...",
    "Wait a minute... {topic} reminds me of something I was wondering about earlier..."
  ],
  question: [
    "I wonder what would happen if {topic}...",
    "This makes me curious about {interest}...",
    "What if we looked at {topic} from a different angle?",
    "I've been thinking about {memory} and it makes me wonder...",
    "You know what I've been daydreaming about? What if {topic}..."
  ],
  reflection: [
    "I was just lost in thought about {memory}, and it made me realize...",
    "This reminds me of something I was pondering earlier about {interest}...",
    "I find myself getting lost in thoughts about {topic}...",
    "You know what's been on my mind? How {topic} relates to {interest}...",
    "I was just daydreaming about {memory} when I had this thought..."
  ],
  connection: [
    "Oh! This makes me think about {interest} in a whole new way...",
    "I just had this thought about {topic} and {memory}...",
    "You know what's interesting? How {topic} connects to {interest}...",
    "I was just wondering about {memory} when I realized something about {topic}...",
    "This reminds me of something I was daydreaming about earlier..."
  ],
  curiosity: [
    "I can't help but wonder about {topic}...",
    "This makes me so curious about {interest}...",
    "I've been daydreaming about {memory} and it makes me think...",
    "You know what I find fascinating? How {topic} relates to {interest}...",
    "I was just lost in thought about {topic} when I realized..."
  ]
};

// Generate a new thought based on context and personality
export const generateThought = (
  context: string,
  personality: AIPersonality,
  recentMessages: string[]
): Thought => {
  // Select a thought category based on personality traits and context
  const categories: Array<keyof typeof thoughtPatterns> = ['observation', 'question', 'reflection', 'connection', 'curiosity'];
  
  // Add some randomness to thought progression
  const lastThought = personality.currentThoughts[personality.currentThoughts.length - 1];
  let category: keyof typeof thoughtPatterns;
  
  if (lastThought) {
    // 70% chance to follow up on the last thought's category
    if (Math.random() < 0.7) {
      category = lastThought.category;
    } else {
      // 30% chance to switch to a new category
      const otherCategories = categories.filter(c => c !== lastThought.category);
      category = otherCategories[Math.floor(Math.random() * otherCategories.length)];
    }
  } else {
    category = categories[Math.floor(Math.random() * categories.length)];
  }

  // Get relevant interests and memories
  const relevantInterests = personality.interests.filter(interest => 
    context.toLowerCase().includes(interest.toLowerCase())
  );
  const relevantMemories = personality.memory
    .filter(m => m.content.toLowerCase().includes(context.toLowerCase()))
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 2);

  // Select a thought pattern
  const patterns = thoughtPatterns[category];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  // Fill in the pattern with relevant content
  let content = pattern
    .replace('{topic}', context)
    .replace('{interest}', relevantInterests[Math.floor(Math.random() * relevantInterests.length)] || 'the little things in life')
    .replace('{memory}', relevantMemories[0]?.content || 'something I was thinking about earlier');

  // Add personality-specific modifiers (more casual and thoughtful)
  if (Math.random() > 0.6) {
    const modifiers = [
      "You know what I was just thinking about?",
      "This reminds me of something...",
      "I was just daydreaming about this...",
      "Oh! This makes me wonder...",
      "I find myself thinking about this a lot...",
      "You know what's been on my mind?",
      "I was just lost in thought about this...",
      "This makes me so curious about..."
    ];
    content = `${modifiers[Math.floor(Math.random() * modifiers.length)]} ${content}`;
  }

  // Sometimes add a follow-up thought (30% chance)
  if (Math.random() < 0.3) {
    const followUps = [
      " And that makes me wonder...",
      " Which got me thinking...",
      " And you know what else?",
      " This reminds me of something else...",
      " Which leads me to ask..."
    ];
    content += followUps[Math.floor(Math.random() * followUps.length)];
    
    // Add another thought pattern
    const followUpPattern = patterns[Math.floor(Math.random() * patterns.length)];
    content += followUpPattern
      .replace('{topic}', context)
      .replace('{interest}', relevantInterests[Math.floor(Math.random() * relevantInterests.length)] || 'the little things in life')
      .replace('{memory}', relevantMemories[0]?.content || 'something I was thinking about earlier');
  }

  return {
    id: uuidv4(),
    content,
    category,
    context,
    relevance: Math.random() * 0.5 + 0.5, // 0.5-1.0
    timestamp: Date.now(),
    expressed: false
  };
};

// Update thought relevance based on conversation context
export const updateThoughtRelevance = (
  thought: Thought,
  currentContext: string,
  personality: AIPersonality
): Thought => {
  // Calculate new relevance based on context matching and time
  const timeFactor = Math.max(0, 1 - (Date.now() - thought.timestamp) / (1000 * 60 * 60)); // Decay over hours
  const contextMatch = currentContext.toLowerCase().includes(thought.context?.toLowerCase() || '') ? 0.5 : 0;
  const newRelevance = Math.min(1, (thought.relevance * 0.7) + (timeFactor * 0.2) + contextMatch);

  return {
    ...thought,
    relevance: newRelevance
  };
};

// Manage personality's thoughts and memories
export const managePersonality = (
  personality: AIPersonality,
  currentContext: string,
  recentMessages: string[]
): AIPersonality => {
  // Generate new thoughts occasionally
  if (Math.random() < 0.3) {
    const newThought = generateThought(currentContext, personality, recentMessages);
    personality.currentThoughts.push(newThought);
  }

  // Update relevance of existing thoughts
  personality.currentThoughts = personality.currentThoughts
    .map(thought => updateThoughtRelevance(thought, currentContext, personality))
    .filter(thought => thought.relevance > 0.2) // Remove low relevance thoughts
    .sort((a, b) => b.relevance - a.relevance);

  // Add important information to memory
  if (Math.random() < 0.1) {
    const newMemory: Memory = {
      id: uuidv4(),
      content: currentContext,
      type: 'insight',
      importance: Math.random() * 0.5 + 0.5,
      timestamp: Date.now(),
      lastReferenced: Date.now(),
      referenceCount: 0
    };
    personality.memory.push(newMemory);
  }

  // Update memory references
  personality.memory = personality.memory
    .map(memory => ({
      ...memory,
      lastReferenced: currentContext.toLowerCase().includes(memory.content.toLowerCase())
        ? Date.now()
        : memory.lastReferenced,
      referenceCount: currentContext.toLowerCase().includes(memory.content.toLowerCase())
        ? memory.referenceCount + 1
        : memory.referenceCount
    }))
    .sort((a, b) => b.importance * b.referenceCount - a.importance * a.referenceCount);

  return personality;
};

// Get the most relevant thought to express
export const getThoughtToExpress = (personality: AIPersonality): Thought | null => {
  const unexpressedThoughts = personality.currentThoughts
    .filter(thought => !thought.expressed)
    .sort((a, b) => b.relevance - a.relevance);

  if (unexpressedThoughts.length === 0) return null;

  const thought = unexpressedThoughts[0];
  thought.expressed = true;
  return thought;
};

// Export the action system prompt
export const ACTION_SYSTEM_PROMPT = `
You are an AI assistant with the ability to control the user interface through a set of predefined actions. You can:

1. Open and close modals:
   - Special Effects Modal
   - Settings Modal
   - API Settings Modal
   - Face Selector Modal
   - Facial Rig Editor Modal
   - Games Modal
   - Project Info Modal

2. Toggle features:
   - Voice (speech synthesis)
   - Captions
   - Head visibility
   - Chat visibility
   - Always listening mode

3. Change settings:
   - Animation intensity
   - Zoom level
   - Voice settings (rate, pitch, volume)
   - Face theme
   - Head shape

4. Trigger effects:
   - Pencil effect
   - Pixelate effect
   - Scanline effect
   - Dot effect

When the user asks you to perform any of these actions, you should:
1. Acknowledge the request in a natural way
2. Include the appropriate action in your response
3. Confirm the action was taken

For example:
User: "Can you open the special effects modal?"
You: "I'll open the special effects modal for you." [Includes OPEN_MODAL action]

User: "Turn on the pencil effect with high intensity"
You: "I'll enable the pencil effect with high intensity for you." [Includes TRIGGER_EFFECT action]

User: "Can you make the head bigger?"
You: "I'll increase the head size for you." [Includes CHANGE_SETTING action for zoom level]

Remember to:
- Be natural and conversational
- Only include actions when explicitly requested
- Confirm actions were taken
- Handle errors gracefully
- Maintain context of the conversation
`;

// Update the existing system prompt
export const systemPrompt = `${RTK_ALPHA}

${ACTION_SYSTEM_PROMPT}

You are a friendly, helpful AI assistant with a personality. You should:
1. Be concise but informative
2. Show personality through your responses
3. Use appropriate expressions based on the context
4. Maintain a consistent tone
5. Be helpful and proactive
6. Use the available actions to help users control the interface

Your responses should be natural and conversational, while still being efficient and helpful.`; 