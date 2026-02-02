// Types
export type {
  Lesson,
  LessonFrontmatter,
  TocItem,
  NavItem,
  NavSection,
  NavSubsection,
  BreadcrumbItem,
} from './types';

// Navigation
export { generateNavigation, getNavigation } from './navigation.server';

// Note: Table of Contents is now handled client-side via components/mdx/TableOfContents.tsx
// using DOM scanning + Intersection Observer (no server-side extraction needed)
