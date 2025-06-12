<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  export let data;

  onMount(() => {
    const target = data.redirectTo || '/';

    // Remove the code param from the URL without triggering a reload
    window.history.replaceState({}, '', target);

    // Then navigate to the target route (client-side)
    goto(target, { replaceState: true });
  });
</script>

<section class="section">
  <div class="container has-text-centered">
    <p><i class="demo-icon icon-spin6 animate-spin">&#xe839;</i></p>
  </div>
</section>
