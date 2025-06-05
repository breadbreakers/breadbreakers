<svelte:head>
    <title>Bread Breakers Singapore | Submit Claim</title>
</svelte:head>

<script>
  import { onMount } from "svelte";
  import { uploadFile } from '$lib/upload.js'; 

  let itemId = "";
  let receiptUrl = ""; // For receipt file
  let deliveryUrl = ""; // For proof of delivery file
  let cost = "";
  let isLoading = false;
  let success = false;
  let error = "";
  let selectedReceipt = null;
  let selectedDelivery = null;

  export let data;
  const item = data.item;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    itemId = params.get("id") || "";
  });

  function handleReceiptChange(event) {
    const file = event.target.files[0];
    if (!file) {
      selectedReceipt = null;
      return;
    }
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, and PDF files are allowed.");
      event.target.value = "";
      selectedReceipt = null;
      return;
    }
    selectedReceipt = file;
  }

  function handleDeliveryChange(event) {
    const file = event.target.files[0];
    if (!file) {
      selectedDelivery = null;
      return;
    }
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, and PDF files are allowed.");
      event.target.value = "";
      selectedDelivery = null;
      return;
    }
    selectedDelivery = file;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";
    success = false;

    if (!selectedReceipt) {
      error = "Please upload a receipt file.";
      isLoading = false;
      return;
    }
    if (!selectedDelivery) {
      error = "Please upload a proof of delivery file.";
      isLoading = false;
      return;
    }

    try {
      // Upload receipt
      receiptUrl = await uploadFile(selectedReceipt, "receipt", itemId);
      // Upload proof of delivery
      deliveryUrl = await uploadFile(selectedDelivery, "proof_of_delivery", itemId);
    } catch (err) {
      error = "File upload failed: " + err.message;
      isLoading = false;
      return;
    }

    try {
      const response = await fetch("/api/claim/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          receiptUrl,
          deliveryUrl,
          cost,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send claim");
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
    <h2 class="subtitle is-4">Claim Request</h2>

    <h3 class="mt-4 has-text-weight-medium">{item.contact_clean}</h3>
    <h3 class="mt-4">{item.title}</h3>
    <h3 class="mt-4">{item.description}</h3>

    {#if success}
      <div class="mt-4 notification is-success">Submitted!</div>
    {:else if error}
      <div class="mt-4 notification is-danger">{error}</div>
    {/if}

    {#if !success}
      <form class="box mt-4" on:submit={handleSubmit}>
        <input type="hidden" bind:value={itemId} />

        <div class="field">
          <label for="claimAmount" class="label">Claim Amount (SGD)</label>
          <div class="control">
            <input
              id="claimAmount"
              class="input"
              type="text"
              bind:value={cost}
              required
              disabled={isLoading}
              pattern="^\d+(\.\d{1,2})?$"
              title="Please enter a valid amount (e.g. 123.45)"
            />
          </div>
        </div>

        <div class="field">
          <label for="receipt" class="label">Upload Receipt (PNG, JPG, PDF)</label>
          <div class="control">
            <input
              id="receipt"
              class="input"
              type="file"
              disabled={isLoading}
              accept=".png,.jpg,.jpeg,.pdf"
              on:change={handleReceiptChange}
              required
            />
          </div>
        </div>

        <div class="field">
          <label for="delivery" class="label">Proof of Delivery (PNG, JPG, PDF)</label>
          <p>Please ensure all personal identifable information is redacted out. This will be published on the website.</p>
          <div class="control">
            <input
              id="delivery"
              class="input"
              type="file"
              disabled={isLoading}
              accept=".png,.jpg,.jpeg,.pdf"
              on:change={handleDeliveryChange}
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
