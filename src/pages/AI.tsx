import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/UI';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const AI: React.FC = () => {
  const { state } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `Hello ${state.userProfile.name}! I'm your Personal Life Coach. I've analyzed your health, habits, and goals. How can I help you optimize your life today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please check your environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });

      const { userProfile, dailyData, habits, education, goals, tasks } = state;
      const latestEntry = dailyData.length > 0 ? [...dailyData].sort((a, b) => b.dayNumber - a.dayNumber)[0] : null;
      const currentWeight = latestEntry ? latestEntry.actualWeight : userProfile.startingWeight;

      // Construct system context from user data
      const systemContext = `
        You are an expert Personal Life Coach for ${userProfile.name}.
        Your goal is to help them achieve their life goals, specifically their weight loss target of ${userProfile.targetWeight}kg (starting from ${userProfile.startingWeight}kg).
        
        Current Stats:
        - Current Weight: ${currentWeight}kg
        - Height: ${userProfile.height}cm
        - Goal Duration: ${userProfile.goalDuration} days
        - Start Date: ${userProfile.startDate}
        
        Current Habits: ${habits.map(h => `${h.name} (${h.streak} day streak)`).join(', ')}
        Active Goals: ${goals.filter(g => g.status === 'In Progress').map(g => g.title).join(', ')}
        Current Learning: ${education.filter(c => c.status === 'In Progress').map(c => c.name).join(', ')}
        Pending Tasks: ${tasks.filter(t => !t.completed).map(t => t.text).join(', ')}
        
        Analyze the user's progress and provide actionable, encouraging, and data-driven advice. 
        Be concise but impactful. Use a professional yet friendly tone.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.slice(1).map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemContext
        }
      });

      const replyText = response.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', content: replyText }]);
    } catch (error: any) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', content: `Error: ${error.message || 'Failed to connect to AI Coach.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">AI Life Coach</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 mb-6">Your personal advisor powered by Gemini.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600 ml-3' : 'bg-emerald-100 text-emerald-600 mr-3'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none'}`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 mr-3 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI coach..."
              className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
