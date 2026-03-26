import React, { useState, useEffect } from 'react';
import { Send, X, MessageSquare, Bot } from 'lucide-react';

const mockResponses = {
  'thin file': "A 'thin-file' applicant has very little credit history (0-1 credit cards). Traditional systems reject them — CreditIQ helps assess them fairly.",
  upload: "Drag & drop a CSV file into the upload zone, or click to browse. Both individual bank statements and bulk datasets are supported.",
  assess: "In Bulk mode, click 'Assess Applicant' after uploading a CSV to input an individual's details and get a risk score.",
  individual: 'Individual mode analyses a single person\'s bank transaction CSV — income, spending, savings rate, and estimated credit score.',
  bulk: 'Bulk mode takes a Kaggle-style multi-user CSV and shows population-level credit analytics.',
  score: 'The credit score is a heuristic between 300–850 based on savings rate, debt-to-income ratio, income level, and loan duration.',
  loan: 'I calculate lending limits based on your score and income. Higher scores get higher limits and longer repayment cycles!',
  borrow: 'You can borrow based on your Suggested Lending Limit. If your score is Low, we suggest smaller loans with faster repayment.',
  hello: 'Hi! I\'m your CreditIQ assistant. Ask me about credit scoring, how to use the app, or what the results mean.',
  hey: 'Hello! I am the CreditIQ Wizard. How can I help you analyze credit data today?',
  thanks: 'You\'re welcome! Let me know if you need anything else.',
  bye: 'Goodbye! Happy credit analyzing!',
  default: "I'm still learning new topics! Try asking about 'thin file', 'credit score', 'upload', 'individual mode', or 'bulk mode'.",
};

const WizardHelper = ({ message, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasNewContext, setHasNewContext] = useState(false);

  // Initialize with context message if provided
  useEffect(() => {
    if (message) {
      const isDuplicate = messages.some(m => m.text === message);
      if (!isDuplicate) {
        setMessages([{ sender: 'wizard', text: message }]);
        if (!isOpen) setHasNewContext(true);
      }
    }
  }, [message, messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: inputVal }];
    setMessages(newMsgs);
    setIsThinking(true);
    
    const lower = inputVal.toLowerCase();
    let reply = mockResponses.default;
    
    // Simple keyword matching
    for (const [key, val] of Object.entries(mockResponses)) {
      if (lower.includes(key)) {
        reply = val;
        break;
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'wizard', text: reply }]);
      setIsThinking(false);
      // Scroll to bottom
      setTimeout(() => {
        const box = document.getElementById('chat-body');
        if (box) box.scrollTop = box.scrollHeight;
      }, 50);
    }, 1000); // 1s "thinking" delay to show emotion
    
    setInputVal('');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewContext(false);
  };

  if (!isVisible) return null;

  return (
    <div className="wizard-chatbot">
      {/* Floating Message Bubble (only if not open and active message exists) */}
      {!isOpen && message && messages.length <= 1 && (
        <div className="wizard-bubble" onClick={toggleChat} style={{ cursor: 'pointer', marginBottom: '0.5rem', position: 'static', width: '220px' }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{message}</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent)' }}>Click to chat →</div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="wizard-window">
          <div className="wizard-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Bot size={20} />
              <h4>CreditIQ Helper</h4>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          
          <div className="wizard-body" id="chat-body">
            {messages.map((m, i) => (
              <div key={i} style={{ 
                marginBottom: '1rem', 
                textAlign: m.sender === 'user' ? 'right' : 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{ 
                  background: m.sender === 'user' ? 'var(--text)' : 'var(--bg-off)', 
                  color: m.sender === 'user' ? '#fff' : 'var(--text)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  borderBottomRightRadius: m.sender === 'user' ? '2px' : '12px',
                  borderBottomLeftRadius: m.sender === 'user' ? '12px' : '2px',
                  maxWidth: '85%',
                  fontSize: '0.88rem'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isThinking && (
              <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                <div style={{ 
                  background: 'var(--bg-off)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  borderBottomLeftRadius: '2px',
                  width: 'fit-content',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  Wizard is thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            <input 
              style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: '8px', padding: '0.5rem 0.75rem', outline: 'none', fontFamily: 'Saira' }}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Ask a question..."
              autoFocus
            />
            <button type="submit" className="btn btn-black" style={{ padding: '0.5rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button className={`wizard-fab ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default WizardHelper;
