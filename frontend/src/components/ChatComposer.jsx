import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";

const ChatComposer = ({ darkMode, onSend, onTyping, recipientId }) => {
  const [draft, setDraft] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const emojis = ["😀", "😊", "😂", "😍", "😢", "😡", "👍", "👎", "👏", "🙏", "❤️", "🎉", "🤔", "👋", "✅", "✨"];

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

  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? draft.length;
    const end = input?.selectionEnd ?? draft.length;
    const nextDraft = `${draft.slice(0, start)}${emoji}${draft.slice(end)}`;

    setDraft(nextDraft);
    setShowEmojiPicker(false);

    requestAnimationFrame(() => {
      input?.focus();
      const caret = start + emoji.length;
      input?.setSelectionRange(caret, caret);
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`relative z-50 border-t p-2 sm:p-3 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-[#f0f2f5]"} shrink-0`}>
      <div className="relative flex items-center gap-1 sm:gap-2">
        <button type="button" className={`hidden p-2 rounded-lg transition sm:block ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-white text-gray-500"}`}><Paperclip className="w-5 h-5" /></button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((isOpen) => !isOpen)}
            aria-label="Choose an emoji"
            aria-expanded={showEmojiPicker}
            className={`p-2 rounded-lg transition ${darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-white text-gray-500"}`}
          >
            <Smile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className={`absolute bottom-full left-0 z-50 mb-2 grid w-fit grid-cols-4 gap-1 rounded-xl border p-2 shadow-lg ${darkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"}`} role="group" aria-label="Emoji picker">
              {emojis.map((emoji) => (
                <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className={`flex h-10 w-10 items-center justify-center text-xl leading-none transition ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`} aria-label={`Add ${emoji}`}>
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <input ref={inputRef} type="text" value={draft} onChange={handleChange} placeholder="Type your message..." className={`min-w-0 flex-1 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500" : "bg-white border border-gray-300"}`} />
        <button type="submit" disabled={!draft.trim()} aria-label="Send message" className={`rounded-full p-2.5 transition-all duration-300 ${draft.trim() ? "bg-[#00a884] text-white hover:bg-[#008f72]" : darkMode ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}><Send className="w-5 h-5" /></button>
      </div>
    </form>
  );
};

export default ChatComposer;
