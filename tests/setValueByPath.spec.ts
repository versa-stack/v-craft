import { describe, it, expect } from 'vitest';
import { setValueByPath } from '../src/lib/setValueByPath';

describe('setValueByPath', () => {
  it('should set a value for a simple path', () => {
    const obj = {};
    setValueByPath(obj, '$.name', 'John');
    expect(obj).toEqual({ name: 'John' });
  });

  it('should set a value for a nested path', () => {
    const obj = {};
    setValueByPath(obj, '$.personal.name', 'John');
    expect(obj).toEqual({ personal: { name: 'John' } });
  });

  it('should set a value for a deeply nested path', () => {
    const obj = {};
    setValueByPath(obj, '$.personal.details.name.first', 'John');
    expect(obj).toEqual({ personal: { details: { name: { first: 'John' } } } });
  });

  it('should override existing values', () => {
    const obj = { personal: { name: 'Jane' } };
    setValueByPath(obj, '$.personal.name', 'John');
    expect(obj).toEqual({ personal: { name: 'John' } });
  });

  it('should handle paths without $ prefix', () => {
    const obj = {};
    setValueByPath(obj, 'name', 'John');
    expect(obj).toEqual({ name: 'John' });
  });

  it('should handle array indices in the path', () => {
    const obj = { users: [] };
    setValueByPath(obj, '$.users[0].name', 'John');
    expect(obj).toEqual({ users: [{ name: 'John' }] });
  });
});
