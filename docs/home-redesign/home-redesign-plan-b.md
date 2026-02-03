# Vision-RS 主页重设计 - 方案 B：杂志式布局

## 设计规范文档

### 配色系统（Catppuccin Macchiato）

```typescript
const colors = {
  // 背景层级
  base: '#24273a', // 主背景
  mantle: '#1e2030', // 次级背景
  crust: '#181926', // 深层背景

  // 表面层级
  surface0: '#363a4f', // 悬停
  surface1: '#494d64', // 激活
  surface2: '#5b6078', // 选中

  // 文字层级
  text: '#cad3f5', // 主文字
  subtext1: '#b8c0e0', // 次级文字
  subtext0: '#a5adcb', // 辅助文字

  // 强调色
  blue: '#8aadf4', // 链接/主按钮
  lavender: '#b7bdf8', // 标题强调
  rust: '#f5a97f', // 品牌色/CTA
  green: '#a6da95', // 成功
  yellow: '#eed49f', // 警告
  mauve: '#c6a0f6', // 特殊
};
```

---

## 布局架构

### 整体结构

```
┌─────────────────────────────────────────────────────────┐
│  Header (Full Width)                                    │
│  ┌──────────────────────┐  ┌─────────────────────────┐ │
│  │  Logo + Title        │  │  个人简介卡片（悬浮）    │ │
│  │  vision-rs           │  │  - 半透明背景           │ │
│  └──────────────────────┘  │  - Hover 展开           │ │
│                            └─────────────────────────┘ │
│                                                          │
│  Slogan Section (左对齐，大字体)                         │
│  ━━━━━━━━━━━━                                           │
│                                                          │
│  Code Showcase (倾斜切角，非对称布局)                    │
│  ┌─────────────────────────────────────────┐            │
│  │  [源码]                │  [编译错误]     │            │
│  │  45度倾斜切角           │                │            │
│  └─────────────────────────────────────────┘            │
│                                                          │
│  Stats & Messages (不规则网格)                          │
│  ┌──────────────┐  ┌─────────────────────┐             │
│  │  访问统计     │  │  留言板              │             │
│  │  (圆形图表)   │  │  (瀑布流)            │             │
│  └──────────────┘  └─────────────────────┘             │
│                                                          │
│  Footer                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 核心设计元素

### 1. 个人简介卡片（右上角悬浮）

**位置**: 固定在视口右上角
**尺寸**: 320px × 自适应
**背景**: 半透明 `rgba(30, 32, 48, 0.8)` + 高斯模糊
**边框**: 渐变边框（rust → lavender）

**状态**:

- 默认：显示头像 + 两行文字
- Hover：展开显示完整简介 + 联系方式

```css
.bio-card {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 320px;
  background: rgba(30, 32, 48, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid transparent;
  border-image: linear-gradient(135deg, #f5a97f, #b7bdf8) 1;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.bio-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(245, 169, 127, 0.2);
}
```

**内容**:

```
┌─────────────────────────┐
│  [头像占位]              │
│                         │
│  已加入 Vibe Coding 阵营，│
│  践行无边界开发理念。    │
│  深耕服务端编程，        │
│  其他领域仍在探索。      │
│                         │
│  ─────────────────────  │
│  > 查看更多 ↓           │
└─────────────────────────┘
```

---

### 2. Hero 区域（非对称布局）

**标题设计**:

- 字体大小：`clamp(4rem, 10vw, 8rem)`
- 字重：700
- 渐变色：rust → peach → yellow
- 字间距：`-0.04em`（更紧凑）

**Slogan**:

- 位置：标题下方，左对齐
- 最大宽度：60% 视口宽度
- 字体大小：`1.5rem`
- 行高：1.8
- 颜色：`subtext1`

**分割线**:

```css
.hero-divider {
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, #f5a97f 0%, transparent 100%);
  margin: 2rem 0;
}
```

---

### 3. 代码展示区（倾斜切角）

**布局革新**:

- 移除传统卡片边框
- 使用 `clip-path` 创建 45 度切角
- 背景渐变：`mantle → crust`

```css
.code-showcase {
  position: relative;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2px;
  margin: 4rem 0;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%);
  background: linear-gradient(135deg, #1e2030 0%, #181926 100%);
}

.code-panel {
  padding: 2rem;
  position: relative;
}

.code-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #f5a97f 50%, transparent 100%);
}
```

**行号设计**:

- 垂直排列在左侧
- 固定宽度：40px
- 颜色：`overlay0`
- 与代码内容分离

---

### 4. 访问统计（圆形图表）

**设计改动**:

- 替换折线图为圆形进度环
- 中心显示总访问数
- 环形图显示趋势

```tsx
<CircularProgress
  percentage={(todayVisitors / maxVisitors) * 100}
  strokeWidth={8}
  strokeColor={colors.rust}
  backgroundColor={colors.surface0}
>
  <div className="stats-center">
    <h3>{totalVisitors}</h3>
    <p>总访问量</p>
  </div>
</CircularProgress>
```

---

### 5. 留言板（瀑布流）

**布局改动**:

- 不规则卡片高度
- Masonry 瀑布流布局
- 卡片悬浮效果

```css
.messages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  grid-auto-flow: dense;
}

