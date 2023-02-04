/**
 * A model of a game. Each player in a game should share the same model of the game.
 */

export class Model {
    #playerSpace;
    #chunkSpace;
    #petSpace;

    constructor(playerSpace, chunkSpace, petSpace) {
        this.#playerSpace = playerSpace;
        this.#chunkSpace = chunkSpace;
        this.#petSpace = petSpace;
    }

    /**
     * Returns the entity space for players.
     * @return {EntitySpace}
     */

    get playerSpace() {
        return this.#playerSpace;
    }

    /**
     * Returns the entity space for chunks.
     * @return {EntitySpace}
     */

    get chunkSpace() {
        return this.#chunkSpace;
    }

    /**
     * Returns the entity space for pets.
     * @return {EntitySpace}
     */

    get petSpace() {
        return this.#petSpace;
    }
}