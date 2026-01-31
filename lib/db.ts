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

export type ArticleMetadata = Omit<Article, 'content'>;

// Article operations
export async function getArticle(id: string): Promise<Article | null> {
  return kv.get<Article>(`article:${id}`);
}

export async function getArticleMetadata(id: string): Promise<ArticleMetadata | null> {
  const article = await getArticle(id);
  if (!article) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content: _content, ...metadata } = article;
  return metadata;
}

export async function getAllArticleIds(): Promise<string[]> {
  return (await kv.get<string[]>('article:ids')) || [];
}

export async function getAllArticles(): Promise<ArticleMetadata[]> {
  const ids = await getAllArticleIds();
  const articles = await Promise.all(ids.map((id) => getArticleMetadata(id)));
  return articles.filter((a): a is ArticleMetadata => a !== null);
}

export async function saveArticle(article: Article): Promise<void> {
  await kv.set(`article:${article.id}`, article);

  const ids = await getAllArticleIds();
  if (!ids.includes(article.id)) {
    await kv.set('article:ids', [...ids, article.id]);
  }
}

export async function saveArticleMetadata(article: ArticleMetadata): Promise<void> {
  // Get existing article to preserve content
  const existing = await getArticle(article.id);
  const fullArticle: Article = {
    ...article,
    content: existing?.content || '',
  };
  await saveArticle(fullArticle);
}

export async function deleteArticleMetadata(id: string): Promise<void> {
  await kv.del(`article:${id}`);

  const ids = await getAllArticleIds();
  await kv.set(
    'article:ids',
    ids.filter((i) => i !== id)
  );
}
