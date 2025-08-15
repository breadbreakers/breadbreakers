<script>
  import { onMount } from "svelte";
  import { uploadSingleFile, checkPrivacyCompliance } from "$lib/upload.js";

  let itemId = "";
  let cost;
  let isLoading = false; // For final submission state
  let success = false;
  let error = "";

  // File and upload state
  let selectedReceipt = null;
  let selectedDelivery = null;
  let receiptTempPath = null;
  let deliveryTempPath = null;
  let receiptPrivacyResult = null;
  let deliveryPrivacyResult = null;

  let isUploadingReceipt = false;
  let isUploadingDelivery = false;
  let uploadErrorReceipt = null;
  let uploadErrorDelivery = null;

  // Progress tracking
  let uploadProgress = { receipt: 0, delivery: 0 };

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

  async function handleFileUpload(file, type) {
    const description = `${item.title} - ${item.description}`;
    const onProgress = (t, p) => updateProgress(type, p);

    if (type === 'claim_receipt') {
      isUploadingReceipt = true;
      uploadErrorReceipt = null;
      uploadProgress.receipt = 0;
    } else {
      isUploadingDelivery = true;
      uploadErrorDelivery = null;
      uploadProgress.delivery = 0;
    }

    try {
      const [uploadResult, privacyResult] = await Promise.all([
        uploadSingleFile(file, type, itemId, onProgress, true), // isTemporary = true
        checkPrivacyCompliance(file, description)
      ]);

      if (type === 'claim_receipt') {
        receiptTempPath = uploadResult;
        receiptPrivacyResult = { index: 0, file: file.name, result: privacyResult, type };
      } else {
        deliveryTempPath = uploadResult;
        deliveryPrivacyResult = { index: 1, file: file.name, result: privacyResult, type };
      }
    } catch (err) {
      console.error(`Upload error for ${type}:`, err);
      if (type === 'claim_receipt') {
        uploadErrorReceipt = err.message;
      } else {
        uploadErrorDelivery = err.message;
      }
    } finally {
      if (type === 'claim_receipt') {
        isUploadingReceipt = false;
      } else {
        isUploadingDelivery = false;
      }
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";
    success = false;

    if (!receiptTempPath || !deliveryTempPath) {
      error = "Please ensure both files are uploaded successfully before submitting.";
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
          receiptTempPath,
          deliveryTempPath,
          cost: parseFloat(cost),
          privacyAnalysis: [receiptPrivacyResult, deliveryPrivacyResult],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send claim");
      }

      success = true;
      
    } catch (err) {
      error = "Claim submission failed: " + err.message;
      console.error("Claim submission error:", err);
    } finally {
      isLoading = false;
    }
  }

  function handleFileChange(event, type) {
    const file = event.target.files[0];
    const setter = type === 'receipt' ? (f) => selectedReceipt = f : (f) => selectedDelivery = f;
    const tempPathSetter = type === 'receipt' ? (p) => receiptTempPath = p : (p) => deliveryTempPath = p;

    if (!file) {
      setter(null);
      tempPathSetter(null);
      return;
    }

    try {
      const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only PNG, JPG, and PDF files are allowed.");
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error(`File too large. Maximum size is 10MB.`);
      }

      setter(file);
      error = ""; // Clear any previous errors
      handleFileUpload(file, `claim_${type}`);
    } catch (err) {
      alert(err.message);
      event.target.value = "";
      setter(null);
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

    <h3 class="mt-4 has-text-weight-medium">{item.contact_full}</h3>
    <h3 class="mt-4">{item.title}</h3>
    <h3 class="mt-4">{item.description}</h3>

    {#if success}
      <div class="mt-4 notification is-success">
        <strong>Claim Submitted Successfully!</strong>
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
            <p class="is-size-7 has-text-grey mb-2">
              Selected: {selectedReceipt.name} ({formatFileSize(selectedReceipt.size)})
            </p>
            {#if isUploadingReceipt}
              <progress class="progress is-info" max="100">{uploadProgress.receipt}%</progress>
            {:else if receiptTempPath}
              <p class="is-size-7 has-text-success">✓ Uploaded</p>
            {:else if uploadErrorReceipt}
              <p class="is-size-7 has-text-danger">Upload failed: {uploadErrorReceipt}</p>
            {/if}
          {/if}
          
          <div class="control">
            <input
              id="receipt"
              class="input"
              type="file"
              disabled={isLoading || isUploadingReceipt}
              accept=".png,.jpg,.jpeg,.pdf"
              on:change={(e) => handleFileChange(e, 'receipt')}
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
            <p class="is-size-7 has-text-grey mb-2">
              Selected: {selectedDelivery.name} ({formatFileSize(selectedDelivery.size)})
            </p>
            {#if isUploadingDelivery}
              <progress class="progress is-info" max="100">{uploadProgress.delivery}%</progress>
            {:else if deliveryTempPath}
              <p class="is-size-7 has-text-success">✓ Uploaded</p>
            {:else if uploadErrorDelivery}
              <p class="is-size-7 has-text-danger">Upload failed: {uploadErrorDelivery}</p>
            {/if}
          {/if}
          
          <div class="control">
            <input
              id="delivery"
              class="input"
              type="file"
              disabled={isLoading || isUploadingDelivery}
              accept=".png,.jpg,.jpeg,.pdf"
              on:change={(e) => handleFileChange(e, 'delivery')}
              required
            />
          </div>
        </div>

        <div class="field">
          <div class="control mt-4">
            <button
              class="button is-info is-light is-fullwidth"
              type="submit"
              disabled={isLoading || isUploadingReceipt || isUploadingDelivery || !receiptTempPath || !deliveryTempPath}
            >
              {#if isUploadingReceipt || isUploadingDelivery}
                Uploading files... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
              {:else if isLoading}
                Submitting... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
              {:else}
                Submit Claim Request
              {/if}
            </button>
          </div>
        </div>
      </form>
      
      <h3 class="is-size-7 mt-4 has-text-grey">Item ID: {itemId}</h3>
    {/if}
  </div>
</div>
