<script lang="ts">
	import { onMount } from 'svelte';

	import type { CanvasItem } from '$lib/types';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import { createCanvasStore } from '$lib/stores/canvasStore';
	import DigitalCanvas from '$lib/components/DigitalCanvas.svelte';
	import AddPhotoModal from '$lib/components/modals/AddPhotoModal.svelte';
	import AddSpotifyModal from '$lib/components/modals/AddSpotifyModal.svelte';
	import DrawDoodleModal from '$lib/components/modals/DrawDoodleModal.svelte';
	import RecordVoiceModal from '$lib/components/modals/RecordVoiceModal.svelte';
	import AddStickyNoteModal from '$lib/components/modals/AddStickyNoteModal.svelte';
	import ExportModal from '$lib/components/modals/ExportModal.svelte';

	const canvasStore = createCanvasStore();

	// Modal state
	let showPhotoModal = false;
	let showStickyModal = false;
	let showVoiceModal = false;
	let showSpotifyModal = false;
	let showDoodleModal = false;
	let showExportModal = false;
	let selectedColor = 'white';

	onMount(() => {
		// Initialize with a sample sticky note
		const sampleNote: CanvasItem = {
			id: 'sample-1',
			type: 'sticky-note',
			content: 'Type your note here...',
			position: { x: 50, y: 50 },
			rotation: -5,
			color: 'white',
			zIndex: 1
		};
		canvasStore.addItem(sampleNote);
	});
</script>

<main class="relative min-h-screen bg-gray-100">
	<!-- Canvas Background with dot pattern -->
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]"
	></div>

	<!-- Main Canvas Area -->
	<div class="relative z-10 min-h-screen">
		<DigitalCanvas {canvasStore} />
	</div>

	<!-- Toolbar -->
	<div class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
		<Toolbar
			{canvasStore}
			bind:showPhotoModal
			bind:showStickyModal
			bind:showVoiceModal
			bind:showSpotifyModal
			bind:showDoodleModal
			bind:showExportModal
			bind:selectedColor
		/>
	</div>

	<!-- Modals -->
	{#if showPhotoModal}
		<AddPhotoModal {canvasStore} bind:showModal={showPhotoModal} />
	{/if}

	{#if showStickyModal}
		<AddStickyNoteModal {canvasStore} {selectedColor} bind:showModal={showStickyModal} />
	{/if}

	{#if showVoiceModal}
		<RecordVoiceModal {canvasStore} bind:showModal={showVoiceModal} />
	{/if}

	{#if showSpotifyModal}
		<AddSpotifyModal {canvasStore} bind:showModal={showSpotifyModal} />
	{/if}

	{#if showDoodleModal}
		<DrawDoodleModal {canvasStore} bind:showModal={showDoodleModal} />
	{/if}

	{#if showExportModal}
		<ExportModal {canvasStore} bind:showModal={showExportModal} />
	{/if}
</main>
