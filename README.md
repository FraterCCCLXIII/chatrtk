# Chatty Face Plugin

A React-based talking head chat interface that can be integrated with various AI providers.

## Features

- Animated talking head with facial expressions
- Support for multiple AI providers (OpenAI, Claude, DeepSeek, Local LLMs)
- Text-to-speech capabilities
- Piper TTS integration for high-quality speech synthesis

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Configuration

### AI Providers

The application supports the following AI providers:

- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4.5 Preview
- **Anthropic**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **DeepSeek**: DeepSeek Chat, DeepSeek Coder
- **Local**: Any local LLM running with an OpenAI-compatible API (e.g., LM Studio)

### Text-to-Speech

The application supports two text-to-speech options:

1. **Web Speech API**: Uses the browser's built-in speech synthesis
2. **Piper TTS**: A high-quality neural text-to-speech system

## Using Piper TTS

To use Piper TTS with the application:

1. Set up the Piper TTS server (see `/piper-server/README.md` for instructions)
2. In the application settings, enable "Text-to-Speech"
3. Enable "Piper TTS"
4. Set the Piper TTS Endpoint to `http://localhost:5000/api/tts` (or the appropriate URL)
5. Save the settings

## Troubleshooting LM Studio Integration

If you're using LM Studio as your local LLM provider and encountering issues, check the following:

1. Make sure LM Studio server is running and accessible at the configured endpoint
2. Check that you're using the correct endpoint format (typically `http://localhost:1234/v1/chat/completions`)
3. Ensure your requests include the required `messages` field
4. If you see "OPTIONS" errors in the LM Studio logs, this is normal for CORS preflight requests

Common error messages from LM Studio:
- `'messages' field is required`: This indicates the request format is incorrect
- `Unexpected endpoint or method. (OPTIONS /)`: This is a CORS preflight request and can be ignored

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Original Project

This project was created with [Lovable](https://lovable.dev/projects/3e7f9d9f-5bec-40f8-b5ad-e7033b6813bd).

## License

[MIT License](LICENSE)
