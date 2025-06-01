# ChatRTK - Interactive AI Chat Interface

ChatRTK is an innovative chat interface that combines expressive facial animations with natural language interaction. The project aims to create a more engaging and human-like experience for AI interactions.

![ChatRTK Demo](demo.gif)

## Features

- 🤖 Interactive talking head with facial expressions
- 🎨 Customizable appearance themes
- 💬 Interactive cards with buttons
- 🌐 Multi-language support (English, Japanese, Chinese, and more)
- 🎤 Voice input and output capabilities
- 🎮 RTK Arcade mini-games
- 🎭 Customizable facial rig
- 📱 Responsive design

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **State Management**: React Context
- **Styling**: Tailwind CSS
- **API Integration**: OpenAI, Claude, DeepSeek, and local models
- **Voice Processing**: Web Speech API
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- (Optional) espeak-ng for local TTS

### Installation

1. Clone the repository:
```bash
git clone https://github.com/paulbloch/chatrtk.git
cd chatrtk
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. For local TTS support, install espeak-ng:
```bash
# macOS
brew install espeak-ng

# Ubuntu/Debian
sudo apt-get install espeak-ng
```

## Current Projects

1. **Language Support**
   - [x] Basic language switching
   - [x] UI translations
   - [ ] Voice model integration for each language
   - [ ] RTL language support

2. **Voice Processing**
   - [x] Basic speech recognition
   - [x] Text-to-speech integration
   - [ ] Voice customization
   - [ ] Emotion-based voice modulation

3. **Facial Expressions**
   - [x] Basic expressions
   - [x] Custom facial rig
   - [ ] More complex expressions
   - [ ] Lip sync improvements

4. **RTK Arcade**
   - [x] Basic game framework
   - [ ] More mini-games
   - [ ] Score tracking
   - [ ] Multiplayer support

## Contributing

We welcome contributions! Here's how you can help:

1. **Bug Reports**: Open an issue with a clear description of the bug
2. **Feature Requests**: Suggest new features or improvements
3. **Code Contributions**: Submit pull requests for bug fixes or new features
4. **Documentation**: Help improve documentation and add examples
5. **Translations**: Add support for new languages

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

### Getting Help

- Join our [Discord community](https://discord.gg/chatrtk)
- Check the [documentation](https://docs.chatrtk.com)
- Open an issue for bugs or questions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Framer Motion](https://www.framer.com/motion/) for animations
- Web Speech API for voice synthesis
- All our contributors and supporters!

## Support the Project

If you find ChatRTK useful, consider:
- Starring the repository
- Contributing code or documentation
- Sharing with others
- Sponsoring development

---

Made with ❤️ by the ChatRTK team
