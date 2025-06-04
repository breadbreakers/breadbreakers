<script>
  // Number of pixels to scroll before showing the button
  export let showOnPx = 150;
  let hidden = true;

  // Scroll handler to show/hide the button
  function handleOnScroll() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    hidden = scrollTop < showOnPx;
  }

  // Scroll to top function
  function goTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<svelte:window on:scroll={handleOnScroll} />

<!-- Button is hidden until scrolled past showOnPx -->
<button class="back-to-top" on:click={goTop} class:hidden> 🔝 </button>

<style>
  .back-to-top {
    opacity: 1;
    transition:
      opacity 0.5s,
      visibility 0.5s;
    position: fixed;
    z-index: 99;
    right: 20px;
    bottom: 20px;
    color: white;

    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .back-to-top.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  button {
    -webkit-tap-highlight-color: transparent;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
