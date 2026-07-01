"use client";

import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type MenuType = "default" | "transparent" | "simple";

type MenuCtxValue = {
	menuType: MenuType;
	setMenuType: (type: MenuType) => void;
};

const MenuCtx = createContext<MenuCtxValue | null>(null);

export function MenuTypeProvider({ children }: { children: ReactNode }) {
	const [menuType, setMenuType] = useState<MenuType>("default");
	const value = useMemo(() => ({ menuType, setMenuType }), [menuType]);
	return <MenuCtx.Provider value={value}>{children}</MenuCtx.Provider>;
}

export function useMenuType(): MenuCtxValue {
	const ctx = useContext(MenuCtx);
	if (!ctx) {
		// Fallback no-op para evitar crash caso seja usado fora do provider
		return { menuType: "default", setMenuType: () => {} };
	}
	return ctx;
}
