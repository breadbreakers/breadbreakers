<svelte:head>
    <title>Bread Breakers (SG) | Ringfence Request (Manual)</title>
</svelte:head>

<script>
  import { uploadFilesWithPrivacyCheck } from '$lib/upload.js'; 

  export let data;

  let itemId = data.itemId;
  let itemTitle;
  let itemDesc;
  let itemContact
  let itemVWO;
  let linkUrl;
  let cost;
  let isLoading = false;
  let success = false;
  let error;
  let swConfirmUrl;
  let itemCostUrl;
  let selectedFile = null;
  let itemCostFile = null;
  let uploadProgress = {};

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

    if (!itemCostFile) {
      error = "Please upload screenshot of item cost inclusive of delivery fee.";
      isLoading = false;
      return;
    }

    try {
      const uploadResult = await uploadFilesWithPrivacyCheck(
        [selectedFile, itemCostFile],
        ["ringfence_sw", "ringfence_cost"],
        itemId,
        updateProgress,
        `${itemTitle} - ${itemDesc}` 
      );

      swConfirmUrl = uploadResult.uploadResults[0].fileUrl;
      itemCostUrl = uploadResult.uploadResults[1].fileUrl;

      const response = await fetch("/api/ringfence/send/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          linkUrl,
          cost,
          swConfirmUrl,
          itemCostUrl,
          itemTitle,
          itemDesc,
          itemContact,
          itemVWO,
          privacyAnalysis: uploadResult.privacyAnalysis,
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

  // Helper function to update individual file progress for the UI
  function updateProgress(type, percent) {
    if (type === "sw_confirm") {
      uploadProgress.sw = percent;
    } else if (type === "itemcost") {
      uploadProgress.itemCost = percent;
    }
    uploadProgress = { ...uploadProgress }; // Trigger reactivity
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

  function handleItemCost(event) {
    const file = event.target.files[0];
    if (!file) {
      itemCostFile = null;
      return;
    }
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG, and PDF files are allowed.");
      event.target.value = "";
      itemCostFile = null;
      return;
    }
    itemCostFile = file;
  }
</script>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Ringfence Request (Manual)</h2>

    {#if success}
      <div class="mt-4 notification is-success">Submitted!</div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}
    {#if !success}
      <form class="mt-4" on:submit={handleSubmit}>
        <div class="field">
          <label for="itemId" class="label">ID</label>
          <div class="control">
            <input
              class="input"
              type="text"
              bind:value={itemId}
              required
              disabled
            />
          </div>
        </div>

        <div class="field">
          <label for="itemTItle" class="label">Item Title</label>
          <div class="control">
            <input
              class="input"
              type="text"
              bind:value={itemTitle}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div class="field">
          <label for="itemDesc" class="label">Description</label>
          <div class="control">
            <textarea
              class="textarea"
              type="text"
              bind:value={itemDesc}
              required
              disabled={isLoading}
            ></textarea>
          </div>
        </div>

        <div class="field">
          <label for="itemContact" class="label">VWO</label>
          <div class="control">
            <input
              class="input"
              type="text"
              bind:value={itemVWO}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div class="field">
          <label for="itemContact" class="label">Social Worker Email/Mobile</label>
          <div class="control">
            <input
              class="input"
              type="text"
              bind:value={itemContact}
              required
              disabled={isLoading}
            />
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
          <label for="cost" class="label">Cost including delivery (SGD)</label>
          <div class="control">
            <input
              id="cost"
              class="input"
              type="number"
              min="0"
              step="0.01"
              disabled={isLoading}
              bind:value={cost}
              required
            />
          </div>
        </div>

        <div class="field">
          <label for="itemCost" class="label"
            >Screenshot showing total cost, inclusive of delivery (PNG, JPG, PDF). Redact all name, address and mobile numbers.</label
          >
          <div class="control">
            <input
              id="itemCost"
              class="input"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              disabled={isLoading}
              on:change={handleItemCost}
              required
            />
          </div>
        </div>

        <div class="field">
          <label for="socialWorkerConfirmation" class="label"
            >Social Worker Confirmation (PNG, JPG, PDF)</label
          >
          <p class="mb-2">Please ensure the description of the item is shown in the attachment. <strong class="is-underlined">Redact all name, address and mobile numbers.</strong></p>
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
          <div class="control mt-6">
            <button
              class="button is-info is-light is-fullwidth"
              type="submit"
              disabled={isLoading}
            >
              {#if isLoading}
              Processing... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
              {:else}
              Submit
              {/if}
            </button>
          </div>
        </div>
      </form>
    {/if}
  </div>
</div>
