# GupAI - Advanced AI Chatbot 

A professional, industry-grade AI chatbot application with modern UI/UX, voice recognition, and PHP backend integration.

## Features

### Core Chat Features
- Real-time AI-powered conversations with smart responses
- Multiple chat sessions with persistent history
- Typing indicators for better user experience
- Quick action buttons for common queries
- Auto-resize text input for comfortable typing

## Voice Recognition
- Speech-to-text input with visual feedback
- Multi-language support for voice commands
- Real-time voice activity indicators
- Auto-send after voice input completion

### User Interface
- Dark/Light theme modes with automatic detection
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional sidebar layout with chat history
- Custom scrollbars and modern design

### Data Management
- Local storage for chat history persistence
- Export chats as text files
- Multiple chat sessions management
- Auto-save functionality for conversations

### Advanced Features
- PHP Backend Integration for scalable AI responses
- Keyboard shortcuts for power users
- Real-time notifications and status updates
- Error handling with graceful degradation
- Health monitoring for backend services

## Project Structure


GupAI/
├── index.html                 # Main application entry point
├── styles/                   # CSS stylesheets
│   ├── main.css             # Base styles and CSS variables
│   ├── components.css       # Component-specific styles
│   └── responsive.css       # Responsive design rules
├── js/                      # JavaScript modules
│   ├── app.js              # Main application controller
│   ├── chat.js             # Chat functionality and AI integration
│   ├── voice.js            # Voice recognition features
│   ├── theme.js            # Theme management
│   └── utils.js            # Utility functions and helpers
├── api/                     # PHP Backend API
│   ├── chat.php            # Chat endpoint handler
│   ├── health.php          # Health check endpoint
│   └── .htaccess           # Apache configuration (optional)
└── assets/                  # Static assets
    ├── icons/              # Application icons
    └── sounds/             # Notification sounds


## Installation & Setup

### Prerequisites
- PHP 7.4+ or Node.js (for different backend options)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (Apache, Nginx, or built-in PHP server)

### Quick Start (PHP Backend - Recommended)

### Method 1: Using Built-in PHP Server
bash
Clone or download the project
cd GupAI

Start PHP built-in development server
php -S localhost:8000

# Open your browser and visit:
# http://localhost:8000


### Method 2: Using XAMPP/WAMP
1. Install [XAMPP](https://www.apachefriends.org/) or [WAMP](http://www.wampserver.com/)
2. Copy project to htdocs folder: C:\xampp\htdocs\GupAI\
3. Start Apache server
4. Visit: `http://localhost/GupAI/

### Alternative: Node.js Backend

bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start Node.js server
npm start

# In new terminal, start frontend
cd ..
python -m http.server 8000


## Configuration

### Backend Configuration
The application automatically detects available backends. Update js/chat.js for custom configurations:

javascript
// For PHP backend (default)
this.apiConfig = {
    baseURL: '',
    endpoints: {
        chat: '/api/chat.php',
        health: '/api/health.php'
    }
};

// For Node.js backend
this.apiConfig = {
    baseURL: 'http://localhost:3000',
    endpoints: {
        chat: '/api/chat',
        health: '/api/health'
    }
};


### Theme Configuration
Themes are managed automatically with system preference detection. Users can toggle between dark/light modes.

## Usage

### Basic Chatting
1. Type your message in the input field
2. Press `Enter` or click the send button
3. Receive AI-powered responses

### Voice Commands
1. Click the microphone button 
2. Allow microphone permissions
3. Speak your message
4. Voice input will be automatically converted to text

### Keyboard Shortcuts
- `Ctrl + /` - Focus chat input
- `Ctrl + K` - Start new chat
- `Escape` - Clear input or close sidebar
- `Enter` - Send message (without Shift)

### Chat Management
- New Chat: Click "New Chat" in sidebar
- Clear Chat: Use clear button to remove current conversation
- Export Chat: Download conversation as text file
- Switch Themes: Toggle between dark/light mode

## Development

### Adding Custom Responses
Extend the AI response system in `js/chat.js`:

javascript
getSimulatedResponse(message) {
    const customResponses = {
        'your keyword': 'Custom response here',
        // Add more custom responses
    };
    // ... existing code
}


### Styling Customization
Modify CSS variables in `styles/main.css`:

css
:root {
    --primary-color: #your-color;
    --bg-primary: #your-background;
    /* Customize other variables */
}


### Backend Integration
Replace simulation with real AI service in `api/chat.php`:

php
// Integrate with OpenAI, Google AI, or custom NLP
$ai_response = your_ai_service($message);
echo json_encode(['reply' => $ai_response]);


## Deployment

### Production Deployment

#### Option 1: Shared Hosting (PHP)
1. Upload all files to your web hosting
2. Ensure PHP 7.4+ is available
3. Set proper file permissions (755 for folders, 644 for files)

#### Option 2: VPS/Cloud (Node.js)
bash
# Install Node.js and PM2
npm install -g pm2

# Deploy application
pm2 start backend/server.js --name "gupai"


#### Option 3: Static Hosting (Frontend Only)
- Netlify, Vercel, or GitHub Pages
- Uses simulation mode without backend

### Environment Variables
Create `.env` file for production:

env
# For PHP backend
API_KEY=your_ai_service_key
ENVIRONMENT=production

# For Node.js backend
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=your_openai_key
```

## Troubleshooting

### Common Issues

Voice Recognition Not Working
- Ensure HTTPS in production
- Allow microphone permissions
- Use Chrome for best compatibility

Backend Connection Failed
- Check if PHP/Node.js server is running
- Verify API endpoints in configuration
- Check browser console for errors

Theme Not Persisting
- Clear browser cache
- Check localStorage permissions
- Update browser to latest version

### Debug Mode
Access developer tools and use:

javascript
// Check backend status
debugChatManager.getStatus()

// Test backend connection
debugChatManager.testBackend()

// Switch between modes
debugChatManager.switchToPHPBackend()
debugChatManager.switchToSimulation()


## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test across different browsers
- Update documentation accordingly

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Font Awesome](https://fontawesome.com)
- Voice recognition using [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- UI inspiration from modern chat applications
- PHP community for robust backend solutions

## Support

Having issues? Here's how to get help:

1. Check Documentation: Review this README and code comments
2. Debug Mode: Use browser console debugging tools
3. Community: Create an issue on