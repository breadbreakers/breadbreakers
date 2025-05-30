<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation"

  export let data;

  const hideMenuOn = ["/logout"];
  $: showMenu = !hideMenuOn.includes($page.url.pathname);
  let isMenuActive = false;

  function toggleMenu() {
    isMenuActive = !isMenuActive;
  }

</script>

{#if showMenu}
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
      <a class="navbar-item" href="/about">About</a>
      <a class="navbar-item" href="/contact">Contact</a>
      {#if data.loggedIn}
        <a class="navbar-item" href="/logout">Logout</a>
      {:else}
        <a class="navbar-item" href="/login">Login</a>
      {/if}
    </div>
  </div>
</nav>
</div>
{/if}

<section class="section">
  <div class="container">
    <h1 class="title has-text-centered">Bread Breakers SG 🍞</h1>
    <h2 class="subtitle is-6 has-text-centered pt-4">We partner with social workers to provide material essentials to those in need.</h2>
  </div>
</section>

<slot />
