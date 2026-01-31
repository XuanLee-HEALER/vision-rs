import { kv } from '@vercel/kv';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'hidden' | 'archived';
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  order: number;
}

export interface ArticleMetadata extends Omit<Article, 'content'> {}

export interface User {
  email: string;
  passwordHash: string;
}

// User operations
export async function getUser(email: string): Promise<User | null> {
  return kv.get<User>(`user:${email}`);
}

export async function createUser(email: string, passwordHash: string): Promise<void> {
  await kv.set(`user:${email}`, { email, passwordHash });
}

// Article operations
export async function getArticleMetadata(id: string): Promise<ArticleMetadata | null> {
  return kv.get<ArticleMetadata>(`article:${id}`);
}

export async function getAllArticleIds(): Promise<string[]> {
  return (await kv.get<string[]>('article:ids')) || [];
}

export async function getAllArticles(): Promise<ArticleMetadata[]> {
  const ids = await getAllArticleIds();
  const articles = await Promise.all(ids.map((id) => getArticleMetadata(id)));
  return articles.filter((a): a is ArticleMetadata => a !== null);
}

export async function saveArticleMetadata(article: ArticleMetadata): Promise<void> {
  await kv.set(`article:${article.id}`, article);

  const ids = await getAllArticleIds();
  if (!ids.includes(article.id)) {
    await kv.set('article:ids', [...ids, article.id]);
  }
}

export async function deleteArticleMetadata(id: string): Promise<void> {
  await kv.del(`article:${id}`);

  const ids = await getAllArticleIds();
  await kv.set(
    'article:ids',
    ids.filter((i) => i !== id)
  );
}
