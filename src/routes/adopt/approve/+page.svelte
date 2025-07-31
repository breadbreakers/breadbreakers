<script>
  import { onMount } from "svelte";

  let itemId;
  let isLoading = false;
  let success = false;
  let error;

  export let data;
  const item = data.item;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    itemId = params.get("id") || "";
  });

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";
    success = false;

    try {
      const response = await fetch("/api/adopt/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      success = true;
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Bread Breakers (SG) | Approve Recurring Request</title>
</svelte:head>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Approve Reccuring Request</h2>
    {#if success}
      <div class="mt-4 notification is-success">
        Approved Recurring Request!
      </div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}
    {#if !success}
      <h3 class="mt-4"><strong class="is-underlined">Social Worker Name</strong> {item.swname}</h3>
      <h3 class="mt-4"><strong class="is-underlined">Social Worker Email</strong> {item.swemail}</h3>
      <h3 class="mt-4"><strong class="is-underlined">Type</strong> {item.type}</h3>
      <h3 class="mt-4"><strong class="is-underlined">Quantity</strong> {item.qty}</h3>
      <h3 class="mt-4"><strong class="is-underlined">Frequency</strong> {item.frequency}</h3>
      <h3 class="mt-4"><strong class="is-underlined">Over a period of</strong> {item.period}</h3>
      <h3 class="mt-4"><strong class="is-underlined">Link to purchase</strong> {item.link}</h3>
      <h3 class="mt-4"><strong class="is-underlined">Remarks</strong> {item.remarks}</h3>
      <form class="box mt-4" on:submit={handleSubmit}>
        <div class="field">
          <div class="control">
            <input class="input" type="hidden" bind:value={itemId} required />
          </div>
        </div>

        <div class="field">
          <div class="control mt-4">
            <button
              class="button is-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Approve"}
            </button>
          </div>
        </div>
      </form>
      <h3 class="is-size-7 mt-4">{itemId}</h3>
    {/if}
  </div>
</div>
