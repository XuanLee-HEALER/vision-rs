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
 * 多层防护：检查 NODE_ENV、Vercel 环境变量、DEV_MDX_TOKEN
 */
export function devGuard(): NextResponse | null {
  // 检查1: NODE_ENV
  if (!isDevelopment()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 检查2: Vercel 环境（防止 NODE_ENV 误配）
  // 在任何 Vercel 环境下都拒绝访问（包括预览和生产）
  if (process.env.VERCEL_ENV || process.env.VERCEL) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 检查3: 强校验 - 要求显式的 DEV_MDX_ENABLED 标志
  // 防止在非预期环境下意外启用 dev API
  if (process.env.DEV_MDX_ENABLED !== 'true') {
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

/**
 * 验证创建路径安全性（允许父目录不存在，用于创建新目录）
 * @param relativePath 相对于LEARN_ROOT的路径
 * @returns 如果安全，返回规范化的绝对路径；否则抛出错误
 */
export async function validateCreatePath(relativePath: string): Promise<string> {
  // 移除开头的斜杠
  const cleanPath = relativePath.replace(/^\/+/, '');

  // 禁止空路径
  if (!cleanPath) {
    throw new Error('Invalid path: path cannot be empty');
  }

  // 禁止只有扩展名的文件名
  if (cleanPath === '.mdx' || cleanPath.endsWith('/.mdx')) {
    throw new Error('Invalid path: filename cannot be empty');
  }

  // 解析为绝对路径
  const absolutePath = path.join(LEARN_ROOT, cleanPath);

  // 规范化路径（解析 .. 等）
  const normalizedPath = path.normalize(absolutePath);

  // 确保是.mdx文件
  if (!normalizedPath.endsWith('.mdx')) {
    throw new Error('Invalid path: must be an .mdx file');
  }

  // 验证 LEARN_ROOT 目录存在
  try {
    await realpath(LEARN_ROOT);
  } catch {
    throw new Error('Invalid path: learn directory does not exist');
  }

  // 确保规范化后的路径在 LEARN_ROOT 之下
  const normalizedLearnRoot = path.normalize(LEARN_ROOT);
  if (
    !normalizedPath.startsWith(normalizedLearnRoot + path.sep) &&
    normalizedPath !== normalizedLearnRoot
  ) {
    throw new Error('Invalid path: must be under learn directory');
  }

  return normalizedPath;
}

/**
 * 验证目录路径安全性（用于删除空目录）
 * @param relativePath 相对于LEARN_ROOT的目录路径
 * @returns 如果安全，返回绝对路径；否则抛出错误
 */
export async function validateDirectoryPath(relativePath: string): Promise<string> {
  // 移除开头的斜杠
  const cleanPath = relativePath.replace(/^\/+/, '');

  // 禁止空路径（防止删除 LEARN_ROOT 本身）
  if (!cleanPath) {
    throw new Error('Invalid path: cannot operate on root directory');
  }

  // 解析为绝对路径
  const absolutePath = path.join(LEARN_ROOT, cleanPath);

  // 规范化路径
  const normalizedPath = path.normalize(absolutePath);

  // 解析 LEARN_ROOT 的真实路径
  let realLearnRoot: string;
  try {
    realLearnRoot = await realpath(LEARN_ROOT);
  } catch {
    throw new Error('Invalid path: learn directory does not exist');
  }

  // 验证目录存在
  let realPath: string;
  try {
    realPath = await realpath(normalizedPath);
  } catch {
    throw new Error('Invalid path: directory does not exist');
  }

  // 确保真实路径在 LEARN_ROOT 之下（但不能是 LEARN_ROOT 本身）
  if (!realPath.startsWith(realLearnRoot + path.sep)) {
    throw new Error('Invalid path: must be under learn directory');
  }

  return realPath;
}
