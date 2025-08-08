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

	<!-- Language and Content -->
	<meta name="language" content="en" />
	<meta name="robots" content="index, follow" />

	<!-- Canonical URL -->
	<link rel="canonical" href="https://digitalplayground.site" />

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="Digital Playground" />
	<meta
		property="og:description"
		content="Create personalized digital letters with various interactive elements."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://digitalplayground.site/opengraph-image.png" />
	<meta
		property="og:image:secure_url"
		content="https://digitalplayground.site/opengraph-image.png"
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content="Digital Playground - Create Interactive Digital Letters" />
	<meta property="og:url" content="https://digitalplayground.site" />
	<meta property="og:site_name" content="Digital Playground" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@ibrahimraimi_" />
	<meta name="twitter:creator" content="@ibrahimraimi_" />
	<meta name="twitter:title" content="Digital Playground" />
	<meta
		name="twitter:description"
		content="Create personalized digital letters with interactive sticky notes, photos, voice messages, Spotify tracks, and doodles."
	/>
	<meta name="twitter:image" content="https://digitalplayground.site/opengraph-image.png" />
	<meta
		name="twitter:image:alt"
		content="Digital Playground - Create Interactive Digital Letters"
	/>

	<!-- Mobile and App Meta Tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#ffffff" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="Digital Playground" />

	<!-- Icons and Favicons -->
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

	<!-- DNS Prefetch for External Resources -->
	<link rel="dns-prefetch" href="//open.spotify.com" />
	<link rel="dns-prefetch" href="//fonts.googleapis.com" />

	<!-- Preload Critical Resources -->
	<!-- <link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin /> -->
	<!-- <link rel="preload" href="/critical-image.webp" as="image" /> -->

	<!-- Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			"name": "Digital Playground",
			"description": "Create playful digital letters with sticky notes, photos, voice messages, Spotify tracks, and doodles. A creative digital playground experience.",
			"url": "https://digitalplayground.site",
			"applicationCategory": "DesignApplication",
			"operatingSystem": "Web",
			"browserRequirements": "Requires JavaScript. Requires HTML5.",
			"softwareVersion": "1.0",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"creator": {
				"@type": "Person",
				"name": "Ibrahim Raimi",
				"url": "https://twitter.com/ibrahimraimi_"
			}
		}
	</script>
</svelte:head>

{@render children?.()}
<Toaster />
