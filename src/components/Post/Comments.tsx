import { useEffect, useState } from "react";
import { api } from "../../api";

type Comment = {
    id: number;
    id_post: number;
    parent_id: number | null;
    name: string;
    email: string;
    comment: string;
    date: string;
    status: number;
};

type Props = {
    postId: number;
};

export default function Comments({ postId }: Props) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        comment: "",
    });

    const [feedback, setFeedback] = useState<{
        type: "success" | "error" | "warning" | null;
        message: string;
    }>({ type: null, message: "" });

    const [sending, setSending] = useState(false);
    const [replyTo, setReplyTo] = useState<Comment | null>(null);
    const [replyForm, setReplyForm] = useState({ name: "", email: "", comment: "" });
    const [sendingReply, setSendingReply] = useState(false);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/comments/${postId}`);
            setComments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postId) fetchComments();
    }, [postId]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        if (!form.name.trim()) return "Informe seu nome";
        if (!form.email.trim()) return "Informe seu email";
        if (!form.email.includes("@")) return "Email inválido";
        if (!form.comment.trim()) return "Digite um comentário";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = validate();

        if (error) {
            setFeedback({ type: "warning", message: error });
            return;
        }

        try {
            setSending(true);
            setFeedback({ type: null, message: "" });

            await api.post("/comments", {
                id_post: postId,
                name: form.name,
                email: form.email,
                comment: form.comment,
                parent_id: null,
            });

            setForm({ name: "", email: "", comment: "" });

            setFeedback({
                type: "success",
                message: "Comentário enviado! Ele será exibido após aprovação.",
            });

            fetchComments();

        } catch (err) {
            console.error(err);
            setFeedback({
                type: "error",
                message: "Erro ao enviar comentário. Tente novamente.",
            });
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (feedback.message) {
            const t = setTimeout(() => {
                setFeedback({ type: null, message: "" });
            }, 4000);
            return () => clearTimeout(t);
        }
    }, [feedback]);

    const replyBtnStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        marginTop: "0.6rem",
        padding: "0.3rem 0.85rem",
        background: "#ffffff",
        border: "1px solid #c2cc9a",
        borderRadius: 999,
        fontSize: "0.78rem",
        fontWeight: 600,
        lineHeight: 1,
        color: "#5a6450",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        cursor: "pointer",
    };

    const rootComments = comments.filter((c) => !c.parent_id);

    const repliesMap = comments.reduce<Record<number, Comment[]>>((acc, c) => {
        if (!c.parent_id) return acc;
        (acc[c.parent_id] ||= []).push(c);
        return acc;
    }, {});

    const handleReply = (c: Comment) => {
        setReplyTo((prev) => (prev?.id === c.id ? null : c));
        setReplyForm({ name: "", email: "", comment: "" });
    };

    const handleSubmitReply = async (e: React.FormEvent, parent: Comment) => {
        e.preventDefault();

        if (!replyForm.name.trim()) {
            setFeedback({ type: "warning", message: "Informe seu nome" });
            return;
        }
        if (!replyForm.email.includes("@")) {
            setFeedback({ type: "warning", message: "Email inválido" });
            return;
        }
        if (!replyForm.comment.trim()) {
            setFeedback({ type: "warning", message: "Digite sua resposta" });
            return;
        }

        try {
            setSendingReply(true);

            await api.post("/comments", {
                id_post: postId,
                name: replyForm.name,
                email: replyForm.email,
                comment: replyForm.comment,
                parent_id: parent.id,
            });

            setReplyTo(null);
            setReplyForm({ name: "", email: "", comment: "" });

            setFeedback({
                type: "success",
                message: "Resposta enviada! Ela será exibida após aprovação.",
            });

            fetchComments();

        } catch (err) {
            console.error(err);
            setFeedback({
                type: "error",
                message: "Erro ao enviar resposta. Tente novamente.",
            });
        } finally {
            setSendingReply(false);
        }
    };

    const renderComment = (c: Comment) => (
        <>
            <div className="comment-head">
                <span className="comment-author">{c.name}</span>
                <time className="comment-date">
                    {new Date(c.date).toLocaleDateString()}{" "}
                    {new Date(c.date).toLocaleTimeString()}
                </time>
            </div>
            <p className="comment-body">{c.comment}</p>
            <button
                type="button"
                className="comment-reply-btn"
                style={replyBtnStyle}
                onClick={() => handleReply(c)}
            >
                {replyTo?.id === c.id ? "Cancelar" : "Responder"}
            </button>

            {replyTo?.id === c.id && (
                <form
                    className="comment-reply-form"
                    onSubmit={(e) => handleSubmitReply(e, c)}
                >
                    <div className="row g-2 mb-2">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="comments-input"
                                placeholder="Seu nome"
                                value={replyForm.name}
                                onChange={(e) =>
                                    setReplyForm((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="email"
                                className="comments-input"
                                placeholder="Seu email"
                                value={replyForm.email}
                                onChange={(e) =>
                                    setReplyForm((p) => ({ ...p, email: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    <textarea
                        className="comments-input comments-textarea"
                        rows={3}
                        placeholder={`Respondendo a ${c.name}...`}
                        value={replyForm.comment}
                        onChange={(e) =>
                            setReplyForm((p) => ({ ...p, comment: e.target.value }))
                        }
                    />

                    <div className="text-end mt-2">
                        <button type="submit" className="mv-btn" disabled={sendingReply}>
                            {sendingReply ? "Enviando..." : "Enviar resposta"}
                        </button>
                    </div>
                </form>
            )}
        </>
    );

    return (
        <section className="comments-section">

            <header className="comments-header">
                <h4 className="comments-title">
                    Comentários
                    <span className="comments-count">{comments.length}</span>
                </h4>
            </header>

            {feedback.message && (
                <div className={`comments-feedback comments-feedback-${feedback.type}`}>
                    {feedback.message}
                </div>
            )}

            <form className="comments-form" onSubmit={handleSubmit}>

                <div className="row g-2 mb-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="comments-input"
                            placeholder="Seu nome"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>

                    <div className="col-md-6">
                        <input
                            type="email"
                            className="comments-input"
                            placeholder="Seu email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <textarea
                        className="comments-input comments-textarea"
                        rows={4}
                        placeholder="Escreva seu comentário..."
                        value={form.comment}
                        onChange={(e) => handleChange("comment", e.target.value)}
                    />
                </div>

                <div className="text-end">
                    <button
                        type="submit"
                        className="mv-btn"
                        disabled={sending}
                    >
                        {sending ? "Enviando..." : "Enviar comentário"}
                    </button>
                </div>

            </form>

            {loading && (
                <p className="comments-empty">Carregando comentários...</p>
            )}

            {!loading && comments.length === 0 && (
                <p className="comments-empty">Nenhum comentário ainda. Seja o primeiro.</p>
            )}

            <ul className="comments-list">
                {rootComments.map((c) => (
                    <li key={c.id} className="comment-item">
                        {renderComment(c)}

                        {(repliesMap[c.id] || []).length > 0 && (
                            <ul
                                className="comments-list comments-replies"
                                style={{
                                    marginTop: "0.75rem",
                                    marginLeft: "2.25rem",
                                    paddingLeft: "1.25rem",
                                    borderLeft: "2px solid #e2e6d6",
                                    listStyle: "none",
                                }}
                            >
                                {repliesMap[c.id].map((r) => (
                                    <li key={r.id} className="comment-item comment-reply">
                                        {renderComment(r)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

        </section>
    );
}
