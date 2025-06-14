<script>
  import { page, navigating } from "$app/stores";
  import Footer from "$lib/components/Footer.svelte";
  import { goto } from "$app/navigation";
  import { env } from '$env/dynamic/public';

  const hideMenuOn = ["/logout"];
  $: showMenu = !hideMenuOn.includes($page.url.pathname);
  $: isNavigating = $navigating !== null;
  let isMenuActive = false;

  function toggleMenu() {
    isMenuActive = !isMenuActive;
  }

  function closeMenu(path) {
    isMenuActive = false;
    goto(env.PUBLIC_SITE_URL + path)
  }

  function isActive(path) {
    if (path === "/") {
      return $page.url.pathname === "/";
    }
    return $page.url.pathname.startsWith(path);
  }
</script>

<section
  class="nav-section"
  style="visibility:{showMenu ? 'visible' : 'hidden'}"
>
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
            on:click|preventDefault={() => closeMenu('/')}>Home</a
          >
          <a
            class="navbar-item"
            href="/about"
            class:is-active={isActive("/about")}
            on:click|preventDefault={() => closeMenu('/about')}>About</a
          >
          <a
            class="navbar-item"
            href="/faq"
            class:is-active={isActive("/faq")}
            on:click|preventDefault={() => closeMenu('/faq')}>FAQ</a
          >
          <a
            class="navbar-item"
            href="/ledger"
            class:is-active={isActive("/ledger")}
            on:click|preventDefault={() => closeMenu('/ledger')}>Financials</a
          >
          <a
            class="navbar-item"
            href="/governance"
            class:is-active={isActive("/governance")}
            on:click|preventDefault={() => closeMenu('/governance')}>Governance</a
          >
          <a
            class="navbar-item"
            href="/get-involved"
            class:is-active={isActive("/get-involved")}
            on:click|preventDefault={() => closeMenu('/get-involved')}>Partner</a
          >
          <a
            class="navbar-item"
            href="/resources"
            class:is-active={isActive("/resources")}
            on:click|preventDefault={() => closeMenu('/resources')}>Resources</a
          >
          <a
            class="navbar-item"
            href="/donate"
            class:is-active={isActive("/donate")}
            on:click|preventDefault={() => closeMenu('/donate')}>Donate</a
          >
          <a
            class="navbar-item"
            href="/contact"
            class:is-active={isActive("/contact")}
            on:click|preventDefault={() => closeMenu('/contact')}>Contact</a
          >
          <a
            class="navbar-item"
            href="/profile"
            class:is-active={isActive("/profile")}
            on:click|preventDefault={() => closeMenu('/profile')}
          >
            <i class="demo-icon icon-user">&#xe800;</i>
            <span class="account-label">Account</span>
          </a>
        </div>
      </div>
    </nav>
  </div>
</section>

<div class="container pl-1 pr-1 hero">
  <div class="has-text-centered">
    <a href="/"
      ><img src="/logo.png" width="500px" alt="bread breakers logo" /></a
    >
  </div>
  <h2
    class="tagline subtitle is-6 has-text-centered has-text-weight-normal pt-4"
  >
    We partner with social service professionals to <span
      class="highlight has-text-weight-medium"
      >transparently provide material essentials</span
    > to those in need.
  </h2>
</div>

<slot />

<Footer />

<style>
  .highlight {
    border-radius: 1em 0 1em 0;
    text-shadow: 1px 1px 1px #fff;
    background-image: linear-gradient(
      -100deg,
      rgba(255, 250, 150, 0.15),
      rgba(255, 250, 150, 0.5) 100%,
      rgba(255, 250, 150, 0.25)
    );
  }

  .navbar-item {
    font-size: 0.9em;
    font-weight: 400;
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

  @media screen and (min-width: 769px) {
    .nav-section {
      padding: 3rem 1.5rem; /* typical Bulma .section padding */
    }
  }

  /* Hide the label by default */
  .account-label {
    display: none;
  }

  /* Show the label only on mobile when the menu is active */
  @media (max-width: 1023px) {
    .navbar-menu.is-active .account-label {
      display: inline;
    }
  }

  .navbar-item.is-active {
    background-color: white;
    font-weight: 600;
    text-decoration: underline;
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
</style>
