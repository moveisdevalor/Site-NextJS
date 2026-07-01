import { create } from 'zustand';

type AccessLevel = {
	accessLevel: number;
	userName: string;
	userId: string;
	userAvatar: string;
	avatar: string;
	handleAccessLevel: (level: number) => void;
	handleUserName: (name: string) => void;
	handleUserId: (id: string) => void;
	handleUserAvatar: (avatar: string) => void;
	updateNavAvatar: () => void;
	getAvatar: (avatar: string) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

function initialUserAvatar(): string {
	if (typeof window === 'undefined') return '';
	const stored = localStorage.getItem('userAvatar');
	return stored ? `${API_URL}${stored}` : '';
}

const useAccessLevelStore = create<AccessLevel>((set) => ({
	accessLevel: 0,
	userName: '',
	userId: '',
	userAvatar: initialUserAvatar(),
	avatar: '',
	handleAccessLevel: (level) => set({ accessLevel: level }),
	handleUserName: (name) => set({ userName: name }),
	handleUserId: (id) => set({ userId: id }),
	handleUserAvatar: (avatar) => {
		if (avatar && typeof window !== 'undefined') {
			localStorage.setItem('userAvatar', avatar);
		}
	},
	updateNavAvatar: () => {
		if (typeof window === 'undefined') return;
		set({
			userAvatar: `${API_URL}${localStorage.getItem('userAvatar') ?? ''}`,
		});
	},
	getAvatar: (avatar) => {
		set({ avatar });
	},
}));

export default useAccessLevelStore;
