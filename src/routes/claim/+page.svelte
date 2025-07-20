<script>
  import { onMount } from "svelte";
  import { uploadFilesWithPrivacyCheck } from "$lib/upload.js";

  let itemId = "";
  let receiptUrl = "";
  let deliveryUrl = "";
  let cost;
  let isLoading = false;
  let success = false;
  let error = "";
  let selectedReceipt = null;
  let selectedDelivery = null;

  // Enhanced progress tracking
  let uploadProgress = { receipt: 0, delivery: 0 };
  let currentStep = "";
  let privacyCheckStatus = "";

  export let data;
  const item = data.item;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    itemId = params.get("id") || "";
    cost = (item.amount / 100).toFixed(2);
  });

  function updateProgress(type, percent) {
    if (type === "claim_receipt") {
      uploadProgress.receipt = percent;
    } else if (type === "claim_delivery") {
      uploadProgress.delivery = percent;
    }
    uploadProgress = { ...uploadProgress };
  }

  function updatePrivacyCheck(status) {
    privacyCheckStatus = status;
  }

  // Enhanced file validation
  function validateFile(file, maxSize = 10 * 1024 * 1024) {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PNG, JPG, and PDF files are allowed.");
    }
    
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${formatFileSize(maxSize)}.`);
    }
    
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";
    success = false;
    uploadProgress = { receipt: 0, delivery: 0 };
    privacyCheckStatus = "";

    try {
      // Validate files first
      if (!selectedReceipt) {
        throw new Error("Please upload a receipt file.");
      }
      if (!selectedDelivery) {
        throw new Error("Please upload a proof of delivery file.");
      }

      validateFile(selectedReceipt);
      validateFile(selectedDelivery);

      currentStep = "Validating files...";

      // Upload files with privacy check
      const uploadResult = await uploadFilesWithPrivacyCheck(
        [selectedReceipt, selectedDelivery],
        ["claim_receipt", "claim_delivery"],
        itemId,
        updateProgress,
        updatePrivacyCheck
      );

      receiptUrl = uploadResult.uploadResults[0].fileUrl || uploadResult.uploadResults[0];
      deliveryUrl = uploadResult.uploadResults[1].fileUrl || uploadResult.uploadResults[1];

      currentStep = "Submitting claim...";
      
      // Send API request with privacy analysis
      const response = await fetch("/api/claim/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          receiptUrl,
          deliveryUrl,
          cost: parseFloat(cost),
          privacyAnalysis: uploadResult.privacyAnalysis,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send claim");
      }

      success = true;
      currentStep = "Claim submitted successfully!";
      
    } catch (err) {
      error = "Claim submission failed: " + err.message;
      console.error("Claim submission error:", err);
    } finally {
      isLoading = false;
      if (!success) {
        uploadProgress = { receipt: 0, delivery: 0 };
        privacyCheckStatus = "";
      }
    }
  }

  function handleReceiptChange(event) {
    const file = event.target.files[0];
    if (!file) {
      selectedReceipt = null;
      return;
    }
    
    try {
      validateFile(file);
      selectedReceipt = file;
      error = ""; // Clear any previous errors
    } catch (err) {
      alert(err.message);
      event.target.value = "";
      selectedReceipt = null;
    }
  }

  function handleDeliveryChange(event) {
    const file = event.target.files[0];
    if (!file) {
      selectedDelivery = null;
      return;
    }
    
    try {
      validateFile(file);
      selectedDelivery = file;
      error = ""; // Clear any previous errors
    } catch (err) {
      alert(err.message);
      event.target.value = "";
      selectedDelivery = null;
    }
  }

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
  <meta name="robots" content="noindex">
</svelte:head>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Claim Request</h2>

    <h3 class="mt-4 has-text-weight-medium">{item.contact_clean}</h3>
    <h3 class="mt-4">{item.title}</h3>
    <h3 class="mt-4">{item.description}</h3>

    {#if success}
      <div class="mt-4 notification is-success">
        <strong>Claim Submitted Successfully!</strong>
        <br />Your claim has been sent for approval. You'll receive an email confirmation shortly.
      </div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}

    {#if !success}
      <form class="mt-4" on:submit={handleSubmit}>
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
              pattern="^\d+(\.\d{1,2})?$"
              title="Please enter a valid amount (e.g. 123.45)"
            />
          </div>
        </div>

        <div class="field pt-5">
          <label for="receipt" class="label">
            📄 Upload Receipt (PNG, JPG, PDF)
          </label>
          <div class="content">
            <p class="has-text-danger">
              <strong>⚠️ Important:</strong> Please ensure your receipt shows PayNow as the payment mode, and all personal information is redacted:
            </p>
            <ul>
              <li>Names (except business names)</li>
              <li>Phone numbers</li>
              <li>Addresses</li>
              <li>Bank account numbers</li>
              <li>Credit card numbers</li>
            </ul>
            <p class="has-text-black">
              This document will be published publicly on our website.
            </p>
          </div>
          
          {#if selectedReceipt}
            <p class="has-text-grey mb-2">
              ✅ Selected: {selectedReceipt.name} ({formatFileSize(selectedReceipt.size)})
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

        <div class="field pt-5">
          <label for="delivery" class="label">
            🚚 Proof of Delivery from Social Worker (PNG, JPG, PDF)
          </label>
          <div class="content">
            <p class="has-text-danger">
              <strong>⚠️ Important:</strong> Please redact all personal information from delivery confirmations.
            </p>
            <p class="has-text-black">
              This document will be published publicly on our website.
            </p>
          </div>
          
          {#if selectedDelivery}
            <p class="has-text-grey mb-2">
              ✅ Selected: {selectedDelivery.name} ({formatFileSize(selectedDelivery.size)})
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
              class="button is-primary is-fullwidth"
              type="submit"
              disabled={isLoading || !selectedReceipt || !selectedDelivery}
            >
              {#if isLoading}
                Processing... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
              {:else}
                Submit Claim Request
              {/if}
            </button>
          </div>
        </div>

        <!-- Progress indicators -->
        {#if isLoading}
          <div class="box has-background-light">
            <div class="mb-3">
              <strong>Progress:</strong> {currentStep}
            </div>
            
            {#if privacyCheckStatus}
              <p class="is-size-7 has-text-black mb-2">🔍 {privacyCheckStatus}</p>
            {/if}
            
            {#if uploadProgress.receipt > 0 || uploadProgress.delivery > 0}
              <div class="mb-2">
                <div class="level is-mobile">
                  <div class="level-left">
                    <span class="is-size-7">Receipt: {uploadProgress.receipt}%</span>
                    <span class="is-size-7">Delivery: {uploadProgress.delivery}%</span>
                  </div>
                </div>
              
              </div>
            {/if}
          </div>
        {/if}
      </form>
      
      <h3 class="is-size-7 mt-4 has-text-grey">Item ID: {itemId}</h3>
    {/if}
  </div>
</div>