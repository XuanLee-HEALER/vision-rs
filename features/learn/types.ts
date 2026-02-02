/**
 * 课程内容的 frontmatter 元数据
 */
export interface LessonFrontmatter {
  title: string;
  description?: string;
  category: string;
  order?: number;
  tags?: string[];
  author?: string;
  date?: string;
}

/**
 * 完整的课程数据（包含内容）
 */
export interface Lesson {
  slug: string;
  frontmatter: LessonFrontmatter;
  content: string;
  toc?: TocItem[];
}

/**
 * 目录项（Table of Contents）
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

/**
 * 导航树节点
 */
export interface NavItem {
  title: string;
  href: string;
  items?: NavItem[]; // 支持子项（用于二级导航）
}

export interface NavSubsection {
  name: string;
  items: NavItem[];
}

export interface NavSection {
  title: string;
  icon: string;
  href?: string; // Section 首页链接
  items?: NavItem[];
  subsections?: NavSubsection[];
}

/**
 * 面包屑项
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
