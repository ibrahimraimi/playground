<script lang="ts">
	import { Upload, Camera } from '@lucide/svelte';
	import type { CanvasItem } from '$lib/types';

	export let canvasStore: any;
	export let showModal: boolean;

	let selectedFile: File | null = null;
	let caption = '';
	let fileInput: HTMLInputElement;

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			selectedFile = target.files[0];
		}
	}

	function handleTakePhoto() {
		// In a real app, this would open the camera
		alert('Camera functionality would be implemented here');
	}

	function handleAddPhoto() {
		if (selectedFile) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const fileUrl = e.target?.result as string;
				const newItem: Omit<CanvasItem, 'id' | 'zIndex'> = {
					type: 'photo',
					content: caption || 'Photo',
					position: { x: 100, y: 100 },
					rotation: 0,
					metadata: {
						fileUrl,
						caption
					}
				};
				canvasStore.addItem(newItem);
				showModal = false;
				selectedFile = null;
				caption = '';
			};
			reader.readAsDataURL(selectedFile);
		}
	}

	function closeModal() {
		showModal = false;
		selectedFile = null;
		caption = '';
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
		<div class="w-96 max-w-[90vw] rounded-xl bg-white p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Add a photo</h2>
				<button on:click={closeModal} class="cursor-pointer text-gray-500 hover:text-gray-700">
					<img src="/assets/keyboard-asterisk.svg" alt="Mic" class="h-6 w-6 text-white" />
				</button>
			</div>

			<div class="space-y-4">
				<div class="flex gap-4">
					<button
						on:click={() => fileInput.click()}
						class="flex flex-1 flex-col items-center gap-2 rounded-xl border-2 border-gray-300 bg-white p-4 transition-colors hover:border-gray-400"
					>
						<img src="/assets/upload.svg" alt="upload" class="h-8 w-8 text-white" />
						<span class="text-sm text-gray-600">Choose file</span>
					</button>

					<button
						on:click={handleTakePhoto}
						class="flex flex-1 flex-col items-center gap-2 rounded-xl border-2 border-gray-300 bg-white p-4 transition-colors hover:border-gray-400"
					>
						<img src="/assets/camera.svg" alt="Camera" class="h-8 w-8 text-white" />
						<span class="text-sm text-gray-600">Take photo</span>
					</button>
				</div>

				<input
					bind:this={fileInput}
					type="file"
					accept="image/*"
					on:change={handleFileSelect}
					class="hidden"
				/>

				{#if selectedFile}
					<div class="text-sm text-gray-600">
						Selected: {selectedFile.name}
					</div>
				{/if}

				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700"> Caption (optional) </label>
					<input
						bind:value={caption}
						type="text"
						placeholder="Add a caption..."
						class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<div class="flex gap-2 pt-4">
					<button
						on:click={closeModal}
						class="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						on:click={handleAddPhoto}
						disabled={!selectedFile}
						class="flex-1 rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Add Photo
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
