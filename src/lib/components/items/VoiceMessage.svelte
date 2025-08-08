<script lang="ts">
	import { onMount } from 'svelte';
	import { X, RotateCw, Play, Pause, Volume2 } from '@lucide/svelte';
	import type { CanvasItem } from '$lib/types';

	export let item: CanvasItem;
	export let canvasStore: any;

	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let isPlaying = false;
	let audioElement: HTMLAudioElement;
	let voiceElement: HTMLDivElement;

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
		class="transform rounded-lg bg-white p-4 shadow-lg transition-all duration-200 hover:scale-105"
		class:ring-2={isSelected}
		class:ring-blue-500={isSelected}
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
	{/if}
</div>

<audio bind:this={audioElement} src={item.metadata?.audioUrl || ''} class="hidden"></audio>
