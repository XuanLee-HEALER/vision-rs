import { TocItem } from './types';

/**
 * 从 MDX 内容中提取标题，生成目录
 * @param content MDX 内容字符串
 * @returns 目录项数组
 */
export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // ## = 2, ### = 3
    const text = match[2].trim();

    // 生成 ID（小写，空格替换为连字符）
    const id = text
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '') // 保留中文、英文、数字、空格和连字符
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({
      id,
      text,
      level,
    });
  }

  return toc;
}

/**
 * 将扁平的 TOC 列表转换为树形结构
 */
export function buildTocTree(items: TocItem[]): TocItem[] {
  const tree: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of items) {
    const newItem = { ...item, children: [] };

    // 找到合适的父级
    while (stack.length > 0 && stack[stack.length - 1].level >= newItem.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 顶级项
      tree.push(newItem);
    } else {
      // 子项
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(newItem);
    }

    stack.push(newItem);
  }

  return tree;
}
