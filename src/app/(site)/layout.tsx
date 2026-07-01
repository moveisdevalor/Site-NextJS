import type { ReactNode } from "react";

import SiteShell from "@/layout";

export default function SiteLayout({ children }: { children: ReactNode }) {
	return <SiteShell>{children}</SiteShell>;
}
