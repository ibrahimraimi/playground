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
	import HamburgerMenu from '$lib/components/HamburgerMenu.svelte';
	import toast from 'svelte-french-toast';
	import LZString from 'lz-string';

	const canvasStore = createCanvasStore();

	// Modal state
	let showPhotoModal = false;
	let showStickyModal = false;
	let showVoiceModal = false;
	let showSpotifyModal = false;
	let showDoodleModal = false;
	let showExportModal = false;
	let selectedColor = 'white';
	let canvasBackground = '#f3f4f6'; // Default light gray background

	onMount(() => {
		// Initialize with a sample sticky note
		const sampleNote: CanvasItem = {
			id: 'sample-1',
			type: 'sticky-note',
			content: 'Type your note here...',
			position: { x: 50, y: 50 },
			size: { width: 192, height: 192 }, // 48 * 4 (h-48 w-48)
			rotation: -5,
			color: 'white',
			zIndex: 1
		};
		canvasStore.addItem(sampleNote);

		// Add keyboard shortcuts
		function handleKeydown(event: KeyboardEvent) {
			if (event.ctrlKey || event.metaKey) {
				switch (event.key) {
					case 'o':
						event.preventDefault();
						// Trigger file open (will be handled by hamburger menu)
						break;
					case 'e':
						if (event.shiftKey) {
							event.preventDefault();
							showExportModal = true;
						}
						break;
					case 's':
						if (event.shiftKey) {
							event.preventDefault();
							// Trigger shareable link (will be handled by hamburger menu)
							break;
						}
						break;
				}
			}
		}

		document.addEventListener('keydown', handleKeydown);

		// Check for shared link data in URL
		const urlParams = new URLSearchParams(window.location.search);
		const sharedData = urlParams.get('data');
		const shareId = urlParams.get('share');

		// Handle new share ID parameter (for large canvases)
		if (shareId) {
			try {
				const storageKey = `playground_share_${shareId}`;
				const storedData = localStorage.getItem(storageKey);

				if (storedData) {
					const shareData = JSON.parse(storedData);

					// Check if the share has expired
					if (shareData.expires && Date.now() > shareData.expires) {
						localStorage.removeItem(storageKey);
						toast.error('This shareable link has expired. Please request a new one.');
						return;
					}

					const canvasData = shareData.data;

					// Reset current canvas and load shared data
					canvasStore.reset();

					// Add all items from the shared data
					canvasData.items.forEach((item: any) => {
						canvasStore.addItem({
							type: item.type,
							content: item.content,
							position: item.position,
							size: item.size || { width: 192, height: 192 }, // Default size for backward compatibility
							rotation: item.rotation,
							color: item.color,
							metadata: item.metadata
						});
					});

					// Clear the URL parameter
					const newUrl = window.location.pathname;
					window.history.replaceState({}, '', newUrl);

					toast.success('Shared layout loaded successfully!');
				} else {
					toast.error('Shareable link not found. It may have expired or been removed.');
				}
			} catch (error) {
				console.error('Error loading shared layout:', error);
				toast.error('Failed to load shared layout. The link might be invalid or corrupted.');
			}
		}
		// Handle data parameter (now using LZ-String compression)
		else if (sharedData) {
			try {
				// Try LZ-String decompression first (new format)
				let canvasData;
				try {
					const decompressedData = LZString.decompressFromEncodedURIComponent(sharedData);
					if (decompressedData) {
						canvasData = JSON.parse(decompressedData);
					} else {
						throw new Error('LZ-String decompression failed');
					}
				} catch (lzError) {
					// Fallback to old base64 format for backward compatibility
					const paddedData = sharedData + '='.repeat((4 - (sharedData.length % 4)) % 4);
					const decodedData = decodeURIComponent(
						escape(atob(paddedData.replace(/-/g, '+').replace(/_/g, '/')))
					);
					canvasData = JSON.parse(decodedData);
				}

				// Reset current canvas and load shared data
				canvasStore.reset();

				// Add all items from the shared data
				canvasData.items.forEach((item: any) => {
					canvasStore.addItem({
						type: item.type,
						content: item.content,
						position: item.position,
						size: item.size || { width: 192, height: 192 }, // Default size for backward compatibility
						rotation: item.rotation,
						color: item.color,
						metadata: item.metadata
					});
				});

				// Clear the URL parameter
				const newUrl = window.location.pathname;
				window.history.replaceState({}, '', newUrl);

				toast.success('Shared layout loaded successfully!');
			} catch (error) {
				console.error('Error loading shared data:', error);
				toast.error('Failed to load shared layout. The link might be invalid or corrupted.');
			}
		}

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<main class="relative min-h-screen" style="background-color: {canvasBackground}">
	<!-- Canvas Background with dot pattern -->
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:20px_20px]"
	></div>

	<!-- Hamburger Menu -->
	<HamburgerMenu
		{canvasStore}
		bind:showExportModal
		on:changeBackground={(event) => (canvasBackground = event.detail.color)}
	/>

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
