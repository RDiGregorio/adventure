import {expect, test} from 'vitest';
import {MapUtil} from '../src/util/map-util.js';
import {MultiMap} from '../src/util/multi-map.js';

test('MapUtil.assign', () => {
    const multiMaps = [new MultiMap(), new MultiMap()];
    multiMaps[1].set('a', 0);
    multiMaps[1].set('a', 1);
    multiMaps[1].set('b', 2);
    MapUtil.assign(multiMaps[0], multiMaps[1]);
    expect([...multiMaps[0]]).toEqual([['a', 0], ['a', 1], ['b', 2]]);
});

test('MapUtil.replace', () => {
    const multiMaps = [new MultiMap(), new MultiMap()];
    multiMaps[0].set('a', 3);
    multiMaps[0].set('a', 4);
    multiMaps[0].set('c', 5);
    multiMaps[1].set('a', 0);
    multiMaps[1].set('a', 1);
    multiMaps[1].set('b', 2);
    MapUtil.replace(multiMaps[0], multiMaps[1]);
    console.log(multiMaps[0]);
    console.log(multiMaps[1]);
    expect([...multiMaps[0]]).toEqual([['a', 0], ['a', 1], ['b', 2]]);
});