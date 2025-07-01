<svelte:head>
    <title>Bread Breakers (SG) | Submit Expense</title>
    <meta name="robots" content="noindex">
</svelte:head>

<script>
  import { uploadFilesWithPrivacyCheck } from '$lib/upload'; 

  let itemDescription;
  let amount;
  let isLoading = false;
  let success = false;
  let error;
  let selectedReceipt;
  let receiptUrl;
  let uploadProgress = { receipt: 0 };
  let privacyCheckStatus = "";

  export let data;

  const approverEmail = data.user.email;

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

    try {
      // Upload files with privacy check
      const uploadResult = await uploadFilesWithPrivacyCheck(
        [selectedReceipt],
        ["receipt"],
        "expense",
        updateProgress,
        updatePrivacyCheck
      );

      receiptUrl = uploadResult.uploadResults[0].fileUrl || uploadResult.uploadResults[0];

    } catch (err) {
      error = "File upload failed: " + err.message;
      isLoading = false;
      return;
    }

    try {
      const response = await fetch("/api/expense/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemDescription,
          receiptUrl,
          amount,
          approverEmail
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

  // Helper function to update individual file progress for the UI
  function updateProgress(type, percent) {
    if (type === "receipt") {
      uploadProgress.receipt = percent;
    } 
    uploadProgress = { ...uploadProgress }; // Trigger reactivity
  }

  function updatePrivacyCheck(status) {
    privacyCheckStatus = status;
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

</script>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Submit Operating Expense</h2>
    {#if success}
      <div class="mt-4 notification is-success">Expense Submitted</div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}
    {#if !success}
      <form class="box mt-4" on:submit={handleSubmit}>
        <div class="field">
          <label for="description" class="label">Description</label>
          <div class="control">
            <input class="input" disabled={isLoading} type="text" bind:value={itemDescription} required />
          </div>
        </div>

        <div class="field">
          <label for="amount" class="label">Expense Amount (SGD)</label>
          <div class="control">
            <input
              id="amount"
              class="input"
              type="number"
              bind:value={amount}
              required
              disabled={isLoading}
              min="0"
              step="0.01"
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
          <div class="control mt-6">
            <button
              class="button is-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    {/if}
  </div>
</div>
