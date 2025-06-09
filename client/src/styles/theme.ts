// Discord 风格的主题配置

// 主色调
export const colors = {
  // 品牌色
  brand: {
    primary: "#5865F2", // Discord 蓝色
    secondary: "#57F287", // Discord 绿色
    danger: "#ED4245", // Discord 红色
    warning: "#FEE75C", // Discord 黄色
    info: "#5865F2", // Discord 蓝色
  },

  // 亮色模式
  light: {
    background: {
      primary: "#FFFFFF",
      secondary: "#F2F3F5",
      tertiary: "#E3E5E8",
      accent: "#5865F2",
    },
    text: {
      primary: "#2E3338",
      secondary: "#4F5660",
      muted: "#747F8D",
      accent: "#5865F2",
      inverse: "#FFFFFF",
    },
    border: {
      primary: "#E3E5E8",
      secondary: "#D4D7DC",
    },
    status: {
      online: "#57F287",
      idle: "#FEE75C",
      dnd: "#ED4245",
      offline: "#747F8D",
    },
  },

  // 暗色模式
  dark: {
    background: {
      primary: "#36393F",
      secondary: "#2F3136",
      tertiary: "#202225",
      accent: "#5865F2",
    },
    text: {
      primary: "#DCDDDE",
      secondary: "#B9BBBE",
      muted: "#72767D",
      accent: "#5865F2",
      inverse: "#2E3338",
    },
    border: {
      primary: "#202225",
      secondary: "#40444B",
    },
    status: {
      online: "#57F287",
      idle: "#FEE75C",
      dnd: "#ED4245",
      offline: "#72767D",
    },
  },
};

// 圆角
export const borderRadius = {
  sm: "3px",
  md: "5px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  full: "9999px",
};

// 阴影
export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
  "2xl": "0 25px 50px rgba(0, 0, 0, 0.2)",
};

// 过渡
export const transitions = {
  fast: "0.1s",
  normal: "0.2s",
  slow: "0.3s",
};

// 字体
export const fonts = {
  body: 'Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif',
  heading: 'Ginto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: 'Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace',
};

// 字体大小
export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
};

// 字体粗细
export const fontWeights = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// 行高
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

// 间距
export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
};
