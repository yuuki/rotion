import { Client } from '@notionhq/client';
import { isNotionClientError, APIErrorCode, ClientErrorCode, LogLevel, } from '@notionhq/client';
import { atoh, readCache, writeCache, isAvailableCache, } from './files.js';
import { cacheDir, waitingTimeSec, waitTimeSecAfterLimit, auth, debug, } from './variables.js';
export const notion = new Client({ auth, logLevel: debug ? LogLevel.DEBUG : LogLevel.ERROR });
export async function reqAPIWithBackoff({ func, args, count }) {
    if (count < 1) {
        throw new Error('backoff count exceeded');
    }
    let res = null;
    try {
        res = await func(args);
        if (waitingTimeSec > 0) {
            await new Promise(resolve => setTimeout(resolve, waitingTimeSec));
        }
    }
    catch (error) {
        if (isNotionClientError(error)) {
            switch (error.code) {
                case APIErrorCode.RateLimited:
                case APIErrorCode.InternalServerError:
                case APIErrorCode.ValidationError:
                    if (error.message.startsWith('The start_cursor provided is invalid:')) {
                        if (debug) {
                            console.log(`reqAPIWithBackoff backoff(${count}) -- error code: ${error.code}`);
                        }
                        if (waitTimeSecAfterLimit > 0) {
                            await new Promise(resolve => setTimeout(resolve, waitTimeSecAfterLimit));
                        }
                        res = await reqAPIWithBackoff({ func, args, count: count-- });
                    }
                    break;
                case ClientErrorCode.ResponseError:
                case ClientErrorCode.RequestTimeout:
                    if (debug) {
                        console.log(`reqAPIWithBackoff backoff(${count}) -- error code: ${error.code}`);
                    }
                    if (waitTimeSecAfterLimit > 0) {
                        await new Promise(resolve => setTimeout(resolve, waitTimeSecAfterLimit));
                    }
                    res = await reqAPIWithBackoff({ func, args, count: count-- });
                    break;
            }
        }
        if (debug) {
            console.error(`reqAPIWithBackoff error -- func: ${func.name}, args: ${args}, error: ${error}`);
        }
    }
    if (res === null) {
        throw new Error(`request to notion api failed: ${func.name}`);
    }
    return res;
}
export async function reqAPIWithBackoffAndCache({ name, func, args, count }) {
    const key = atoh(JSON.stringify({ func: func.name, args }));
    const cacheFile = `${cacheDir}/${name}-${key}`;
    try {
        const cache = await readCache(cacheFile);
        if (await isAvailableCache(cacheFile)) {
            return cache;
        }
    }
    catch (_) {
        /* not fatal */
    }
    const res = await reqAPIWithBackoff({ func, args, count });
    await writeCache(cacheFile, res);
    return res;
}
// TODO: replace http(s).get functions to this
export async function fetchWithTimeout(url, options = {}) {
    const { timeout = 5000, ...fetchOptions } = options;
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);
    options.signal = signal;
    try {
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);
        return response;
    }
    catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Request timed out after ${timeout}ms`);
        }
        throw error;
    }
}
//# sourceMappingURL=api.js.map