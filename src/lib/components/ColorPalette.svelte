<script lang="ts">
	import type { ColorOption } from '$lib/types';

	export let colorOptions: ColorOption[];
	export let selectedColor: string;

	function selectColor(color: string) {
		selectedColor = color;
	}
</script>

<div class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-lg">
	{#each colorOptions as color}
		<button
			on:click={() => selectColor(color.value)}
			class="h-6 w-6 rounded-full border-2 transition-all hover:scale-110 {selectedColor ===
			color.value
				? 'border-gray-600'
				: 'border-gray-300'}"
			style="background-color: {color.value}"
			title={color.label}
		></button>
	{/each}
</div>
