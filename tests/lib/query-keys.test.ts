import { describe, it, expect } from 'vitest';
import { queryKeys } from '../../src/lib/query-keys';

describe('queryKeys', () => {
  it('has home key', () => {
    expect(queryKeys.home).toEqual(['home']);
  });

  it('has filters key', () => {
    expect(queryKeys.filters).toEqual(['filters']);
  });

  it('has categories key', () => {
    expect(queryKeys.categories).toEqual(['categories']);
  });

  it('has notes.all key', () => {
    expect(queryKeys.notes.all).toEqual(['notes']);
  });

  it('generates correct notes.list key', () => {
    const params = { page: 1, limit: 10 };
    expect(queryKeys.notes.list(params)).toEqual(['notes', 'list', params]);
  });

  it('generates correct notes.detail key', () => {
    expect(queryKeys.notes.detail('my-note')).toEqual(['notes', 'detail', 'my-note']);
  });

  it('has groups.all key', () => {
    expect(queryKeys.groups.all).toEqual(['groups']);
  });

  it('generates correct groups.list key', () => {
    const params = { page: 1 };
    expect(queryKeys.groups.list(params)).toEqual(['groups', 'list', params]);
  });

  it('generates correct groups.detail key', () => {
    expect(queryKeys.groups.detail('my-group')).toEqual(['groups', 'detail', 'my-group']);
  });

  it('generates correct order key', () => {
    expect(queryKeys.order('abc123')).toEqual(['order', 'abc123']);
  });

  it('generates correct orderLookup key', () => {
    expect(queryKeys.orderLookup('ORD-12345')).toEqual(['order', 'lookup', 'ORD-12345']);
  });

  it('has admin.me key', () => {
    expect(queryKeys.admin.me).toEqual(['admin', 'me']);
  });

  it('has admin.dashboard key', () => {
    expect(queryKeys.admin.dashboard).toEqual(['admin', 'dashboard']);
  });

  it('has admin.categories key', () => {
    expect(queryKeys.admin.categories).toEqual(['admin', 'categories']);
  });

  it('has admin.admins key', () => {
    expect(queryKeys.admin.admins).toEqual(['admin', 'admins']);
  });

  it('has admin.notes.all key', () => {
    expect(queryKeys.admin.notes.all).toEqual(['admin', 'notes']);
  });

  it('generates correct admin.notes.list key', () => {
    const params = { page: 1 };
    expect(queryKeys.admin.notes.list(params)).toEqual(['admin', 'notes', 'list', params]);
  });

  it('generates correct admin.notes.detail key', () => {
    expect(queryKeys.admin.notes.detail('note-id')).toEqual(['admin', 'notes', 'detail', 'note-id']);
  });

  it('has admin.groups.all key', () => {
    expect(queryKeys.admin.groups.all).toEqual(['admin', 'groups']);
  });

  it('generates correct admin.groups.list key', () => {
    const params = { page: 1 };
    expect(queryKeys.admin.groups.list(params)).toEqual(['admin', 'groups', 'list', params]);
  });

  it('generates correct admin.groups.detail key', () => {
    expect(queryKeys.admin.groups.detail('group-id')).toEqual(['admin', 'groups', 'detail', 'group-id']);
  });

  it('has admin.orders.all key', () => {
    expect(queryKeys.admin.orders.all).toEqual(['admin', 'orders']);
  });

  it('generates correct admin.orders.list key', () => {
    const params = { page: 1 };
    expect(queryKeys.admin.orders.list(params)).toEqual(['admin', 'orders', 'list', params]);
  });

  it('generates correct admin.orders.detail key', () => {
    expect(queryKeys.admin.orders.detail('order-id')).toEqual(['admin', 'orders', 'detail', 'order-id']);
  });

  it('generates correct admin.leads key', () => {
    const params = { page: 1 };
    expect(queryKeys.admin.leads(params)).toEqual(['admin', 'leads', params]);
  });

  it('generates correct admin.activities key', () => {
    const params = { page: 1 };
    expect(queryKeys.admin.activities(params)).toEqual(['admin', 'activities', params]);
  });
});
