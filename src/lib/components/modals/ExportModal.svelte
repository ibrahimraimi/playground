<script lang="ts">
	import type { CanvasState } from '$lib/types';

	export let canvasStore: any;
	export let showModal: boolean;

	let isExporting = false;

	async function exportAsPNG() {
		isExporting = true;
		try {
			// For now, just show a message that PNG export is being worked on
			alert(
				'PNG export is currently being improved. Please use JSON export to save your layout, or try the PDF export.'
			);
		} catch (error) {
			console.error('Error exporting as PNG:', error);
			alert(`Failed to export as PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			isExporting = false;
		}
	}

	async function exportAsPDF() {
		isExporting = true;
		try {
			// For now, just show a message that PDF export is being worked on
			alert('PDF export is currently being improved. Please use JSON export to save your layout.');
		} catch (error) {
			console.error('Error exporting as PDF:', error);
			alert(`Failed to export as PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
		} finally {
			isExporting = false;
		}
	}

	function exportAsJSON() {
		try {
			const canvasData: CanvasState = {
				items: $canvasStore.items,
				selectedItem: null,
				nextZIndex: $canvasStore.nextZIndex
			};

			const dataStr = JSON.stringify(canvasData, null, 2);
			const dataBlob = new Blob([dataStr], { type: 'application/json' });
			const url = URL.createObjectURL(dataBlob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `digital-playground-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			// Show success message
			alert(
				'Layout saved successfully! You can reload this file later to restore your digital playground.'
			);
		} catch (error) {
			console.error('Error exporting as JSON:', error);
			alert('Failed to export as JSON. Please try again.');
		}
	}

	function closeModal() {
		showModal = false;
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
		<div class="w-96 max-w-[90vw] rounded-xl bg-white p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Export Board</h2>
				<button on:click={closeModal} class="cursor-pointer text-gray-500 hover:text-gray-700">
					<img src="/assets/keyboard-asterisk.svg" alt="Mic" class="h-6 w-6 text-white" />
				</button>
			</div>

			<div class="space-y-4">
				<p class="text-sm text-gray-600">
					Export your digital playground layout. PNG and PDF exports are being improved.
				</p>

				<div class="space-y-3">
					<!-- PNG Export -->
					<button
						on:click={exportAsPNG}
						disabled={isExporting}
						class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 disabled:opacity-50"
					>
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center">
								<img src="/assets/photo-frame.svg" alt="Doodle" class="h-10 w-10" />
							</div>
							<div>
								<div class="font-medium text-gray-900">PNG Image</div>
								<div class="text-sm text-gray-500">Coming soon - being improved</div>
							</div>
						</div>
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</button>

					<!-- PDF Export -->
					<button
						on:click={exportAsPDF}
						disabled={isExporting}
						class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 disabled:opacity-50"
					>
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center">
								<img src="/assets/pdf-attach.svg" alt="Doodle" class="h-10 w-10" />
							</div>
							<div>
								<div class="font-medium text-gray-900">PDF Report</div>
								<div class="text-sm text-gray-500">Coming soon - being improved</div>
							</div>
						</div>
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</button>

					<!-- JSON Export -->
					<button
						on:click={exportAsJSON}
						disabled={isExporting}
						class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 disabled:opacity-50"
					>
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center">
								<img src="/assets/json-code.svg" alt="Doodle" class="h-10 w-10" />
							</div>
							<div>
								<div class="font-medium text-gray-900">JSON Layout</div>
								<div class="text-sm text-gray-500">Save layout to reload later</div>
							</div>
						</div>
						<svg
							class="h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
							></path>
						</svg>
					</button>
				</div>

				{#if isExporting}
					<div class="flex items-center justify-center gap-2 text-sm text-gray-600">
						<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Processing...
					</div>
				{/if}

				<div class="flex justify-end pt-4">
					<button
						on:click={closeModal}
						class="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
