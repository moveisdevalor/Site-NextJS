// components/Loading/LoadingSkeleton.tsx
import "./skeleton.css";

export default function LoadingSkeleton() {
    return (
        <div className="container">
            <div className="row">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div className="col-3 mb-3" key={index}>
                        <div className="skeleton-card">
                            <div className="skeleton-image" />
                            <div className="skeleton-text" />
                            <div className="skeleton-text small" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
