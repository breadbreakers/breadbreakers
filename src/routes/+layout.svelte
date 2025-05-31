<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  export let data;

  const hideMenuOn = ["/logout"];
  $: showMenu = !hideMenuOn.includes($page.url.pathname);
  let isMenuActive = false;

  function toggleMenu() {
    isMenuActive = !isMenuActive;
  }

  // needed because svelte tries to be smart and loads the a href if you mouseover, unintentionally logging out
  async function logout(event) {
    event.preventDefault();
    await goto("/logout");
  }
</script>

{#if showMenu}
  <section class="nav-section">
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
              <a class="navbar-item" href="/" on:click|preventDefault={logout}>Logout</a>
            {:else}
              <a class="navbar-item" href="/login">Login</a>
            {/if}
          </div>
        </div>
      </nav>
    </div>
  </section>
{/if}

  <div class="container mb-6">
    <div class="has-text-centered">
      <img src="logo.png" width="500px" alt="bread breakers logo" />
    </div>
    <h2 class="tagline subtitle is-6 has-text-centered has-text-weight-normal pt-4">
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
    color: #555;
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
</style>
