<script>
  import { onMount } from "svelte";

  let itemId = "";
  let linkUrl = "";
  let cost = "";
  let subject = "";
  let body = "";
  let isLoading = false;
  let success = false;
  let error = "";

  export let data;
  const item = data.item;

  onMount(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    itemId = params.get("id") || "";
  });

  async function sendEmail() {
    isLoading = true;
    error = "";
    success = false;

    try {
      const response = await fetch("/api/ringfence/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          linkUrl,
          cost,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
      }

      success = true;
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Ringfence Request</h2>

    <h3 class="mt-4 has-text-weight-medium">{item.contact_clean}</h3>
    <h3 class="mt-4">{item.title}</h3>
    <h3 class="mt-4">{item.description}</h3>
    
    {#if success}
      <div class="mt-4 notification is-success">Submitted!</div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}
    {#if !success}
    <form class="box mt-4" on:submit|preventDefault={sendEmail}>
      <div class="field">
        <div class="control">
          <input class="input" type="hidden" bind:value={itemId} required />
        </div>
      </div>

      <div class="field">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">Link to purchase</label>
        <div class="control">
          <input
            class="input"
            type="url"
            bind:value={linkUrl}
            required
            pattern="https?://.+"
            title="Please enter a valid URL starting with http:// or https://"
          />
        </div>
      </div>

      <div class="field">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">Cost (SGD)</label>
        <div class="control">
          <input
            class="input"
            type="text"
            bind:value={cost}
            required
            pattern="^\d+(\.\d{(1, 2)})?$"
            title="Please enter a valid amount (e.g. 123.45)"
          />
        </div>
      </div>

      <div class="field">
        <div class="control mt-4">
          <button class="button is-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </form>
    <h3 class="is-size-7 mt-4">Item ID {itemId}</h3>
    {/if}
  </div>
</div>
