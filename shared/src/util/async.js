/**
 * Returns a promise that resolves after `milliseconds`.
 * @param {number} milliseconds
 * @return {Promise<void>}
 */

export async function sleep(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}