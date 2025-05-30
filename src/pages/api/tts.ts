import { NextApiRequest, NextApiResponse } from 'next';
import talkify from 'talkify-tts';

// Initialize Talkify
const player = new talkify.TtsPlayer();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Use Talkify to speak the text
    await player.playText(text);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in TTS:', error);
    res.status(500).json({ error: 'Failed to process text-to-speech' });
  }
} 