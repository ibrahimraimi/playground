<script lang="ts">
	import type { CanvasItem } from '$lib/types';

	export let canvasStore: any;
	export let showModal: boolean;

	let spotifyUrl = '';

	function extractSpotifyEmbedUrl(url: string): string | null {
		// Handle different Spotify URL formats
		const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
		const albumMatch = url.match(/spotify\.com\/album\/([a-zA-Z0-9]+)/);
		const playlistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);

		if (trackMatch) {
			return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
		} else if (albumMatch) {
			return `https://open.spotify.com/embed/album/${albumMatch[1]}`;
		} else if (playlistMatch) {
			return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}`;
		}

		return null;
	}

	function handleAddSpotify() {
		const embedUrl = extractSpotifyEmbedUrl(spotifyUrl);
		if (embedUrl) {
			const newItem: Omit<CanvasItem, 'id' | 'zIndex'> = {
				type: 'spotify-track',
				content: 'Spotify Track',
				position: { x: 100, y: 100 },
				rotation: 0,
				metadata: {
					spotifyUrl: embedUrl
				}
			};
			canvasStore.addItem(newItem);
			showModal = false;
			spotifyUrl = '';
		} else {
			alert('Please enter a valid Spotify URL (track, album, or playlist)');
		}
	}

	function closeModal() {
		showModal = false;
		spotifyUrl = '';
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
		<div class="w-96 max-w-[90vw] rounded-xl bg-white p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Add Spotify Track</h2>
				<button on:click={closeModal} class="text-gray-500 hover:text-gray-700"> × </button>
			</div>

			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700"> Spotify embed URL </label>
					<input
						bind:value={spotifyUrl}
						type="text"
						placeholder="https://open.spotify.com/track/..."
						class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<div class="text-sm text-gray-600">Paste a Spotify track, album, or playlist URL</div>

				<div class="flex gap-2 pt-4">
					<button
						on:click={closeModal}
						class="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						on:click={handleAddSpotify}
						disabled={!spotifyUrl.trim()}
						class="flex-1 rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Add
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
