/**
 * Contextual clean developer logging framework preventing production outputs.
 * @param args - Multiple elements to parse safely.
 * @returns void
 */
export const log = (...args: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};
