<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabase";

  onMount(async () => {
    const { error } = await supabase.auth.getUser();
    if (!error) {
      window.location.href = "/";
    }
  });
</script>

<section class="section">
  <div class="container">
    <div class="loading-spinner"></div>
    <p>Completing authentication...</p>
  </div>
</section>
<div class="loading-container"></div>

<style>
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
