<svelte:head>
    <title>Bread Breakers (SG) | Logout</title>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let countdown = 0;
    let timer;

    onMount(() => {
        timer = setInterval(() => {
            countdown -= 1;
            if (countdown <= 0) {
                clearInterval(timer);
                window.location.href = "/";
            }
        }, 1000);

        return () => clearInterval(timer);
    });
</script>

<section class="section">
  <div class="container has-text-centered">
    <p><i class="demo-icon icon-spin6 animate-spin">&#xe839;</i></p>
  </div>
</section>