.message-card {
  background: rgba(54, 58, 79, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.message-card:hover {
  transform: translateY(-4px);
  background: rgba(73, 77, 100, 0.7);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
```

---

## 响应式设计

### 断点系统

```css
/* 桌面 */
@media (min-width: 1024px) {
  /* 完整杂志式布局 */
}

/* 平板 */
@media (max-width: 1023px) and (min-width: 768px) {
  /* 简化网格，保留非对称 */
  .bio-card {
    position: static;
    margin: 2rem auto;
  }
}

/* 移动端 */
@media (max-width: 767px) {
  /* 单列布局，移除倾斜效果 */
  .code-showcase {
    clip-path: none;
    grid-template-columns: 1fr;
  }

  .bio-card {
    width: 100%;
    position: static;
  }
}
```

---

## 动画系统

### 入场动画

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

.hero-slogan {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

.code-showcase {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
}
```

### 微交互

```css
/* 链接悬停 */
a {
  position: relative;
  transition: color 0.2s ease;
}

a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

a:hover::after {
  width: 100%;
}
```

---

## 设计检查清单

### 视觉层次

- [x] 清晰的主次关系
- [x] 合理的留白比例
- [x] 渐进式信息展示

### 交互反馈

- [x] 所有可点击元素有 hover 状态
- [x] 表单输入有 focus 反馈
- [x] 动画流畅（60fps）

### 可访问性

- [x] 文字对比度 ≥ 4.5:1（WCAG AA）
- [x] 支持键盘导航
- [x] 适当的 ARIA 标签

### 性能

- [x] 无布局抖动
- [x] 图片懒加载
- [x] CSS 动画使用 `transform` 和 `opacity`

---

## 实现优先级

### Phase 1: 布局框架（1 小时）

1. 非对称网格系统
2. 个人简介卡片
3. 响应式断点

### Phase 2: 视觉增强（1 小时）

1. 代码区倾斜切角
2. 渐变分割线
3. 卡片悬浮效果

### Phase 3: 细节打磨（30 分钟）

1. 微动效
2. 入场动画
3. 性能优化

---

## 设计哲学总结

**杂志式布局的核心**：

1. **打破常规**：非对称网格，拒绝中规中矩
2. **大胆留白**：间距是设计的一部分，不是浪费
3. **视觉流动**：引导用户视线，创造阅读节奏
4. **克制使用装饰**：每个元素都有目的，不为装饰而装饰

**极简主义原则**：

- 移除所有不必要的图标和装饰
- 用排版和留白创造视觉冲击
- 让内容本身成为设计

---

Next: 开始实现！
