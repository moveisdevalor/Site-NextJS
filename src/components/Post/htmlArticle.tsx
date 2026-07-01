import './html.css';
type HtmlContentProps = {
    content: string;
};

export default function HtmlContent({ content }: HtmlContentProps) {
    if (!content) {
        return <p>(Sem conteúdo)</p>;
    }

    return (
        <div
            className="html-content-article"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
