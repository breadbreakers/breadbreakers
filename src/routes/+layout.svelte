<script>
	import Footer from '$lib/components/Footer.svelte';
	import { page, navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte'; // Import onMount
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { browser } from '$app/environment';

	export let data;

	$: userName = data.userName;

	let isMobile = false; // New reactive variable

	if (browser) {
		const mediaQuery = window.matchMedia('(max-width: 1023px)');

		const handleMediaQueryChange = (event) => {
			isMobile = event.matches;
		};

		onMount(() => {
			isMobile = mediaQuery.matches; // Set initial value
			mediaQuery.addEventListener('change', handleMediaQueryChange);
		});

		onDestroy(() => {
			mediaQuery.removeEventListener('change', handleMediaQueryChange);
			const badge = document.querySelector('.grecaptcha-badge');
			if (badge) badge.remove();
		});

		afterNavigate(() => {
			const badge = document.querySelector('.grecaptcha-badge');
			if (badge) badge.remove();
			isMenuActive = false;
		});
	}

	const hideMenuOn = ['/logout'];
	$: showMenu = !hideMenuOn.includes($page.url.pathname);
	$: isNavigating = $navigating !== null;

	let isMenuActive = false;
	let clickedPath = null;

	function toggleMenu() {
		isMenuActive = !isMenuActive;
	}

	function closeMenu(path) {
		clickedPath = path;
		goto(env.PUBLIC_SITE_URL + path);
	}

	$: if (!isNavigating) {
		clickedPath = null;
	}

	function isActive(path) {
		return path === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(path);
	}
</script>

<section class="nav-section" style="visibility:{showMenu ? 'visible' : 'hidden'}">
	<div class="container">
		<nav class="navbar" aria-label="main navigation">
			<div class="navbar-end">
				{#if isNavigating && isMobile} <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
				{:else}
					<button
						type="button"
						class="menu-toggle"
						aria-label="menu"
						aria-expanded={isMenuActive}
						on:click={() => toggleMenu()}
						tabindex="0"
						class:is-active={isMenuActive}
					>
					</button>
				{/if}
			</div>

			<div class="navbar-menu" class:is-active={isMenuActive}>
				<div class="navbar-start navbar-links">
					<a
						class="navbar-item"
						href="/"
						class:is-active={isActive('/')}
						class:is-loading={isNavigating && clickedPath === '/'}
						on:click|preventDefault={() => closeMenu('/')}>Home</a
					>
					<a
						class="navbar-item"
						href="/about"
						class:is-active={isActive('/about')}
						class:is-loading={isNavigating && clickedPath === '/about'}
						on:click|preventDefault={() => closeMenu('/about')}>About</a
					>
					<a
						class="navbar-item"
						href="/faq"
						class:is-active={isActive('/faq')}
						class:is-loading={isNavigating && clickedPath === '/faq'}
						on:click|preventDefault={() => closeMenu('/faq')}>FAQ</a
					>
					<a
						class="navbar-item"
						href="/ledger"
						class:is-active={isActive('/ledger')}
						class:is-loading={isNavigating && clickedPath === '/ledger'}
						on:click|preventDefault={() => closeMenu('/ledger')}>Financials</a
					>
					<a
						class="navbar-item"
						href="/governance"
						class:is-active={isActive('/governance')}
						class:is-loading={isNavigating && clickedPath === '/governance'}
						on:click|preventDefault={() => closeMenu('/governance')}>Governance</a
					>
					<a
						class="navbar-item"
						href="/get-involved"
						class:is-active={isActive('/get-involved')}
						class:is-loading={isNavigating && clickedPath === '/get-involved'}
						on:click|preventDefault={() => closeMenu('/get-involved')}>Partner With Us</a
					>
					<a
						class="navbar-item"
						href="/resources"
						class:is-active={isActive('/resources')}
						class:is-loading={isNavigating && clickedPath === '/resources'}
						on:click|preventDefault={() => closeMenu('/resources')}>Resources</a
					>
						<a
						class="navbar-item"
						href="/donate"
						class:is-active={isActive('/donate')}
						class:is-loading={isNavigating && clickedPath === '/donate'}
						on:click|preventDefault={() => closeMenu('/donate')}>Donate</a
					>
					<a
						class="navbar-item"
						href="/contact"
						class:is-active={isActive('/contact')}
						class:is-loading={isNavigating && clickedPath === '/contact'}
						on:click|preventDefault={() => closeMenu('/contact')}>Contact</a
					>
					<a
						class="navbar-item"
						href="/profile"
						class:is-active={isActive('/profile')}
						class:is-loading={isNavigating && clickedPath === '/profile'}
						on:click|preventDefault={() => closeMenu('/profile')}
					>
						<i class="demo-icon icon-user">&#xe800;</i>
						<span class="account-label">{userName !== '' ? userName : 'Partners'}</span>
					</a>
				</div>
			</div>
		</nav>
	</div>
</section>

<div class="container pl-1 pr-1 hero">
	<div class="has-text-centered">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a href="/">
			<enhanced:img
				src="$lib/images/logo.png"
				class="logo"
				sizes="(min-width: 768px) 50vw, 100vw"
				alt="Bread Breakers (SG) Logo"
				fetchpriority="high"
				loading="eager"
			/>
		</a>
	</div>
	<h2 class="tagline subtitle is-6 has-text-centered has-text-weight-normal pt-4">
		We partner with social service professionals to <span class="highlight has-text-weight-medium"
			>transparently provide material essentials</span
		> to those in need.
	</h2>
</div>

<slot />

<Footer />

<style>
	.highlight {
		color: black;
		font-size: 1em;
		border-radius: 1em 0 1em 0;
		text-shadow: 1px 1px 1px #fff;
		background-image: linear-gradient(
    to right, /* left to right */
    rgba(204, 169, 0, 0.6), 0%,    /* darker gold */
    rgba(255, 245, 57, 0.5), 70%, /* medium yellow */
    rgba(255, 250, 150, 0.3) 100% /* lighter yellow */
  );
	}

	.navbar-item {
		font-weight: 400;
	}

	@media screen and (min-width: 1024px) {
		.navbar-item {
			position: relative;
		}

		.navbar-item.is-loading::after {
			content: '';
			position: absolute;
			width: calc(100% - 0.75em);
			height: 0.05em;
			bottom: 0;
			left: 0.375em;
			border-radius: 5px;
			background: currentColor;
			transform-origin: left;
			transform: scaleX(0);
			animation: loading-underline 1s ease-in-out infinite;
		}
	}

	@keyframes loading-underline {
		0% {
			transform: scaleX(0);
			transform-origin: left;
		}
		50% {
			transform: scaleX(1);
			transform-origin: left;
		}
		51% {
			transform-origin: right;
		}
		100% {
			transform: scaleX(0);
			transform-origin: right;
		}
	}

	.tagline {
		color: #3c3d37;
		margin-left: 0.5em;
		margin-right: 0.5em;
	}

	.menu-toggle {
		position: relative;
		display: none;
		width: 22px;
		height: 13px;
		background: transparent;
		border-top: 2px solid;
		border-bottom: 2px solid;
		color: #000000;
		font-size: 0;
		transition: all 0.25s ease-in-out;
		border-left: none;
		border-right: none;
		cursor: pointer;
		outline: none;
	}

	@media screen and (max-width: 1023px) {
		.menu-toggle {
			display: block;
			margin-left: auto;
			margin-right: 1.5rem;
			margin-top: 1rem;
		}
	}

	.menu-toggle:before,
	.menu-toggle:after {
		content: '';
		display: block;
		width: 100%;
		height: 2px;
		position: absolute;
		top: 50%;
		left: 50%;
		background: currentColor;
		transform: translate(-50%, -50%);
		transition: transform 0.25s ease-in-out;
	}

	.menu-toggle:hover {
		color: #000000;
	}

	.menu-toggle.is-active {
		border-color: transparent;
	}

	.menu-toggle.is-active:before {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.menu-toggle.is-active:after {
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	.nav-section {
		padding: 0;
	}

	@media screen and (min-width: 1023px) {
		.nav-section {
			padding: 3rem 1.5rem;
		}

		.navbar-item.is-active::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0.375em;
			width: calc(100% - 0.75em);
			height: 0.05em;
			background-color: #b87333;
		}
	}

	.navbar-menu {
		box-shadow: none;
		padding-bottom: 2em;
	}

	@media (max-width: 1023px) {
		.navbar-menu.is-active .account-label {
			display: inline;
		}

		.navbar-item {
			padding-left: 2em;
		}

		.navbar-item.is-active {
			text-decoration: underline;
			text-decoration-color: #b87333;
		}
	}

	.navbar-item.is-active {
		background-color: white;
		font-weight: 600;
	}

	.navbar-item.is-active .account-label {
		text-decoration: none;
	}

	.navbar-item:hover,
	.navbar-item:focus {
		background: none !important;
		color: inherit !important;
		box-shadow: none !important;
	}

	.navbar-links {
		flex-grow: 1;
		justify-content: center;
	}

	@media screen and (max-width: 1023px) {
		.navbar-links {
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
		}
	}

	.logo {
		width: 555px;
		height: auto;
	}

	.navbar-end {
		display: flex;
		justify-content: flex-end;
		align-items: center; 
	}
	
	.navbar-end i.demo-icon {
		font-size: 15px; 
		margin-left: auto;
		margin-right: 1.5rem;
		margin-top: 1rem;
		display: inline-block;
		vertical-align: middle;
		color: #000; 
	}
</style>