import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';

const CONTENT_DIR = path.join(process.cwd(), 'content/mental-model');

export interface UpdateUnderstandingParams {
  chapterId: string; // e.g., "1-1-crates-items"
  content: string; // 新的"我的理解"内容
  email: string; // 操作者邮箱
}

export interface Chapter {
  id: string;
  title: string;
  part: string;
  partTitle: string;
}

/**
 * 更新章节的"我的理解"部分
 */
export async function updateUnderstanding(params: UpdateUnderstandingParams) {
  const filePath = path.join(CONTENT_DIR, `${params.chapterId}.mdx`);

  // 验证文件存在
  if (!fs.existsSync(filePath)) {
    throw new Error(`Chapter file not found: ${params.chapterId}`);
  }

  // 读取原文件
  const original = fs.readFileSync(filePath, 'utf-8');

  // 定位"我的理解"部分
  const marker = '## 我的理解';
  const markerIndex = original.lastIndexOf(marker);

  if (markerIndex === -1) {
    throw new Error('Understanding section not found in file');
  }

  // 构造新内容（保留标记之前的所有内容）
  const beforeMarker = original.substring(0, markerIndex);
  const newContent = `${beforeMarker}${marker}\n\n> 此部分可通过管理后台编辑\n\n${params.content.trim()}\n`;

  // 原子性写入 (tmp -> rename)
  const tmpPath = `${filePath}.tmp`;
  try {
    fs.writeFileSync(tmpPath, newContent, 'utf-8');
    fs.renameSync(tmpPath, filePath);
  } catch (error) {
    // 清理临时文件
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
    throw error;
  }

  // Git 提交
  try {
    const safeFilePath = filePath.replace(/'/g, "'\\''");
    const safeChapterId = params.chapterId.replace(/'/g, "'\\''");
    const safeEmail = params.email.replace(/'/g, "'\\''");

    execSync(`git add '${safeFilePath}'`, { cwd: process.cwd() });
    execSync(
      `git commit -m 'Update understanding for ${safeChapterId}\n\nEdited by: ${safeEmail}'`,
      { cwd: process.cwd() }
    );

    console.log(`Successfully committed changes for ${params.chapterId}`);
  } catch (error) {
    console.error('Git commit failed:', error);
    // 不影响文件更新，仅记录日志
  }

  return { success: true };
}

/**
 * 获取章节的"我的理解"部分内容
 */
export function getUnderstandingSection(chapterId: string): string {
  const filePath = path.join(CONTENT_DIR, `${chapterId}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Chapter file not found: ${chapterId}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { content } = matter(fileContent);

  const marker = '## 我的理解';
  const markerIndex = content.lastIndexOf(marker);

  if (markerIndex === -1) {
    return ''; // 没有找到"我的理解"部分
  }

  // 提取"## 我的理解"之后的所有内容
  const afterMarker = content.substring(markerIndex + marker.length).trim();

  // 移除提示文本
  const lines = afterMarker.split('\n');
  const filteredLines = lines.filter((line) => !line.includes('此部分可通过管理后台编辑'));

  return filteredLines.join('\n').trim();
}

/**
 * 获取所有章节列表
 */
export function getAllChapters(): Chapter[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR);
  const chapters: Chapter[] = [];

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;

    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (data.title) {
      chapters.push({
        id: file.replace('.mdx', ''),
        title: data.title,
        part: data.part || '',
        partTitle: data.partTitle || '',
      });
    }
  }

  // 按照文件名排序
  chapters.sort((a, b) => a.id.localeCompare(b.id));

  return chapters;
}

/**
 * 获取章节的完整信息（包括 frontmatter）
 */
export function getChapterInfo(chapterId: string) {
  const filePath = path.join(CONTENT_DIR, `${chapterId}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Chapter file not found: ${chapterId}`);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  return {
    id: chapterId,
    title: data.title || chapterId,
    part: data.part || '',
    partTitle: data.partTitle || '',
    ...data,
  };
}
