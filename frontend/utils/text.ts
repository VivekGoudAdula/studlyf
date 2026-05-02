/**
 * Plain text for cards / previews from rich-text HTML or escaped HTML strings.
 */
export function plainTextFromRichContent(raw: unknown, maxLen?: number): string {
    if (raw == null) return '';

    let s: string;
    if (typeof raw === 'object' && raw !== null) {
        const o = raw as Record<string, unknown>;
        const inner = o.html ?? o.content ?? o.text ?? o.description;
        if (typeof inner === 'string') {
            s = inner;
        } else {
            s = JSON.stringify(raw);
        }
    } else {
        s = typeof raw === 'string' ? raw : String(raw);
    }

    if (!s.trim()) return '';

    if (typeof document !== 'undefined') {
        for (let pass = 0; pass < 4; pass++) {
            try {
                const ta = document.createElement('textarea');
                ta.innerHTML = s;
                const decoded = ta.value;
                if (decoded === s && !s.includes('&lt;') && !s.includes('&#')) {
                    break;
                }
                s = decoded;
            } catch {
                break;
            }
        }

        try {
            const doc = new DOMParser().parseFromString(s, 'text/html');
            const text = doc.body?.textContent?.replace(/\s+/g, ' ').trim();
            if (text) {
                const out = maxLen != null ? text.slice(0, maxLen) : text;
                return stripResidualTags(out);
            }
        } catch {
            /* fall through */
        }
    }

    const stripped = stripResidualTags(
        s.replace(/<[\s\S]*?>/g, ' ').replace(/\s+/g, ' ').trim()
    );
    return maxLen != null ? stripped.slice(0, maxLen) : stripped;
}

function stripResidualTags(input: string): string {
    let out = input;
    for (let i = 0; i < 5 && /<[a-z!/]/i.test(out); i++) {
        out = out.replace(/<[\s\S]*?>/gi, ' ').replace(/\s+/g, ' ').trim();
    }
    return out;
}

/** Raw HTML string from API (string or { html, content, ... }). */
export function richHtmlFromOpportunityField(raw: unknown): string {
    if (raw == null) return '';
    if (typeof raw === 'object' && raw !== null) {
        const o = raw as Record<string, unknown>;
        const inner = o.html ?? o.content ?? o.text ?? o.description;
        if (typeof inner === 'string') return inner;
    }
    return typeof raw === 'string' ? raw : '';
}

/**
 * Strip dangerous tags/attributes for institution-authored HTML shown on learner pages.
 * Not a full XSS auditor; pair with CSP in production where possible.
 */
export function sanitizePresentationHtml(html: string): string {
    if (!html || !html.trim()) return '';
    let s = html;
    s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
    s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
    s = s.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
    s = s.replace(/<object[\s\S]*?<\/object>/gi, '');
    s = s.replace(/<embed[\s\S]*?>/gi, '');
    s = s.replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    s = s.replace(/href\s*=\s*(?:"|')?\s*javascript:[^"'>\s]*/gi, 'href="#"');
    return s;
}

/** Location label without a leading comma when city/venue is missing */
export function formatOpportunityLocation(loc: string | undefined | null): string {
    if (loc == null) return '';
    return String(loc).replace(/^\s*,\s*/, '').trim();
}
