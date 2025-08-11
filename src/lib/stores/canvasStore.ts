import { writable, type Writable } from 'svelte/store';
import type { CanvasItem, CanvasState, Position, Size } from '$lib/types';

// History management for undo/redo
interface HistoryState {
	items: CanvasItem[];
	nextZIndex: number;
}

function createCanvasStore() {
	const initialState: CanvasState = {
		items: [],
		selectedItem: null,
		nextZIndex: 1
	};

	const { subscribe, set, update }: Writable<CanvasState> = writable(initialState);

	// History management
	let history: HistoryState[] = [];
	let historyIndex = -1;
	const maxHistorySize = 50;

	// Helper function to save current state to history
	function saveToHistory() {
		const currentState = get(initialState);
		const historyEntry: HistoryState = {
			items: [...currentState.items],
			nextZIndex: currentState.nextZIndex
		};

		// Remove any future history if we're not at the end
		history = history.slice(0, historyIndex + 1);

		// Add new entry
		history.push(historyEntry);
		historyIndex++;

		// Limit history size
		if (history.length > maxHistorySize) {
			history.shift();
			historyIndex--;
		}
	}

	// Helper function to get current state
	function get(state: CanvasState): CanvasState {
		let currentState: CanvasState;
		subscribe((s) => (currentState = s))();
		return currentState;
	}

	return {
		subscribe,
		addItem: (item: Omit<CanvasItem, 'id' | 'zIndex'>) => {
			saveToHistory();
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
			saveToHistory();
			update((state) => ({
				...state,
				items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
			}));
		},
		removeItem: (id: string) => {
			saveToHistory();
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
			saveToHistory();
			update((state) => ({
				...state,
				items: state.items.map((item) => (item.id === id ? { ...item, position } : item))
			}));
		},
		rotateItem: (id: string, rotation: number) => {
			saveToHistory();
			update((state) => ({
				...state,
				items: state.items.map((item) => (item.id === id ? { ...item, rotation } : item))
			}));
		},
		resizeItem: (id: string, size: Size) => {
			saveToHistory();
			update((state) => ({
				...state,
				items: state.items.map((item) => (item.id === id ? { ...item, size } : item))
			}));
		},
		bringToFront: (id: string) => {
			saveToHistory();
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
		undo: () => {
			if (historyIndex > 0) {
				historyIndex--;
				const previousState = history[historyIndex];
				set({
					items: [...previousState.items],
					selectedItem: null,
					nextZIndex: previousState.nextZIndex
				});
			}
		},
		redo: () => {
			if (historyIndex < history.length - 1) {
				historyIndex++;
				const nextState = history[historyIndex];
				set({
					items: [...nextState.items],
					selectedItem: null,
					nextZIndex: nextState.nextZIndex
				});
			}
		},
		canUndo: () => historyIndex > 0,
		canRedo: () => historyIndex < history.length - 1,
		reset: () => {
			saveToHistory();
			set(initialState);
		}
	};
}

export { createCanvasStore };
