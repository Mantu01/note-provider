import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useNote } from '@/features/notes/api/use-note'
import { useNotes } from '@/features/notes/api/use-notes'
import { useGroup } from '@/features/groups/api/use-group'
import { useGroups } from '@/features/groups/api/use-groups'
import { useHome } from '@/features/home/api/use-home'
import { useFilters } from '@/features/notes/api/use-filters'
import { useOrder } from '@/features/orders/api/use-order'
import { useOrderLookup } from '@/features/orders/api/use-order-lookup'
import { useCreateOrder } from '@/features/checkout/api/use-create-order'
import { useAdminNotes } from '@/features/admin/api/use-admin-notes'
import { useAdminGroups } from '@/features/admin/api/use-admin-groups'
import { useAdminCategories } from '@/features/admin/api/use-admin-categories'
import { useAdminOrders } from '@/features/admin/api/use-admin-orders'
import { useAdminLeads } from '@/features/admin/api/use-admin-leads'
import { useAdminActivities } from '@/features/admin/api/use-admin-activities'
import { useFileUpload } from '@/features/admin/api/use-upload'

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return React.createElement(QueryClientProvider, { client }, children)
}

beforeEach(() => { vi.clearAllMocks() })

function mockFetch(resolved: any, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status,
    json: () => Promise.resolve(resolved),
    headers: new Headers({ 'content-type': 'application/json' }),
  })
}

function mockFetchError(message: string, status = 500) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ success: false, error: { code: 'INTERNAL_ERROR', message } }),
    headers: new Headers({ 'content-type': 'application/json' }),
  })
}

