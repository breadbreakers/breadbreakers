<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  const hideMenuOn = ["/logout"];
  $: showMenu = !hideMenuOn.includes($page.url.pathname);
  let isMenuActive = false;

  function toggleMenu() {
    isMenuActive = !isMenuActive;
  }

  function closeMenu() {
    isMenuActive = false;
  }

  function isActive(path) {
    return $page.url.pathname === path;
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
          on:click={toggleMenu}
          tabindex="0"
          class:is-active={isMenuActive}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div class="navbar-menu" class:is-active={isMenuActive}>
        <div class="navbar-end">
          <a class="navbar-item" href="/" class:is-active={isActive("/")} on:click={closeMenu}>Home</a>
          <a class="navbar-item" href="/about" class:is-active={isActive("/about")} on:click={closeMenu}>About</a>
          <a class="navbar-item" href="/ledger" class:is-active={isActive("/financials")} on:click={closeMenu}>Financials</a>
          <a class="navbar-item" href="/governance" class:is-active={isActive("/governance")} on:click={closeMenu}>Governance</a>
          <a class="navbar-item" href="/donate" class:is-active={isActive("/donate")} on:click={closeMenu}>Donate</a>
          <a class="navbar-item" href="/contact" class:is-active={isActive("/contact")} on:click={closeMenu}>Contact</a
          >
          <a class="navbar-item" href="/profile" class:is-active={isActive("/profile")} on:click={closeMenu}>
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
    <a href="/"><img src="/logo.png" width="500px" alt="bread breakers logo" /></a>
  </div>
  <h2
    class="tagline subtitle is-6 has-text-centered has-text-weight-normal pt-4"
  >
    We partner with social workers to <span
      class="highlight has-text-weight-medium"
      >transparently provide material essentials</span
    > to those in need.
  </h2>
</div>

<slot />

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
    font-size: 0.85em;
  }

  .tagline {
    color: #3C3D37;
    letter-spacing: -0.35px;
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
    margin-left: 0.5em;
  }

  /* Show the label only on mobile when the menu is active */
  @media (max-width: 1023px) {
    .navbar-menu.is-active .account-label {
      display: inline;
    }
  }

  .navbar-item.is-active {
  background-color: white;
  color: black !important;
  font-weight: 500;
}

.navbar-item:hover,
.navbar-item:focus {
  background: none !important;
  color: inherit !important;
  box-shadow: none !important;
  text-decoration: none !important;
}
</style>
