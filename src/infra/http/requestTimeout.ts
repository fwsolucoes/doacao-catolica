// @arkyn/server aborts requests after 10s by default (returns 504);
// some external endpoints legitimately take 15–20s to respond.
const REQUEST_TIMEOUT_MS = 30_000;

export { REQUEST_TIMEOUT_MS };
