import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Octokit } from '@octokit/rest';

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
 * 使用 GitHub API 进行更新，兼容 Serverless 环境
 */
export async function updateUnderstanding(params: UpdateUnderstandingParams) {
  const isProduction = process.env.NODE_ENV === 'production';
  const githubToken = process.env.GITHUB_TOKEN;
  const githubOwner = process.env.GITHUB_OWNER;
  const githubRepo = process.env.GITHUB_REPO;
  const githubBranch = process.env.GITHUB_BRANCH || 'main';

  // 在生产环境且配置了 GitHub Token，使用 GitHub API
  if (isProduction && githubToken && githubOwner && githubRepo) {
    return await updateViaGitHubAPI(params, {
      token: githubToken,
      owner: githubOwner,
      repo: githubRepo,
      branch: githubBranch,
    });
  }

  // 开发环境或未配置 GitHub API，使用本地文件系统（仅限开发）
  if (!isProduction) {
    return await updateViaFileSystem(params);
  }

  throw new Error(
    'GitHub API not configured. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.'
  );
}

/**
 * 通过 GitHub API 更新文件
 */
async function updateViaGitHubAPI(
  params: UpdateUnderstandingParams,
  config: { token: string; owner: string; repo: string; branch: string }
) {
  const octokit = new Octokit({ auth: config.token });
  const filePath = `content/mental-model/${params.chapterId}.mdx`;

  try {
    // 1. 获取文件当前内容和 SHA
    const { data: fileData } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      ref: config.branch,
    });

    if (!('content' in fileData)) {
      throw new Error('File not found or is a directory');
    }

    // 2. 解码并修改内容
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const newContent = replaceUnderstandingSection(currentContent, params.content);

    // 3. 提交更新
    await octokit.repos.createOrUpdateFileContents({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      message: `Update understanding for ${params.chapterId}\n\nEdited by: ${params.email}`,
      content: Buffer.from(newContent).toString('base64'),
      sha: fileData.sha,
      branch: config.branch,
    });

    console.log(`Successfully updated ${params.chapterId} via GitHub API`);
    return { success: true, method: 'github-api' };
  } catch (error) {
    console.error('GitHub API update failed:', error);
    throw new Error(
      `Failed to update via GitHub API: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * 通过本地文件系统更新（仅限开发环境）
 */
async function updateViaFileSystem(params: UpdateUnderstandingParams) {
  const filePath = path.join(CONTENT_DIR, `${params.chapterId}.mdx`);

  // 验证文件存在
  if (!fs.existsSync(filePath)) {
    throw new Error(`Chapter file not found: ${params.chapterId}`);
  }

  // 读取并修改文件
  const original = fs.readFileSync(filePath, 'utf-8');
  const newContent = replaceUnderstandingSection(original, params.content);

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

  console.log(`Successfully updated ${params.chapterId} via file system (dev mode)`);
  return { success: true, method: 'file-system' };
}

/**
 * 替换"我的理解"部分的内容
 */
function replaceUnderstandingSection(originalContent: string, newContent: string): string {
  const marker = '## 我的理解';
  const markerIndex = originalContent.lastIndexOf(marker);

  if (markerIndex === -1) {
    throw new Error('Understanding section not found in file');
  }

  // 构造新内容（保留标记之前的所有内容）
  const beforeMarker = originalContent.substring(0, markerIndex);
  return `${beforeMarker}${marker}\n\n> 此部分可通过管理后台编辑\n\n${newContent.trim()}\n`;
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
