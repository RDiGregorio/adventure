import {expect, test} from 'vitest';
import {Space} from '../src/util/space.js';

test('space', () => {
    const space = new Space();

    expect(Math.sqrt(4)).toBe(2)
    expect(Math.sqrt(144)).toBe(12)
    expect(Math.sqrt(2)).toBe(Math.SQRT2)
})
