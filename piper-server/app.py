from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import tempfile
import wave
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('piper_server.log')
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to store the voice model
voice = None

def load_voice_model():
    """Load the Piper voice model if available"""
    global voice
    try:
        from piper import PiperVoice
        
        # Check if model files exist
        MODEL_PATH = os.path.join("voices", "en-us-kathleen-low.onnx")
        MODEL_CONFIG = os.path.join("voices", "en-us-kathleen-low.onnx.json")
        
        if not os.path.exists(MODEL_PATH) or not os.path.exists(MODEL_CONFIG):
            logger.warning(f"Voice model files not found at {MODEL_PATH}")
            return False
        
        # Initialize the voice
        voice = PiperVoice.load(MODEL_PATH, MODEL_CONFIG)
        logger.info("Voice model loaded successfully")
        return True
    
    except ImportError:
        logger.error("Piper TTS not installed. Install with: pip install piper-tts")
        return False
    except Exception as e:
        logger.error(f"Error loading voice model: {str(e)}")
        return False

@app.route('/')
def index():
    return jsonify({
        "status": "running",
        "endpoints": ["/api/tts"],
        "voice_model_loaded": voice is not None
    })

@app.route('/api/tts', methods=['POST', 'OPTIONS'])
def text_to_speech():
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return '', 200
    
    # Check if voice model is loaded
    if voice is None:
        if not load_voice_model():
            return jsonify({
                "error": "Voice model not loaded. Please check server logs."
            }), 500
    
    try:
        # Get text from request
        data = request.json
        if not data or 'text' not in data:
            logger.warning("No text provided in request")
            return jsonify({"error": "No text provided"}), 400
        
        text = data['text']
        logger.info(f"Generating speech for text: {text[:50]}...")
        
        # Create a temporary WAV file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            temp_wav_path = temp_wav.name
        
        # Generate speech
        with wave.open(temp_wav_path, 'wb') as wav_file:
            voice.synthesize(text, wav_file)
        
        logger.info(f"Speech generated successfully, file size: {os.path.getsize(temp_wav_path)} bytes")
        
        # Send the file
        return send_file(
            temp_wav_path,
            mimetype='audio/wav',
            as_attachment=True,
            download_name='speech.wav'
        )
    
    except Exception as e:
        logger.error(f"Error generating speech: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
    finally:
        # Clean up the temporary file
        if 'temp_wav_path' in locals() and os.path.exists(temp_wav_path):
            os.unlink(temp_wav_path)

if __name__ == '__main__':
    # Try to load the voice model at startup
    load_voice_model()
    
    # Run the server
    app.run(host='0.0.0.0', port=5000, debug=True)