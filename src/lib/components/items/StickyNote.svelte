<script lang="ts">
	import { onMount } from 'svelte';
	import { X, RotateCw } from '@lucide/svelte';
	import type { CanvasItem } from '$lib/types';

	export let item: CanvasItem;
	export let canvasStore: any;

	let isEditing = false;
	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let startRotation = 0;
	let noteElement: HTMLDivElement;
	let textareaElement: HTMLTextAreaElement;

	$: isSelected = $canvasStore.selectedItem === item.id;

	function handleMouseDown(e: MouseEvent) {
		if (e.target === textareaElement && isEditing) return;

		e.preventDefault();
		canvasStore.selectItem(item.id);
		canvasStore.bringToFront(item.id);

		startX = e.clientX - item.position.x;
		startY = e.clientY - item.position.y;
		startRotation = item.rotation;
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

	function handleDoubleClick() {
		if (!isEditing) {
			isEditing = true;
			setTimeout(() => {
				textareaElement?.focus();
				textareaElement?.select();
			}, 0);
		}
	}

	function handleTextChange(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		canvasStore.updateItem(item.id, { content: target.value });
	}

	function handleTextBlur() {
		isEditing = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isEditing = false;
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
	bind:this={noteElement}
	class="relative cursor-move select-none"
	class:selected={isSelected}
	on:mousedown={handleMouseDown}
	on:dblclick={handleDoubleClick}
	role="button"
	tabindex="0"
	aria-label="Sticky note"
>
	<!-- Sticky Note -->
	<div
		class="h-48 w-48 transform rounded-xl p-4 shadow-lg transition-all duration-200 hover:scale-105"
		class:ring-2={isSelected}
		class:ring-blue-500={isSelected}
		style="background-color: {item.color || 'white'}"
	>
		{#if isEditing}
			<textarea
				bind:this={textareaElement}
				bind:value={item.content}
				on:input={handleTextChange}
				on:blur={handleTextBlur}
				on:keydown={handleKeyDown}
				class="font-handwriting h-full w-full resize-none border-none bg-transparent text-gray-800 outline-none"
				placeholder="Type your note here..."
			></textarea>
		{:else}
			<div class="font-handwriting h-full w-full whitespace-pre-wrap text-gray-800">
				{item.content}
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

<style>
	.font-handwriting {
		font-family: 'Comic Sans MS', cursive, sans-serif;
	}
</style>
