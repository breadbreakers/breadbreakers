<script>
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabase'
  import 'datatables.net-dt/css/dataTables.dataTables.css'
  import jquery from 'jquery'
  import DataTable from 'datatables.net'

  export const data = undefined
  let isMenuActive = false
  
  function toggleMenu() {
    isMenuActive = !isMenuActive
  }
</script>

<nav class="navbar" aria-label="main navigation" style="background-color: white;">
  <div class="navbar-brand">
    <a class="navbar-item has-text-weight-bold" href="/" style="color: black; background-color: white;">
      🍞 Bread Breakers Singapore
    </a>
    <button type="button"
       class="navbar-burger" 
       aria-label="menu" 
       aria-expanded={isMenuActive}
       on:click={toggleMenu}
       on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? toggleMenu() : null}
       tabindex="0"
       class:is-active={isMenuActive}>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  </div>
  <div class="navbar-menu" class:is-active={isMenuActive}>
    <div class="navbar-end">
      <a class="navbar-item" href="/about">About</a>
      <a class="navbar-item" href="/contact">Contact</a>
    </div>
  </div>
</nav>

<slot />

<style>
  .navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,.1);
    background-color: white !important;
    border-bottom: none !important;
  }
  .navbar-item {
    color: black !important;
    background-color: white !important;
  }
  .navbar-item:hover {
    color: black !important;
  }
  .navbar-item:focus {
    outline: none;
  }
  .navbar-item:focus-visible {
    outline: none;
  }

  .navbar-burger {
    background-color: white !important;
    color: black !important;
  }
  .navbar-burger span {
    background-color: black !important;
  }
  .navbar-burger:hover {
    background-color: white !important;
    color: black !important;
  }
  .navbar-menu {
    background-color: white !important;
  }

  @media (min-width: 1024px) {
    .navbar-burger {
      display: none !important;
    }
    .navbar-menu {
      display: flex !important;
    }
  }
</style>
