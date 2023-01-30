import _ from 'lodash';
import './app.css';
import React from 'react';
import {GameView} from 'shared/src/engine/game-view';
import {Entity} from 'shared/src/engine/entity';
import {ChunkManager} from 'shared/src/engine/chunk-manager';
import {mockExists, mockLoad, mockSave, Storage} from 'shared/src/util/storage';
import {jsonReplacer, jsonReviver} from 'shared/src/util/json';
import {random} from 'shared/src/util/math';

const chunkSize = 25;

export default class App extends React.Component {
    constructor(properties) {
        super(properties);
        this.state = {data: ''};
        this.#init();
    }

    async #init() {
        const chunkManager = new ChunkManager(
            chunkSize,
            new Storage(mockExists, mockLoad, mockSave, jsonReviver, jsonReplacer),
            (world, x, y) => _.range(5).map(() => new Entity(
                world,
                x + random(chunkSize),
                y + random(chunkSize)
            ))
        );

        const entity = new Entity(0, 0, 0);
        const gameView = new GameView(entity, chunkManager);
        await chunkManager.load(0, 0, 0);
        await gameView.load();

        gameView.forEach(entity => {
            const element = document.querySelector(`#tile-${entity.x}-${entity.y}`);
            if (element) element.textContent = '🐉';
        });
    }

    #tiles(width, height) {
        let key = 0;

        return _.range(height).map(y => <div className="tile-container" key={key++}>{_.range(width).map(x => {
            const id = `tile-${x}-${y}`;
            return <span className="tile" id={id} key={key++}></span>;
        })}</div>);
    }

    render() {
        return <div className="noto-emoji">{this.#tiles(chunkSize, chunkSize)}</div>
    }
}