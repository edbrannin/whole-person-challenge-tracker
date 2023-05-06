import { parseLine } from './WorkoutsTextAreaInput';

describe('parseLine', () => {
  it('should parse numbers (leading whitespace)', () => {
    expect(parseLine('  45').amount).toBe(45);
  })
  it('should parse numbers (comment)', () => {
    expect(parseLine('45 -- Did a thing').amount).toBe(45);
  })

  it('should parse numbers', () => {
    expect(parseLine('45').amount).toBe(45);
  })

  it('should parse buddy number with *', () => {
    expect(parseLine('45*').amount).toBe(45);
    expect(parseLine('45*').isBuddyWorkout).toBe(true);
  })
});
