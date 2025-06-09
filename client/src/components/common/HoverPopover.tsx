import React, { useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HoverPopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  contentClassName?: string;
  showOnClick?: boolean;
  closeOnSelect?: boolean;
}

const HoverPopover: React.FC<HoverPopoverProps> = ({
  trigger,
  content,
  position = "top",
  className = "",
  contentClassName = "",
  showOnClick = false,
  closeOnSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!showOnClick) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!showOnClick) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (showOnClick) {
      setIsOpen(!isOpen);
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (closeOnSelect && showOnClick) {
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && showOnClick) {
        const isClickInTrigger = triggerRef.current?.contains(e.target as Node);
        const isClickInContent = contentRef.current?.contains(e.target as Node);

        if (!isClickInTrigger && !isClickInContent) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, showOnClick]);

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-2";
      case "bottom":
        return "top-full mt-2";
      case "left":
        return "right-full mr-2";
      case "right":
        return "left-full ml-2";
      default:
        return "bottom-full mb-2";
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      ref={triggerRef}
    >
      {trigger}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-50 ${getPositionStyles()} ${contentClassName}`}
            onClick={handleContentClick}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverPopover;
