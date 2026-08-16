import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/providers/theme-provider'
import * as nextThemes from 'next-themes'

const mockNextThemesProvider = vi.fn()

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: any) => {
    mockNextThemesProvider(props)
    return <div data-testid="next-themes-wrapper">{children}</div>
  },
}))

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children inside NextThemesProvider', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <span data-testid="child">Hello</span>
      </ThemeProvider>
    )
    expect(getByTestId('child')).toBeInTheDocument()
    expect(getByTestId('child').textContent).toBe('Hello')
  })

  it('passes attribute="class" to NextThemesProvider', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>)
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({ attribute: 'class' })
    )
  })

  it('passes defaultTheme="dark" to NextThemesProvider', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>)
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({ defaultTheme: 'dark' })
    )
  })

  it('passes enableSystem to NextThemesProvider', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>)
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({ enableSystem: true })
    )
  })

  it('passes disableTransitionOnChange to NextThemesProvider', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>)
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({ disableTransitionOnChange: true })
    )
  })

  it('spreads additional props through to NextThemesProvider', () => {
    render(
      <ThemeProvider forcedTheme="light" themes={['light', 'dark']}>
        <div>Test</div>
      </ThemeProvider>
    )
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        forcedTheme: 'light',
        themes: ['light', 'dark'],
        attribute: 'class',
        defaultTheme: 'dark',
        enableSystem: true,
        disableTransitionOnChange: true,
      })
    )
  })

  it('defaults enableSystem to true when not provided', () => {
    render(<ThemeProvider><div>Test</div></ThemeProvider>)
    const calls = mockNextThemesProvider.mock.calls
    expect(calls[0][0].enableSystem).toBe(true)
  })

  it('passes through a custom className or other props without dropping defaults', () => {
    render(
      <ThemeProvider data-testid="provider-wrapper" data-theme="dark">
        <div>Test</div>
      </ThemeProvider>
    )
    expect(mockNextThemesProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: 'class',
        defaultTheme: 'dark',
        enableSystem: true,
        disableTransitionOnChange: true,
        'data-testid': 'provider-wrapper',
        'data-theme': 'dark',
      })
    )
  })
})
