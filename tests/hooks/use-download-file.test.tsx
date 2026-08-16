import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { useDownloadFile } from '@/hooks/use-download-file'

const mockToast = vi.hoisted(() => ({
  loading: vi.fn().mockReturnValue('toast-id'),
  success: vi.fn(),
  error: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: mockToast,
}))

const mockUseMutation = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-query', () => ({
  useMutation: (...args: any[]) => mockUseMutation(...args),
}))

describe('useDownloadFile', () => {
  const originalCreateObjectURL = globalThis.URL.createObjectURL
  const originalRevokeObjectURL = globalThis.URL.revokeObjectURL
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    ;(vi as any).clearAllMocks()
    globalThis.URL.createObjectURL = vi.fn(() => 'http://mock.blob.url')
    globalThis.URL.revokeObjectURL = vi.fn()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(['test-content'])),
    })
  })

  afterEach(() => {
    globalThis.URL.createObjectURL = originalCreateObjectURL
    globalThis.URL.revokeObjectURL = originalRevokeObjectURL
    globalThis.fetch = originalFetch
    vi.restoreAllMocks()
  })

  function mountHook() {
    const result = { download: vi.fn(), isDownloading: false }
    mockUseMutation.mockImplementation(({ mutationFn, onMutate, onSuccess, onError }: any) => {
      result.download = ((params: any) => {
        result.isDownloading = true
        onMutate?.()
        return mutationFn(params).then(
          (data: any) => { onSuccess?.(data); result.isDownloading = false; return data },
          (err: any) => { onError?.(err); result.isDownloading = false; throw err }
        )
      }) as any
      return { mutate: result.download as any, isPending: false }
    })

    const TestComponent = () => {
      const { download, isDownloading } = useDownloadFile()
      return (
        <button onClick={() => download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' })}>
          Download
        </button>
      )
    }

    const { getByTestId } = render(<TestComponent />)
    return { download: result.download, isDownloading: () => result.isDownloading, getByTestId }
  }

  it('calls the download function with correct url and filename', async () => {
    const { download } = mountHook()
    await download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://example.com/file.pdf',
      expect.objectContaining({ credentials: 'include' })
    )
  })

  it('shows loading toast on mutation start', async () => {
    const { download } = mountHook()
    await download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' })

    expect(mockToast.loading).toHaveBeenCalledWith(
      'Preparing your download…',
      expect.objectContaining({ id: 'download' })
    )
  })

  it('shows success toast on successful download', async () => {
    const { download } = mountHook()
    await download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' })

    expect(mockToast.success).toHaveBeenCalledWith(
      'Download started',
      expect.objectContaining({ id: 'download' })
    )
  })

  it('shows error toast when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false })
    const { download } = mountHook()
    await download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' }).catch(() => {})

    expect(mockToast.error).toHaveBeenCalledWith(
      'Unable to prepare your download. Please try again.',
      expect.objectContaining({ id: 'download' })
    )
  })

  it('creates a blob URL and revokes it after download', async () => {
    const { download } = mountHook()
    await download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' })

    expect(globalThis.URL.createObjectURL).toHaveBeenCalledOnce()
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledOnce()
  })

  it('returns isDownloading true during pending state', () => {
    mockUseMutation.mockImplementation(() => ({
      mutate: vi.fn(),
      isPending: true,
    }))

    let captured: boolean | null = null
    render(
      <div>
        {(() => {
          const { isDownloading } = useDownloadFile()
          captured = isDownloading
          return null
        })()}
      </div>
    )

    expect(captured).toBe(true)
  })

  it('returns isDownloading false when mutation is idle', () => {
    mockUseMutation.mockImplementation(() => ({
      mutate: vi.fn(),
      isPending: false,
    }))

    let captured: boolean | null = null
    render(
      <div>
        {(() => {
          const { isDownloading } = useDownloadFile()
          captured = isDownloading
          return null
        })()}
      </div>
    )

    expect(captured).toBe(false)
  })

  it('does not call URL methods when download is not triggered', async () => {
    mockUseMutation.mockImplementation(() => ({
      mutate: vi.fn(),
      isPending: false,
    }))

    render(<div>Idle</div>)

    expect(globalThis.URL.createObjectURL).not.toHaveBeenCalled()
    expect(globalThis.URL.revokeObjectURL).not.toHaveBeenCalled()
  })

  it('passes credentials include in fetch options for downloadFile', async () => {
    const { download } = mountHook()
    await download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' })

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://example.com/file.pdf',
      expect.objectContaining({ credentials: 'include' })
    )
  })

  it('throws when fetch response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false })
    const { download } = mountHook()
    await expect(
      download({ url: 'http://example.com/file.pdf', filename: 'file.pdf' })
    ).rejects.toThrow('Unable to prepare your download. Please try again.')
  })

  it('returns download function and isDownloading from hook', () => {
    mockUseMutation.mockImplementation(() => ({
      mutate: vi.fn(),
      isPending: false,
    }))

    let captured: any
    render(
      <div>
        {(() => {
          captured = useDownloadFile()
          return null
        })()}
      </div>
    )

    expect(typeof captured.download).toBe('function')
    expect(typeof captured.isDownloading).toBe('boolean')
  })
})
