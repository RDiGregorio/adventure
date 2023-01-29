import {expect, test} from 'vitest';
import {GameObject} from '../src/engine/game-object.js';

test('object.sync', () => {
    const objects = [new GameObject(), new GameObject()];
    objects[0].set('a', 0);
    objects[0].set('b', 1);
    objects[0].set('c', 2);
    objects[0].set('b', 3);
    objects[0].set('c', 4);
    objects[0].set('d', 5);
    objects[0].sync(objects[1]);
    expect(objects[0]).toEqual(objects[1]);
});