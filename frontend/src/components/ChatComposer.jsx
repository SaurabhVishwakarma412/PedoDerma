import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";

const EMOJIS = [
  { value: "😀", label: "Grinning face" }, { value: "😊", label: "Smiling face" },
  { value: "😂", label: "Face with tears of joy" }, { value: "😍", label: "Smiling face with heart eyes" },
  { value: "🤔", label: "Thinking face" }, { value: "😢", label: "Crying face" },
  { value: "😡", label: "Angry face" }, { value: "👍", label: "Thumbs up" },
  { value: "👎", label: "Thumbs down" }, { value: "👏", label: "Clapping hands" },
  { value: "🙏", label: "Folded hands" }, { value: "❤️", label: "Red heart" },
  { value: "🎉", label: "Party popper" }, { value: "👋", label: "Waving hand" },
  { value: "✅", label: "Check mark" }, { value: "✨", label: "Sparkles" },
];

const ChatComposer = ({ darkMode, onSend, onTyping, recipientId }) => {
  const [draft, setDraft] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const typingTimerRef = useRef(null);

  useEffect(() => {
    setDraft("");
    setSelectedEmoji(null);
    return () => clearTimeout(typingTimerRef.current);
  }, [recipientId]);

  useEffect(() => {
    const closePicker = (event) => {
      if (!emojiPickerRef.current?.contains(event.target)) setShowEmojiPicker(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowEmojiPicker(false);
    };

    document.addEventListener("mousedown", closePicker);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closePicker);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

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
    setSelectedEmoji(emoji);
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
        <div ref={emojiPickerRef} className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((isOpen) => !isOpen)}
            aria-label="Choose an emoji"
            aria-expanded={showEmojiPicker}
            className={`rounded-lg p-2 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${showEmojiPicker ? (darkMode ? "bg-gray-700 text-emerald-400" : "bg-emerald-50 text-emerald-600") : darkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-white"}`}
          >
            <Smile className="w-5 h-5" />
          </button>
          {showEmojiPicker && (
            <div className={`absolute bottom-full left-0 z-50 mb-2 w-[252px] rounded-2xl border p-2.5 shadow-xl ${darkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"}`} role="group" aria-label="Emoji picker">
              <div className="mb-2 px-1 text-xs font-medium text-gray-400">Choose an emoji</div>
              <div className="grid grid-cols-5 gap-1.5">
                {EMOJIS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => insertEmoji(value)}
                    aria-label={`Add ${label}`}
                    aria-pressed={selectedEmoji === value}
                    title={label}
                    className={`flex aspect-square items-center justify-center rounded-xl text-[22px] leading-none transition duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${selectedEmoji === value ? "scale-105 bg-emerald-500 shadow-sm" : darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-emerald-50"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
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
