<script>
  import { onMount } from "svelte";

  let itemId;
  let isLoading = false;
  let success = false;
  let error;
  let approveMessage;

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
      const response = await fetch("/api/claim/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          approveMessage
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

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Approve Claim Request</h2>

    <h3 class="mt-4 has-text-weight-medium">{item.contact_clean}</h3>
    <h3 class="mt-4">{item.title}</h3>
    <h3 class="mt-4">{item.description}</h3>

    {#if success}
      <div class="mt-4 notification is-success">Approved Claim!</div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}
    {#if !success}

      <form class="box mt-4" on:submit={handleSubmit}>
        <div class="field">
          <div class="control">
            <input class="input" type="hidden" bind:value={itemId} required />
          </div>
        </div>

        <div class="field">
          <label for="approveMessage" class="label">Remarks</label>
          <div class="control">
            <textarea
              class="textarea"
              id="approveMessage"
              bind:value={approveMessage}
              required></textarea>
            
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
      <h3 class="is-size-7 mt-4">Item ID {itemId}</h3>
    {/if}
  </div>
</div>
