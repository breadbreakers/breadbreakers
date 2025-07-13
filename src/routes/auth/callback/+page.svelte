<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { clearDashboardCache } from '$lib/dashboardCache.js';

  export let data;

  onMount(() => {
    // Clear cache on login
    clearDashboardCache();
    
    // Use the redirectTo passed from the server
    const target = data.redirectTo || '/';

    // Clean URL by removing all query parameters (including code and redirectTo)
    const cleanUrl = window.location.pathname;
    window.location.href = "/";
    window.history.replaceState({}, '', cleanUrl);

    // Navigate to the target route
    //goto(target, { replaceState: true });
    window.location.href = target;
  });
</script>

<section class="section">
  <div class="container has-text-centered">
    <p><i class="demo-icon icon-spin6 animate-spin">&#xe839;</i></p>
  </div>
</section>