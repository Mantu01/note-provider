import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadBuffer, destroyAsset, buildSignedUrl } from '@/server/lib/cloudinary';
import { AppError } from '@/server/lib/errors';

const { mockUploader, mockUrl } = vi.hoisted(() => ({
  mockUploader: {
    upload_stream: vi.fn(),
    destroy: vi.fn(),
  },
  mockUrl: vi.fn(),
}));

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: mockUploader,
    url: mockUrl,
  },
}));

describe('cloudinary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadBuffer', () => {
    it('resolves with upload result on success', async () => {
      mockUploader.upload_stream.mockImplementation((options, callback) => {
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test/image/upload/test.pdf',
          public_id: 'notes-provider/test',
          bytes: 1024,
          format: 'pdf',
          pages: 10,
        });
        return { end: vi.fn() };
      });

      const result = await uploadBuffer(Buffer.from('test'), {
        folder: 'notes-provider/notes/full',
        resourceType: 'raw',
        deliveryType: 'upload',
        filename: 'my-note',
      });

      expect(result).toEqual({
        url: 'https://res.cloudinary.com/test/image/upload/test.pdf',
        publicId: 'notes-provider/test',
        bytes: 1024,
        format: 'pdf',
        pageCount: 10,
        resourceType: 'raw',
      });
    });

    it('passes correct upload options', async () => {
      const optionsArg: any = {};
      mockUploader.upload_stream.mockImplementation((options, callback) => {
        Object.assign(optionsArg, options);
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test/raw/upload/doc.pdf',
          public_id: 'notes/doc',
          bytes: 1024,
          format: 'pdf',
        });
        return { end: vi.fn() };
      });

      await uploadBuffer(Buffer.from('test'), {
        folder: 'notes',
        resourceType: 'raw',
        deliveryType: 'upload',
        filename: 'doc',
      });

      expect(optionsArg).toMatchObject({
        folder: 'notes',
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        filename_override: 'doc',
        overwrite: false,
      });
    });

    it('applies 16:9 fill transformation for image resource type', async () => {
      let capturedOptions: any;
      mockUploader.upload_stream.mockImplementation((options, callback) => {
        capturedOptions = options;
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test/image/upload/img.jpg',
          public_id: 'notes/img',
          bytes: 512,
          format: 'jpg',
        });
        return { end: vi.fn() };
      });

      await uploadBuffer(Buffer.from('img'), {
        folder: 'notes',
        resourceType: 'image',
        deliveryType: 'upload',
        filename: 'cover',
      });

      expect(capturedOptions.transformation).toEqual([
        { aspect_ratio: '16:9', crop: 'fill' },
      ]);
    });

    it('does not apply transformation for raw resource type', async () => {
      let capturedOptions: any;
      mockUploader.upload_stream.mockImplementation((options, callback) => {
        capturedOptions = options;
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test/raw/upload/doc.pdf',
          public_id: 'notes/doc',
          bytes: 2048,
          format: 'pdf',
        });
        return { end: vi.fn() };
      });

      await uploadBuffer(Buffer.from('pdf'), {
        folder: 'notes',
        resourceType: 'raw',
        deliveryType: 'upload',
        filename: 'doc',
      });

      expect(capturedOptions.transformation).toBeUndefined();
    });

    it('rejects with AppError on upload error', async () => {
      mockUploader.upload_stream.mockImplementation((_options, callback) => {
        callback(new Error('Cloudinary error'), null);
        return { end: vi.fn() };
      });

      await expect(
        uploadBuffer(Buffer.from('test'), {
          folder: 'notes',
          resourceType: 'raw',
          deliveryType: 'upload',
          filename: 'doc',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('rejects when result is null on error', async () => {
      mockUploader.upload_stream.mockImplementation((_options, callback) => {
        callback(new Error('unknown'), null);
        return { end: vi.fn() };
      });

      await expect(
        uploadBuffer(Buffer.from('test'), {
          folder: 'notes',
          resourceType: 'raw',
          deliveryType: 'upload',
          filename: 'doc',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('rejects when error is thrown without message', async () => {
      mockUploader.upload_stream.mockImplementation((_options, callback) => {
        callback(new Error(), null);
        return { end: vi.fn() };
      });

      await expect(
        uploadBuffer(Buffer.from('test'), {
          folder: 'notes',
          resourceType: 'raw',
          deliveryType: 'upload',
          filename: 'doc',
        }),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('defaults format to pdf when result format is missing', async () => {
      mockUploader.upload_stream.mockImplementation((_options, callback) => {
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test/raw/upload/doc',
          public_id: 'notes/doc',
          bytes: 100,
        });
        return { end: vi.fn() };
      });

      const result = await uploadBuffer(Buffer.from('test'), {
        folder: 'notes',
        resourceType: 'raw',
        deliveryType: 'upload',
        filename: 'doc',
      });
      expect(result.format).toBe('pdf');
    });

    it('sets pageCount to null when pages is not a number', async () => {
      mockUploader.upload_stream.mockImplementation((_options, callback) => {
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test/raw/upload/doc.pdf',
          public_id: 'notes/doc',
          bytes: 100,
          format: 'pdf',
          pages: 'ten' as unknown as number,
        });
        return { end: vi.fn() };
      });

      const result = await uploadBuffer(Buffer.from('test'), {
        folder: 'notes',
        resourceType: 'raw',
        deliveryType: 'upload',
        filename: 'doc',
      });
      expect(result.pageCount).toBeNull();
    });

    it('sends buffer to stream', async () => {
      const endFn = vi.fn();
      mockUploader.upload_stream.mockImplementation((_options, callback) => {
        callback(null, {
          secure_url: 'https://res.cloudinary.com/test/raw/upload/doc.pdf',
          public_id: 'notes/doc',
          bytes: 100,
          format: 'pdf',
        });
        return { end: endFn };
      });

      const buffer = Buffer.from('hello world');
      await uploadBuffer(buffer, {
        folder: 'notes',
        resourceType: 'raw',
        deliveryType: 'upload',
        filename: 'doc',
      });
      expect(endFn).toHaveBeenCalledWith(buffer);
    });
  });

  describe('destroyAsset', () => {
    it('calls cloudinary uploader destroy with correct params', async () => {
      mockUploader.destroy.mockResolvedValue({ ok: true });
      await destroyAsset('notes/doc', 'raw', 'upload');
      expect(mockUploader.destroy).toHaveBeenCalledWith('notes/doc', {
        resource_type: 'auto',
        type: 'upload',
        invalidate: true,
      });
    });

    it('passes correct resource_type for image', async () => {
      mockUploader.destroy.mockResolvedValue({ ok: true });
      await destroyAsset('notes/img', 'image', 'upload');
      expect(mockUploader.destroy).toHaveBeenCalledWith('notes/img', {
        resource_type: 'image',
        type: 'upload',
        invalidate: true,
      });
    });

    it('swallows errors without throwing', async () => {
      mockUploader.destroy.mockRejectedValue(new Error('destroy failed'));
      await expect(destroyAsset('notes/doc', 'raw')).resolves.toBeUndefined();
    });

    it('uses default deliveryType of upload', async () => {
      mockUploader.destroy.mockResolvedValue({ ok: true });
      await destroyAsset('notes/doc', 'raw');
      expect(mockUploader.destroy).toHaveBeenCalledWith('notes/doc', expect.objectContaining({
        type: 'upload',
      }));
    });

    it('handles authenticated delivery type', async () => {
      mockUploader.destroy.mockResolvedValue({ ok: true });
      await destroyAsset('notes/doc', 'raw', 'authenticated');
      expect(mockUploader.destroy).toHaveBeenCalledWith('notes/doc', expect.objectContaining({
        type: 'authenticated',
      }));
    });
  });

  describe('buildSignedUrl', () => {
    it('returns a signed URL from cloudinary', () => {
      mockUrl.mockReturnValue('https://res.cloudinary.com/test/raw/uploadnotes/doc.pdf');
      const url = buildSignedUrl('notes/doc', 'raw', 'upload');
      expect(url).toBe('https://res.cloudinary.com/test/raw/uploadnotes/doc.pdf');
    });

    it('passes correct resource_type for raw', () => {
      mockUrl.mockReturnValue('https://res.cloudinary.com/test/raw/upload/doc');
      buildSignedUrl('notes/doc', 'raw');
      expect(mockUrl).toHaveBeenCalledWith('notes/doc', expect.objectContaining({
        resource_type: 'auto',
      }));
    });

    it('passes correct resource_type for image', () => {
      mockUrl.mockReturnValue('https://res.cloudinary.com/test/image/upload/img');
      buildSignedUrl('notes/img', 'image');
      expect(mockUrl).toHaveBeenCalledWith('notes/img', expect.objectContaining({
        resource_type: 'image',
      }));
    });

    it('uses default resource_type of auto', () => {
      mockUrl.mockReturnValue('https://res.cloudinary.com/test/upload/doc');
      buildSignedUrl('notes/doc');
      expect(mockUrl).toHaveBeenCalledWith('notes/doc', expect.objectContaining({
        resource_type: 'auto',
      }));
    });

    it('uses secure true by default', () => {
      mockUrl.mockReturnValue('https://res.cloudinary.com/test/upload/doc');
      buildSignedUrl('notes/doc');
      expect(mockUrl).toHaveBeenCalledWith('notes/doc', expect.objectContaining({
        secure: true,
      }));
    });

    it('passes delivery type to cloudinary.url', () => {
      mockUrl.mockReturnValue('https://res.cloudinary.com/test/authenticated/doc');
      buildSignedUrl('notes/doc', 'raw', 'authenticated');
      expect(mockUrl).toHaveBeenCalledWith('notes/doc', expect.objectContaining({
        type: 'authenticated',
      }));
    });
  });
});
