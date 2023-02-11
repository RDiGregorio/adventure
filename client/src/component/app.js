import _ from 'lodash';
import './app.css';
import React from 'react';
import {Entity} from 'shared/src/entity/entity';
import {StorageAdapter} from 'shared/src/transport/storage-adapter';
import {Game} from 'shared/src/framework/game';
import {Account} from 'shared/src/framework/account';
import {random} from 'shared/src/util/math';
import {View} from 'shared/src/framework/view';
import {animate} from 'shared/src/async/async';

const chunkSize = 25, game = new Game(
    new StorageAdapter(),
    new StorageAdapter(),
    chunkSize,
    200,
    (game, account) => {
        game.chunkManager.loadNearbyChunks('', 0, 0, (world, x, y) => {
            const result = [];

            for (let i = 0; i < 20; i++)
                result.push(new Entity('', '', x + random(chunkSize), y + random(chunkSize)));

            return result;
        });

        game.chunkSpace.toArray().forEach(entity => game.chunkSpace.add(
            entity,
            entity.world,
            entity.x + random(3) - 1,
            entity.y + random(3) - 1
        ));
    }
);

game.accountManager.load('player', () => new Account());

export default class App extends React.Component {
    #view = new View(game.playerSpace, game.chunkSpace, game.petSpace);

    constructor(properties) {
        super(properties);
        animate(() => {
            this.#view.update('', 0, 0, chunkSize, chunkSize);
            this.forceUpdate();
        });
    }

    #entity(entity) {
        const cell = document.querySelector(`#grid-${entity.x}-${entity.y}`),
            x = cell?.getBoundingClientRect()?.x ?? 0,
            y = cell?.getBoundingClientRect()?.y ?? 0,
            style = {position: 'fixed', left: `${x}px`, top: `${y}px`};

        return <div className="noto-emoji entity" style={style} key={entity.id}>🐉</div>
    }

    #grid(width, height) {
        let key = 0;

        return _.range(height).map(y =>
            <div className="grid-row" key={key++}>{_.range(width).map(x =>
                <div className="grid-cell" id={`grid-${x}-${y}`} key={`grid-${x}-${y}`}></div>
            )}</div>
        );
    }

    render() {
        return <div className="grid">
            {this.#grid(chunkSize, chunkSize)}
            {this.#view.toArray().map(this.#entity)}
        </div>
    }
}