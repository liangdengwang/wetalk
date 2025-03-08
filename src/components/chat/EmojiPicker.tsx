import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Clock, Star, SmilePlus } from "lucide-react";
import TabBar, { TabItem } from "../common/TabBar";

// 表情数据接口
interface Emoji {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

// 表情分类接口
interface EmojiCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  className = "",
}) => {
  // 表情分类
  const categories: EmojiCategory[] = [
    { id: "recent", name: "最近使用", icon: <Clock className="w-4 h-4" /> },
    { id: "favorite", name: "收藏", icon: <Heart className="w-4 h-4" /> },
    { id: "emotion", name: "表情", icon: <Star className="w-4 h-4" /> },
    { id: "gesture", name: "手势", icon: <SmilePlus className="w-4 h-4" /> },
  ];

  // 转换为 TabBar 需要的格式
  const tabs: TabItem[] = categories.map((cat) => ({
    id: cat.id,
    label: cat.name,
  }));

  // 所有表情数据
  const allEmojis: Emoji[] = [
    // 表情类
    { id: "1", emoji: "😊", name: "微笑", category: "emotion" },
    { id: "2", emoji: "😂", name: "笑哭", category: "emotion" },
    { id: "3", emoji: "😍", name: "喜欢", category: "emotion" },
    { id: "4", emoji: "🥰", name: "爱慕", category: "emotion" },
    { id: "5", emoji: "😎", name: "酷", category: "emotion" },
    { id: "6", emoji: "🤔", name: "思考", category: "emotion" },
    { id: "7", emoji: "😅", name: "尴尬", category: "emotion" },
    { id: "8", emoji: "😱", name: "惊恐", category: "emotion" },
    { id: "9", emoji: "😴", name: "睡觉", category: "emotion" },
    { id: "10", emoji: "🤗", name: "拥抱", category: "emotion" },
    { id: "11", emoji: "😘", name: "亲吻", category: "emotion" },
    { id: "12", emoji: "🙄", name: "翻白眼", category: "emotion" },

    // 手势类
    { id: "13", emoji: "👍", name: "赞", category: "gesture" },
    { id: "14", emoji: "👋", name: "招手", category: "gesture" },
    { id: "15", emoji: "🙏", name: "感谢", category: "gesture" },
    { id: "16", emoji: "👏", name: "鼓掌", category: "gesture" },
    { id: "17", emoji: "🤝", name: "握手", category: "gesture" },
    { id: "18", emoji: "✌️", name: "胜利", category: "gesture" },
    { id: "19", emoji: "👌", name: "OK", category: "gesture" },
    { id: "20", emoji: "🤞", name: "祝福", category: "gesture" },
    { id: "21", emoji: "👊", name: "拳头", category: "gesture" },
    { id: "22", emoji: "✊", name: "加油", category: "gesture" },
    { id: "23", emoji: "🤟", name: "摇滚", category: "gesture" },
    { id: "24", emoji: "🤘", name: "角", category: "gesture" },
  ];

  // 状态
  const [activeCategory, setActiveCategory] = useState<string>("recent");
  const [recentEmojis, setRecentEmojis] = useState<Emoji[]>([]);
  const [favoriteEmojis, setFavoriteEmojis] = useState<Emoji[]>([]);

  // 从本地存储加载最近使用和收藏的表情
  useEffect(() => {
    const storedRecent = localStorage.getItem("recentEmojis");
    const storedFavorites = localStorage.getItem("favoriteEmojis");

    if (storedRecent) {
      try {
        setRecentEmojis(JSON.parse(storedRecent));
      } catch (e) {
        console.error("Failed to parse recent emojis", e);
      }
    }

    if (storedFavorites) {
      try {
        setFavoriteEmojis(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Failed to parse favorite emojis", e);
      }
    }
  }, []);

  // 保存最近使用的表情到本地存储
  const saveRecentEmoji = (emoji: Emoji) => {
    const updatedRecent = [
      emoji,
      ...recentEmojis.filter((e) => e.id !== emoji.id),
    ].slice(0, 12);
    setRecentEmojis(updatedRecent);
    localStorage.setItem("recentEmojis", JSON.stringify(updatedRecent));
  };

  // 切换表情收藏状态
  const toggleFavorite = (emoji: Emoji, e: React.MouseEvent) => {
    // 阻止事件冒泡，防止触发父元素的点击事件
    e.stopPropagation();

    const isFavorite = favoriteEmojis.some((e) => e.id === emoji.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favoriteEmojis.filter((e) => e.id !== emoji.id);
    } else {
      updatedFavorites = [...favoriteEmojis, emoji].slice(0, 24);
    }

    setFavoriteEmojis(updatedFavorites);
    localStorage.setItem("favoriteEmojis", JSON.stringify(updatedFavorites));
  };

  // 处理表情选择
  const handleSelect = (emoji: Emoji) => {
    onEmojiSelect(emoji.emoji);
    saveRecentEmoji(emoji);
  };

  // 处理分类切换
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // 检查表情是否已收藏
  const isEmojiInFavorites = (emojiId: string) => {
    return favoriteEmojis.some((e) => e.id === emojiId);
  };

  // 根据当前分类获取表情列表
  const getEmojisForCategory = () => {
    switch (activeCategory) {
      case "recent":
        return recentEmojis.length > 0 ? recentEmojis : allEmojis.slice(0, 12);
      case "favorite":
        return favoriteEmojis;
      default:
        return allEmojis.filter((emoji) => emoji.category === activeCategory);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
      onClick={(e) => e.stopPropagation()} // 阻止事件冒泡到父元素
    >
      {/* 使用 TabBar 组件 */}
      <TabBar
        tabs={tabs}
        activeTab={activeCategory}
        onChange={handleCategoryChange}
      />

      {/* 表情网格 */}
      <div className="p-2">
        <div className="grid grid-cols-6 gap-1">
          {getEmojisForCategory().map((emoji) => (
            <div key={emoji.id} className="relative">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                onClick={() => handleSelect(emoji)}
                title={emoji.name}
              >
                {emoji.emoji}
              </motion.button>
              <button
                className={`absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-xs ${
                  isEmojiInFavorites(emoji.id)
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                }`}
                onClick={(e) => toggleFavorite(emoji, e)}
                title={isEmojiInFavorites(emoji.id) ? "取消收藏" : "添加到收藏"}
              >
                <Heart className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        点击添加到消息 • 点击❤️收藏表情
      </div>
    </div>
  );
};

export default EmojiPicker;
