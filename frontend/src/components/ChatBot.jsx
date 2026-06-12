import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: 'Hello! I am your real estate assistant. Ask me anything about properties in Pakistan!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend) => {
    // Determine the actual input: either the button click text or the manual input
    const userInput = typeof textToSend === 'string' ? textToSend : input;
    if (!userInput.trim()) return;

    setInput('');
    setError('');
    
    const newMessages = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      // MULTI-TURN CONTEXT: Full conversation history sent with each 
      // request so Gemini remembers previous messages in the chat
      const contents = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // PROMPT ENGINEERING: System instruction establishes the AI as 
      // a Pakistani real estate expert with specific behavioral rules
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `You are a helpful Pakistani real estate assistant. 
              You help users with property buying, selling, renting, 
              investment advice, and documentation in Pakistan. 
              Be conversational, friendly, and locally knowledgeable. 
              Keep answers concise and practical. You may use 
              English with common Urdu real estate terms naturally.`
            }]
          },
          contents: contents
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) throw new Error("No response from AI. Try again.");

      setMessages(prev => [...prev, { role: 'model', text: reply }]);
      
    } catch (err) {
      setError("Could not generate reply: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestions = ["DHA Lahore rates?", "Documents checklist", "Rent vs Buy advice"];
  const showSuggestions = messages.length === 1 && !loading;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[340px] h-[420px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-slide-up">
          {/* Header */}
          <div className="bg-brand-secondary p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">Real Estate Assistant</h3>
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Powered by Gemini</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === 'user' ? 'bg-brand-primary text-white self-end rounded-br-sm' : 'bg-white text-gray-800 self-start rounded-bl-sm border border-gray-100'}`}>
                {msg.text}
              </div>
            ))}
            
            {loading && (
              <div className="bg-white text-gray-800 self-start rounded-2xl rounded-bl-sm border border-gray-100 px-4 py-3 shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}

            {error && (
              <div className="self-center bg-red-50 text-red-500 border border-red-100 text-xs px-4 py-2 rounded-xl text-center">
                ⚠️ {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div className="px-4 py-3 bg-gray-50 flex flex-wrap gap-2 border-t border-gray-100 justify-center">
              {suggestions.map((sug, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleSend(sug)}
                  className="bg-white border border-gray-200 text-brand-primary text-[11px] px-3 py-1.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors font-bold shadow-sm"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about properties..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-brand hover:scale-110 transition-transform duration-300 z-50 relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
