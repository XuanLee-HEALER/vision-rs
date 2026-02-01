import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function optimizeLogo() {
  console.log('🎨 开始优化 Logo...\n');

  const inputPath = join(projectRoot, 'icon.png');
  const outputDir = join(projectRoot, 'public');

  try {
    // 读取原图信息
    const metadata = await sharp(inputPath).metadata();
    console.log(`📊 原图信息:`);
    console.log(`   尺寸: ${metadata.width}x${metadata.height}px`);
    console.log(`   格式: ${metadata.format}`);
    console.log(`   大小: ${(readFileSync(inputPath).length / 1024 / 1024).toFixed(2)}MB\n`);

    // 1. 生成桌面版 Logo (适合 header 高度 56px)
    const desktopWidth = 240; // 宽度，保持宽高比
    const desktopHeight = Math.round((desktopWidth / metadata.width) * metadata.height);

    await sharp(inputPath)
      .resize(desktopWidth, desktopHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(join(outputDir, 'logo.png'));

    const logoSize = readFileSync(join(outputDir, 'logo.png')).length;
    console.log(`✅ logo.png (桌面版)`);
    console.log(`   尺寸: ${desktopWidth}x${desktopHeight}px`);
    console.log(`   大小: ${(logoSize / 1024).toFixed(2)}KB\n`);

    // 2. 生成移动版 Icon (正方形，适合小屏幕)
    const iconSize = 64;

    await sharp(inputPath)
      .resize(iconSize, iconSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(join(outputDir, 'logo-icon.png'));

    const iconFileSize = readFileSync(join(outputDir, 'logo-icon.png')).length;
    console.log(`✅ logo-icon.png (移动版)`);
    console.log(`   尺寸: ${iconSize}x${iconSize}px`);
    console.log(`   大小: ${(iconFileSize / 1024).toFixed(2)}KB\n`);

    // 3. 生成 2x 版本 (Retina 显示)
    await sharp(inputPath)
      .resize(desktopWidth * 2, desktopHeight * 2, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(join(outputDir, 'logo@2x.png'));

    const logo2xSize = readFileSync(join(outputDir, 'logo@2x.png')).length;
    console.log(`✅ logo@2x.png (高分屏)`);
    console.log(`   尺寸: ${desktopWidth * 2}x${desktopHeight * 2}px`);
    console.log(`   大小: ${(logo2xSize / 1024).toFixed(2)}KB\n`);

    // 4. 生成 WebP 版本 (现代浏览器)
    await sharp(inputPath)
      .resize(desktopWidth, desktopHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 90 })
      .toFile(join(outputDir, 'logo.webp'));

    const webpSize = readFileSync(join(outputDir, 'logo.webp')).length;
    console.log(`✅ logo.webp (现代格式)`);
    console.log(`   尺寸: ${desktopWidth}x${desktopHeight}px`);
    console.log(`   大小: ${(webpSize / 1024).toFixed(2)}KB\n`);

    // 5. 生成 favicon (32x32)
    await sharp(inputPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(join(outputDir, 'favicon-32x32.png'));

    console.log(`✅ favicon-32x32.png`);
    console.log(`   尺寸: 32x32px\n`);

    console.log('🎉 优化完成！生成的文件：');
    console.log('   - public/logo.png (桌面版)');
    console.log('   - public/logo-icon.png (移动版)');
    console.log('   - public/logo@2x.png (高分屏)');
    console.log('   - public/logo.webp (WebP 格式)');
    console.log('   - public/favicon-32x32.png (Favicon)\n');
  } catch (error) {
    console.error('❌ 处理失败:', error.message);
    process.exit(1);
  }
}

optimizeLogo();
