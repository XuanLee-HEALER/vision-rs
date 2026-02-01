import sharp from 'sharp';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function optimizeLogo() {
  console.log('🎨 最终优化 Logo（完整内容 + 真正透明）...\n');

  const inputPath = join(projectRoot, 'icon.png');
  const outputDir = join(projectRoot, 'public');

  try {
    // 1. 使用 ImageMagick 彻底移除白色背景和 matte
    console.log('🔧 ImageMagick 处理透明度和颜色...');

    const tempPath = join(outputDir, 'logo-processed.png');

    // 移除背景、增强饱和度、确保 alpha 通道
    const magickCmd = `convert "${inputPath}" \
      -background none \
      -alpha on \
      -channel RGBA \
      -fuzz 10% \
      -transparent white \
      -modulate 100,140,100 \
      "${tempPath}"`;

    execSync(magickCmd, { stdio: 'pipe' });

    // 验证处理结果
    const checkCmd = `identify -verbose "${tempPath}" | grep -E "Background|Matte"`;
    try {
      const result = execSync(checkCmd, { encoding: 'utf8' });
      console.log('处理后的元数据:', result);
    } catch (e) {
      console.log('✅ 无背景/matte 元数据（正常）');
    }

    const metadata = await sharp(tempPath).metadata();
    console.log(`📊 处理后尺寸: ${metadata.width}x${metadata.height}px\n`);

    // 2. 桌面版 Logo - 保持宽高比，不裁剪
    const desktopWidth = 240;
    const desktopHeight = Math.round((desktopWidth / metadata.width) * metadata.height);

    await sharp(tempPath)
      .resize(desktopWidth, desktopHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        force: true,
        // 关键：确保无背景色
        palette: false
      })
      .toFile(join(outputDir, 'logo.png'));

    console.log(`✅ logo.png: ${desktopWidth}x${desktopHeight}px`);

    // 3. 移动版图标 - 使用 contain 而非裁剪，保留完整内容
    const iconSize = 64;

    // 计算缩放后的实际尺寸（保持宽高比）
    const iconHeight = Math.round((iconSize / metadata.width) * metadata.height);

    await sharp(tempPath)
      .resize(iconSize, iconHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        force: true,
        palette: false
      })
      .toFile(join(outputDir, 'logo-icon.png'));

    console.log(`✅ logo-icon.png: ${iconSize}x${iconHeight}px（保留完整内容）`);

    // 4. 高分屏移动版
    await sharp(tempPath)
      .resize(128, Math.round((128 / metadata.width) * metadata.height), {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        force: true,
        palette: false
      })
      .toFile(join(outputDir, 'logo-icon@2x.png'));

    console.log(`✅ logo-icon@2x.png: 128x${Math.round((128 / metadata.width) * metadata.height)}px`);

    // 5. WebP 版本 - 确保透明
    await sharp(tempPath)
      .resize(desktopWidth, desktopHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({
        quality: 95,
        force: true,
        // 关键：启用 alpha 通道
        lossless: false,
        nearLossless: true
      })
      .toFile(join(outputDir, 'logo.webp'));

    console.log(`✅ logo.webp: ${desktopWidth}x${desktopHeight}px`);

    // 6. 2x 桌面版
    await sharp(tempPath)
      .resize(desktopWidth * 2, desktopHeight * 2, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        force: true,
        palette: false
      })
      .toFile(join(outputDir, 'logo@2x.png'));

    console.log(`✅ logo@2x.png: ${desktopWidth * 2}x${desktopHeight * 2}px`);

    // 7. Favicons - 使用 contain 保留完整内容
    const faviconSizes = [16, 32, 48, 180];
    for (const size of faviconSizes) {
      const fHeight = Math.round((size / metadata.width) * metadata.height);

      await sharp(tempPath)
        .resize(size, fHeight, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({
          quality: 100,
          compressionLevel: 9,
          force: true,
          palette: false
        })
        .toFile(join(outputDir, `favicon-${size}x${size}.png`));

      console.log(`✅ favicon-${size}x${size}.png`);
    }

    // 8. 验证最终输出
    console.log('\n🔍 验证透明度...');
    const verifyCmd = `identify -verbose "${join(outputDir, 'logo.png')}" | grep -E "Background|Matte"`;
    try {
      const result = execSync(verifyCmd, { encoding: 'utf8' });
      console.warn('⚠️  仍有背景元数据:', result);
    } catch (e) {
      console.log('✅ 确认无背景元数据');
    }

    // 清理临时文件
    execSync(`rm -f "${tempPath}"`, { stdio: 'pipe' });

    console.log('\n🎉 Logo 优化完成！');
    console.log('\n改进：');
    console.log('  ✅ 完整内容保留（无裁剪）');
    console.log('  ✅ 真正透明背景');
    console.log('  ✅ 颜色饱和度增强 40%');
    console.log('  ✅ 自适应宽高比');

  } catch (error) {
    console.error('❌ 处理失败:', error.message);
    process.exit(1);
  }
}

optimizeLogo();
