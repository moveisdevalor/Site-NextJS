import './html.css';
type HtmlContentProps = {
    content: string;
};

// Mapa Wingdings → Unicode (caracteres mais comuns colados do Word).
const WINGDINGS_MAP: Record<string, string> = {
    'ü': '✓',
    'û': '✗',
    'v': '❖',
    'Ø': '●',
    'o': '○',
    '§': '◆',
};

function sanitizeWingdings(html: string): string {
    // Remove spans com font-family Wingdings, convertendo o conteúdo interno.
    let out = html.replace(
        /<span\b[^>]*font-family:\s*['"]?Wingdings[^>]*>([\s\S]*?)<\/span>/gi,
        (_, inner: string) =>
            inner.replace(/./g, (c) => WINGDINGS_MAP[c] ?? c)
    )
    // Casos sem span: "ü " no início de parágrafos/linhas (colado como texto puro).
    .replace(/(<(?:p|li|div|h[1-6])[^>]*>\s*)ü(\s)/gi, '$1✓$2');

    // Word/CKEditor às vezes salva uma lista inteira como um único <li> contendo
    // vários <p class="MsoListParagraph">. Cada <p> começa com um span Symbol "·"
    // (bullet literal). Quebra em múltiplos <li>, removendo os spans Symbol.
    out = out.replace(
        /<li\b[^>]*>([\s\S]*?)<\/li>/gi,
        (match, inner: string) => {
            const paragraphs = inner.match(
                /<p[^>]*class="[^"]*MsoListParagraph[^"]*"[^>]*>[\s\S]*?<\/p>/gi
            );
            if (!paragraphs || paragraphs.length < 2) return match;
            return paragraphs
                .map((p) => {
                    const cleaned = p.replace(
                        /<span[^>]*font-family:\s*['"]?Symbol[^>]*>[\s\S]*?<\/span>\s*/gi,
                        ""
                    );
                    return `<li>${cleaned}</li>`;
                })
                .join("");
        }
    );

    return out;
}

export default function HtmlContent({ content }: HtmlContentProps) {
    if (!content) {
        return <p>(Sem conteúdo)</p>;
    }

    return (
        <div
            className="html-content"
            dangerouslySetInnerHTML={{ __html: sanitizeWingdings(content) }}
        />
    );
}
