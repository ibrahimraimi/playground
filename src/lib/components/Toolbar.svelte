<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColorPalette from './ColorPalette.svelte';

	export let canvasStore: any;
	export let showPhotoModal: boolean;
	export let showStickyModal: boolean;
	export let showVoiceModal: boolean;
	export let showSpotifyModal: boolean;
	export let showDoodleModal: boolean;

	export let selectedColor: string;

	const dispatch = createEventDispatcher();

	const colorOptions = [
		{ name: 'white', value: 'white', label: 'White' },
		{ name: 'yellow', value: '#fef3c7', label: 'Yellow' },
		{ name: 'blue', value: '#dbeafe', label: 'Blue' },
		{ name: 'green', value: '#dcfce7', label: 'Green' },
		{ name: 'pink', value: '#fce7f3', label: 'Pink' }
	];

	function handleAddPhoto() {
		showPhotoModal = true;
	}

	function handleAddStickyNote() {
		showStickyModal = true;
	}

	function handleAddVoiceMessage() {
		showVoiceModal = true;
	}

	function handleAddSpotify() {
		showSpotifyModal = true;
	}

	function handleDrawDoodle() {
		showDoodleModal = true;
	}
</script>

<div class="relative">
	<!-- Color Palette -->
	<!-- <div class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform">
		<ColorPalette {colorOptions} bind:selectedColor />
	</div> -->

	<!-- Main Toolbar -->
	<div class="flex items-center gap-4 rounded-xl bg-white px-4 py-2 shadow-lg">
		<!-- Add Photo -->
		<button on:click={handleAddPhoto} class="flex cursor-pointer flex-col items-center">
			<div class="flex items-center justify-center">
				<img src="/assets/camera.svg" alt="Camera" class="h-10 w-10" />
			</div>
		</button>

		<!-- Add Sticky Note -->
		<button on:click={handleAddStickyNote} class="flex cursor-pointer flex-col items-center">
			<div class="relative flex items-center justify-center">
				<img src="/assets/notes.svg" alt="Note" class="h-10 w-10" />
			</div>
		</button>

		<!-- Record Voice -->
		<button on:click={handleAddVoiceMessage} class="flex cursor-pointer flex-col items-center">
			<div class="flex items-center justify-center">
				<img src="/assets/microphone.svg" alt="Mic" class="h-10 w-10" />
			</div>
		</button>

		<!-- Add Spotify -->
		<button on:click={handleAddSpotify} class="flex cursor-pointer flex-col items-center">
			<div class="flex items-center justify-center">
				<img src="/assets/disc.svg" alt="Music" class="h-10 w-10" />
			</div>
		</button>

		<!-- Draw Doodle -->
		<button on:click={handleDrawDoodle} class="flex cursor-pointer flex-col items-center">
			<div class="flex items-center justify-center">
				<img src="/assets/pencil.svg" alt="Doodle" class="h-10 w-10" />
			</div>
		</button>
	</div>
</div>
