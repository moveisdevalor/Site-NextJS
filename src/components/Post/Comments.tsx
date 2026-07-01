import { useEffect, useState } from "react";
import { api } from "../../api";

type Comment = {
    id: number;
    id_post: number;
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
            });

            setForm({ name: "", email: "", comment: "" });

            setFeedback({
                type: "success",
                message: "Comentário enviado! Ele será exibido após aprovação.",
            });

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
                {comments.map((c) => (
                    <li key={c.id} className="comment-item">
                        <div className="comment-head">
                            <span className="comment-author">{c.name}</span>
                            <time className="comment-date">
                                {new Date(c.date).toLocaleDateString()}{" "}
                                {new Date(c.date).toLocaleTimeString()}
                            </time>
                        </div>
                        <p className="comment-body">{c.comment}</p>
                    </li>
                ))}
            </ul>

        </section>
    );
}
