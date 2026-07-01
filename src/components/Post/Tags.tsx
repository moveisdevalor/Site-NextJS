"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TagsProps = {
    initialTags?: string;
};

export default function Tags({ initialTags = "" }: TagsProps) {

    const router = useRouter();

    const [tags] = useState<string[]>(
        initialTags.split(",").map((t) => t.trim()).filter(Boolean)
    );

    if (tags.length === 0) return null;

    const handleSearchByTag = (tag: string) => {
        router.push(`/noticias?q=${encodeURIComponent(tag)}`);
    };

    return (
        <div className="post-tags">
            <div className="post-tags-list">
                {tags.map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        className="post-tag"
                        onClick={() => handleSearchByTag(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}
