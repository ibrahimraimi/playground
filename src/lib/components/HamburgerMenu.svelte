<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { CanvasState } from '$lib/types';
	import toast from 'svelte-french-toast';
	import LZString from 'lz-string';

	export let canvasStore: any;
	export let showExportModal: boolean;

	let isOpen = false;
	let fileInput: HTMLInputElement;

	const dispatch = createEventDispatcher();

	const backgroundColors = [
		{ name: 'White', value: '#ffffff', class: 'bg-white' },
		{ name: 'Light Gray', value: '#f3f4f6', class: 'bg-gray-100' },
		{ name: 'Light Blue', value: '#dbeafe', class: 'bg-blue-100' },
		{ name: 'Light Yellow', value: '#fef3c7', class: 'bg-yellow-100' },
		{ name: 'Light Pink', value: '#fce7f3', class: 'bg-pink-100' },
		{ name: 'Light Green', value: '#dcfce7', class: 'bg-green-100' }
	];

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function handleExport() {
		showExportModal = true;
		closeMenu();
	}

		async function generateShareableLink() {
		try {
			const canvasData: CanvasState = {
				items: $canvasStore.items,
				selectedItem: null,
				nextZIndex: $canvasStore.nextZIndex
			};

			// Check if canvas has content
			if (canvasData.items.length === 0) {
				toast.error('Cannot generate shareable link for an empty canvas. Add some content first!');
				return;
			}

					// Use LZ-String compression for much better compression
		const dataStr = JSON.stringify(canvasData);
		const compressedData = LZString.compressToEncodedURIComponent(dataStr);

		// Create shareable URL with compressed data
		const shareableUrl = `${window.location.origin}${window.location.pathname}?data=${compressedData}`;
		
		// Check if the URL is still too long (very unlikely with LZ-String)
		if (shareableUrl.length > 8000) { // Increased limit due to better compression
			// Fallback to localStorage approach for extremely large canvases
			const shareId = crypto.randomUUID();
			const shareData = {
				data: canvasData,
				timestamp: Date.now(),
				expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
			};

			// Store in localStorage
			localStorage.setItem(`playground_share_${shareId}`, JSON.stringify(shareData));

			// Create shareable URL with just the ID
			const fallbackUrl = `${window.location.origin}${window.location.pathname}?share=${shareId}`;

			// Copy to clipboard
			navigator.clipboard
				.writeText(fallbackUrl)
				.then(() => {
					toast.success(
						'Shareable link copied to clipboard! This link will work for 7 days and requires the recipient to have visited the site before.'
					);
				})
				.catch(() => {
					// Fallback: show the URL in a toast
					toast.success(`Shareable link generated! Copy this URL:\n\n${fallbackUrl}\n\nNote: This link works for 7 days and requires the recipient to have visited the site before.`);
				});
			closeMenu();
			return;
		}

					// Copy to clipboard
		navigator.clipboard
			.writeText(shareableUrl)
			.then(() => {
				toast.success(
					'Shareable link copied to clipboard! Share this link with others to let them view your digital playground.'
				);
			})
			.catch(() => {
				// Fallback: show the URL in a toast
				toast.success(`Shareable link generated! Copy this URL:\n\n${shareableUrl}`);
			});

		closeMenu();
		} catch (error) {
			console.error('Error generating shareable link:', error);
			toast.error('Failed to generate shareable link. Please try again.');
		}
	}

	function handleLoadFile() {
		fileInput?.click();
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const content = e.target?.result as string;
					const canvasData: CanvasState = JSON.parse(content);

					// Reset current canvas and load new data
					canvasStore.reset();

					// Add all items from the loaded data
					canvasData.items.forEach((item) => {
						canvasStore.addItem({
							type: item.type,
							content: item.content,
							position: item.position,
							rotation: item.rotation,
							color: item.color,
							metadata: item.metadata
						});
					});

					toast.success('Layout loaded successfully!');
				} catch (error) {
					console.error('Error loading file:', error);
					toast.error(
						"Failed to load file. Please make sure it's a valid Digital Playground layout file."
					);
				}
			};
			reader.readAsText(file);
		}

		// Reset input
		target.value = '';
	}

	function changeBackground(color: string) {
		// Dispatch event to parent to change background
		dispatch('changeBackground', { color });
		closeMenu();
	}

	// Close menu when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.hamburger-menu')) {
			closeMenu();
		}
	}

	// Add click outside listener
	onMount(() => {
		$: if (isOpen) {
			setTimeout(() => {
				document.addEventListener('click', handleClickOutside);
			}, 0);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="hamburger-menu fixed top-4 right-4 z-50">
	<!-- Hamburger Button -->
	<button
		on:click={toggleMenu}
		class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-white shadow-lg transition-colors hover:bg-gray-50"
		title="Menu"
	>
		<img src="/assets/menu.svg" alt="Menu" class="h-5 w-5" />
	</button>

	<!-- Dropdown Menu -->
	{#if isOpen}
		<div class="absolute top-12 right-0 w-64 rounded-lg border border-gray-200 bg-white shadow-xl">
			<!-- File and Canvas Actions -->
			<div class="p-2">
				<button
					on:click={handleLoadFile}
					class="flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors hover:bg-gray-100"
				>
					<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
						></path>
					</svg>
					<span>Open</span>
					<span class="ml-auto text-xs text-gray-400">Ctrl+O</span>
				</button>

				<button
					on:click={handleExport}
					class="flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors hover:bg-gray-100"
				>
					<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						></path>
					</svg>
					<span>Export layout...</span>
					<span class="ml-auto text-xs text-gray-400">Ctrl+Shift+E</span>
				</button>

				<button
					on:click={generateShareableLink}
					class="flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors hover:bg-gray-100"
				>
					<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
						></path>
					</svg>
					<span>Shareable link</span>
					<span class="ml-auto text-xs text-gray-400">Ctrl+Shift+S</span>
				</button>

				<button
					on:click={() => canvasStore.reset()}
					class="flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors hover:bg-gray-100"
				>
					<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						></path>
					</svg>
					<span>Reset canvas</span>
				</button>
			</div>

			<!-- Divider -->
			<div class="border-t border-gray-200"></div>

			<!-- Canvas Background -->
			<div class="p-2">
				<div class="px-3 py-2 text-sm font-medium text-gray-700">Canvas background</div>
				<div class="grid grid-cols-6 gap-1 px-3 pb-2">
					{#each backgroundColors as color}
						<button
							on:click={() => changeBackground(color.value)}
							class="h-8 w-8 rounded border-2 border-gray-300 transition-colors hover:border-gray-400 {color.class}"
							title={color.name}
						></button>
					{/each}
				</div>
			</div>

			<!-- Divider -->
			<div class="border-t border-gray-200"></div>

			<!-- Help -->
			<div class="p-2">
				<button
					on:click={() => window.open('https://github.com/ibrahimraimi/playground', '_blank')}
					class="flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors hover:bg-gray-100"
				>
					<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
					<span>Help</span>
					<span class="ml-auto text-xs text-gray-400">?</span>
				</button>
			</div>
		</div>
	{/if}

	<!-- Hidden file input for loading JSON -->
	<input
		bind:this={fileInput}
		type="file"
		accept=".json"
		class="hidden"
		on:change={handleFileSelect}
	/>
</div>
