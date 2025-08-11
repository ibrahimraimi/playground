<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Minus, Plus, RotateCcw, RotateCw, RotateCcw as RotateCcwIcon } from '@lucide/svelte';

	export let zoomLevel = 100;
	export let onZoomIn: () => void;
	export let onZoomOut: () => void;
	export let onUndo: () => void;
	export let onRedo: () => void;
	export let onResetZoom: () => void;
	export let canUndo = false;
	export let canRedo = false;

	const dispatch = createEventDispatcher();

	function handleZoomIn() {
		if (onZoomIn) {
			onZoomIn();
		} else {
			dispatch('zoomIn');
		}
	}

	function handleZoomOut() {
		if (onZoomOut) {
			onZoomOut();
		} else {
			dispatch('zoomOut');
		}
	}

	function handleUndo() {
		if (onUndo) {
			onUndo();
		} else {
			dispatch('undo');
		}
	}

	function handleRedo() {
		if (onRedo) {
			onRedo();
		} else {
			dispatch('redo');
		}
	}

	function handleResetZoom() {
		if (onResetZoom) {
			onResetZoom();
		} else {
			dispatch('resetZoom');
		}
	}
</script>

<div class="fixed right-4 bottom-4 z-50 flex gap-2">
	<!-- Zoom Controls -->
	<div class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 shadow-sm">
		<button
			on:click={handleZoomOut}
			class="flex h-6 w-6 items-center justify-center text-gray-700 transition-colors hover:text-gray-900"
			title="Zoom Out"
		>
			<Minus class="h-4 w-4" />
		</button>
		<button
			on:click={handleResetZoom}
			class="min-w-[3rem] text-center text-xs font-medium text-gray-700 transition-colors hover:text-gray-900"
			title="Reset Zoom (Ctrl+0)"
		>
			{Math.round(zoomLevel)}%
		</button>
		<button
			on:click={handleZoomIn}
			class="flex h-6 w-6 items-center justify-center text-gray-700 transition-colors hover:text-gray-900"
			title="Zoom In"
		>
			<Plus class="h-4 w-4" />
		</button>
	</div>

	<!-- Undo/Redo Controls -->
	<div class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 shadow-sm">
		<button
			on:click={handleUndo}
			disabled={!canUndo}
			class="flex h-6 w-6 items-center justify-center text-gray-700 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
			title="Undo (Ctrl+Z)"
		>
			<RotateCcw class="h-4 w-4" />
		</button>
		<button
			on:click={handleRedo}
			disabled={!canRedo}
			class="flex h-6 w-6 items-center justify-center text-gray-700 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
			title="Redo (Ctrl+Shift+Z)"
		>
			<RotateCw class="h-4 w-4" />
		</button>
	</div>
</div>
