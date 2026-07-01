// components/Loading/Loading.tsx
import "./loading.css";

export default function Loading() {
    return (
        <div className="loading-wrapper">
            <div className="spinner"></div>
            <p>Carregando conteúdo...</p>
        </div>
    );
}
