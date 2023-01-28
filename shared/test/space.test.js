import {expect, test} from 'vitest';
import {Space} from '../src/util/space.js';

test('space.search', () => {
    const space = new Space();
    space.add('a', 0, 0);
    expect(space.search(0, 0, 0, 0)).toEqual([]);
    expect(space.search(-1, -1, 1, 1)).toEqual([]);
    expect(space.search(0, 0, 1, 1)).toEqual(['a']);
    expect(space.search(-1, -1, 2, 2)).toEqual(['a']);
});

test('space.add', () => {
    const space = new Space();
    space.add('a', 0, 0);
    space.add('b', 0, 0);
    space.add('a', 1, 1);
    expect(space.search(0, 0, 1, 1)).toEqual(['b']);
    expect(space.search(1, 1, 1, 1)).toEqual(['a']);
});

test('space.delete', () => {
    const space = new Space();
    space.add('a', 0, 0);
    space.add('b', 0, 0);
    expect(space.search(0, 0, 1, 1).sort()).toEqual(['a', 'b']);
    space.delete('a');
    expect([...space]).toEqual(['b']);
    space.add('b', 1, 1);
    space.delete('b');
    expect([...space]).toEqual([]);
});