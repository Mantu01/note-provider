import { describe, it, expect } from 'vitest'
import { getTemplate } from '../../../src/server/lib/templates'
import type { TemplateProps } from '../../../src/server/lib/templates'

describe('templates', () => {
  const baseProps: TemplateProps = {
    type: 'purchase_notification',
    orderNumber: 'NP-20260815-0001',
    itemTitle: 'React Advanced Notes',
    itemType: 'note',
    amountLabel: '₹299',
    buyerName: 'John Doe',
    paidAt: '2026-08-15 10:30:00',
    paymentMethod: 'UPI',
    adminOrderUrl: 'https://notesprovider.com/admin/orders/NP-20260815-0001',
  }

  describe('getTemplate', () => {
    it('returns HTML for purchase_notification type', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html>')
      expect(html).toContain('<head>')
      expect(html).toContain('<body')
    })

    it('includes order number in title', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('<title>New Purchase Alert - NP-20260815-0001</title>')
    })

    it('includes order number in body', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('NP-20260815-0001')
    })

    it('includes item title', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('React Advanced Notes')
    })

    it('labels note item type correctly', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('(Note)')
      expect(html).not.toContain('(Bundle)')
    })

    it('includes amount label', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('₹299')
    })

    it('includes buyer name', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('John Doe')
    })

    it('includes payment method', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('UPI')
    })

    it('includes paid at date', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('2026-08-15 10:30:00')
    })

    it('includes admin order URL', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('https://notesprovider.com/admin/orders/NP-20260815-0001')
    })

    it('includes the CTA button text', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('View Order & Fulfill Notes')
    })

    it('includes brand name', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('Notes Provider')
    })

    it('includes notification subtitle', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('New Payment Received!')
    })

    it('includes footer text', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('Notes Provider Admin Notification System')
    })

    it('includes meta charset utf-8', () => {
      const html = getTemplate(baseProps)
      expect(html).toContain('charset="utf-8"')
    })

    it('renders group item type as Bundle', () => {
      const groupProps = { ...baseProps, itemType: 'group' as const, itemTitle: 'Full Stack Bundle' }
      const html = getTemplate(groupProps)
      expect(html).toContain('(Bundle)')
      expect(html).not.toContain('(Note)')
    })

    it('returns empty string for unknown template type', () => {
      const result = getTemplate({ type: 'unknown_type' as any } as any)
      expect(result).toBe('')
    })

    it('trims leading and trailing whitespace', () => {
      const html = getTemplate(baseProps)
      expect(html.startsWith('\n')).toBe(false)
      expect(html.endsWith('\n')).toBe(false)
    })
  })
})
