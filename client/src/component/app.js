import _ from 'lodash';
import './app.css';
import React from 'react';
import {Entity} from 'shared/src/entity/entity';
import {StorageAdapter} from 'shared/src/transport/storage-adapter';
import {Game} from 'shared/src/framework/game';
import {Account} from 'shared/src/framework/account';
import {random} from 'shared/src/util/math';

const chunkSize = 25, game = new Game(
    new StorageAdapter(),
    new StorageAdapter(),
    chunkSize,
    100,
    async (game, account) => {
        game.chunkManager.loadNearbyChunks('', 0, 0, (world, x, y) => {
            const result = [];

            for (let i = 0; i < 5; i++)
                result.push(new Entity('', '', x + random(chunkSize), y + random(chunkSize)));

            return result;
        });

        // Render.

        game.model.chunkSpace.toArray().forEach(entity => {
            const element = document.querySelector(`#tile-${entity.x}-${entity.y}`);
            if (element) element.textContent = '🐉';
        });
    });

game.accountManager.load('player', () => new Account());

export default class App extends React.Component {
    constructor(properties) {
        super(properties);
    }

    #tiles(width, height) {
        let key = 0;

        return _.range(height).map(y => <div className="tile-container" key={key++}>{_.range(width).map(x => {
            const id = `tile-${x}-${y}`;
            return <div className="tile" id={id} key={key++}></div>;
        })}</div>);
    }

    render() {
        return <div className="noto-emoji">{this.#tiles(chunkSize, chunkSize)}</div>
    }
}