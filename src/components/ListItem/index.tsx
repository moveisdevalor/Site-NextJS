"use client";

import { BsPencilSquare } from 'react-icons/bs';
import Link from 'next/link';

export default function ListItem({
	title,
	id,
}: {
	title?: string;
	id?: number | string;
}) {
	return (
		<div className="w-100 h-20 d-flex align-items-center p-2 justify-content-between">
			<div className="d-flex gap-3">
				<p className="fs-6 mb-0">{title}</p>
			</div>
			<Link href={`form?id=${id}`}>
				<BsPencilSquare />
			</Link>
		</div>
	);
}
