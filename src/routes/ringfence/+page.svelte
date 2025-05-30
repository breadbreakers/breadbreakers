<script>
  import { onMount } from "svelte";
  import { uploadFile } from '$lib/upload.js'; 

  let itemId;
  let linkUrl;
  let cost;
  let isLoading = false;
  let success = false;
  let error;
  let swConfirmUrl;
  let selectedFile = null;

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

    if (!selectedFile) {
      error = "Please upload confirmation from social worker.";
      isLoading = false;
      return;
    }

    try {
      // Upload confirmation
      swConfirmUrl = await uploadFile(selectedFile, "sw_confirm", itemId);
    } catch (err) {
      error = "File upload failed: " + err.message;
      isLoading = false;
      return;
    }

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
          swConfirmUrl,
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

  function handleConfirmSW(event) {
    const file = event.target.files[0];
    if (!file) {
      selectedFile = null;
      return;
    }
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, and PDF files are allowed.");
      event.target.value = "";
      selectedFile = null;
      return;
    }
    selectedFile = file;
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
      <form class="box mt-4" on:submit={handleSubmit}>
        <div class="field">
          <div class="control">
            <input class="input" type="hidden" bind:value={itemId} required disabled={isLoading} />
          </div>
        </div>

        <div class="field">
          <label for="linkToPurchase" class="label">Link to purchase</label>
          <div class="control">
            <input
              id="linktoPurchase"
              class="input"
              type="url"
              bind:value={linkUrl}
              required
              disabled={isLoading}
              pattern="https?://.+"
              title="Please enter a valid URL starting with http:// or https://"
            />
          </div>
        </div>

        <div class="field">
          <label for="cost" class="label">Cost (SGD)</label>
          <div class="control">
            <input
              id="cost"
              class="input"
              type="text"
              disabled={isLoading}
              bind:value={cost}
              required
              pattern="^\d+(\.\d{(1, 2)})?$"
              title="Please enter a valid amount (e.g. 123.45)"
            />
          </div>
        </div>

        <div class="field">
          <label for="socialWorkerConfirmation" class="label"
            >Social Worker Confirmation (PNG, JPG, PDF)</label
          >
          <div class="control">
            <input
              id="socialWorkerConfirmation"
              class="input"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              disabled={isLoading}
              on:change={handleConfirmSW}
              required
            />
          </div>
        </div>

        <div class="field">
          <div class="control mt-4">
            <button
              class="button is-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </form>
      <h3 class="is-size-7 mt-4">Item ID {itemId}</h3>
    {/if}
  </div>
</div>
