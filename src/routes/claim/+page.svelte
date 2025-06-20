<script>
  import { onMount } from "svelte";
  import { uploadFiles } from "$lib/upload.js";

  let itemId = "";
  let receiptUrl = ""; // For receipt file
  let deliveryUrl = ""; // For proof of delivery file
  let cost; // Changed to not be initialized with "" for number type
  let isLoading = false;
  let success = false;
  let error = "";
  let selectedReceipt = null;
  let selectedDelivery = null;

  // Progress tracking
  let uploadProgress = { receipt: 0, delivery: 0 };
  let currentStep = "";

  export let data;
  const item = data.item;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    itemId = params.get("id") || "";
    cost = (item.amount / 100).toFixed(2);
  });

  // Helper function to update individual file progress
  function updateProgress(type, percent) {
    if (type === "receipt") {
      uploadProgress.receipt = percent;
    } else if (type === "proof_of_delivery") {
      uploadProgress.delivery = percent;
    }
    uploadProgress = { ...uploadProgress }; // Trigger reactivity
  }

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";
    success = false;
    uploadProgress = { receipt: 0, delivery: 0 }; // Reset progress

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
      // Step 1: Upload files in parallel with progress tracking
      currentStep = "Uploading files...";
      const uploadedUrls = await uploadFiles(
        [selectedReceipt, selectedDelivery],
        ["claim_receipt", "claim_delivery"],
        itemId,
        updateProgress
      );

      receiptUrl = uploadedUrls[0].fileUrl;
      deliveryUrl = uploadedUrls[1].fileUrl;

      // Step 2: Send API request
      currentStep = "Processing request...";
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
      currentStep = "Complete!";
    } catch (err) {
      error = "Claim submission failed: " + err.message;
      console.error("Claim submission error:", err);
    } finally {
      isLoading = false;
      uploadProgress = { receipt: 0, delivery: 0 }; // Reset progress on completion/error
    }
  }

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

  // Helper function to format file size (copied from your working file)
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
</script>

<svelte:head>
  <title>Bread Breakers (SG) | Submit Claim</title>
</svelte:head>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Claim Request</h2>

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
        <input type="hidden" bind:value={itemId} />

        <div class="field">
          <label for="claimAmount" class="label">Claim Amount (SGD)</label>
          <div class="control">
            <input
              id="claimAmount"
              class="input"
              type="number"
              min="0"
              step="0.01"
              bind:value={cost}
              required
              disabled
              pattern="^\d+(\.\d{(1, 2)})?$"
              title="Please enter a valid amount (e.g. 123.45)"
            />
          </div>
        </div>

        <div class="field">
          <label for="receipt" class="label"
            >Upload Redacted Receipt (PNG, JPG, PDF)</label
          >
          <p>
            Please ensure all personal identifiable information is redacted out.
            This will be published on the website.
          </p>
          {#if selectedReceipt}
            <p class="is-size-7 has-text-grey mb-2">
              Selected: {selectedReceipt.name} ({formatFileSize(
                selectedReceipt.size
              )})
            </p>
          {/if}
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
          <label for="delivery" class="label"
            >Proof of Delivery (PNG, JPG, PDF)</label
          >
          <p>
            Please ensure all personal identifiable information is redacted out.
            This will be published on the website.
          </p>
          {#if selectedDelivery}
            <p class="is-size-7 has-text-grey mb-2">
              Selected: {selectedDelivery.name} ({formatFileSize(
                selectedDelivery.size
              )})
            </p>
          {/if}
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
              {#if isLoading}
                Processing... <i class="demo-icon icon-spin6 animate-spin"
                  >&#xe839;</i
                >
              {:else}
                Send
              {/if}
            </button>
          </div>
        </div>
      </form>
      <h3 class="is-size-7 mt-4">Item ID {itemId}</h3>
    {/if}
  </div>
</div>