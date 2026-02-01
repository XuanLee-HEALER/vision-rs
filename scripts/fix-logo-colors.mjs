import sharp from 'sharp';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function fixLogoColors() {
  console.log('🎨 修复 Logo 颜色和透明度...\n');

  const inputPath = join(projectRoot, 'icon.png');
  const outputDir = join(projectRoot, 'public');
  const tempPath = join(outputDir, 'logo-temp.png');

  try {
    // 1. 使用 ImageMagick 修复透明度并调整颜色
    console.log('🔧 使用 ImageMagick 处理颜色...');

    // 移除 matte/background，增强颜色饱和度，调整色调匹配主题
    const magickCmd = `convert "${inputPath}" \
      -background none \
      -alpha on \
      -channel RGBA \
      -modulate 100,140,100 \
      "${tempPath}"`;

    execSync(magickCmd, { stdio: 'pipe' });
    console.log('✅ 颜色调整完成\n');

    // 2. 使用 sharp 生成各种尺寸，确保透明度保留
    const metadata = await sharp(tempPath).metadata();
    console.log(`📊 处理后尺寸: ${metadata.width}x${metadata.height}px\n`);

    // 桌面版 Logo
    const desktopWidth = 240;
    const desktopHeight = Math.round((desktopWidth / metadata.width) * metadata.height);

    await sharp(tempPath)
      .resize(desktopWidth, desktopHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 9, force: true })
      .toFile(join(outputDir, 'logo.png'));

    console.log(`✅ logo.png: ${desktopWidth}x${desktopHeight}px`);

    // 移动版图标 - 中心裁剪
    const iconSize = 64;
    const cropSize = Math.min(metadata.width, metadata.height);
    const left = Math.floor((metadata.width - cropSize) / 2);
    const top = Math.floor((metadata.height - cropSize) / 2);

    await sharp(tempPath)
      .extract({ left, top, width: cropSize, height: cropSize })
      .resize(iconSize, iconSize, {
        fit: 'cover',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 9, force: true })
      .toFile(join(outputDir, 'logo-icon.png'));

    console.log(`✅ logo-icon.png: ${iconSize}x${iconSize}px`);

    // 高分屏版本
    await sharp(tempPath)
      .extract({ left, top, width: cropSize, height: cropSize })
      .resize(128, 128, {
        fit: 'cover',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 9, force: true })
      .toFile(join(outputDir, 'logo-icon@2x.png'));

    console.log(`✅ logo-icon@2x.png: 128x128px`);

    // WebP 版本
    await sharp(tempPath)
      .resize(desktopWidth, desktopHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ quality: 95, force: true })
      .toFile(join(outputDir, 'logo.webp'));

    console.log(`✅ logo.webp: ${desktopWidth}x${desktopHeight}px`);

    // 2x 桌面版
    await sharp(tempPath)
      .resize(desktopWidth * 2, desktopHeight * 2, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 9, force: true })
      .toFile(join(outputDir, 'logo@2x.png'));

    console.log(`✅ logo@2x.png: ${desktopWidth * 2}x${desktopHeight * 2}px`);

    // Favicons
    const faviconSizes = [16, 32, 48, 180];
    for (const size of faviconSizes) {
      await sharp(tempPath)
        .extract({ left, top, width: cropSize, height: cropSize })
        .resize(size, size, {
          fit: 'cover',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({ quality: 100, compressionLevel: 9, force: true })
        .toFile(join(outputDir, `favicon-${size}x${size}.png`));
      console.log(`✅ favicon-${size}x${size}.png`);
    }

    // 清理临时文件
    execSync(`rm -f "${tempPath}"`, { stdio: 'pipe' });

    console.log('\n🎉 Logo 颜色和透明度修复完成！');
    console.log('\n改进：');
    console.log('  ✅ 透明背景正确保留');
    console.log('  ✅ 颜色饱和度增强 40%');
    console.log('  ✅ 更匹配 Catppuccin Macchiato 主题');

  } catch (error) {
    console.error('❌ 处理失败:', error.message);
    process.exit(1);
  }
}

fixLogoColors();
