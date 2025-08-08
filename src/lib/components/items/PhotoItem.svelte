<script lang="ts">
	import { onMount } from 'svelte';
	import { X, RotateCw } from '@lucide/svelte';
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
	let photoElement: HTMLDivElement;

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
			startWidth = item.size?.width || 320;
			startHeight = item.size?.height || 240;
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
					newWidth = Math.max(100, startWidth + deltaX);
					newHeight = Math.max(100, startHeight + deltaY);
					break;
				case 'sw':
					newWidth = Math.max(100, startWidth - deltaX);
					newHeight = Math.max(100, startHeight + deltaY);
					break;
				case 'ne':
					newWidth = Math.max(100, startWidth + deltaX);
					newHeight = Math.max(100, startHeight - deltaY);
					break;
				case 'nw':
					newWidth = Math.max(100, startWidth - deltaX);
					newHeight = Math.max(100, startHeight - deltaY);
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
	bind:this={photoElement}
	class="relative cursor-move select-none"
	class:selected={isSelected}
	on:mousedown={handleMouseDown}
	role="button"
	tabindex="0"
>
	<!-- Photo Container -->
	<div
		class="transform overflow-hidden rounded-lg shadow-lg transition-all duration-200"
		class:ring-1={isSelected}
		class:ring-gray-300={isSelected}
		style="width: {item.size?.width || 320}px; height: {item.size?.height || 240}px;"
	>
		<!-- Photo -->
		<img
			src={item.metadata?.fileUrl || ''}
			alt={item.metadata?.caption || 'Photo'}
			class="h-full w-full object-cover"
			draggable="false"
		/>

		<!-- Caption -->
		{#if item.metadata?.caption}
			<div class="bg-opacity-50 absolute right-0 bottom-0 left-0 bg-black p-3">
				<p class="text-sm text-white">{item.metadata.caption}</p>
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
