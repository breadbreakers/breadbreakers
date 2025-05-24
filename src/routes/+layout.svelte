<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabase";
  import { session } from "$lib/stores";
  import { goto, invalidate } from "$app/navigation";
  import { page } from "$app/stores";

  const hideMenuOn = ["/logout"];
  $: showMenu = !hideMenuOn.includes($page.url.pathname);
  let isMenuActive = false;

  function toggleMenu() {
    isMenuActive = !isMenuActive;
  }

  async function handleLogout(event) {
    event.preventDefault();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await goto("/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  onMount(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) session.set({ user: data.user });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authSession) => {
      session.set(authSession);
    });

    return () => subscription?.unsubscribe();
  });
</script>

{#if showMenu}
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
      {#if $session?.user}
        <a class="navbar-item" href="/" on:click|preventDefault={handleLogout}>Logout</a>
      {:else}
        <a class="navbar-item" href="/login">Login</a>
      {/if}
    </div>
  </div>
</nav>
{/if}

<section class="section">
  <div class="container">
    <h1 class="title">Bread Breakers 🍞</h1>
    <h2 class="subtitle">Compassion in Action</h2>
  </div>
</section>

<slot />
