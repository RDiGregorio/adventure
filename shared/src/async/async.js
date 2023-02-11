/**
 * Calls a function on each animation frame.
 * @param {function(): void} callback
 */

export function animate(callback) {
    requestAnimationFrame(() => {
        callback();
        animate(callback);
    });
}

/**
 * Returns a promise that resolves after `milliseconds`.
 * @param {number} milliseconds
 * @return {Promise<void>}
 */

export async function async(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
}