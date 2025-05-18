# Piper TTS Server for Chatty Face Plugin

This directory contains instructions for setting up a Piper TTS server to work with the Chatty Face Plugin.

## What is Piper TTS?

Piper TTS is a fast, local neural text-to-speech system that sounds great and is optimized for the Raspberry Pi 4. It uses ONNX models for inference and can generate high-quality speech.

## Setup Instructions

### 1. Install Piper TTS

```bash
# Create a virtual environment (recommended)
python -m venv piper-env
source piper-env/bin/activate  # On Windows: piper-env\Scripts\activate

# Install Piper TTS
pip install piper-tts
```

### 2. Download a Voice Model

Piper comes with several voice models. You can download them from the [Piper GitHub repository](https://github.com/rhasspy/piper/releases).

```bash
# Create a directory for voice models
mkdir -p voices

# Download a voice model (example: English female voice)
wget https://github.com/rhasspy/piper/releases/download/v1.2.0/voice-en-us-kathleen-low.tar.gz
tar -xzf voice-en-us-kathleen-low.tar.gz -C voices/
```

### 3. Create a Simple Flask Server

Create a file named `app.py` with the following content:

```python
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import tempfile
import wave
from piper import PiperVoice

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load Piper voice model
MODEL_PATH = "voices/en-us-kathleen-low.onnx"
MODEL_CONFIG = "voices/en-us-kathleen-low.onnx.json"

# Initialize the voice
voice = PiperVoice.load(MODEL_PATH, MODEL_CONFIG)

@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    try:
        # Get text from request
        data = request.json
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text']
        
        # Create a temporary WAV file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            temp_wav_path = temp_wav.name
        
        # Generate speech
        with wave.open(temp_wav_path, 'wb') as wav_file:
            voice.synthesize(text, wav_file)
        
        # Send the file
        return send_file(
            temp_wav_path,
            mimetype='audio/wav',
            as_attachment=True,
            download_name='speech.wav'
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    finally:
        # Clean up the temporary file
        if 'temp_wav_path' in locals() and os.path.exists(temp_wav_path):
            os.unlink(temp_wav_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### 4. Install Dependencies for the Server

```bash
pip install flask flask-cors
```

### 5. Run the Server

```bash
python app.py
```

The server will run on port 5000 and provide an endpoint at `/api/tts` that accepts POST requests with JSON data containing a "text" field.

## Using with Chatty Face Plugin

1. In the Chatty Face Plugin settings, enable "Text-to-Speech"
2. Enable "Piper TTS"
3. Set the Piper TTS Endpoint to `http://localhost:5000/api/tts` (or the appropriate URL if running on a different machine)
4. Save the settings

Now when the AI responds, it will use Piper TTS for high-quality speech synthesis.

## Troubleshooting

- If you encounter issues with the server, check the console output for error messages
- Make sure the voice model path in `app.py` matches your downloaded model
- If running on a different machine, ensure the server is accessible from the machine running the Chatty Face Plugin
- Check that CORS is properly enabled if you're getting cross-origin errors