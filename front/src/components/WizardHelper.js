import React, { useState, useEffect } from 'react';
import { Send, X, MessageSquare, Map } from 'lucide-react';

const mockResponses = {
  "thin file": "A 'thin-file' applicant has very little or no credit history (e.g., 0-1 credit cards). They are typically rejected by traditional systems, which is what we are trying to solve here!",
  "upload": "To upload data, click or drag a Kaggle Credit CSV file into the dashed box on the home screen.",
  "assess": "Click the golden 'Assess Applicant' button on the dashboard to input an individual's details and check their simulated risk score.",
  "hello": "Greetings! I am the Risk Assessor AI Wizard. Ask me anything about credit scoring or how to use this app.",
  "default": "I'm still learning! But primarily, I compare your single loan requests against the global statistical dataset to determine risk automatically."
};

const WizardHelper = ({ defaultMessage, isVisible, currentView }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'wizard', text: "Hello! Need any help navigating the app? Ask a question or click 'Start Tour'!" }]);
  const [inputVal, setInputVal] = useState('');
  const [tourActive, setTourActive] = useState(false);
  const [tourStyle, setTourStyle] = useState({});
  const [tourMessage, setTourMessage] = useState('');

  useEffect(() => {
    if (!tourActive) {
      setTourStyle({});
      document.querySelectorAll('.tour-spotlight').forEach(el => el.classList.remove('tour-spotlight'));
      return;
    }

    let targetId = null;
    let fallbackMsg = '';
    
    if (currentView === 'hero') { targetId = 'tour-upload'; fallbackMsg = 'Step 1: Upload a CSV over here!'; }
    else if (currentView === 'dashboard') { targetId = 'tour-assess-btn'; fallbackMsg = 'Step 2: Assess a new applicant!'; }
    else if (currentView === 'form') { targetId = 'tour-submit-btn'; fallbackMsg = 'Step 3: Submit their form!'; }
    else if (currentView === 'report') { fallbackMsg = 'See their risk score here! You finished the tour.'; }
    
    setTourMessage(fallbackMsg);

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.classList.add('tour-spotlight');
          const rect = el.getBoundingClientRect();
          // Position wizard to the right of the element
          setTourStyle({
            position: 'fixed',
            bottom: 'auto',
            right: 'auto',
            left: `${Math.min(window.innerWidth - 200, rect.left + rect.width + 10)}px`,
            top: `${Math.max(0, rect.top - 50)}px`,
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10005
          });
        }
      }, 500); // Wait for page transition
    } else {
       setTourStyle({});
    }

    return () => {
      document.querySelectorAll('.tour-spotlight').forEach(el => el.classList.remove('tour-spotlight'));
    };
  }, [tourActive, currentView]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    const newMsgs = [...messages, { sender: 'user', text: inputVal }];
    setMessages(newMsgs);
    
    const lower = inputVal.toLowerCase();
    let reply = mockResponses["default"];
    Object.keys(mockResponses).forEach(key => {
      if (lower.includes(key)) reply = mockResponses[key];
    });

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'wizard', text: reply }]);
      // auto scroll to bottom
      const msgBox = document.getElementById('chat-scroll-container');
      if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
    }, 600);
    
    setInputVal('');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Interactive Chat Window */}
      {chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MessageSquare size={18} /> AI Wizard Chat</span>
            <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages" id="chat-scroll-container">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.sender}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="chat-input-area">
            <input 
              value={inputVal} 
              onChange={e => setInputVal(e.target.value)} 
              className="chat-input" 
              placeholder="Ask a question..." 
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Wizard Asset */}
      <div className="wizard-container" style={{ ...tourStyle }}>
        {!chatOpen && (
          <div className="wizard-bubble">
            {tourActive ? tourMessage : defaultMessage}
            
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
              
              <button 
                onClick={() => setChatOpen(true)} 
                title="Chat with Wizard"
                style={{ background: 'var(--secondary)', color: 'white', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={14} />
              </button>

              {!tourActive ? (
                <button 
                  onClick={() => setTourActive(true)} 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary)', color: 'black', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <Map size={14} /> Start Tour
                </button>
              ) : (
                <button 
                  onClick={() => setTourActive(false)} 
                  style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  End Tour
                </button>
              )}
            </div>
          </div>
        )}
        
        <img 
          src="/wizard.png" 
          alt="Wizard Helper" 
          className="wizard-image" 
          onClick={() => {
             if(!chatOpen) setChatOpen(true);
          }}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </>
  );
};

export default WizardHelper;
