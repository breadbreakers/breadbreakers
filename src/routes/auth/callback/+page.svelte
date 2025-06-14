// src/routes/auth/callback/+page.svelte
<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let data;

  onMount(() => {
    // Use the redirectTo passed from the server
    const target = data.redirectTo || '/';

    // Clean URL by removing all query parameters (including code and redirectTo)
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);

    // Navigate to the target route
    goto(target, { replaceState: true });
  });
</script>

<section class="section">
  <div class="container has-text-centered">
    <p><i class="demo-icon icon-spin6 animate-spin">&#xe839;</i></p>
  </div>
</section>
