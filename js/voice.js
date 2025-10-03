// Voice recognition functionality
class VoiceRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.transcript = '';
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.setupEventListeners();
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported');
            document.getElementById('mic-btn').style.display = 'none';
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.showVoiceIndicator();
        };

        this.recognition.onresult = (event) => {
            this.transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            this.updateUserInput(this.transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopListening();
            
            if (event.error === 'not-allowed') {
                Utils.showNotification('Microphone access denied. Please allow microphone permissions.', 'error');
            } else {
                Utils.showNotification('Voice recognition error. Please try again.', 'error');
            }
        };

        this.recognition.onend = () => {
            this.stopListening();
        };
    }

    setupEventListeners() {
        const micBtn = document.getElementById('mic-btn');
        const voiceStopBtn = document.getElementById('voice-stop-btn');
        const userInput = document.getElementById('user-input');

        if (micBtn) {
            micBtn.addEventListener('click', () => this.toggleListening());
        }

        if (voiceStopBtn) {
            voiceStopBtn.addEventListener('click', () => this.stopListening());
        }

        // Stop listening when user starts typing
        if (userInput) {
            userInput.addEventListener('input', () => {
                if (this.isListening) {
                    this.stopListening();
                }
            });
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition) {
            Utils.showNotification('Voice recognition not supported in your browser', 'error');
            return;
        }

        try {
            this.transcript = '';
            this.recognition.start();
            Utils.showNotification('Listening... Speak now', 'info', 2000);
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            Utils.showNotification('Error starting voice recognition', 'error');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        
        this.isListening = false;
        this.hideVoiceIndicator();
        
        // Auto-send if we have a transcript
        if (this.transcript.trim()) {
            setTimeout(() => {
                document.getElementById('user-input').value = this.transcript;
                // Trigger send after a short delay
                setTimeout(() => {
                    const sendBtn = document.getElementById('send-btn');
                    if (sendBtn) sendBtn.click();
                }, 500);
            }, 100);
        }
    }

    showVoiceIndicator() {
        const indicator = document.getElementById('voice-indicator');
        if (indicator) {
            indicator.classList.add('active');
        }
    }

    hideVoiceIndicator() {
        const indicator = document.getElementById('voice-indicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    updateUserInput(text) {
        const userInput = document.getElementById('user-input');
        if (userInput) {
            userInput.value = text;
            Utils.autoResizeTextarea(userInput);
        }
    }

    // Set language for speech recognition
    setLanguage(lang) {
        if (this.recognition) {
            this.recognition.lang = lang;
        }
    }

    // Get available languages
    getAvailableLanguages() {
        return [
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'es-ES', name: 'Spanish' },
            { code: 'fr-FR', name: 'French' },
            { code: 'de-DE', name: 'German' },
            { code: 'it-IT', name: 'Italian' }
        ];
    }
}

// Initialize voice recognition when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceRecognition = new VoiceRecognition();
});