<script lang="ts">
	import { onMount } from 'svelte';
	import { X, RotateCw, Music } from '@lucide/svelte';
	import type { CanvasItem } from '$lib/types';

	export let item: CanvasItem;
	export let canvasStore: any;

	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let spotifyElement: HTMLDivElement;

	$: isSelected = $canvasStore.selectedItem === item.id;

	function handleMouseDown(e: MouseEvent) {
		e.preventDefault();
		canvasStore.selectItem(item.id);
		canvasStore.bringToFront(item.id);

		startX = e.clientX - item.position.x;
		startY = e.clientY - item.position.y;
		isDragging = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;

		const newX = e.clientX - startX;
		const newY = e.clientY - startY;

		canvasStore.moveItem(item.id, { x: newX, y: newY });
	}

	function handleMouseUp() {
		isDragging = false;
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
		class="transform rounded-lg bg-white shadow-lg transition-all duration-200 hover:scale-105"
		class:ring-2={isSelected}
		class:ring-blue-500={isSelected}
			<iframe
				src={item.metadata.spotifyUrl}
				width="300"
				height="80"
				style="border: none;"
				allow="encrypted-media"
				class="rounded-t-lg"
				title="Spotify track player"
			></iframe>
				allow="encrypted-media"
				class="rounded-t-lg"
			></iframe>
		{:else}
			<!-- Fallback -->
			<div class="flex h-20 w-80 items-center justify-center rounded-t-lg bg-gray-100">
				<div class="flex items-center gap-2 text-gray-500">
					<Music class="h-5 w-5" />
					<span>Spotify Track</span>
				</div>
			</div>
		{/if}

		<!-- Title -->
		<div class="border-t p-3">
			<p class="text-sm font-medium text-gray-900">{item.content}</p>
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
	{/if}
</div>
