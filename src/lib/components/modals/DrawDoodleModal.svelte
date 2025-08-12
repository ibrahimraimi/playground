<script lang="ts">
	import { onMount } from 'svelte';
	import type { CanvasItem } from '$lib/types';

	export let canvasStore: any;
	export let showModal: boolean;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;
	let currentColor = '#000000';
	let lineWidth = 2;

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d')!;
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = currentColor;
			ctx.lineWidth = lineWidth;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
		}
	});

	function startDrawing(e: MouseEvent) {
		isDrawing = true;
		const rect = canvas.getBoundingClientRect();
		lastX = e.clientX - rect.left;
		lastY = e.clientY - rect.top;
	}

	function draw(e: MouseEvent) {
		if (!isDrawing) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();

		lastX = x;
		lastY = y;
	}

	function stopDrawing() {
		isDrawing = false;
	}

	function clearCanvas() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = currentColor;
	}

	function changeColor(color: string) {
		currentColor = color;
		ctx.strokeStyle = color;
	}

	function changeLineWidth(width: number) {
		lineWidth = width;
		ctx.lineWidth = width;
	}

	function handleAddDoodle() {
		const drawingData = canvas.toDataURL('image/png');
		const newItem: Omit<CanvasItem, 'id' | 'zIndex'> = {
			type: 'doodle',
			content: 'Doodle',
			position: { x: 100, y: 100 },
			size: { width: 320, height: 240 }, // Default size for doodles
			rotation: 0,
			metadata: {
				drawingData
			}
		};
		canvasStore.addItem(newItem);
		showModal = false;
		clearCanvas();
	}

	function closeModal() {
		showModal = false;
		clearCanvas();
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
		<div class="w-[600px] max-w-[95vw] rounded-xl bg-white p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Draw a doodle</h2>
				<button on:click={closeModal} class="cursor-pointer text-gray-500 hover:text-gray-700">
					<img src="/assets/keyboard-asterisk.svg" alt="Mic" class="h-6 w-6 text-white" />
				</button>
			</div>

			<div class="space-y-4">
				<!-- Drawing Controls -->
				<div class="flex items-center gap-4">
					<!-- Color Picker -->
					<div class="flex items-center gap-2">
						<div
							class="h-6 w-6 cursor-pointer rounded-full border-2 border-gray-300"
							style="background-color: {currentColor}"
							on:click={() => {
								if (typeof document !== 'undefined') {
									const input = document.createElement('input');
									input.type = 'color';
									input.value = currentColor;
									input.onchange = (e) => {
										const target = e.target as HTMLInputElement;
										if (target) {
											changeColor(target.value);
										}
									};
									input.click();
								}
							}}
						></div>
					</div>

					<!-- Line Width Slider -->
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-600">Width:</span>
						<input
							type="range"
							min="1"
							max="10"
							bind:value={lineWidth}
							on:input={(e) => {
								const target = e.target as HTMLInputElement;
								if (target) {
									changeLineWidth(parseInt(target.value));
								}
							}}
							class="w-20"
						/>
						<div
							class="h-4 w-4 rounded-full bg-gray-400"
							style="width: {lineWidth}px; height: {lineWidth}px;"
						></div>
					</div>

					<!-- Clear Button -->
					<button
						on:click={clearCanvas}
						class="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
					>
						Clear
					</button>
				</div>

				<!-- Drawing Canvas -->
				<div class="overflow-hidden rounded-xl border-2 border-gray-300">
					<canvas
						bind:this={canvas}
						width="560"
						height="400"
						on:mousedown={startDrawing}
						on:mousemove={draw}
						on:mouseup={stopDrawing}
						on:mouseleave={stopDrawing}
						class="cursor-crosshair"
					></canvas>
				</div>

				<!-- Action Buttons -->
				<div class="flex justify-center">
					<button
						on:click={handleAddDoodle}
						class="rounded-xl bg-black px-6 py-2 text-white hover:bg-gray-800"
					>
						Add Doodle
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
