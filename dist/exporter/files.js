import fs from 'fs';
import { mkdir, stat } from 'node:fs/promises';
import https from 'https';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import { promisify } from 'util';
import sharp from 'sharp';
import replaceExt from 'replace-ext';
import { docRoot, imageDir, fileDir, timeout, webpQuality, httpOptions, debug, googleMapKey, cacheAvailableDuration, maxRedirects, } from './variables.js';
// @ts-ignore
https.get[promisify.custom] = function getAsync(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, httpOptions, (res) => {
            // @ts-ignore
            res.end = new Promise((resolve) => res.on('end', resolve));
            resolve(res);
        });
        req.on('error', reject);
        req.setTimeout(timeout, () => {
            req.abort();
            reject(new Error(`request timed out(${timeout}ms): ${url}`));
        });
    });
};
// @ts-ignore
http.get[promisify.custom] = function getAsync(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, httpOptions, (res) => {
            // @ts-ignore
            res.end = new Promise((resolve) => res.on('end', resolve));
            resolve(res);
        });
        req.on('error', reject);
        req.setTimeout(timeout, () => {
            req.abort();
            reject(new Error(`request timed out(${timeout}ms): ${url}`));
        });
    });
};
const httpsGet = promisify(https.get);
const httpGet = promisify(http.get);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
export const findLocationUrl = (rawHeaders) => {
    for (let i = 0; i <= rawHeaders.length; i++) {
        if (rawHeaders[i].toLowerCase() === 'location') {
            const next = 1;
            return rawHeaders[i + next];
        }
    }
    if (debug) {
        console.log('location header url is not found', rawHeaders);
    }
    return '';
};
async function httpsGetWithFollowRedirects(reqUrl, redirectCount) {
    if (!redirectCount) {
        redirectCount = 0;
    }
    const httpFunc = (reqUrl.includes('https://')) ? httpsGet : httpGet;
    const res = await httpFunc(reqUrl);
    const isIncludesLocationHeader = () => {
        return res.rawHeaders.includes('Location') || res.rawHeaders.includes('location');
    };
    if (res.statusCode >= 300 && res.statusCode < 400 && isIncludesLocationHeader()) {
        const redirectTo = findLocationUrl(res.rawHeaders);
        redirectCount++;
        if (maxRedirects < redirectCount) {
            if (debug) {
                console.log('maximum number of redirects exceeded');
            }
            return res;
        }
        return await httpsGetWithFollowRedirects(redirectTo, redirectCount);
    }
    else {
        return res;
    }
}
export async function getHTTP(reqUrl) {
    let body = '';
    const res = await httpsGetWithFollowRedirects(reqUrl);
    // @ts-ignore
    for await (const chunk of res) {
        body += chunk;
    }
    return body;
}
export async function getJson(reqUrl) {
    const body = await getHTTP(reqUrl);
    return JSON.parse(body);
}
export const atoh = (a) => {
    const shasum = crypto.createHash('sha1');
    shasum.update(a);
    return shasum.digest('hex');
};
export const createDirWhenNotfound = async (dir) => {
    if (!fs.existsSync(dir)) {
        await mkdir(dir, { recursive: true });
        if (debug) {
            console.log(`created direcotry: ${dir}`);
        }
    }
};
export async function readCache(f) {
    return JSON.parse(await readFile(f, 'utf8'));
}
export async function writeCache(f, data) {
    return writeFile(f, JSON.stringify(data), 'utf8').catch(() => { });
}
export async function isAvailableCache(f, d) {
    const now = Date.now();
    const stats = await stat(f);
    const cache = stats.mtime.getTime() + (d || cacheAvailableDuration);
    return now < cache;
}
export const sleep = (m) => {
    return new Promise((resolve) => setTimeout(resolve, m));
};
export async function saveFile(fileUrl, prefix) {
    const urlWithoutQuerystring = fileUrl.split('?').shift() || '';
    const { ext, name } = path.parse(urlWithoutQuerystring);
    const basename = `${atoh(name)}${ext}`;
    const urlPath = `/${fileDir}/${prefix}-${basename}`;
    const filePath = `${docRoot}${urlPath}`;
    const dirPath = `${docRoot}/${fileDir}`;
    await createDirWhenNotfound(dirPath);
    if (fs.existsSync(filePath)) {
        const stats = await stat(filePath);
        return {
            src: urlPath,
            size: stats.size,
        };
        /* Download file */
    }
    else {
        try {
            let res;
            res = await httpsGetWithFollowRedirects(fileUrl);
            if (res.statusCode >= 400 && res.statusCode < 500 && imageDir !== urlWithoutQuerystring) {
                res = await httpsGetWithFollowRedirects(urlWithoutQuerystring);
                if (res.statusCode >= 400 && res.statusCode < 500) {
                    throw new Error(`retry download to ${urlWithoutQuerystring} but failed`);
                }
            }
            res.pipe(fs.createWriteStream(filePath));
            await res.end;
            // This fix that for fileType do not returns undefined
            await sleep(10);
        }
        catch (e) {
            if (debug) {
                console.log(`saveFile download error -- path: ${filePath}, url: ${fileUrl}, message: ${e}`);
            }
        }
    }
    const stats = await stat(filePath);
    return {
        src: urlPath,
        size: stats.size,
    };
}
export const saveImage = async (imageUrl, prefix) => {
    const urlWithoutQuerystring = imageUrl.split('?').shift() || '';
    const { ext, name } = path.parse(urlWithoutQuerystring);
    const basename = `${atoh(name)}${ext}`;
    const urlPath = `/${imageDir}/${prefix}-${basename}`;
    const filePath = `${docRoot}${urlPath}`;
    const dirPath = `${docRoot}/${imageDir}`;
    const webpUrlPath = replaceExt(urlPath, '.webp');
    const webpPath = `${docRoot}${webpUrlPath}`;
    await createDirWhenNotfound(dirPath);
    if (fs.existsSync(filePath)) {
        if (webpQuality > 0 && fs.existsSync(webpPath)) {
            try {
                const meta = await sharp(webpPath).metadata();
                return {
                    path: webpUrlPath,
                    width: meta.width,
                    height: meta.height,
                };
            }
            catch (e) {
                if (debug) {
                    console.log(`sharp.metadata() error -- path: ${webpUrlPath}, message: ${e}`);
                }
                return { path: webpUrlPath };
            }
        }
        else {
            if (ext === '.ico') {
                return { path: urlPath };
            }
            try {
                const meta = await sharp(filePath).metadata();
                return {
                    path: urlPath,
                    width: meta.width,
                    height: meta.height,
                };
            }
            catch (e) {
                if (debug) {
                    console.log(`sharp.metadata() error -- path: ${urlPath}, message: ${e}`);
                }
                return { path: urlPath };
            }
        }
        /* Download image */
    }
    else {
        try {
            let res;
            res = await httpsGetWithFollowRedirects(imageUrl);
            if (res.statusCode >= 400 && res.statusCode < 500 && imageDir !== urlWithoutQuerystring) {
                res = await httpsGetWithFollowRedirects(urlWithoutQuerystring);
                if (res.statusCode >= 400 && res.statusCode < 500) {
                    throw new Error(`retry download to ${urlWithoutQuerystring} but failed`);
                }
            }
            res.pipe(fs.createWriteStream(filePath));
            await res.end;
            // This fix that for fileType do not returns undefined
            await sleep(10);
        }
        catch (e) {
            if (debug) {
                console.log(`saveImage download error -- path: ${filePath}, url: ${imageUrl}, message: ${e}`);
            }
        }
    }
    if (ext === '.ico') {
        return { path: urlPath };
    }
    /* Convert to webp */
    try {
        const meta = await sharp(filePath).metadata();
        if (webpQuality > 0) {
            if (meta.format === 'png' || meta.format === 'jpeg') {
                if (meta.orientation && [3, 6, 8].includes(meta.orientation)) {
                    const angle = (meta.orientation === 6) ? 90 : (meta.orientation === 8) ? -90 : 180;
                    await sharp(filePath).rotate(angle).webp({ quality: webpQuality }).toFile(webpPath);
                    return {
                        path: webpUrlPath,
                        width: meta.orientation === 6 || meta.orientation === 8 ? meta.height : meta.width,
                        height: meta.orientation === 6 || meta.orientation === 8 ? meta.width : meta.height,
                    };
                }
                else {
                    await sharp(filePath).webp({ quality: webpQuality }).toFile(webpPath);
                    return {
                        path: webpUrlPath,
                        width: meta.width,
                        height: meta.height,
                    };
                }
            }
            else {
                if (debug) {
                    console.log(`sharp.metadata().format returns other -- path: ${filePath}, url: ${imageUrl}, format: ${meta.format}`);
                }
                return {
                    path: urlPath,
                    width: meta.width,
                    height: meta.height,
                };
            }
        }
        else {
            return {
                path: urlPath,
                width: meta.width,
                height: meta.height,
            };
        }
    }
    catch (e) {
        if (debug) {
            console.log(`saveImage webp convert error -- path: ${filePath}, url: ${imageUrl}, message: ${e}`);
        }
    }
    return { path: urlPath };
};
export const findHtmlByRegexp = (regexps, html) => {
    let matched = null;
    for (let i = 0; i < regexps.length; i++) {
        const result = html.match(regexps[i]);
        if (result !== null) {
            matched = result;
            break;
        }
    }
    if (matched === null) {
        return null;
    }
    return matched[1]
        .replace(/\n/g, ' ')
        .trim()
        .replace(/<[^>]*>?/gm, '')
        .replace(/https:https:/g, 'https:');
};
export const titleRegexps = [
    /<title>([^"]*?)<\/title>/,
    /<title\s+[^"]+="[^"]+">([^"]*?)<\/title>/,
    /property="og:title"\s+content="([^"]+)"/,
];
export const descRegexps = [
    /property="og:description"\s+content="([^"]+)"/,
    /content="([^"]+)"\s+property="og:description"/,
    /name="description"\s+content="([^"]+)"/,
    /content="([^"]+)"\s+name="description"/,
    /<main\s.*?<p>([\s\S]*?)<\/p>/,
    /<p>([\s\S]*?)<\/p>/,
    /<p\s.*?>([\s\S]*?)<\/p>/,
    /<div>([\s\S]*?)<\/div>/,
    /<div\s.*?>([\s\S]*?)<\/div>/,
];
export const imageRegexps = [
    /property="og:image:secure_url"\s+content="([^"]+)"/,
    /property="og:image"\s+content="([^"]+)"/,
    /content="([^"]+)"\s+property="og:image:secure_url"/,
    /content="([^"]+)"\s+property="og:image"/,
    /name="og:image"\s+content="([^"]+)"/,
    /name="twitter:image"\s+content="([^"]+)"/,
];
export const iconRegexps = [
    /<link\s+href="([^"]+)"\s+rel="icon"/,
    /<link\s+rel="icon"\s+href="(\/favicon\.ico)"\s*?\/?>/,
    /<link\s+rel="icon".*?href="([^"]+)"/,
    /<link\s+rel="shortcut icon"\s+type="image\/x-icon"\s+href="?([^"]+)"?\s?\/?>/,
    /<link\s+rel="shortcut icon"\s+href="?([^"]+)"?\s?\/?>/,
    /<link\s+href="?([^"]+)"?\s+rel="(shortcut icon|icon shortcut)"(\s+type="image\/x-icon")?\s?\/?>/,
    /<link\s+href="([^"]+)"\s+rel="icon"\s+sizes="[^"]+"\s+type="image\/[^"]"\s*\/?>/,
    /type="image\/x-icon"\s+href="(\/favicon\.ico)"/,
    /rel="icon"\s+href="(\/favicon\.ico)"/,
    /rel="shortcut icon"\s+href="([^"]+)"/,
];
export const findImage = (html) => {
    const img = html.match(/<img\s(.*?)\s?\/?>/);
    if (img !== null) {
        const imgTag = img[1];
        const imageRegex = /src="(.*?)"/;
        const result = imgTag.match(imageRegex);
        if (result !== null) {
            return result[1];
        }
    }
    return null;
};
export const getHtmlMeta = async (reqUrl, httpFunc) => {
    try {
        const resbody = httpFunc ? await httpFunc(reqUrl) : await getHTTP(reqUrl);
        const body = resbody.replace(/\n/g, ' ');
        const title = findHtmlByRegexp(titleRegexps, body) || '';
        const desc = findHtmlByRegexp(descRegexps, body) || '';
        const imagePath = findHtmlByRegexp(imageRegexps, body) || findImage(body) || '';
        const iconPath = findHtmlByRegexp(iconRegexps, body) || '/favicon.ico';
        const url = new URL(reqUrl);
        const imageUrl = imagePath !== '' ? (imagePath.match(/^(https?:|data:)/) ? imagePath : `${url.protocol}//${url.hostname}${imagePath}`) : '';
        const ipws = imagePath !== '' ? (imagePath.match(/^data:/) ? { path: imagePath } : await saveImage(imageUrl, 'html-image')) : null;
        const image = ipws ? ipws.path : '';
        const iconUrl = iconPath !== '' ? (iconPath.match(/^(https?:|data:)/) ? iconPath : `${url.protocol}//${url.hostname}${iconPath}`) : '';
        const ipws2 = iconUrl !== '' ? (iconPath.match(/^data:/) ? { path: iconPath } : await saveImage(iconUrl, `html-icon-${atoh(reqUrl)}`)) : null;
        const icon = ipws2 ? ipws2.path : '';
        return { title, desc, image, icon };
    }
    catch (e) {
        if (debug) {
            console.log(`getHtmlMeta failure: ${reqUrl} -- ${e}`);
        }
    }
    return { title: '', desc: '', image: '', icon: '' };
};
export const getVideoHtml = async (block) => {
    if (block.video?.type !== 'external') {
        return '';
    }
    const extUrl = block.video?.external.url;
    let reqUrl = '';
    if (extUrl.includes('//www.youtube.com') || extUrl.includes('youtu.be')) {
        reqUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(extUrl)}`;
    }
    else if (extUrl.includes('//vimeo.com')) {
        reqUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(extUrl)}`;
    }
    if (reqUrl !== '') {
        try {
            const json = await getJson(reqUrl);
            return json.html;
        }
        catch (e) {
            if (debug) {
                console.log(`getVideoHtml failure: ${reqUrl} - ${e}`);
            }
        }
    }
    return '';
};
export async function getSlideshareOembedUrl(reqUrl, httpFunc) {
    const resbody = httpFunc ? await httpFunc(reqUrl) : await getHTTP(reqUrl);
    const metaTagRegex = /<meta\s+name=["']twitter:player["']\s+content=["'](.*?)["']/i;
    const matched = resbody.match(metaTagRegex);
    return matched ? matched[1] : '';
}
export const getEmbedHtml = async (block) => {
    const { embed } = block;
    if (embed === undefined) {
        return '';
    }
    const { url } = embed;
    const src = url || '';
    let oembedUrl = '';
    if (url.includes('//www.instagram.com')) {
        const link = src.split('?').shift();
        // Instagram oEmbed API is authentication required. So hard-coding.
        return `<blockquote class="instagram-media" data-instgrm-permalink="${link}?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"> </blockquote> <script async src="//www.instagram.com/embed.js"></script>`;
    }
    else if (url.includes('//open.spotify.com')) {
        const type = src.includes('artist') ? 'artist' : src.includes('album') ? 'album' : null;
        if (type) {
            // Example: https://open.spotify.com/intl-ja/artist/2YZyLoL8N0Wb9xBt1NhZWg
            // Example: https://open.spotify.com/intl-ja/album/07w0rG5TETcyihsEIZR3qG
            const id = src.split('/').pop();
            return `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/${type}/${id}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
        }
        console.log(`spotify url mismatched: ${src}`);
    }
    else if (url.includes('//music.apple.com')) {
        // Example: https://music.apple.com/us/album/paracosm-bonus-track-version/655768700
        const m = src.match(/([a-z]+)\/album\/([0-9A-z-]+)\/(\d+)/);
        if (m) {
            const contry = m[1];
            const albumName = m[2];
            const musicId = m[3];
            return `<iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;border-radius:10px;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/${contry}/album/${albumName}/${musicId}"></iframe>`;
        }
        console.log(`apple music url mismatched: ${src}`);
    }
    else if (url.includes('//www.google')) {
        if (googleMapKey) {
            // Example:
            // https://www.google.com/maps/@33.5838302,130.3657052,14z?entry=ttu
            // https://www.google.com/maps/place/%E7%A6%8F%E5%B2%A1%E5%B8%82%E5%BD%B9%E6%89%80/@33.5902469,130.3992059,17z/data=!3m2!4b1!5s0x3541918112202223:0x6cba44d6a8d62d97!4m6!3m5!1s0x35419191c6bf9d81:0x5999335c14be57dc!8m2!3d33.5902425!4d130.4017862!16s%2Fg%2F1tdmbp2k?hl=ja&entry=ttu
            // https://www.google.co.jp/maps/place/%E7%A6%8F%E5%B2%A1%E7%9C%8C%E7%A6%8F%E5%B2%A1%E5%B8%82/@33.6501493,130.0988255,11z/data=!3m1!4b1!4m6!3m5!1s0x3541eda1e9848429:0xf60a729936398783!8m2!3d33.5901838!4d130.4016888!16zL20vMGdxa2Q?hl=ja&entry=ttu
            // https://www.google.co.jp/maps/dir/%E5%A4%A9%E7%A5%9E%E3%80%81%E3%80%92810-0001+%E7%A6%8F%E5%B2%A1%E7%9C%8C%E7%A6%8F%E5%B2%A1%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA/%E7%A6%8F%E5%B2%A1%E7%A9%BA%E6%B8%AF%E3%80%81%E3%80%92812-0003+%E7%A6%8F%E5%B2%A1%E7%9C%8C%E7%A6%8F%E5%B2%A1%E5%B8%82%E5%8D%9A%E5%A4%9A%E5%8C%BA%E4%B8%8B%E8%87%BC%E4%BA%95%EF%BC%97%EF%BC%97%EF%BC%98%E2%88%92%EF%BC%91/@33.5728608,130.4138763,14z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x3541918dd8b0a675:0x43ab58c2e521e67!2m2!1d130.399409!2d33.5916163!1m5!1m1!1s0x35419016426901ad:0x16e67f46584e1fb7!2m2!1d130.4438542!2d33.5845874!3e3?hl=ja&entry=ttu
            const regex = /maps\/((view|place|dir)\/(.*)\/)?\@([0-9\.]+),([0-9\.]+),(\d+)z/;
            const m = src.match(regex);
            if (m) {
                const mode = m[2];
                const data = m[3];
                const latitude = m[4];
                const longitude = m[5];
                const zoom = m[6];
                let url = 'https://www.google.com/maps/embed/v1';
                switch (mode) {
                    case 'dir':
                        const arrayData = data.split('/');
                        url = `${url}/directions?key=${googleMapKey}&origin=${arrayData[0]}&destination=${arrayData[1]}`;
                        break;
                    case 'place':
                        url = `${url}/place?key=${googleMapKey}&q=${data}&center=${latitude},${longitude}&zoom=${zoom}`;
                        break;
                    case 'view':
                    default:
                        url = `${url}/view?key=${googleMapKey}&center=${latitude},${longitude}&zoom=${zoom}`;
                        break;
                }
                return `<iframe width="100%" height="450" frameborder="0" style="border:0" referrerpolicy="no-referrer-when-downgrade" src="${url}" allowfullscreen> </iframe>`;
            }
            console.log(`map url mismatched: ${src}`);
        }
        else {
            console.log('map is required: GOOGLEMAP_KEY');
        }
    }
    else if (url.includes('//www.slideshare.net')) {
        const playerUrl = (url.includes('/embed_code/')) ? url : await getSlideshareOembedUrl(url);
        oembedUrl = `https://www.slideshare.net/api/oembed/2?url=${encodeURIComponent(playerUrl)}`;
    }
    else if (url.includes('//x.com') || url.includes('//twitter.com')) {
        const tweetId = path.basename(src.split('?').shift() || '');
        oembedUrl = `https://api.twitter.com/1/statuses/oembed.json?id=${tweetId}`;
    }
    else if (url.includes('//speakerdeck.com')) {
        oembedUrl = `https://speakerdeck.com/oembed.json?url=${encodeURIComponent(url)}`;
    }
    else if (url.includes('//www.tiktok.com')) {
        oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    }
    if (oembedUrl !== '') {
        /*
         * The `UND_ERR_SOCKET` error occurs when GET request to the speakerdeck.com using the fetch api. That's why this using the https module.
         * A bug report has been created
         * https://github.com/nodejs/undici/issues/1412
         */
        try {
            const json = await getJson(oembedUrl);
            return json.html;
        }
        catch (e) {
            if (debug) {
                console.log(`getEmbedHtml failure: ${oembedUrl} -- ${e}`);
            }
        }
    }
    return '';
};
export const isEmpty = (obj) => {
    return !Object.keys(obj).length;
};
export function getVideoType(uri) {
    const ext = path.extname(uri).replace('.', '');
    switch (ext) {
        case 'mp4':
            return 'video/mp4';
        case 'webm':
            return 'video/webm';
        case 'ogm':
        case 'ogv':
        case 'ogg':
            return 'video/ogg';
        default:
            return '';
    }
}
//# sourceMappingURL=files.js.map