import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function optimizeLogo() {
  console.log('🎨 重新优化 Logo v2...\n');

  const inputPath = join(projectRoot, 'icon.png');
  const outputDir = join(projectRoot, 'public');

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`📊 原图: ${metadata.width}x${metadata.height}px\n`);

    // 1. 桌面版 Logo (保持不变)
    const desktopWidth = 240;
    const desktopHeight = Math.round((desktopWidth / metadata.width) * metadata.height);

    await sharp(inputPath)
      .resize(desktopWidth, desktopHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(join(outputDir, 'logo.png'));

    console.log(`✅ logo.png: ${desktopWidth}x${desktopHeight}px`);

    // 2. 移动版图标 - 策略改进
    // 从原图中心区域裁剪正方形，然后缩放
    const iconSize = 64;
    const cropSize = Math.min(metadata.width, metadata.height); // 正方形裁剪尺寸

    // 计算居中裁剪的起始位置
    const left = Math.floor((metadata.width - cropSize) / 2);
    const top = Math.floor((metadata.height - cropSize) / 2);

    await sharp(inputPath)
      .extract({ left, top, width: cropSize, height: cropSize }) // 从中心裁剪正方形
      .resize(iconSize, iconSize, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(join(outputDir, 'logo-icon.png'));

    const iconFileSize = readFileSync(join(outputDir, 'logo-icon.png')).length;
    console.log(`✅ logo-icon.png: ${iconSize}x${iconSize}px (${(iconFileSize / 1024).toFixed(2)}KB)`);

    // 3. 更大的移动版图标 (用于高分屏)
    await sharp(inputPath)
      .extract({ left, top, width: cropSize, height: cropSize })
      .resize(128, 128, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(join(outputDir, 'logo-icon@2x.png'));

    console.log(`✅ logo-icon@2x.png: 128x128px`);

    // 4. Favicon 尺寸系列
    const faviconSizes = [16, 32, 48, 180]; // 180 for Apple touch icon

    for (const size of faviconSizes) {
      await sharp(inputPath)
        .extract({ left, top, width: cropSize, height: cropSize })
        .resize(size, size, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(join(outputDir, `favicon-${size}x${size}.png`));

      console.log(`✅ favicon-${size}x${size}.png`);
    }

    // 5. WebP 版本 (桌面)
    await sharp(inputPath)
      .resize(desktopWidth, desktopHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 95 })
      .toFile(join(outputDir, 'logo.webp'));

    console.log(`✅ logo.webp: ${desktopWidth}x${desktopHeight}px`);

    // 6. 高分屏桌面版
    await sharp(inputPath)
      .resize(desktopWidth * 2, desktopHeight * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(join(outputDir, 'logo@2x.png'));

    console.log(`✅ logo@2x.png: ${desktopWidth * 2}x${desktopHeight * 2}px\n`);

    console.log('🎉 优化完成！');
    console.log('\n📦 生成的文件：');
    console.log('   Desktop: logo.png, logo.webp, logo@2x.png');
    console.log('   Mobile: logo-icon.png, logo-icon@2x.png');
    console.log('   Favicon: favicon-16x16.png ~ favicon-180x180.png');

  } catch (error) {
    console.error('❌ 处理失败:', error.message);
    process.exit(1);
  }
}

optimizeLogo();
