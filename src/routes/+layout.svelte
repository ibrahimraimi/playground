<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Digital Letter Creator | Create Interactive Digital Letters</title>
	<meta
		name="description"
		content="Create playful digital letters with sticky notes, photos, voice messages, Spotify tracks, and doodles. A creative digital gift box experience."
	/>
	<meta
		name="keywords"
		content="digital letter, sticky notes, voice messages, spotify integration, drawing tool, digital gift"
	/>
	<meta name="author" content="Digital Letter Creator" />
	<meta property="og:title" content="Digital Letter Creator" />
	<meta
		property="og:description"
		content="Create personalized digital letters with various interactive elements."
	/>
	<meta property="og:type" content="website" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
