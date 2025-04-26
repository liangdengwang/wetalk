import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import EmojiPicker from "../EmojiPicker";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onEmojiSelect,
  className = "",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);

  const handleIsVisibleEmojiPicker = (e:React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setIsOpenEmojiPicker(!isOpenEmojiPicker);
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prevMessage) => prevMessage + emoji);
    onEmojiSelect(emoji);
    setIsOpenEmojiPicker(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 自动调整文本区域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpenEmojiPicker &&
        !event.composedPath().includes(textareaRef.current as Node)&&//这个是判断点击的元素是否在textareaRef.current这个元素内部，如果是，则不执行下面的代码
        !event.composedPath().includes(emojiPickerRef.current as Node)
      ) {
        setIsOpenEmojiPicker(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpenEmojiPicker]);

  return (
    <div
      className={`px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-end bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <button
            type="button"
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-1"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="发送消息到 #一般聊天"
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-1"
            rows={1}
          />

          <div className="flex items-center">
            <button
              type="button"
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mx-1"
              onClick={handleIsVisibleEmojiPicker}
            >
              <Smile className="w-5 h-5" />
            </button>
            {isOpenEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-25 right-30 z-10">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            )}

            <button
              type="button"
              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ml-1"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              type="submit"
              className={`p-1 rounded-full ml-2 ${
                message.trim()
                  ? "text-white bg-[#5865F2] hover:bg-[#4752c4]"
                  : "text-gray-400 bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
              }`}
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
