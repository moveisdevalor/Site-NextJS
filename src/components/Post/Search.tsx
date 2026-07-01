import { LuSearch } from "react-icons/lu";
import "./search.css";

interface SearchProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit?: () => void;
    placeholder?: string;
}

export default function Search({
                                   value,
                                   onChange,
                                   onSubmit,
                                   placeholder = "Pesquisar"
                               }: SearchProps) {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onSubmit) {
            onSubmit();
        }
    };

    return (
        <div className="input-group mb-3">

            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                aria-label="Pesquisar"
            />

            <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={onSubmit}
            >
                <LuSearch />
            </button>

        </div>
    );
}
