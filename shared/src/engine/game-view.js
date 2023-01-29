class GameView {
    #replaceWith(left, right) {
        [...left.keys()].filter(key => !right.has(key)).forEach(key => left.delete(key));
        [...right].forEach(entry => left.set(...entry));
    }
}