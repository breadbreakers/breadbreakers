<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let countdown = 3;
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
        <p>Redirecting to home page in {countdown} seconds...</p>
    </div>
</section>