describe('useNote hook', () => {
  it('fetches note by slug on mount', async () => {
    mockFetch({ success: true, data: { note: { id: 'n1', slug: 'test', title: 'Test' } } })
    const { result } = renderHook(() => useNote('test'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.note.slug).toBe('test')
  })

  it('handles API error gracefully', async () => {
    mockFetchError('Not found', 404)
    const { result } = renderHook(() => useNote('missing'), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  it('does not fetch when slug is empty', async () => {
    const fn = vi.fn()
    global.fetch = fn
    renderHook(() => useNote(''), { wrapper })
    expect(fn).not.toHaveBeenCalled()
  })

  it('can be disabled externally', async () => {
    const fn = vi.fn()
    global.fetch = fn
    const { result } = renderHook(() => useNote('test', { enabled: false }), { wrapper })
    // When disabled, hook should not be fetching
    expect(!result.current.isLoading).toBe(true)
  })
})

describe('useNotes hook', () => {
  it('fetches paginated notes', async () => {
    mockFetch({ success: true, data: { items: [{ id: 'n1', slug: 'n1' }], pagination: { page: 1, limit: 12, total: 1, totalPages: 1, hasNext: false, hasPrev: false } } })
    const { result } = renderHook(() => useNotes({ page: 1, limit: 12 }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('handles network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useNotes({}), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useGroup hook', () => {
  it('fetches group by slug', async () => {
    mockFetch({ success: true, data: { group: { id: 'g1', slug: 'bundle', name: 'Bundle' } } })
    const { result } = renderHook(() => useGroup('bundle'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('handles not found', async () => {
    mockFetchError('Group not found', 404)
    const { result } = renderHook(() => useGroup('gone'), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useGroups hook', () => {
  it('fetches paginated groups', async () => {
    mockFetch({ success: true, data: { items: [{ id: 'g1', slug: 'g1' }], pagination: { page: 1, limit: 12, total: 1, totalPages: 1, hasNext: false, hasPrev: false } } })
    const { result } = renderHook(() => useGroups({ page: 1 }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useHome hook', () => {
  it('fetches home data', async () => {
    mockFetch({ success: true, data: { featuredNotes: [], latestNotes: [], freeNotes: [], featuredGroups: [], categories: [], stats: { totalNotes: 0, totalCategories: 0, totalDownloads: 0, happyLearners: 0 } } })
    const { result } = renderHook(() => useHome(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useFilters hook', () => {
  it('fetches filter options', async () => {
    mockFetch({ success: true, data: { categories: [], levels: [], subjects: [], tags: [], priceRange: { minPaise: 0, maxPaise: 0 }, pricing: [] } })
    const { result } = renderHook(() => useFilters(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useOrder hook', () => {
  it('fetches order by ID', async () => {
    mockFetch({ success: true, data: { id: 'o1', orderNumber: 'NP-001', paymentStatus: 'paid' } })
    const { result } = renderHook(() => useOrder('o1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('handles order not found', async () => {
    mockFetchError('Order not found', 404)
    const { result } = renderHook(() => useOrder('missing'), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useOrderLookup hook', () => {
  it('looks up order by number', async () => {
    mockFetch({ success: true, data: { orderId: 'o1', orderNumber: 'NP-001' } }, 200)
    const { result } = renderHook(() => useOrderLookup(), { wrapper })
    await result.current.mutateAsync('np-001')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('handles lookup error', async () => {
    mockFetchError('Order not found', 404)
    const { result } = renderHook(() => useOrderLookup(), { wrapper })
    let errored = false
    try {
      await result.current.mutateAsync('invalid')
    } catch {
      errored = true
    }
    expect(errored).toBe(true)
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 2000 })
  })
})

describe('useCreateOrder hook', () => {
  it('creates order successfully', async () => {
    mockFetch({ success: true, data: { orderId: 'o1', orderNumber: 'NP-001', razorpayOrderId: 'r_1', razorpayKeyId: 'rzp_key', amount: 50000, currency: 'INR', itemTitle: 'Note', buyer: { fullName: 'User', contact: '', email: 'u@u.com' } } })
    const { result } = renderHook(() => useCreateOrder(), { wrapper })
    await result.current.mutateAsync({ itemType: 'note', itemSlug: 'n1', fullName: 'User', socialPlatform: 'email', socialHandle: 'u@u.com', consentAccepted: true })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('handles creation failure', async () => {
    mockFetchError('Rate limited', 429)
    const { result } = renderHook(() => useCreateOrder(), { wrapper })
    let errored = false
    try {
      await result.current.mutateAsync({ itemType: 'note', itemSlug: 'n1', fullName: 'U', socialPlatform: 'email', socialHandle: 'u@u.com', consentAccepted: true })
    } catch {
      errored = true
    }
    expect(errored).toBe(true)
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 2000 })
  })
})

describe('useAdminNotes hook', () => {
  it('fetches admin notes list', async () => {
    mockFetch({ success: true, data: { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } })
    const { result } = renderHook(() => useAdminNotes(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAdminGroups hook', () => {
  it('fetches admin groups list', async () => {
    mockFetch({ success: true, data: { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } })
    const { result } = renderHook(() => useAdminGroups(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAdminCategories hook', () => {
  it('fetches admin categories list', async () => {
    mockFetch({ success: true, data: { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } })
    const { result } = renderHook(() => useAdminCategories(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAdminOrders hook', () => {
  it('fetches admin orders with summary', async () => {
    mockFetch({ success: true, data: { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false }, summary: { totalRevenuePaise: 0, paidCount: 0, pendingFulfillmentCount: 0, failedCount: 0 } } })
    const { result } = renderHook(() => useAdminOrders(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAdminLeads hook', () => {
  it('fetches admin leads', async () => {
    mockFetch({ success: true, data: { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } })
    const { result } = renderHook(() => useAdminLeads(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useAdminActivities hook', () => {
  it('fetches admin activities', async () => {
    mockFetch({ success: true, data: { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1, hasNext: false, hasPrev: false } } })
    const { result } = renderHook(() => useAdminActivities(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useFileUpload hook', () => {
  it('uploads file successfully', async () => {
    mockFetch({ success: true, data: { url: 'https://cdn/test.pdf', publicId: 'pub1', bytes: 1000, sizeLabel: '1 KB', format: 'pdf', pageCount: 10, resourceType: 'raw' } })
    const { result } = renderHook(() => useFileUpload(), { wrapper })
    const formData = new FormData()
    formData.append('file', new Blob(['data']), 'test.pdf')
    formData.append('kind', 'note_full')
    await result.current.mutateAsync(formData as any)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('handles upload failure', async () => {
    mockFetchError('Upload failed', 500)
    const { result } = renderHook(() => useFileUpload(), { wrapper })
    const formData = new FormData()
    formData.append('file', new Blob(['data']), 'test.pdf')
    formData.append('kind', 'cover')
    let errored = false
    try {
      await result.current.mutateAsync(formData as any)
    } catch {
      errored = true
    }
    expect(errored).toBe(true)
    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 2000 })
  })
})
