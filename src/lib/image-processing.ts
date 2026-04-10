import ExifReader from 'exifreader';
import sharp from 'sharp';

export interface PhotoExif {
  model?: string;
  make?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: string;
  focalLength?: string;
  dateTime?: string;
  lensModel?: string;
  width?: number;
  height?: number;
}

/**
 * 从图片 Buffer 中提取核心 EXIF 参数及尺寸
 */
export async function extractExif(buffer: Buffer): Promise<PhotoExif> {
  try {
    const [tags, metadata] = await Promise.all([
      Promise.resolve(ExifReader.load(buffer)),
      sharp(buffer).metadata()
    ]);
    
    // 提取并提取描述性文本，避免复杂的对象结构
    const getTag = (name: string) => tags[name]?.description || undefined;

    return {
      model: getTag('Model'),
      make: getTag('Make'),
      exposureTime: getTag('ExposureTime'),
      fNumber: getTag('FNumber'),
      iso: getTag('ISOSpeedRatings'),
      focalLength: getTag('FocalLength'),
      dateTime: getTag('DateTimeOriginal') || getTag('DateTime'),
      lensModel: getTag('LensModel'),
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error('元数据提取失败:', error);
    return {};
  }
}

/**
 * 使用 sharp 生成 10px 的模糊占位图 (Base64)
 */
export async function generateBlurPlaceholder(buffer: Buffer): Promise<string> {
  try {
    const miniBuffer = await sharp(buffer)
      .resize(10, 10, { fit: 'inside' }) // 缩小至 10px 保持比例
      .webp({ quality: 20 }) // 使用低质量 webp
      .toBuffer();
    
    return `data:image/webp;base64,${miniBuffer.toString('base64')}`;
  } catch (error) {
    console.error('占位图生成失败:', error);
    return '';
  }
}
