import React, { useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";

interface AutoResizeTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: number;
  minHeight?: number;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "",
  className = "",
  maxHeight = 150,
  minHeight = 36,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 调整文本区域的高度
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 重置高度，以便我们可以计算实际内容的高度
    textarea.style.height = "auto";

    // 计算新的高度，但不超过最大高度
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);

    // 设置新的高度，但不小于最小高度
    textarea.style.height = `${Math.max(newHeight, minHeight)}px`;

    // 如果内容高度超过最大高度，启用滚动
    textarea.style.overflowY = newHeight === maxHeight ? "auto" : "hidden";
  };

  // 当值变化时调整高度
  useEffect(() => {
    adjustHeight();
  }, [value, maxHeight, minHeight]);

  // 处理输入事件
  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    adjustHeight();
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInput}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className}`}
      style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
      rows={1}
    />
  );
};

export default AutoResizeTextarea;
