<script lang="ts">
	import type { CanvasItem } from '$lib/types';

	export let canvasStore: any;
	export let selectedColor: string;
	export let showModal: boolean;

	let content = '';

	function handleAddNote() {
		if (content.trim()) {
			const newItem: Omit<CanvasItem, 'id' | 'zIndex'> = {
				type: 'sticky-note',
				content: content.trim(),
				position: { x: 100, y: 100 },
				size: { width: 192, height: 192 }, // Default size
				rotation: Math.random() * 20 - 10, // Random rotation between -10 and 10 degrees
				color: selectedColor
			};
			canvasStore.addItem(newItem);
			showModal = false;
			content = '';
		}
	}

	function closeModal() {
		showModal = false;
		content = '';
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
		<div class="w-96 max-w-[90vw] rounded-xl bg-white p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Add a sticky note</h2>
				<button on:click={closeModal} class="cursor-pointer text-gray-500 hover:text-gray-700">
					<img src="/assets/keyboard-asterisk.svg" alt="Mic" class="h-6 w-6 text-white" />
				</button>
			</div>

			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700"> Note content </label>
					<textarea
						bind:value={content}
						placeholder="Type your note here..."
						rows="4"
						class="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					></textarea>
				</div>

				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700"> Color </label>
					<div class="flex gap-2">
						{#each ['white', '#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3'] as color}
							<button
								on:click={() => (selectedColor = color)}
								class="h-8 w-8 rounded-full border-2 {selectedColor === color
									? 'border-gray-600'
									: 'border-gray-300'}"
								style="background-color: {color}"
							></button>
						{/each}
					</div>
				</div>

				<div class="flex gap-2 pt-4">
					<button
						on:click={closeModal}
						class="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						on:click={handleAddNote}
						disabled={!content.trim()}
						class="flex-1 rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Add Note
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
