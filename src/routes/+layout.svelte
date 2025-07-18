<script>
  import Footer from "$lib/components/Footer.svelte";
	import { page, navigating } from "$app/stores";
	import { afterNavigate } from "$app/navigation";
	import { onDestroy } from "svelte";	
	import { goto } from "$app/navigation";
	import { env } from "$env/dynamic/public";
	import { browser } from "$app/environment";

	export let data;

	$: userName = data.userName;

	if (browser) {
		afterNavigate(() => {
			const badge = document.querySelector(".grecaptcha-badge");
			if (badge) {
				badge.remove();
			}
			isMenuActive = false;
		});

		onDestroy(() => {
			const badge = document.querySelector(".grecaptcha-badge");
			if (badge) badge.remove();
		});
	}

	const hideMenuOn = ["/logout"];
	$: showMenu = !hideMenuOn.includes($page.url.pathname);
	$: isNavigating = $navigating !== null;
	let isMenuActive = false;
	let clickedPath = null;

	function toggleMenu() {
		isMenuActive = !isMenuActive;
	}

	function closeMenu(path) {
		clickedPath = path; // Track which link was clicked
		goto(env.PUBLIC_SITE_URL + path);
	}

	// Reset clicked path when navigation completes
	$: if (!isNavigating) {
		clickedPath = null;
	}

	function isActive(path) {
		if (path === "/") {
			return $page.url.pathname === "/";
		}
		return $page.url.pathname.startsWith(path);
	}
</script>

<section class="nav-section" style="visibility:{showMenu ? 'visible' : 'hidden'}">
	<div class="container">
		<nav class="navbar" aria-label="main navigation">
			<div class="navbar-brand">
				<button
					type="button"
					class="navbar-burger"
					aria-label="menu"
					aria-expanded={isMenuActive}
					on:click={() => toggleMenu()}
					tabindex="0"
					class:is-active={isMenuActive}
				>
					{#if isNavigating}
						<i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
					{:else}
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					{/if}
				</button>
			</div>

			<div class="navbar-menu" class:is-active={isMenuActive}>
				<div class="navbar-start navbar-links">
					<a
						class="navbar-item"
						href="/"
						class:is-active={isActive("/")}
						class:is-loading={isNavigating && clickedPath === "/"}
						on:click|preventDefault={() => closeMenu("/")}>Home</a
					>
					<a
						class="navbar-item"
						href="/about"
						class:is-active={isActive("/about")}
						class:is-loading={isNavigating && clickedPath === "/about"}
						on:click|preventDefault={() => closeMenu("/about")}>About</a
					>
					<a
						class="navbar-item"
						href="/faq"
						class:is-active={isActive("/faq")}
						class:is-loading={isNavigating && clickedPath === "/faq"}
						on:click|preventDefault={() => closeMenu("/faq")}>FAQ</a
					>
					<a
						class="navbar-item"
						href="/ledger"
						class:is-active={isActive("/ledger")}
						class:is-loading={isNavigating && clickedPath === "/ledger"}
						on:click|preventDefault={() => closeMenu("/ledger")}>Financials</a
					>
					<a
						class="navbar-item"
						href="/governance"
						class:is-active={isActive("/governance")}
						class:is-loading={isNavigating && clickedPath === "/governance"}
						on:click|preventDefault={() => closeMenu("/governance")}>Governance</a
					>
					<a
						class="navbar-item"
						href="/get-involved"
						class:is-active={isActive("/get-involved")}
						class:is-loading={isNavigating && clickedPath === "/get-involved"}
						on:click|preventDefault={() => closeMenu("/get-involved")}>Partner With Us</a
					>
					<a
						class="navbar-item"
						href="/resources"
						class:is-active={isActive("/resources")}
						class:is-loading={isNavigating && clickedPath === "/resources"}
						on:click|preventDefault={() => closeMenu("/resources")}>Resources</a
					>
					<a
						class="navbar-item"
						href="/donate"
						class:is-active={isActive("/donate")}
						class:is-loading={isNavigating && clickedPath === "/donate"}
						on:click|preventDefault={() => closeMenu("/donate")}>Donate</a
					>
					<a
						class="navbar-item"
						href="/contact"
						class:is-active={isActive("/contact")}
						class:is-loading={isNavigating && clickedPath === "/contact"}
						on:click|preventDefault={() => closeMenu("/contact")}>Contact</a
					>
					<a
						class="navbar-item"
						href="/profile"
						class:is-active={isActive("/profile")}
						class:is-loading={isNavigating && clickedPath === "/profile"}
						on:click|preventDefault={() => closeMenu("/profile")}
					>
						<i class="demo-icon icon-user">&#xe800;</i>
						<span class="account-label">{userName !== "" ? userName : "Partners"}</span>
					</a>
				</div>
			</div>
		</nav>
	</div>
</section>

<div class="container pl-1 pr-1 hero">
	<div class="has-text-centered">
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<a href="/"
			><enhanced:img
				src="$lib/images/logo.png"
				class="logo"
				sizes="(min-width: 768px) 50vw, 100vw"
				alt="Bread Breakers (SG) Logo"
				fetchpriority="high"
				loading="eager"
			/></a
		>
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
			-100deg,
			rgba(255, 250, 150, 0.15),
			rgba(255, 245, 57, 0.5) 100%,
			rgba(255, 250, 150, 0.25)
		);
	}

	.navbar-item {
		font-weight: 400;
	}

	/* Loading animation only for desktop */
	@media screen and (min-width: 1024px) {
		.navbar-item {
			position: relative;
		}

		.navbar-item.is-loading::after {
			content: "";
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

	.navbar-burger {
		color: black;
	}

	.nav-section {
		padding: 0;
	}

	@media screen and (min-width: 1023px) {
		.nav-section {
			padding: 3rem 1.5rem; /* typical Bulma .section padding */
		}

		.navbar-item.is-active::after {
			content: "";
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

	/* Show the label only on mobile when the menu is active */
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

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.logo {
		width: 500px;
		height: auto; /* keeps aspect ratio */
	}

	.navbar-burger:hover {
		background-color: transparent !important;
	}

	.navbar-burger {
		color: black !important;
		background: transparent !important;
		background-color: transparent !important;
		border: none !important;
		outline: none !important;
		box-shadow: none !important;
		/* Disable all user interaction visual feedback */
		-webkit-tap-highlight-color: transparent !important;
		-webkit-touch-callout: none !important;
		-webkit-user-select: none !important;
		-moz-user-select: none !important;
		-ms-user-select: none !important;
		user-select: none !important;
	}

	/* Override ALL possible button states */
	.navbar-burger:focus,
	.navbar-burger:active,
	.navbar-burger:hover,
	.navbar-burger:visited,
	.navbar-burger.is-active,
	.navbar-burger:focus-visible,
	.navbar-burger:focus-within {
		background: transparent !important;
		background-color: transparent !important;
		color: black !important;
		outline: none !important;
		box-shadow: none !important;
		border: none !important;
		-webkit-tap-highlight-color: transparent !important;
	}

	/* Target Bulma's specific button classes */
	button.navbar-burger,
	button.navbar-burger:focus,
	button.navbar-burger:active,
	button.navbar-burger:hover,
	button.navbar-burger.is-active {
		background: transparent !important;
		background-color: transparent !important;
		color: black !important;
		outline: none !important;
		box-shadow: none !important;
		border: none !important;
	}
</style>
