/**
 * أبو راس · الذكاء الاصطناعي الخارق
 * يتصل مباشرة بـ OpenRouter و Gemini API
 * بدون أي ردود محلية - كل الإجابات من API
 */

// ==============================================
// تهيئة المتغيرات العامة
// ==============================================
let currentModel = 'openai/gpt-4';
let conversationHistory = [];
let modelsStatus = {};

// 🔑 **مفاتيح API - حط مفاتيحك هنا**
const API_KEYS = {
    openrouter: 'YOUR_OPENROUTER_KEY', // من https://openrouter.ai/keys
    gemini: 'YOUR_GEMINI_KEY'          // من https://makersuite.google.com/app/apikey
};

// ==============================================
// تهيئة الصفحة
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeParticles();
    checkAPIKeys();
    setupEventListeners();
    addWelcomeMessage();
    setInterval(checkAPIKeys, 5000); // يفحص المفاتيح كل 5 ثواني
});

// ==============================================
// فحص مفاتيح API
// ==============================================
function checkAPIKeys() {
    const hasOpenRouter = API_KEYS.openrouter && API_KEYS.openrouter !== 'YOUR_OPENROUTER_KEY';
    const hasGemini = API_KEYS.gemini && API_KEYS.gemini !== 'YOUR_GEMINI_KEY';
    
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('status-text');
    
    if (!statusDot || !statusText) return;
    
    if (hasOpenRouter || hasGemini) {
        statusDot.style.background = '#10b981';
        statusDot.style.boxShadow = '0 0 20px #10b981';
        statusText.textContent = '🟢 متصل - جاهز للإجابة';
    } else {
        statusDot.style.background = '#ef4444';
        statusDot.style.boxShadow = '0 0 20px #ef4444';
        statusText.textContent = '🔴 غير متصل - أضف مفاتيح API';
    }
}

// ==============================================
// رسالة الترحيب
// ==============================================
function addWelcomeMessage() {
    const hasOpenRouter = API_KEYS.openrouter && API_KEYS.openrouter !== 'YOUR_OPENROUTER_KEY';
    const hasGemini = API_KEYS.gemini && API_KEYS.gemini !== 'YOUR_GEMINI_KEY';
    
    if (hasOpenRouter || hasGemini) {
        addMessage('🌟 مرحباً! أنا أبو راس، متصل مباشرة بـ ' + 
            (hasOpenRouter ? 'OpenRouter (GPT-4, Claude, Gemini)' : '') + 
            (hasOpenRouter && hasGemini ? ' و ' : '') + 
            (hasGemini ? 'Google Gemini' : '') + 
            '. اسألني عن أي شيء وأنا أجيبك من أقوى نماذج الذكاء الاصطناعي!', 'bot');
    } else {
        addMessage('⚠️ **تنبيه**: لم تضف مفاتيح API بعد. أضف مفاتيح OpenRouter أو Gemini في ملف script.js عشان يشتغل.', 'bot');
    }
}

// ==============================================
// نظام الجسيمات (زينة فقط)
// ==============================================
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
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
    
    // عرض رسالة المستخدم
    addMessage(message, 'user');
    input.value = '';
    
    // إظهار مؤشر الكتابة
    showTypingIndicator();
    
    try {
        let response = null;
        
        // محاولة OpenRouter أولاً
        if (API_KEYS.openrouter && API_KEYS.openrouter !== 'YOUR_OPENROUTER_KEY') {
            response = await callOpenRouter(message);
        }
        
        // إذا فشل OpenRouter، جرب Gemini
        if (!response && API_KEYS.gemini && API_KEYS.gemini !== 'YOUR_GEMINI_KEY') {
            response = await callGemini(message);
        }
        
        // إخفاء مؤشر الكتابة
        removeTypingIndicator();
        
        // عرض الرد
        if (response) {
            addMessage(response, 'bot');
            // حفظ في التاريخ
            conversationHistory.push({ role: 'user', content: message });
            conversationHistory.push({ role: 'assistant', content: response });
        } else {
            addMessage('❌ **خطأ**: ما قدرت أتصل بأي API. تأكد من مفاتيحك.', 'bot');
        }
        
    } catch (error) {
        removeTypingIndicator();
        addMessage('❌ **خطأ**: ' + error.message, 'bot');
    }
}

// ==============================================
// الاتصال بـ OpenRouter API
// ==============================================
async function callOpenRouter(message) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEYS.openrouter}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'أبو راس',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: currentModel,
                messages: [
                    { 
                        role: 'system', 
                        content: 'أنت أبو راس، مساعد عربي ذكي ومفيد. أجب على أسئلة المستخدم بدقة ووضوح. قدم معلومات كاملة ومفيدة.'
                    },
                    ...conversationHistory.slice(-6),
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 2000,
                top_p: 0.9
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error('OpenRouter Error:', data.error);
            return null;
        }
        
        return data.choices?.[0]?.message?.content;
        
    } catch (error) {
        console.error('OpenRouter Fetch Error:', error);
        return null;
    }
}

// ==============================================
// الاتصال بـ Google Gemini API
// ==============================================
async function callGemini(message) {
    try {
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
                    maxOutputTokens: 2000,
                    topP: 0.9
                }
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error('Gemini Error:', data.error);
            return null;
        }
        
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
        
    } catch (error) {
        console.error('Gemini Fetch Error:', error);
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
    
    // تحويل **نص** إلى <strong>نص</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // تحويل *نص* إلى <em>نص</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // تحويل `نص` إلى <code>نص</code>
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // تحويل الأسطر الجديدة
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
        'claude-sonnet': 'anthropic/claude-3-sonnet',
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
            'claude-sonnet': 'Claude 3 Sonnet',
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
