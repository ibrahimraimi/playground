<script lang="ts">
	import { onMount } from 'svelte';
	import type { CanvasItem } from '$lib/types';
	import PhotoItem from './items/PhotoItem.svelte';
	import DoodleItem from './items/DoodleItem.svelte';
	import StickyNote from './items/StickyNote.svelte';
	import VoiceMessage from './items/VoiceMessage.svelte';
	import SpotifyTrack from './items/SpotifyTrack.svelte';

	export let canvasStore: any;

	let canvasElement: HTMLDivElement;

	onMount(() => {
		// Handle canvas click to deselect items
		canvasElement.addEventListener('click', (e) => {
			if (e.target === canvasElement) {
				canvasStore.selectItem(null);
			}
		});
	});
</script>

<div bind:this={canvasElement} class="relative min-h-screen w-full cursor-default">
	{#each $canvasStore.items as item (item.id)}
		<div
			class="absolute"
			style="
				left: {item.position.x}px; 
				top: {item.position.y}px; 
				transform: rotate({item.rotation}deg);
				z-index: {item.zIndex};
			"
		>
			{#if item.type === 'sticky-note'}
				<StickyNote {item} {canvasStore} />
			{:else if item.type === 'photo'}
				<PhotoItem {item} {canvasStore} />
			{:else if item.type === 'voice-message'}
				<VoiceMessage {item} {canvasStore} />
			{:else if item.type === 'spotify-track'}
				<SpotifyTrack {item} {canvasStore} />
			{:else if item.type === 'doodle'}
				<DoodleItem {item} {canvasStore} />
			{/if}
		</div>
	{/each}
</div>
