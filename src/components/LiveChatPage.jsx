import React, { useState, useEffect, useRef } from 'react';
import { 
    Paperclip, 
    Mic, 
    Send, 
    Headset, 
    ChevronLeft, 
    ChevronDown,
    MoreVertical, 
    Smile,
    Image as ImageIcon
} from 'lucide-react';
import liveChatSupportAvatar from '../assets/live-chat-support-avatar.svg';

const SUGGESTED_MESSAGES = [
    "I want to deposit",
    "Withdrawal status",
    "Bonus inquiry",
    "Account verification",
    "Technical support",
    "Game issue"
];

const INITIAL_MESSAGES = [
    {
        id: 1,
        type: 'date',
        text: '09/05/2025'
    },
    {
        id: 2,
        type: 'received',
        sender: 'Support Team',
        text: 'Hello there. 🌟 Welcome to 12WIN Support. 👋 How can we assist you today?',
        timestamp: '14:20',
        avatar: liveChatSupportAvatar
    },
    {
        id: 3,
        type: 'sent',
        text: 'Hi, I have a question about my deposit.',
        timestamp: '14:21'
    },
    {
        id: 4,
        type: 'received',
        sender: 'Support Team',
        text: 'Sure! Please provide your transaction ID and we will check it for you. 💎',
        timestamp: '14:22',
        avatar: liveChatSupportAvatar
    }
];

export default function LiveChatPage({ onNavigate, authUser }) {
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newMessage = {
            id: Date.now(),
            type: 'sent',
            text: inputValue,
            timestamp: timestamp
        };
        
        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    const handleSuggestedClick = (text) => {
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newMessage = {
            id: Date.now(),
            type: 'sent',
            text: text,
            timestamp: timestamp
        };
        
        setMessages([...messages, newMessage]);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-56px)] md:h-[calc(100vh-100px)] bg-[var(--color-page-default)] animate-in fade-in duration-500">
            {/* Header */}
            <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[var(--color-brand-primary)] shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        type="button" 
                        onClick={() => onNavigate?.('home')}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ChevronLeft size={22} className="text-white" />
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-white/20 border border-white/10 p-0.5 overflow-hidden">
                                <img src={liveChatSupportAvatar} alt="Support" className="w-full h-full object-cover" />
                            </div>
                            <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-[#4ade80] border-2 border-[var(--color-brand-primary)]"></span>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-white leading-none">RioCity9 Support</h2>
                            <div className="mt-1 flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]"></span>
                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider">SUPPORT ONLINE</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" className="p-2 text-white/60 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                </button>
            </header>

            {/* Chat Body */}
            <main className="flex-1 overflow-y-auto px-4 py-8 space-y-6 bg-[var(--color-page-default)]">
                {messages.map((msg) => {
                    if (msg.type === 'date') {
                        return (
                            <div key={msg.id} className="flex justify-center my-8">
                                <span className="px-5 py-1.5 rounded-full bg-white border border-[var(--color-border-default)] text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-widest shadow-sm">
                                    {msg.text}
                                </span>
                            </div>
                        );
                    }

                    const isSent = msg.type === 'sent';

                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isSent ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2 duration-300`}>
                            {!isSent && (
                                <div className="h-9 w-9 rounded-full overflow-hidden border border-[var(--color-border-default)] bg-white shadow-sm shrink-0 mt-1">
                                    <img src={msg.avatar || liveChatSupportAvatar} alt={msg.sender} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className={`flex flex-col max-w-[92%] ${isSent ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1.5 px-1.5">
                                    {!isSent && <span className="text-[11px] font-bold text-[var(--color-brand-primary)]">{msg.sender || 'Support'}</span>}
                                    <span className="text-[10px] font-medium text-[var(--color-text-muted)] opacity-70 uppercase tracking-tight">{msg.timestamp}</span>
                                </div>
                                <div 
                                    className={`px-4 py-3 rounded-[20px] text-[14px] leading-relaxed shadow-sm transition-all
                                        ${isSent 
                                            ? 'bg-[var(--color-brand-primary)] text-white rounded-tr-none font-medium' 
                                            : 'bg-white text-[var(--color-text-strong)] border border-[var(--color-border-default)] rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} className="h-4" />
            </main>

            {/* Bottom Section */}
            <div className="sticky bottom-0 bg-white border-t border-[var(--color-border-default)]">
                {/* Suggested Replies */}
                <div className="px-4 py-3 bg-[var(--color-surface-muted)]/30 border-b border-[var(--color-border-default)]/10">
                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-0.5 scroll-smooth">
                        {SUGGESTED_MESSAGES.map((text) => (
                            <button
                                key={text}
                                type="button"
                                onClick={() => handleSuggestedClick(text)}
                                className="whitespace-nowrap px-4 py-2 rounded-full border border-[var(--color-border-default)] bg-white text-[12px] font-bold text-[var(--color-text-main)] hover:bg-[var(--color-brand-primary)] hover:text-white hover:border-[var(--color-brand-primary)] transition-all shrink-0"
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Bar - Redesigned to match second screenshot exactly */}
                <div className="px-4 py-4 w-full bg-[#f8f9fc]">
                    <div className="flex items-center gap-4 w-full">
                        <button type="button" className="text-[#94a3b8] hover:text-[var(--color-brand-primary)] transition-colors p-1 shrink-0">
                            <Paperclip size={22} />
                        </button>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message here..."
                                className="w-full bg-[#f1f5f9] border-none rounded-xl focus:ring-1 focus:ring-[var(--color-brand-primary)]/20 text-[14px] text-[var(--color-text-strong)] placeholder:text-[#94a3b8] py-3 px-5"
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim()}
                            className={`h-10 w-10 rounded-full transition-all flex items-center justify-center shrink-0 ${
                                inputValue.trim() 
                                    ? 'bg-[var(--color-brand-primary)] text-white shadow-md' 
                                    : 'bg-[#f1f5f9] text-[#94a3b8]'
                            }`}
                        >
                            <Send size={18} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}

