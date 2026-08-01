import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";

const ChatComposer = ({ darkMode, onSend, onTyping, recipientId }) => {
  const [draft, setDraft] = useState("");
  const typingTimerRef = useRef(null);

  useEffect(() => {
    setDraft("");
    return () => clearTimeout(typingTimerRef.current);
  }, [recipientId]);

  const handleChange = (event) => {
    const value = event.target.value;
    setDraft(value);
    clearTimeout(typingTimerRef.current);
    if (value.trim()) typingTimerRef.current = setTimeout(onTyping, 300);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;
    if (await onSend(message)) setDraft("");
  };

  return (
    <form onSubmit={handleSubmit} className={`border-t p-2 sm:p-3 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-[#f0f2f5]"} shrink-0`}>
      <div className="flex items-center gap-1 sm:gap-2">
        <button type="button" className={`hidden p-2 rounded-lg transition sm:block ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-white text-gray-500"}`}><Paperclip className="w-5 h-5" /></button>
        <button type="button" className={`p-2 rounded-lg transition ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-white text-gray-500"}`}><Smile className="w-5 h-5" /></button>
        <input type="text" value={draft} onChange={handleChange} placeholder="Type your message..." className={`min-w-0 flex-1 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500" : "bg-white border border-gray-300"}`} />
        <button type="submit" disabled={!draft.trim()} aria-label="Send message" className={`rounded-full p-2.5 transition-all duration-300 ${draft.trim() ? "bg-[#00a884] text-white hover:bg-[#008f72]" : darkMode ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><Send className="w-5 h-5" /></button>
      </div>
    </form>
  );
};

export default ChatComposer;
