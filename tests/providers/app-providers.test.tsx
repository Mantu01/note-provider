import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { AppProviders } from '@/providers/app-providers'

const mockThemeProvider = vi.fn()
const mockQueryProvider = vi.fn()
const mockNuqsAdapter = vi.fn()
const mockToaster = vi.fn()

vi.mock('@/providers/theme-provider', () => ({
  ThemeProvider: ({ children }: any) => {
    mockThemeProvider(children)
    return <div data-testid="theme-provider">{children}</div>
  },
}))

vi.mock('@/providers/query-provider', () => ({
  QueryProvider: ({ children }: any) => {
    mockQueryProvider(children)
    return <div data-testid="query-provider">{children}</div>
  },
}))

vi.mock('nuqs/adapters/next/app', () => ({
  NuqsAdapter: ({ children }: any) => {
    mockNuqsAdapter(children)
    return <div data-testid="nuqs-adapter">{children}</div>
  },
}))

vi.mock('sonner', () => ({
  Toaster: ({ position, closeButton, richColors }: any) => {
    mockToaster({ position, closeButton, richColors })
    return <div data-testid="toaster" data-position={position} data-rich-colors={richColors} data-close-button={closeButton} />
  },
}))

describe('AppProviders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children inside all provider layers', () => {
    const { getByTestId } = render(
      <AppProviders>
        <span data-testid="child">Hello</span>
      </AppProviders>
    )
    expect(getByTestId('child')).toBeInTheDocument()
    expect(getByTestId('child').textContent).toBe('Hello')
  })

  it('wraps content in ThemeProvider as the outermost layer', () => {
    render(
      <AppProviders>
        <div>Inner</div>
      </AppProviders>
    )
    expect(mockThemeProvider).toHaveBeenCalledOnce()
  })

  it('wraps content in QueryProvider inside ThemeProvider', () => {
    render(
      <AppProviders>
        <div>Inner</div>
      </AppProviders>
    )
    expect(mockQueryProvider).toHaveBeenCalledOnce()
  })

  it('wraps content in NuqsAdapter inside QueryProvider', () => {
    render(
      <AppProviders>
        <div>Inner</div>
      </AppProviders>
    )
    expect(mockNuqsAdapter).toHaveBeenCalledOnce()
  })

  it('renders Toaster alongside NuqsAdapter children inside QueryProvider', () => {
    const { getByTestId } = render(
      <AppProviders>
        <div>Inner</div>
      </AppProviders>
    )
    expect(getByTestId('toaster')).toBeInTheDocument()
  })

  it('passes correct props to Toaster', () => {
    render(
      <AppProviders>
        <div>Inner</div>
      </AppProviders>
    )
    expect(mockToaster).toHaveBeenCalledWith(
      expect.objectContaining({
        position: 'top-right',
        richColors: true,
        closeButton: true,
      })
    )
  })

  it('preserves nested children through all layers', () => {
    const { getByTestId } = render(
      <AppProviders>
        <div data-testid="root">
          <span data-testid="nested">Nested text</span>
        </div>
      </AppProviders>
    )
    expect(getByTestId('root')).toBeInTheDocument()
    expect(getByTestId('nested')).toBeInTheDocument()
    expect(getByTestId('nested').textContent).toBe('Nested text')
  })

  it('has correct DOM nesting order: ThemeProvider > QueryProvider > NuqsAdapter > Toaster', () => {
    const { getByTestId } = render(
      <AppProviders>
        <span>Content</span>
      </AppProviders>
    )
    expect(getByTestId('theme-provider')).toBeInTheDocument()
    expect(getByTestId('query-provider')).toBeInTheDocument()
    expect(getByTestId('nuqs-adapter')).toBeInTheDocument()
    expect(getByTestId('toaster')).toBeInTheDocument()
  })

  it('renders Toaster with correct data attributes for positional and styling props', () => {
    const { getByTestId } = render(
      <AppProviders>
        <div>Inner</div>
      </AppProviders>
    )
    const toaster = getByTestId('toaster')
    expect(toaster).toHaveAttribute('data-position', 'top-right')
    expect(toaster).toHaveAttribute('data-rich-colors', 'true')
    expect(toaster).toHaveAttribute('data-close-button', 'true')
  })

  it('renders multiple siblings as children', () => {
    render(
      <AppProviders>
        <span key="a">A</span>
        <span key="b">B</span>
        <span key="c">C</span>
      </AppProviders>
    )
    expect(mockToaster).toHaveBeenCalledOnce()
  })

  it('passes children through to ThemeProvider unchanged', () => {
    render(
      <AppProviders>
        <span data-testid="passed-through">Passed</span>
      </AppProviders>
    )
    expect(mockThemeProvider).toHaveBeenCalledWith(
      expect.anything()
    )
  })
})
