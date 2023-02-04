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

test('MapUtil.sync', () => {
    const multiMaps = [new MultiMap(), new MultiMap()];
    multiMaps[0].set('a', 3);
    multiMaps[0].set('a', 4);
    multiMaps[0].set('c', 5);
    multiMaps[1].set('a', 0);
    multiMaps[1].set('a', 1);
    multiMaps[1].set('b', 2);
    MapUtil.sync(multiMaps[0], multiMaps[1]);
    expect([...multiMaps[0]]).toEqual([['a', 0], ['a', 1], ['b', 2]]);
});

test('MapUtil.registerClass', () => {
    const map = new Map([['a', 0], ['b', 1], ['c', 2]]);
    expect(JSON.parse(JSON.stringify(map, MapUtil.replaceMap), MapUtil.reviveMap)).toEqual(map);
    const multiMap = new MultiMap();
    multiMap.set('a', 0);
    multiMap.set('a', 1);
    multiMap.set('b', 2);
    MapUtil.registerClass(MultiMap);
    expect(JSON.parse(JSON.stringify(multiMap, MapUtil.replaceMap), MapUtil.reviveMap)).toEqual(multiMap);
});