import { parseLine } from './useTracker';

describe('parseLine', () => {
  it('should parse numbers (leading whitespace)', () => {
    expect(parseLine('  45')).toBe(45);
  })
  it('should parse numbers (comment)', () => {
    expect(parseLine('45 -- Did a thing')).toBe(45);
  })

  it('should parse numbers', () => {
    expect(parseLine('45')).toBe(45);
  })

  it('should parse buddy number with *', () => {
    expect(parseLine('45*')).toBe(90);
  })
});
