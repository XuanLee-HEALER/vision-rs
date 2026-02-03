import { NextResponse } from 'next/server';
import path from 'path';

/**
 * 可编辑的MDX文件根目录
 */
export const LEARN_ROOT = path.join(process.cwd(), 'app', '(site)', 'learn');

/**
 * 检查是否在开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 开发环境守卫 - 如果不在开发环境，返回404响应
 */
export function devGuard(): NextResponse | null {
  if (!isDevelopment()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return null;
}

/**
 * 验证路径安全性
 * @param relativePath 相对于LEARN_ROOT的路径
 * @returns 如果安全，返回绝对路径；否则抛出错误
 */
export function validatePath(relativePath: string): string {
  // 移除开头的斜杠
  const cleanPath = relativePath.replace(/^\/+/, '');

  // 解析为绝对路径
  const absolutePath = path.join(LEARN_ROOT, cleanPath);

  // 规范化路径（解析 .. 等）
  const normalizedPath = path.normalize(absolutePath);

  // 确保路径在LEARN_ROOT之下
  if (!normalizedPath.startsWith(LEARN_ROOT)) {
    throw new Error('Invalid path: must be under learn directory');
  }

  // 确保是.mdx文件
  if (!normalizedPath.endsWith('.mdx')) {
    throw new Error('Invalid path: must be an .mdx file');
  }

  return normalizedPath;
}

/**
 * 将绝对路径转换为相对路径（相对于LEARN_ROOT）
 */
export function toRelativePath(absolutePath: string): string {
  return path.relative(LEARN_ROOT, absolutePath);
}

/**
 * 从路径推断标题
 */
export function inferTitleFromPath(relativePath: string): string {
  const parts = relativePath.split('/');
  const fileName = parts[parts.length - 2] || 'Untitled'; // page.mdx的父目录名
  return fileName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 提取文件的category（从路径判断）
 */
export function extractCategory(relativePath: string): string {
  const parts = relativePath.split('/');
  if (parts.length > 1) {
    return parts[0]; // concepts, crates, mental-model等
  }
  return 'other';
}

/**
 * 从路径生成URL
 */
export function pathToUrl(relativePath: string): string {
  // 移除 /page.mdx 后缀
  const urlPath = relativePath.replace(/\/page\.mdx$/, '');
  return `/learn/${urlPath}`;
}
