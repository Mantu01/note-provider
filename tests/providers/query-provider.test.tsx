import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { QueryProvider } from '@/providers/query-provider'
import { ApiError } from '@/lib/api-client'

const mockQueryCache = vi.hoisted(() => vi.fn())
const mockQueryClient = vi.hoisted(() => vi.fn())
const mockToast = vi.hoisted(() => vi.fn())
const mockQueryCacheInstance = vi.hoisted(() => ({ clear: vi.fn() }))

vi.mock('sonner', () => ({
  toast: {
    error: mockToast,
    success: mockToast,
    loading: mockToast,
  },
}))

vi.mock('@tanstack/react-query', () => ({
  QueryCache: vi.fn(function (...args: any[]) {
    mockQueryCache(...args)
    return mockQueryCacheInstance
  }),
  QueryClient: vi.fn(function (...args: any[]) {
    mockQueryClient(...args)
    return {}
  }),
  QueryClientProvider: ({ children, client }: any) => {
    return <div data-testid="query-provider-wrapper">{children}</div>
  },
}) as any)

function setLocation(pathname: string) {
  const mockLocation = {
    pathname,
    assign: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
    href: `http://localhost${pathname}`,
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    search: '',
    hash: '',
  }
  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
  })
}

describe('QueryProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setLocation('/')
  })

  it('renders children inside QueryClientProvider', () => {
    const { getByTestId } = render(
      <QueryProvider>
        <span data-testid="child">Hello</span>
      </QueryProvider>
    )
    expect(getByTestId('child')).toBeInTheDocument()
  })

  it('creates a QueryClient with QueryCache', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    expect(mockQueryClient).toHaveBeenCalledOnce()
    expect(mockQueryCache).toHaveBeenCalledOnce()
  })

  it('passes defaultOptions to QueryClient', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    expect(mockQueryClient).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultOptions: expect.any(Object),
      })
    )
  })

  it('sets staleTime to 60000 in default query options', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const opts = mockQueryClient.mock.calls[0][0].defaultOptions.queries
    expect(opts.staleTime).toBe(60000)
  })

  it('sets gcTime to 300000 in default query options', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const opts = mockQueryClient.mock.calls[0][0].defaultOptions.queries
    expect(opts.gcTime).toBe(300000)
  })

  it('sets refetchOnWindowFocus to false in default query options', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const opts = mockQueryClient.mock.calls[0][0].defaultOptions.queries
    expect(opts.refetchOnWindowFocus).toBe(false)
  })

  it('configures retry to return false for 4xx errors', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const retry = mockQueryClient.mock.calls[0][0].defaultOptions.queries.retry
    expect(typeof retry).toBe('function')

    const notFoundError = new ApiError('NOT_FOUND', 'Not found', 404)
    expect(retry(0, notFoundError)).toBe(false)

    const conflictError = new ApiError('CONFLICT', 'Conflict', 409)
    expect(retry(0, conflictError)).toBe(false)
  })

  it('configures retry to attempt up to 2 times for non-4xx errors', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const retry = mockQueryClient.mock.calls[0][0].defaultOptions.queries.retry

    const serverError = new ApiError('INTERNAL_ERROR', 'Server error', 500)
    expect(retry(0, serverError)).toBe(true)
    expect(retry(1, serverError)).toBe(true)
    expect(retry(2, serverError)).toBe(false)

    const plainError = new Error('Network error')
    expect(retry(0, plainError)).toBe(true)
    expect(retry(1, plainError)).toBe(true)
    expect(retry(2, plainError)).toBe(false)
  })

  it('does not retry for 4xx errors even on first attempt', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const retry = mockQueryClient.mock.calls[0][0].defaultOptions.queries.retry

    const unauthorizedError = new ApiError('UNAUTHORIZED', 'Unauthorized', 401)
    expect(retry(0, unauthorizedError)).toBe(false)
  })

  it('calls QueryCache onError when error is UNAUTHORIZED ApiError', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const onErrorCallback = mockQueryCache.mock.calls[0][0].onError
    expect(typeof onErrorCallback).toBe('function')

    const authError = new ApiError('UNAUTHORIZED', 'Session expired', 401)
    onErrorCallback(authError)

    expect(mockToast).toHaveBeenCalledWith('Your session expired. Please log in again.')
  })

  it('redirects to /admin/login on UNAUTHORIZED when not already on login page', () => {
    setLocation('/')
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const onErrorCallback = mockQueryCache.mock.calls[0][0].onError

    onErrorCallback(new ApiError('UNAUTHORIZED', 'Session expired', 401))

    expect(window.location.assign).toHaveBeenCalledWith('/admin/login')
  })

  it('does not redirect when already on /admin/login page', () => {
    setLocation('/admin/login')
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const onErrorCallback = mockQueryCache.mock.calls[0][0].onError

    onErrorCallback(new ApiError('UNAUTHORIZED', 'Session expired', 401))

    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('clears admin_session cookie on UNAUTHORIZED', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const onErrorCallback = mockQueryCache.mock.calls[0][0].onError

    let cookieValue = ''
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
      configurable: true,
    })
    Object.defineProperty(document, 'cookie', {
      set(val) { cookieValue = val },
      get() { return cookieValue },
      configurable: true,
    })

    onErrorCallback(new ApiError('UNAUTHORIZED', 'Session expired', 401))

    expect(cookieValue).toContain('admin_session=')
  })

  it('does not redirect or show toast for non-UNAUTHORIZED errors', () => {
    setLocation('/')
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const onErrorCallback = mockQueryCache.mock.calls[0][0].onError

    onErrorCallback(new ApiError('NOT_FOUND', 'Not found', 404))

    expect(mockToast).not.toHaveBeenCalledWith('Your session expired. Please log in again.')
    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('does not redirect for plain Error instances', () => {
    setLocation('/')
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const onErrorCallback = mockQueryCache.mock.calls[0][0].onError

    onErrorCallback(new Error('Something broke'))

    expect(window.location.assign).not.toHaveBeenCalled()
  })

  it('clears queryCache on UNAUTHORIZED', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const onErrorCallback = mockQueryCache.mock.calls[0][0].onError

    onErrorCallback(new ApiError('UNAUTHORIZED', 'Session expired', 401))

    expect(mockQueryCacheInstance.clear).toHaveBeenCalledOnce()
  })

  it('configures mutation onError to show toast with error message', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const mutationOnError = mockQueryClient.mock.calls[0][0].defaultOptions.mutations.onError
    expect(typeof mutationOnError).toBe('function')

    mutationOnError(new Error('Mutation failed'))
    expect(mockToast).toHaveBeenCalledWith('Mutation failed')
  })

  it('shows generic error message for non-Error values in mutation onError', () => {
    render(<QueryProvider><div>Test</div></QueryProvider>)
    const mutationOnError = mockQueryClient.mock.calls[0][0].defaultOptions.mutations.onError

    mutationOnError('string error' as any)
    expect(mockToast).toHaveBeenCalledWith('Something went wrong. Please try again.')
  })

  it('renders children exactly once inside QueryClientProvider', () => {
    const { getByTestId } = render(
      <QueryProvider>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </QueryProvider>
    )
    expect(getByTestId('a')).toBeInTheDocument()
    expect(getByTestId('b')).toBeInTheDocument()
  })
})
