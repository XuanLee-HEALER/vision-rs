import { NextResponse } from 'next/server';
import path from 'path';
import { realpath } from 'fs/promises';

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
 * 多层防护：检查 NODE_ENV 和 Vercel 环境变量
 */
export function devGuard(): NextResponse | null {
  // 检查1: NODE_ENV
  if (!isDevelopment()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 检查2: Vercel 生产环境（防止 NODE_ENV 误配）
  if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return null;
}

/**
 * 验证路径安全性（异步版本，解析符号链接防止绕过）
 * @param relativePath 相对于LEARN_ROOT的路径
 * @returns 如果安全，返回绝对路径；否则抛出错误
 */
export async function validatePath(relativePath: string): Promise<string> {
  // 移除开头的斜杠
  const cleanPath = relativePath.replace(/^\/+/, '');

  // 解析为绝对路径
  const absolutePath = path.join(LEARN_ROOT, cleanPath);

  // 规范化路径（解析 .. 等）
  const normalizedPath = path.normalize(absolutePath);

  // 确保是.mdx文件（在解析符号链接前检查）
  if (!normalizedPath.endsWith('.mdx')) {
    throw new Error('Invalid path: must be an .mdx file');
  }

  // 解析符号链接获取真实路径
  let realPath: string;
  try {
    realPath = await realpath(normalizedPath);
  } catch {
    throw new Error('Invalid path: file does not exist');
  }

  // 同时解析 LEARN_ROOT 的真实路径
  let realLearnRoot: string;
  try {
    realLearnRoot = await realpath(LEARN_ROOT);
  } catch {
    throw new Error('Invalid path: learn directory does not exist');
  }

  // 确保真实路径在 LEARN_ROOT 之下
  if (!realPath.startsWith(realLearnRoot + path.sep) && realPath !== realLearnRoot) {
    throw new Error('Invalid path: must be under learn directory');
  }

  // 确保真实路径也是 .mdx 文件
  if (!realPath.endsWith('.mdx')) {
    throw new Error('Invalid path: must be an .mdx file');
  }

  return realPath;
}

/**
 * 验证写入路径安全性（允许文件不存在，用于创建新文件）
 * @param relativePath 相对于LEARN_ROOT的路径
 * @returns 如果安全，返回规范化的绝对路径；否则抛出错误
 */
export async function validateWritePath(relativePath: string): Promise<string> {
  // 移除开头的斜杠
  const cleanPath = relativePath.replace(/^\/+/, '');

  // 解析为绝对路径
  const absolutePath = path.join(LEARN_ROOT, cleanPath);

  // 规范化路径（解析 .. 等）
  const normalizedPath = path.normalize(absolutePath);

  // 确保是.mdx文件
  if (!normalizedPath.endsWith('.mdx')) {
    throw new Error('Invalid path: must be an .mdx file');
  }

  // 获取父目录路径
  const parentDir = path.dirname(normalizedPath);

  // 解析父目录的真实路径（父目录必须存在）
  let realParentDir: string;
  try {
    realParentDir = await realpath(parentDir);
  } catch {
    throw new Error('Invalid path: parent directory does not exist');
  }

  // 解析 LEARN_ROOT 的真实路径
  let realLearnRoot: string;
  try {
    realLearnRoot = await realpath(LEARN_ROOT);
  } catch {
    throw new Error('Invalid path: learn directory does not exist');
  }

  // 确保父目录在 LEARN_ROOT 之下
  if (!realParentDir.startsWith(realLearnRoot + path.sep) && realParentDir !== realLearnRoot) {
    throw new Error('Invalid path: must be under learn directory');
  }

  // 返回规范化的路径（基于真实父目录 + 文件名）
  const fileName = path.basename(normalizedPath);
  return path.join(realParentDir, fileName);
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
