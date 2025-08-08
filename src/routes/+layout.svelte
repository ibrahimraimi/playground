<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster } from 'svelte-french-toast';

	let { children } = $props();
</script>

<svelte:head>
	<title>Digital Playground | Create Interactive Digital Letters</title>
	<meta
		name="description"
		content="Create playful digital letters with sticky notes, photos, voice messages, Spotify tracks, and doodles. A creative digital playground experience."
	/>
	<meta
		name="keywords"
		content="digital playground, sticky notes, voice messages, spotify integration, drawing tool, digital gift"
	/>
	<meta name="author" content="Digital Playground" />
	<meta property="og:title" content="Digital Playground" />
	<meta
		property="og:description"
		content="Create personalized digital letters with various interactive elements."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/opengraph-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Digital Playground - Create Interactive Digital Letters" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Digital Playground" />
	<meta
		name="twitter:description"
		content="Create personalized digital letters with various interactive elements."
	/>
	<meta name="twitter:image" content="/opengraph-image.png" />
	<meta
		name="twitter:image:alt"
		content="Digital Playground - Create Interactive Digital Letters"
	/>

	<!-- Additional Social Media Meta Tags -->
	<meta property="og:url" content="https://playground.ibrahimraimi.com" />
	<meta property="og:site_name" content="Digital Playground" />
	<meta property="og:locale" content="en_US" />

	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
<Toaster />
