/**
 * A game controller. Each player in a game should have a different game controller.
 */

export class Controller {
    #game;

    // this will mostly just set "actions" on the account

    constructor(game) {
        this.#game = game;
    }
}