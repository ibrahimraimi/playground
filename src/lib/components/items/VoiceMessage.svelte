<script lang="ts">
	import { onMount } from 'svelte';
	import { X, RotateCw, Play, Pause, Volume2 } from '@lucide/svelte';
	import type { CanvasItem } from '$lib/types';

	export let item: CanvasItem;
	export let canvasStore: any;

	let isDragging = false;
	let isResizing = false;
	let startX = 0;
	let startY = 0;
	let startWidth = 0;
	let startHeight = 0;
	let resizeHandle = '';
	let isPlaying = false;
	let audioElement: HTMLAudioElement;
	let voiceElement: HTMLDivElement;

	$: isSelected = $canvasStore.selectedItem === item.id;

	function handleMouseDown(e: MouseEvent) {
		// Check if clicking on a resize handle
		const target = e.target as HTMLElement;
		if (target.classList.contains('resize-handle')) {
			e.preventDefault();
			e.stopPropagation();
			isResizing = true;
			resizeHandle = target.dataset.handle || '';
			startX = e.clientX;
			startY = e.clientY;
			startWidth = item.size?.width || 280;
			startHeight = item.size?.height || 120;
			canvasStore.selectItem(item.id);
			canvasStore.bringToFront(item.id);
			return;
		}

		e.preventDefault();
		canvasStore.selectItem(item.id);
		canvasStore.bringToFront(item.id);

		startX = e.clientX - item.position.x;
		startY = e.clientY - item.position.y;
		isDragging = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (isResizing) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			let newWidth = startWidth;
			let newHeight = startHeight;

			// Calculate new size based on resize handle
			switch (resizeHandle) {
				case 'se':
					newWidth = Math.max(150, startWidth + deltaX);
					newHeight = Math.max(80, startHeight + deltaY);
					break;
				case 'sw':
					newWidth = Math.max(150, startWidth - deltaX);
					newHeight = Math.max(80, startHeight + deltaY);
					break;
				case 'ne':
					newWidth = Math.max(150, startWidth + deltaX);
					newHeight = Math.max(80, startHeight - deltaY);
					break;
				case 'nw':
					newWidth = Math.max(150, startWidth - deltaX);
					newHeight = Math.max(80, startHeight - deltaY);
					break;
			}

			canvasStore.resizeItem(item.id, { width: newWidth, height: newHeight });
			return;
		}

		if (!isDragging) return;

		const newX = e.clientX - startX;
		const newY = e.clientY - startY;

		canvasStore.moveItem(item.id, { x: newX, y: newY });
	}

	function handleMouseUp() {
		isDragging = false;
		isResizing = false;
		resizeHandle = '';
	}

	function handleDelete() {
		canvasStore.removeItem(item.id);
	}

	function handleRotate() {
		const newRotation = item.rotation + 15;
		canvasStore.rotateItem(item.id, newRotation);
	}

	function togglePlayback() {
		if (audioElement) {
			if (isPlaying) {
				audioElement.pause();
			} else {
				audioElement.play();
			}
		}
	}

	function formatDuration(seconds: number): string {
		if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
			return '0:00';
		}
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		if (audioElement) {
			audioElement.onplay = () => (isPlaying = true);
			audioElement.onpause = () => (isPlaying = false);
			audioElement.onended = () => (isPlaying = false);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});
</script>

<div
	bind:this={voiceElement}
	class="relative cursor-move select-none"
	class:selected={isSelected}
	on:mousedown={handleMouseDown}
	role="button"
	tabindex="0"
>
	<!-- Voice Message Container -->
	<div
		class="transform rounded-lg bg-white p-4 shadow-lg transition-all duration-200"
		class:ring-1={isSelected}
		class:ring-gray-300={isSelected}
		style="width: {item.size?.width || 280}px; height: {item.size?.height || 120}px;"
	>
		<div class="flex items-center gap-3">
			<!-- Play/Pause Button -->
			<button
				on:click={togglePlayback}
				class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 transition-colors hover:bg-blue-600"
			>
				{#if isPlaying}
					<Pause class="h-4 w-4 text-white" />
				{:else}
					<Play class="ml-0.5 h-4 w-4 text-white" />
				{/if}
			</button>

			<!-- Voice Message Info -->
			<div class="min-w-0 flex-1">
				<div class="mb-1 flex items-center gap-2">
					<Volume2 class="h-4 w-4 text-gray-500" />
					<h3 class="truncate font-medium text-gray-900">{item.content}</h3>
				</div>
				{#if item.metadata?.recordingDuration}
					<p class="text-sm text-gray-500">
						{formatDuration(item.metadata.recordingDuration)}
					</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Controls (only show when selected) -->
	{#if isSelected}
		<div class="absolute -top-2 -right-2 flex gap-1">
			<button
				on:click={handleRotate}
				class="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
				title="Rotate"
			>
				<RotateCw class="h-3 w-3 text-gray-600" />
			</button>
			<button
				on:click={handleDelete}
				class="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-md hover:bg-red-600"
				title="Delete"
			>
				<X class="h-3 w-3 text-white" />
			</button>
		</div>

		<!-- Resize Handles (Hidden) -->
		<div class="pointer-events-none absolute inset-0">
			<!-- Corner resize handles -->
			<div
				class="resize-handle pointer-events-auto absolute -right-1 -bottom-1 h-3 w-3 cursor-se-resize rounded-full bg-transparent"
				data-handle="se"
				title="Resize"
			></div>
			<div
				class="resize-handle pointer-events-auto absolute -bottom-1 -left-1 h-3 w-3 cursor-sw-resize rounded-full bg-transparent"
				data-handle="sw"
				title="Resize"
			></div>
			<div
				class="resize-handle pointer-events-auto absolute -top-1 -right-1 h-3 w-3 cursor-ne-resize rounded-full bg-transparent"
				data-handle="ne"
				title="Resize"
			></div>
			<div
				class="resize-handle pointer-events-auto absolute -top-1 -left-1 h-3 w-3 cursor-nw-resize rounded-full bg-transparent"
				data-handle="nw"
				title="Resize"
			></div>
		</div>
	{/if}
</div>

<audio bind:this={audioElement} src={item.metadata?.audioUrl || ''} class="hidden"></audio>
