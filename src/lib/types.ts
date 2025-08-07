export type ItemType = 'sticky-note' | 'photo' | 'voice-message' | 'spotify-track' | 'doodle';

export interface Position {
	x: number;
	y: number;
}

export interface CanvasItem {
	id: string;
	type: ItemType;
	content: string;
	position: Position;
	rotation: number;
	color?: string;
	zIndex: number;
	metadata?: {
		fileUrl?: string;
		caption?: string;
		audioUrl?: string;
		spotifyUrl?: string;
		drawingData?: string; // Base64 encoded canvas data
		recordingDuration?: number;
	};
}

export interface CanvasState {
	items: CanvasItem[];
	selectedItem: string | null;
	nextZIndex: number;
}

export interface ColorOption {
	name: string;
	value: string;
	label: string;
}

export interface ToolbarItem {
	id: string;
	icon: string;
	label: string;
	action: () => void;
}
