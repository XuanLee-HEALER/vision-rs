#!/bin/bash

# Vision-RS SEO 验证脚本
# 用法: ./scripts/verify-seo.sh [url]
# 默认 URL: http://localhost:3000

URL="${1:-http://localhost:3000}"

echo "🔍 Vision-RS SEO 验证脚本"
echo "================================"
echo "测试 URL: $URL"
echo ""

# 检查服务是否可访问
if ! curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
  echo "❌ 错误: 无法访问 $URL"
  echo "提示: 请先运行 'pnpm build && pnpm start'"
  exit 1
fi

echo "✅ 服务器可访问"
echo ""

# 1. 检查 Open Graph metadata
echo "📊 检查 Open Graph metadata..."
OG_TAGS=$(curl -s "$URL" | grep -c "og:")
if [ "$OG_TAGS" -gt 0 ]; then
  echo "✅ 找到 $OG_TAGS 个 Open Graph 标签"
  curl -s "$URL" | grep "og:" | head -5
else
  echo "❌ 未找到 Open Graph 标签"
fi
echo ""

# 2. 检查 Twitter Cards
echo "🐦 检查 Twitter Cards metadata..."
TWITTER_TAGS=$(curl -s "$URL" | grep -c "twitter:")
if [ "$TWITTER_TAGS" -gt 0 ]; then
  echo "✅ 找到 $TWITTER_TAGS 个 Twitter Card 标签"
  curl -s "$URL" | grep "twitter:" | head -3
else
  echo "❌ 未找到 Twitter Card 标签"
fi
echo ""

# 3. 检查 JSON-LD
echo "📦 检查 JSON-LD 结构化数据..."
JSON_LD=$(curl -s "$URL" | grep -c "application/ld+json")
if [ "$JSON_LD" -gt 0 ]; then
  echo "✅ 找到 $JSON_LD 个 JSON-LD 块"
else
  echo "❌ 未找到 JSON-LD"
fi
echo ""

# 4. 检查 robots.txt
echo "🤖 检查 robots.txt..."
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/robots.txt")
if [ "$ROBOTS_STATUS" == "200" ]; then
  echo "✅ robots.txt 可访问"
  echo "内容:"
  curl -s "$URL/robots.txt"
else
  echo "❌ robots.txt 返回状态码: $ROBOTS_STATUS"
fi
echo ""

# 5. 检查 sitemap.xml
echo "🗺️  检查 sitemap.xml..."
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/sitemap.xml")
if [ "$SITEMAP_STATUS" == "200" ]; then
  echo "✅ sitemap.xml 可访问"
  SITEMAP_URLS=$(curl -s "$URL/sitemap.xml" | grep -c "<url>")
  echo "包含 $SITEMAP_URLS 个 URL"
else
  echo "❌ sitemap.xml 返回状态码: $SITEMAP_STATUS"
fi
echo ""

# 6. 检查 favicon
echo "🎨 检查 favicon..."
FAVICON_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/icon.svg")
if [ "$FAVICON_STATUS" == "200" ]; then
  echo "✅ icon.svg 可访问"
else
  echo "❌ icon.svg 返回状态码: $FAVICON_STATUS"
fi
echo ""

# 7. 检查章节页面的 metadata
echo "📖 检查章节页面 metadata..."
CHAPTER_URL="$URL/learn/mental-model/part-1-static-world/1-1-crates-items"
CHAPTER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$CHAPTER_URL")
if [ "$CHAPTER_STATUS" == "200" ]; then
  echo "✅ 章节页面可访问: $CHAPTER_URL"
  CHAPTER_JSON_LD=$(curl -s "$CHAPTER_URL" | grep -c "application/ld+json")
  if [ "$CHAPTER_JSON_LD" -gt 0 ]; then
    echo "✅ 章节页面包含 JSON-LD"
  else
    echo "⚠️  章节页面未包含 JSON-LD"
  fi
else
  echo "❌ 章节页面无法访问"
fi
echo ""

echo "================================"
echo "✅ SEO 验证完成"
echo ""
echo "📚 下一步:"
echo "1. 使用在线工具验证:"
echo "   - Google Rich Results Test: https://search.google.com/test/rich-results"
echo "   - OpenGraph.xyz: https://www.opengraph.xyz/"
echo "   - Twitter Card Validator: https://cards-dev.twitter.com/validator"
echo ""
echo "2. 部署到生产环境后:"
echo "   - 在 Google Search Console 提交 sitemap"
echo "   - 使用 URL 检查工具测试索引状态"
