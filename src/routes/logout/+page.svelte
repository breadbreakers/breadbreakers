<svelte:head>
    <title>Bread Breakers Singapore | Logout</title>
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
    <div class="container">
        <h1 class="subtitle">Logged out successfully</h1>
        <p>Redirecting to home page...</p>
    </div>
</section>
