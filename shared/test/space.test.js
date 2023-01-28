import {expect, test} from 'vitest';
import {Space} from '../src/util/space.js';

test('space', () => {
    const space = new Space(value => `${value}`);
    space.add('a', 0, 0);
    expect(space.search(0, 0, 0, 0)).toEqual([]);
    expect(space.search(-1, -1, 1, 1)).toEqual([]);
    expect(space.search(0, 0, 1, 1)).toEqual(['a']);
    expect(space.search(-1, -1, 2, 2)).toEqual(['a']);
});