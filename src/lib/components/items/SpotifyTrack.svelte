<script lang="ts">
	import { onMount } from 'svelte';
	import { X, RotateCw, Music } from '@lucide/svelte';
	import type { CanvasItem } from '$lib/types';

	export let item: CanvasItem;
	export let canvasStore: any;

	let isDragging = false;
	let isMouseDown = false;
	let dragTimeout: number;
	let startX = 0;
	let startY = 0;
	let spotifyElement: HTMLDivElement;

	$: isSelected = $canvasStore.selectedItem === item.id;

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;

		const newX = e.clientX - startX;
		const newY = e.clientY - startY;

		canvasStore.moveItem(item.id, { x: newX, y: newY });
	}

	function handleMouseDown(e: MouseEvent) {
		// Check if clicking on an iframe (Spotify player)
		const target = e.target as HTMLElement;
		if (target.tagName === 'IFRAME' || target.closest('iframe')) {
			// Don't start dragging if clicking on the iframe content
			canvasStore.selectItem(item.id);
			canvasStore.bringToFront(item.id);
			return;
		}

		e.preventDefault();
		canvasStore.selectItem(item.id);
		canvasStore.bringToFront(item.id);

		startX = e.clientX - item.position.x;
		startY = e.clientY - item.position.y;
		isMouseDown = true;

		// Start drag after a short delay to distinguish between click and drag
		dragTimeout = window.setTimeout(() => {
			if (isMouseDown) {
				isDragging = true;
			}
		}, 150);
	}

	function handleMouseUp() {
		isDragging = false;
		isMouseDown = false;

		// Clear the drag timeout
		if (dragTimeout) {
			clearTimeout(dragTimeout);
			dragTimeout = 0;
		}
	}

	function handleDelete() {
		canvasStore.removeItem(item.id);
	}

	function handleRotate() {
		const newRotation = item.rotation + 15;
		canvasStore.rotateItem(item.id, newRotation);
	}

	onMount(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});
</script>

<div
	bind:this={spotifyElement}
	class="relative cursor-move select-none"
	class:selected={isSelected}
	on:mousedown={handleMouseDown}
	role="button"
	tabindex="0"
	aria-label="Move Spotify track"
>
	<!-- Spotify Track Container -->
	<div
		class="relative transform overflow-hidden rounded-lg bg-white p-2 shadow-lg transition-all duration-200"
		class:ring-1={isSelected}
		class:ring-gray-300={isSelected}
		style="width: {item.size?.width || 300}px; height: {item.size?.height || 100}px;"
	>
		<!-- Original Spotify Embed -->
		{#if item.metadata?.spotifyUrl}
			<iframe
				src={item.metadata?.spotifyUrl}
				width="100%"
				height="100%"
				style="border: none;"
				allow="encrypted-media"
				title="Spotify track player"
			></iframe>
		{:else}
			<!-- Fallback -->
			<div class="flex h-full w-full items-center justify-center bg-gray-100">
				<div class="flex items-center gap-2 text-gray-500">
					<Music class="h-5 w-5" />
					<span>Spotify Track</span>
				</div>
			</div>
		{/if}
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
	{/if}
</div>
