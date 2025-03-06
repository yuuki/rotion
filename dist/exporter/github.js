import { fetchWithTimeout } from './api.js';
import { saveImage } from './files.js';
const reqInit = {
    headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    }
};
export async function getRepo({ owner, repo }, func) {
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    return (func) ? func(url, reqInit) : (await fetchWithTimeout(url, reqInit)).json();
}
export async function getRepoForLinkPreview({ owner, repo }, func) {
    const res = await getRepo({ owner, repo }, func);
    const { name, owner: { login, avatar_url }, updated_at } = res;
    const ipws = await saveImage(avatar_url, 'github-link-preview');
    return {
        name,
        login,
        avatar_url,
        avatar_src: ipws.path,
        updated_at
    };
}
export async function getIssue({ owner, repo, number }, func) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;
    return func ? func(url, reqInit) : (await fetchWithTimeout(url, reqInit)).json();
}
export async function getIssueForLinkPreview({ owner, repo, number }, func) {
    const res = await getIssue({ owner, repo, number }, func);
    const n = res.number;
    const { title, user: { login, avatar_url }, created_at, closed_at } = res;
    const ipws = await saveImage(avatar_url, 'github-link-preview');
    return {
        title,
        login,
        avatar_url,
        avatar_src: ipws.path,
        created_at,
        closed_at,
        merged_at: res.pull_request ? res.pull_request.merged_at : null,
        state: res.pull_request && res.pull_request.merged_at ? 'merged' : res.state,
        number: n
    };
}
//# sourceMappingURL=github.js.map