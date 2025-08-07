import { writable, type Writable } from 'svelte/store';
import type { CanvasItem, CanvasState, Position } from '$lib/types';

function createCanvasStore() {
	const initialState: CanvasState = {
		items: [],
		selectedItem: null,
		nextZIndex: 1
	};

	const { subscribe, set, update }: Writable<CanvasState> = writable(initialState);

	return {
		subscribe,
		addItem: (item: Omit<CanvasItem, 'id' | 'zIndex'>) => {
			update((state) => {
				const newItem: CanvasItem = {
					...item,
					id: crypto.randomUUID(),
					zIndex: state.nextZIndex
				};
				return {
					...state,
					items: [...state.items, newItem],
					nextZIndex: state.nextZIndex + 1,
					selectedItem: newItem.id
				};
			});
		},
		updateItem: (id: string, updates: Partial<CanvasItem>) => {
			update((state) => ({
				...state,
				items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
			}));
		},
		removeItem: (id: string) => {
			update((state) => ({
				...state,
				items: state.items.filter((item) => item.id !== id),
				selectedItem: state.selectedItem === id ? null : state.selectedItem
			}));
		},
		selectItem: (id: string | null) => {
			update((state) => ({
				...state,
				selectedItem: id
			}));
		},
		moveItem: (id: string, position: Position) => {
			update((state) => ({
				...state,
				items: state.items.map((item) => (item.id === id ? { ...item, position } : item))
			}));
		},
		rotateItem: (id: string, rotation: number) => {
			update((state) => ({
				...state,
				items: state.items.map((item) => (item.id === id ? { ...item, rotation } : item))
			}));
		},
		bringToFront: (id: string) => {
			update((state) => {
				const maxZIndex = Math.max(...state.items.map((item) => item.zIndex));
				return {
					...state,
					items: state.items.map((item) =>
						item.id === id ? { ...item, zIndex: maxZIndex + 1 } : item
					),
					nextZIndex: maxZIndex + 2
				};
			});
		},
		reset: () => set(initialState)
	};
}

export { createCanvasStore };
