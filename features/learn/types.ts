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
}

export interface NavSubsection {
  name: string;
  items: NavItem[];
}

export interface NavSection {
  title: string;
  icon: string;
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
