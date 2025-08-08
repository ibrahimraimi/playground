<script lang="ts">
	import { Mic, Play, Square } from '@lucide/svelte';
	import type { CanvasItem } from '$lib/types';

	export let canvasStore: any;
	export let showModal: boolean;

	let recordingName = '';
	let isRecording = false;
	let isPlaying = false;
	let mediaRecorder: MediaRecorder | null = null;
	let audioChunks: Blob[] = [];
	let audioUrl: string | null = null;
	let audioElement: HTMLAudioElement;
	let recordingDuration = 0;
	let recordingStartTime = 0;
	let currentRecordingTime = 0;
	let recordingInterval: number | null = null;

	function startRecording() {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				mediaRecorder = new MediaRecorder(stream);
				audioChunks = [];
				recordingStartTime = Date.now();
				currentRecordingTime = 0;

				mediaRecorder.ondataavailable = (event) => {
					audioChunks.push(event.data);
				};

				mediaRecorder.onstop = () => {
					const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
					audioUrl = URL.createObjectURL(audioBlob);
					audioElement.src = audioUrl;

					// Calculate duration from recording time
					recordingDuration = (Date.now() - recordingStartTime) / 1000;

					// Stop the timer
					if (recordingInterval) {
						clearInterval(recordingInterval);
						recordingInterval = null;
					}
				};

				mediaRecorder.start();
				isRecording = true;

				// Start the timer for live duration display
				recordingInterval = setInterval(() => {
					currentRecordingTime = (Date.now() - recordingStartTime) / 1000;
				}, 100);
			})
			.catch((err) => {
				console.error('Error accessing microphone:', err);
				alert('Could not access microphone. Please check permissions.');
			});
	}

	function stopRecording() {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			mediaRecorder.stream.getTracks().forEach((track) => track.stop());
			isRecording = false;

			// Stop the timer
			if (recordingInterval) {
				clearInterval(recordingInterval);
				recordingInterval = null;
			}
		}
	}

	function playRecording() {
		if (audioElement && audioUrl) {
			if (isPlaying) {
				audioElement.pause();
				isPlaying = false;
			} else {
				audioElement
					.play()
					.then(() => {
						isPlaying = true;
					})
					.catch((err) => {
						console.error('Error playing audio:', err);
					});
			}
		}
	}

	// Set up audio event listeners
	$: if (audioElement) {
		audioElement.onended = () => {
			isPlaying = false;
		};
		audioElement.onpause = () => {
			isPlaying = false;
		};
		audioElement.onplay = () => {
			isPlaying = true;
		};
	}

	function handleAddVoiceMessage() {
		if (audioUrl && recordingName.trim()) {
			const newItem: Omit<CanvasItem, 'id' | 'zIndex'> = {
				type: 'voice-message',
				content: recordingName.trim(),
				position: { x: 100, y: 100 },
				rotation: 0,
				metadata: {
					audioUrl,
					recordingDuration: recordingDuration
				}
			};
			canvasStore.addItem(newItem);
			showModal = false;
			recordingName = '';
			audioUrl = null;
			recordingDuration = 0;
		}
	}

	function formatDuration(seconds: number): string {
		if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
			return '0:00';
		}
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function closeModal() {
		if (isRecording) {
			stopRecording();
		}
		showModal = false;
		recordingName = '';
		audioUrl = null;
		recordingDuration = 0;
		currentRecordingTime = 0;
	}
</script>

{#if showModal}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
		<div class="w-96 max-w-[90vw] rounded-xl bg-white p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Record Voice Note</h2>
				<button on:click={closeModal} class="cursor-pointer text-gray-500 hover:text-gray-700">
					<img src="/assets/keyboard-asterisk.svg" alt="Mic" class="h-6 w-6 text-white" />
				</button>
			</div>

			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium text-gray-700"> Recording name </label>
					<input
						bind:value={recordingName}
						type="text"
						placeholder="Enter recording name..."
						class="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<!-- Recording Duration Display -->
				{#if isRecording}
					<div class="text-center">
						<div class="font-mono text-2xl text-red-500">
							{formatDuration(currentRecordingTime)}
						</div>
						<div class="text-sm text-gray-500">Recording...</div>
					</div>
				{:else if audioUrl}
					<div class="text-center">
						<div class="font-mono text-lg text-gray-700">
							Duration: {formatDuration(recordingDuration)}
						</div>
					</div>
				{/if}

				<div class="flex gap-2">
					<button
						on:click={isRecording ? stopRecording : startRecording}
						class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
						class:bg-red-500={isRecording}
						class:text-white={isRecording}
						class:border-red-500={isRecording}
					>
						{#if isRecording}
							<Square class="h-4 w-4" />
							Stop Rec
						{:else}
							<img src="/assets/microphone.svg" alt="Mic" class="h-6 w-6 text-white" />
							Start Rec
						{/if}
					</button>

					<button
						on:click={playRecording}
						disabled={!audioUrl}
						class="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
					>
						{#if isPlaying}
							<Square class="h-4 w-4" />
							Pause
						{:else}
							<Play class="h-4 w-4" />
							Play
						{/if}
					</button>
				</div>

				{#if audioUrl}
					<div class="text-sm text-green-600">✓ Recording saved</div>
				{/if}

				<div class="flex gap-2 pt-4">
					<button
						on:click={closeModal}
						class="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						on:click={handleAddVoiceMessage}
						disabled={!audioUrl || !recordingName.trim()}
						class="flex-1 rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Add Voice Message
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<audio bind:this={audioElement} class="hidden"></audio>
