<script>
  let itemDescription;
  let amount;
  let isLoading = false;
  let fundType;
  let success = false;
  let error;

  export let data;

  const approverEmail = data.user.email;

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";
    success = false;

    try {
      const response = await fetch("/api/incoming/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemDescription,
          fundType,
          amount,
          approverEmail,
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

<svelte:head>
  <title>Bread Breakers (SG) | Submit Incoming Cashflow</title>
  <meta name="robots" content="noindex">
</svelte:head>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Submit Incoming Cashflow</h2>
    {#if success}
      <div class="mt-4 notification is-success">
        Incoming Cashflow Submitted
      </div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}
    {#if !success}
      <form class="box mt-4" on:submit={handleSubmit}>
        <div class="field">
          <label for="description" class="label">Source/Bank Statement Reference</label>
          <div class="control">
            <input
              class="input"
              disabled={isLoading}
              type="text"
              bind:value={itemDescription}
              required
            />
          </div>
        </div>

        <div class="field">
          <label for="fund" class="label">Fund</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select name="fund" id="type" bind:value={fundType} required>
                  <option value="mission" selected>Beneficary Fund</option>
                  <option value="operating">Operating Fund</option>
              </select>
            </div>
          </div>
        </div>

        <div class="field">
          <label for="amount" class="label">Incoming Amount (SGD)</label>
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
