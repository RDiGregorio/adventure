import _ from 'lodash';
import './app.css';
import React from 'react';
import {Entity} from 'shared/src/entity/entity';
import {StorageAdapter} from 'shared/src/transport/storage-adapter';
import {Game} from 'shared/src/framework/game';
import {Account} from 'shared/src/framework/account';
import {random} from 'shared/src/util/math';
import {View} from "shared/src/framework/view";
import {animate} from "shared/src/async/async";

const chunkSize = 25, game = new Game(
    new StorageAdapter(),
    new StorageAdapter(),
    chunkSize,
    100,
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
    #world = '';
    #x = 0;
    #y = 0;
    #width = chunkSize;
    #height = chunkSize;

    constructor(properties) {
        super(properties);

        animate(() => {
            this.#view.update(this.#world, this.#x, this.#y, this.#width, this.#height);
            this.forceUpdate();
        });
    }

    #tile(x, y) {
        const array = [...this.#view.tile(x, y)];
        return array.length > 0 ? '🐉' : '';
    }

    #tiles(width, height) {
        //this.#view.update('', 0, 0, width, height);
        let key = 0;

        return _.range(height).map(y => <div className="tile-container" key={key++}>{_.range(width).map(x => {
            const id = `tile-${x}-${y}`;
            return <div className="tile" id={id} key={key++}>{this.#tile(x, y)}</div>;
        })}</div>);
    }

    render() {
        console.log(Date.now());
        return <div className="noto-emoji">{this.#tiles(this.#width, this.#height)}</div>
    }
}