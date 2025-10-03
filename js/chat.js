// Chat functionality
class ChatManager {
    constructor() {
        this.currentChatId = null;
        this.chats = Storage.get('chats', {});
        this.isWaitingForResponse = false;
        this.apiConfig = {
            baseURL: '', // Empty for PHP relative paths
            endpoints: {
                chat: '/api/chat.php',
                health: '/api/health.php'
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChatHistory();
        this.createNewChat();
        
        // Check backend connection on startup
        this.checkBackendConnection();
    }

    async checkBackendConnection() {
        const isHealthy = await this.checkBackendHealth();
        if (!isHealthy) {
            Utils.showNotification('PHP backend server is not connected. Using simulation mode.', 'warning', 5000);
        } else {
            Utils.showNotification('Connected to PHP backend server', 'success', 3000);
        }
    }

    async checkBackendHealth() {
        try {
            const response = await fetch(this.apiConfig.endpoints.health);
            if (!response.ok) return false;
            const data = await response.json();
            return data.status === 'OK';
        } catch (error) {
            console.warn('PHP Backend health check failed:', error);
            return false;
        }
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');
        const newChatBtn = document.getElementById('new-chat-btn');
        const clearChatBtn = document.getElementById('clear-chat-btn');
        const exportChatBtn = document.getElementById('export-chat-btn');
        const quickActions = document.querySelectorAll('.action-btn');

        // Send message
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Enter key to send
        if (userInput) {
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            userInput.addEventListener('input', () => {
                Utils.autoResizeTextarea(userInput);
                this.updateSendButton();
            });
        }

        // New chat
        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.createNewChat());
        }

        // Clear chat
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => this.clearCurrentChat());
        }

        // Export chat
        if (exportChatBtn) {
            exportChatBtn.addEventListener('click', () => this.exportChat());
        }

        // Quick actions
        quickActions.forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                if (prompt) {
                    document.getElementById('user-input').value = prompt;
                    this.sendMessage();
                }
            });
        });

        // Handle beforeunload to save current chat
        window.addEventListener('beforeunload', () => {
            this.saveCurrentChat();
        });
    }

    createNewChat() {
        this.saveCurrentChat();
        
        this.currentChatId = Utils.generateId();
        this.chats[this.currentChatId] = {
            id: this.currentChatId,
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.renderChat();
        this.updateChatHistory();
        this.clearChatBox();

        Utils.showNotification('New chat started', 'success');
    }

    saveCurrentChat() {
        if (this.currentChatId && this.chats[this.currentChatId]) {
            Storage.set('chats', this.chats);
        }
    }

    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();

        if (!message || this.isWaitingForResponse) return;

        // Add user message
        this.addMessage('user', message);
        userInput.value = '';
        Utils.autoResizeTextarea(userInput);
        this.updateSendButton();

        this.isWaitingForResponse = true;

        try {
            // Use the getAIResponse function
            const response = await this.getAIResponse(message);
            
            // Add bot response
            this.addMessage('bot', response);
            
            this.isWaitingForResponse = false;
            
        } catch (error) {
            this.addMessage('bot', 'Sorry, I encountered an unexpected error. Please try again.');
            this.isWaitingForResponse = false;
            console.error('Chat error:', error);
        }

        // Update chat title if it's the first message
        if (this.chats[this.currentChatId].messages.length === 2) {
            this.updateChatTitle(message);
        }

        this.saveCurrentChat();
        this.updateChatHistory();
    }

    async getAIResponse(message) {
        // Show typing indicator
        this.showTypingIndicator();
        
        // Check if backend is available
        const isBackendHealthy = await this.checkBackendHealth();
        
        if (!isBackendHealthy) {
            // Use simulation mode if backend is down
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.hideTypingIndicator();
            return this.getSimulatedResponse(message);
        }

        try {
            // Call PHP backend API
            const response = await fetch(this.apiConfig.endpoints.chat, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: message,
                    chatHistory: this.chats[this.currentChatId]?.messages.slice(-6) || []
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            return data.reply || data.response || data.message;

        } catch (error) {
            // Hide typing indicator on error
            this.hideTypingIndicator();
            
            console.error('PHP Backend Error:', error);
            
            // Fallback to simulation mode
            return this.getSimulatedResponse(message);
        }
    }

    getSimulatedResponse(message) {
        // Simple simulation responses
        const responses = {
            'hello': "Hello! I'm GupAI, your AI assistant. How can I help you today?",
            'hi': "Hi there! I'm GupAI, ready to assist you with any questions or tasks.",
            'help': "I can help you with various tasks like answering questions, writing content, explaining concepts, coding help, and much more. What would you like to know?",
            'weather': "I don't have real-time weather data, but you can ask me about weather concepts or how to check weather in your area!",
            'joke': "Why don't scientists trust atoms? Because they make up everything! 😄",
            'name': "I'm GupAI, your intelligent AI assistant!",
            'who are you': "I'm GupAI, an AI assistant created to help you with various tasks and answer your questions.",
            'what can you do': "I can help with answering questions, writing content, explaining concepts, programming help, creative writing, and much more!",
            'thank': "You're welcome! Is there anything else I can help you with?",
            'bye': "Goodbye! Feel free to come back if you have more questions!",
            'how are you': "I'm just a bunch of code, but I'm functioning perfectly! How can I assist you today?",
            'php': "I'm currently running with a PHP backend! This allows for better performance and easier deployment.",
            'backend': "The PHP backend is handling your requests. It's fast, reliable, and works on most hosting environments.",
            'default': `I understand you're asking about "${message}". Currently, I'm running in simulation mode since the PHP backend is not available. How can I help you with this topic?`
        };

        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key) && key !== 'default') {
                return response;
            }
        }

        // Smart responses based on message content
        if (lowerMessage.includes('?')) {
            return "That's an interesting question! In a full implementation, I'd provide a detailed answer. For now, I can tell you that I'm an AI assistant designed to help with various tasks.";
        }
        
        if (lowerMessage.includes('time')) {
            return `The current time is ${Utils.formatTime(new Date())}. In simulation mode, I can't access real-time data, but I'm here to help with other questions!`;
        }
        
        if (lowerMessage.includes('calculate') || lowerMessage.includes('math')) {
            return "I can help with mathematical concepts and explanations! In simulation mode, I don't have calculation capabilities, but I can explain how to solve various math problems.";
        }

        return responses.default;
    }

    addMessage(sender, content) {
        if (!this.currentChatId) return;

        const message = {
            id: Utils.generateId(),
            sender,
            content,
            timestamp: new Date().toISOString()
        };

        this.chats[this.currentChatId].messages.push(message);
        this.chats[this.currentChatId].updatedAt = new Date().toISOString();

        this.renderMessage(message);
    }

    renderMessage(message) {
        const chatBox = document.getElementById('chat-box');
        const welcomeSection = document.querySelector('.welcome-section');

        // Remove welcome section if it exists
        if (welcomeSection && this.chats[this.currentChatId].messages.length > 0) {
            welcomeSection.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        messageElement.innerHTML = `
            <div class="message-avatar">
                ${message.sender === 'user' ? 'U' : 'AI'}
            </div>
            <div class="message-content">
                <div class="message-text">${Utils.sanitizeHTML(message.content)}</div>
                <div class="message-time">${Utils.formatTime(new Date(message.timestamp))}</div>
            </div>
        `;

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    renderChat() {
        if (!this.currentChatId || !this.chats[this.currentChatId]) return;

        this.clearChatBox();
        const messages = this.chats[this.currentChatId].messages;

        if (messages.length === 0) {
            // Show welcome section for empty chat
            return;
        }

        messages.forEach(message => this.renderMessage(message));
    }

    clearChatBox() {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = `
            <div class="welcome-section">
                <div class="welcome-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h2>Welcome to GupAI</h2>
                <p>Your intelligent AI assistant powered by PHP backend</p>
                <div class="quick-actions">
                    <div class="action-grid">
                        <button class="action-btn" data-prompt="Explain quantum computing in simple terms">
                            <i class="fas fa-atom"></i>
                            <span>Quantum Computing</span>
                        </button>
                        <button class="action-btn" data-prompt="Help me write a professional email">
                            <i class="fas fa-envelope"></i>
                            <span>Email Writing</span>
                        </button>
                        <button class="action-btn" data-prompt="Create a workout plan for beginners">
                            <i class="fas fa-dumbbell"></i>
                            <span>Fitness Plan</span>
                        </button>
                        <button class="action-btn" data-prompt="Explain machine learning concepts">
                            <i class="fas fa-brain"></i>
                            <span>ML Concepts</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Re-attach event listeners to quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                if (prompt) {
                    document.getElementById('user-input').value = prompt;
                    this.sendMessage();
                }
            });
        });
    }

    clearCurrentChat() {
        if (!this.currentChatId) return;

        if (confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
            this.chats[this.currentChatId].messages = [];
            this.renderChat();
            this.saveCurrentChat();
            Utils.showNotification('Chat cleared', 'success');
        }
    }

    exportChat() {
        if (!this.currentChatId || !this.chats[this.currentChatId].messages.length) {
            Utils.showNotification('No messages to export', 'error');
            return;
        }

        const chat = this.chats[this.currentChatId];
        let exportContent = `GupAI Chat Export\n`;
        exportContent += `Date: ${new Date().toLocaleString()}\n`;
        exportContent += `Chat: ${chat.title}\n`;
        exportContent += `Backend: PHP\n\n`;
        exportContent += '='.repeat(50) + '\n\n';

        chat.messages.forEach(message => {
            const sender = message.sender === 'user' ? 'You' : 'GupAI';
            const time = Utils.formatTime(new Date(message.timestamp));
            exportContent += `${sender} (${time}):\n`;
            exportContent += `${message.content}\n\n`;
        });

        const filename = `gupai-chat-${new Date().toISOString().split('T')[0]}.txt`;
        Utils.downloadFile(exportContent, filename);

        Utils.showNotification('Chat exported successfully', 'success');
    }

    updateChatTitle(firstMessage) {
        if (!this.currentChatId) return;

        // Create a short title from the first message
        const title = firstMessage.length > 30 
            ? firstMessage.substring(0, 30) + '...' 
            : firstMessage;

        this.chats[this.currentChatId].title = title;
        this.updateChatHistory();
    }

    loadChatHistory() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;

        historyList.innerHTML = '';

        const sortedChats = Object.values(this.chats)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        sortedChats.forEach(chat => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${chat.id === this.currentChatId ? 'active' : ''}`;
            historyItem.innerHTML = `
                <i class="fas fa-message"></i>
                <span>${Utils.sanitizeHTML(chat.title)}</span>
            `;

            historyItem.addEventListener('click', () => this.switchChat(chat.id));
            historyList.appendChild(historyItem);
        });
    }

    switchChat(chatId) {
        if (this.currentChatId === chatId) return;

        this.saveCurrentChat();
        this.currentChatId = chatId;
        this.renderChat();
        this.loadChatHistory();

        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.add('active');
            // Scroll to bottom to show typing indicator
            const chatBox = document.getElementById('chat-box');
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    updateSendButton() {
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');
        
        if (sendBtn && userInput) {
            sendBtn.disabled = !userInput.value.trim() || this.isWaitingForResponse;
        }
    }

    // Search through chat history
    searchChats(query) {
        const results = [];
        Object.values(this.chats).forEach(chat => {
            const matchingMessages = chat.messages.filter(message => 
                message.content.toLowerCase().includes(query.toLowerCase())
            );
            
            if (matchingMessages.length > 0) {
                results.push({
                    chat,
                    matchingMessages
                });
            }
        });
        
        return results;
    }

    // Delete a specific chat
    deleteChat(chatId) {
        if (this.chats[chatId]) {
            delete this.chats[chatId];
            Storage.set('chats', this.chats);
            
            if (this.currentChatId === chatId) {
                this.createNewChat();
            }
            
            this.loadChatHistory();
            Utils.showNotification('Chat deleted', 'success');
        }
    }

    // Update API configuration
    updateApiConfig(newConfig) {
        this.apiConfig = { ...this.apiConfig, ...newConfig };
        Utils.showNotification('API configuration updated', 'success');
    }

    // Get current API status
    async getApiStatus() {
        try {
            const isHealthy = await this.checkBackendHealth();
            const healthResponse = await fetch(this.apiConfig.endpoints.health);
            const healthData = await healthResponse.json();
            
            return {
                connected: isHealthy,
                backend: 'PHP',
                endpoints: this.apiConfig.endpoints,
                health: healthData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                connected: false,
                backend: 'PHP',
                endpoints: this.apiConfig.endpoints,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Test backend connection
    async testBackend() {
        try {
            const response = await fetch(this.apiConfig.endpoints.health);
            const data = await response.json();
            return {
                success: true,
                data: data,
                status: response.status
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Initialize chat manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
    
    // Expose chat manager methods globally for debugging
    window.debugChatManager = {
        getStatus: () => window.chatManager.getApiStatus(),
        testBackend: () => window.chatManager.testBackend(),
        getCurrentChat: () => window.chatManager.chats[window.chatManager.currentChatId],
        getAllChats: () => window.chatManager.chats,
        switchToSimulation: () => {
            window.chatManager.updateApiConfig({ 
                baseURL: 'http://invalid-url-to-force-simulation',
                endpoints: {
                    chat: '/invalid-chat-endpoint',
                    health: '/invalid-health-endpoint'
                }
            });
            Utils.showNotification('Switched to simulation mode', 'info');
        },
        switchToPHPBackend: () => {
            window.chatManager.updateApiConfig({
                baseURL: '',
                endpoints: {
                    chat: '/api/chat.php',
                    health: '/api/health.php'
                }
            });
            Utils.showNotification('Switched to PHP backend', 'success');
        },
        forceHealthCheck: () => {
            window.chatManager.checkBackendConnection();
        }
    };

    // Add PHP backend info to console
    console.log(`
🚀 GupAI Chat Manager Initialized
📡 Backend: PHP
📍 Endpoints:
   - Chat: ${window.chatManager.apiConfig.endpoints.chat}
   - Health: ${window.chatManager.apiConfig.endpoints.health}
🔧 Debug: Use debugChatManager in console
    `);
});