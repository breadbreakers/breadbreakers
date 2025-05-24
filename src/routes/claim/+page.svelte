<script>
  import { onMount } from "svelte";

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

  async function uploadFile(file, label) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("itemId", itemId);
    formData.append("label", label);

    const uploadRes = await fetch("/api/claim/upload", {
      method: "POST",
      body: formData,
    });
    const uploadResult = await uploadRes.json();
    if (!uploadRes.ok) {
      throw new Error(uploadResult.error || "File upload failed");
    }
    return uploadResult.fileUrl || uploadResult.fileId;
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
      receiptUrl = await uploadFile(selectedReceipt, "receipt");
      // Upload proof of delivery
      deliveryUrl = await uploadFile(selectedDelivery, "proof_of_delivery");
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
          receiptUrl,       // receipt file url/id
          deliveryUrl,   // proof of delivery file url/id
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
          <label class="label">Claim Amount (SGD)</label>
          <div class="control">
            <input
              class="input"
              type="text"
              bind:value={cost}
              required
              pattern="^\d+(\.\d{1,2})?$"
              title="Please enter a valid amount (e.g. 123.45)"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Upload Receipt (PNG, JPG, PDF)</label>
          <div class="control">
            <input
              class="input"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              on:change={handleReceiptChange}
              required
            />
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="label">Proof of Delivery (PNG, JPG, PDF)</label>
          <div class="control">
            <input
              class="input"
              type="file"
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
