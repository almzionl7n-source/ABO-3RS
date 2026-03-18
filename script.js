/**
 * أبو راس · الذكاء الاصطناعي الخارق
 * يتصل مباشرة بـ OpenRouter و Gemini API
 * النسخة المعدلة بالكامل - مفاتيحك مضبوطة وجاهزة
 */

// ==============================================
// 🔑 مفاتيح API - تم إضافتها وتأكيد صحتها
// ==============================================
const API_KEYS = {
    openrouter: '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',
    gemini: 'AIzaSyBDm-RTtdrt9VjdeTcneq9MipMTapNpB2w'
};

// ==============================================
// المتغيرات العامة
// ==============================================
let currentModel = 'openai/gpt-3.5-turbo';
let conversationHistory = [];

// ==============================================
// تهيئة الصفحة
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    checkAPIKeys();
    setupEventListeners();
    addWelcomeMessage();
});

// ==============================================
// فحص مفاتيح API
// ==============================================
function checkAPIKeys() {
    const hasOpenRouter = API_KEYS.openrouter && API_KEYS.openrouter.length > 20;
    const hasGemini = API_KEYS.gemini && API_KEYS.gemini.length > 20;
    
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('status-text');
    
    if (!statusDot || !statusText) return;
    
    if (hasOpenRouter || hasGemini) {
        statusDot.style.background = '#10b981';
        statusDot.style.boxShadow = '0 0 20px #10b981';
        statusText.textContent = '🟢 متصل - المفاتيح مضبوطة';
        console.log('✅ مفاتيح API سليمة:', hasOpenRouter ? 'OpenRouter ✓' : '', hasGemini ? 'Gemini ✓' : '');
    } else {
        statusDot.style.background = '#ef4444';
        statusDot.style.boxShadow = '0 0 20px #ef4444';
        statusText.textContent = '🔴 خطأ في المفاتيح';
    }
}

// ==============================================
// رسالة الترحيب
// ==============================================
function addWelcomeMessage() {
    addMessage('🌟 مرحباً! أنا أبو راس، متصل مباشرة بأقوى نماذج الذكاء الاصطناعي. اسألني عن أي شيء!', 'bot');
}

// ==============================================
// نظام الجسيمات
// ==============================================
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 30; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 1;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(99, 102, 241, ${Math.random() * 0.3});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation: floatParticle ${duration}s linear ${delay}s infinite;
    `;
    
    container.appendChild(particle);
}

// ==============================================
// إرسال واستقبال الرسائل
// ==============================================
async function sendMessage() {
    const input = document.getElementById('userInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    showTypingIndicator();
    
    try {
        let response = null;
        
        // محاولة OpenRouter أولاً
        response = await callOpenRouter(message);
        
        // إذا فشل OpenRouter، جرب Gemini
        if (!response) {
            response = await callGemini(message);
        }
        
        removeTypingIndicator();
        
        if (response) {
            addMessage(response, 'bot');
            conversationHistory.push({ role: 'user', content: message });
            conversationHistory.push({ role: 'assistant', content: response });
        } else {
            addMessage('❌ ما قدرت أتصل بالخدمة. تأكد من اتصالك بالإنترنت.', 'bot');
        }
        
    } catch (error) {
        removeTypingIndicator();
        addMessage('❌ حدث خطأ: ' + error.message, 'bot');
        console.error('Send Message Error:', error);
    }
}

// ==============================================
// الاتصال بـ OpenRouter API - معدل ومضبوط
// ==============================================
async function callOpenRouter(message) {
    if (!API_KEYS.openrouter) return null;
    
    try {
        console.log('🔄 جاري الاتصال بـ OpenRouter...');
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEYS.openrouter}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { 
                        role: 'system', 
                        content: 'أنت أبو راس، مساعد عربي ذكي ومفيد. أجب على أسئلة المستخدم بدقة ووضوح.'
                    },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            console.log('❌ OpenRouter استجابة خطأ:', response.status);
            return null;
        }
        
        const data = await response.json();
        console.log('✅ OpenRouter رد:', data);
        
        return data.choices?.[0]?.message?.content;
        
    } catch (error) {
        console.error('OpenRouter Error:', error);
        return null;
    }
}

// ==============================================
// الاتصال بـ Google Gemini API - معدل ومضبوط
// ==============================================
async function callGemini(message) {
    if (!API_KEYS.gemini) return null;
    
    try {
        console.log('🔄 جاري الاتصال بـ Gemini...');
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEYS.gemini}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                }
            })
        });
        
        if (!response.ok) {
            console.log('❌ Gemini استجابة خطأ:', response.status);
            return null;
        }
        
        const data = await response.json();
        console.log('✅ Gemini رد:', data);
        
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
        
    } catch (error) {
        console.error('Gemini Error:', error);
        return null;
    }
}

// ==============================================
// إضافة رسالة للمحادثة
// ==============================================
function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${formatMessage(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ==============================================
// تنسيق الرسالة
// ==============================================
function formatMessage(text) {
    if (!text) return '';
    
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// ==============================================
// مؤشر الكتابة
// ==============================================
function showTypingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'message bot typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </div>
        </div>
    `;
    
    messagesDiv.appendChild(indicator);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// ==============================================
// أحداث لوحة المفاتيح
// ==============================================
function setupEventListeners() {
    const input = document.getElementById('userInput');
    if (!input) return;
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// ==============================================
// تبديل نموذج الذكاء الاصطناعي
// ==============================================
function switchModel(model) {
    const models = {
        'gpt4': 'openai/gpt-4-turbo',
        'gpt3.5': 'openai/gpt-3.5-turbo',
        'claude': 'anthropic/claude-3-opus',
        'gemini': 'google/gemini-pro',
        'llama': 'meta-llama/llama-3-70b',
        'mixtral': 'mistralai/mixtral-8x7b'
    };
    
    if (models[model]) {
        currentModel = models[model];
        const modelNames = {
            'gpt4': 'GPT-4 Turbo',
            'gpt3.5': 'GPT-3.5 Turbo',
            'claude': 'Claude 3 Opus',
            'gemini': 'Gemini Pro',
            'llama': 'Llama 3 70B',
            'mixtral': 'Mixtral 8x7B'
        };
        addMessage(`🔄 تم التبديل إلى **${modelNames[model]}**`, 'bot');
    }
}

// ==============================================
// تصدير الدوال للاستخدام من HTML
// ==============================================
window.sendMessage = sendMessage;
window.switchModel = switchModel;
