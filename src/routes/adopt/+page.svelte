<script>
  let type;
  let link;
  let region;
  let isLoading = false;
  let success = false;
  let error;
  let remarks = "";
  let swname;
  let swemail;
  let frequency;
  let period;
  let qty;

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";

    try {

      const response = await fetch("/api/adopt/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qty,
          swname,
          swemail,
          type,
          region,
          frequency,
          period,
          link,
          remarks
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send claim");
      }

      success = true;
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Bread Breakers (SG) | Recurring Request</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="section">
  <div class="container">
    <h2 class="subtitle is-4">Recurring Request</h2>

    {#if success}
      <div class="mt-4 notification is-success">Submitted! We will keep you updated by email.</div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}

    {#if !success}
      <form class="mt-4" on:submit={handleSubmit}>
        <div class="field">
          <label for="socialWorkerName" class="label">Social Worker Name</label>
          <div class="control">
            <input
              id="socialWorkerName"
              class="input"
              type="text"
              bind:value={swname}
              disabled={isLoading}
            />
          </div>
        </div>

        <div class="field">
          <label for="socialWorkerEmail" class="label"
            >Social Worker Email</label
          >
          <p>Personal email addresses are not allowed.</p>
          <div class="control pt-2">
            <input
              id="socialWorkerEmail"
              class="input"
              type="email"
              bind:value={swemail}
              disabled={isLoading}
            />
          </div>
        </div>

        <!-- svelte-ignore a11y_label_has_associated_control -->
        <div class="field">
          <label class="label">Request Type</label>
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                name="itemType"
                value="Diapers"
                bind:group={type}
                disabled={isLoading}
                required
              />
              Diapers
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="itemType"
                value="Milk Powder"
                bind:group={type}
                disabled={isLoading}
                required
              />
              Milk Powder
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="itemType"
                value="Groceries"
                bind:group={type}
                disabled={isLoading}
                required
              />
              Groceries
            </label>
          </div>
        </div>

        <div class="field">
          <label for="qty" class="label"
            >Quantity</label
          >
          <div class="control">
            <p>E.g. 2 packs</p>
            <input
              id="qty"
              class="input"
              required
              type="text"
              bind:value={qty}
              disabled={isLoading}
            />
          </div>
        </div>        

        <div class="field">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="label">Delivery Frequency</label>
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                name="frequency"
                value="Weekly"
                bind:group={frequency}
                disabled={isLoading}
                required
              />
              Weekly
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="frequency"
                value="Monthly"
                bind:group={frequency}
                disabled={isLoading}
                required
              />
              Monthly
            </label>
          </div>
        </div>

        <div class="field">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="label">Over a Period of</label>
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                name="period"
                value="Over 3 months"
                bind:group={period}
                disabled={isLoading}
                required
              />
              3 months
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="period"
                value="Over 6 months"
                bind:group={period}
                disabled={isLoading}
                required
              />
              6 months
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="period"
                value="Over 9 months"
                bind:group={period}
                disabled={isLoading}
                required
              />
              9 months
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="period"
                value="Over 12 months"
                bind:group={period}
                disabled={isLoading}
                required
              />
              12 months
            </label>
          </div>
        </div>

<div class="field">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label class="label">Which part of Singapore is the beneficiary located in?</label>
          <p>This information helps us match volunteers living nearby.</p>
          <div class="control pt-2">
            <label class="radio">
              <input
                type="radio"
                name="region"
                value="North"
                bind:group={region}
                disabled={isLoading}
                required
              />
              North
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="region"
                value="South"
                bind:group={region}
                disabled={isLoading}
                required
              />
              South
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="region"
                value="East"
                bind:group={region}
                disabled={isLoading}
                required
              />
              East
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="region"
                value="West"
                bind:group={region}
                disabled={isLoading}
                required
              />
              West
            </label>
            <br />
            <label class="radio">
              <input
                type="radio"
                name="region"
                value="Central"
                bind:group={region}
                disabled={isLoading}
                required
              />
              Central
            </label>
          </div>
        </div>

        <div class="field">
          <label for="linkToPurchase" class="label"
            >Link to Purchase (Optional)</label
          >
          <div class="control">
            <input
              id="linktoPurchase"
              class="input"
              type="url"
              bind:value={link}
              disabled={isLoading}
              pattern="https?://.+"
              title="Please enter a valid URL starting with http:// or https://"
            />
          </div>
        </div>

        <div class="field">
          <label class="label" for="remarks">Remarks</label>
          <p>
            Please help us better understand the beneficiary's situation, the
            specific brands required and reason. If requesting groceries, please
            include a list of the items needed.
          </p>
          <p>⚠️ Do not disclose any personal data.</p>
          <div class="control">
            <textarea
              class="textarea"
              disabled={isLoading}
              id="remarks"
              bind:value={remarks}
            ></textarea>
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
    {/if}
  </div>
</div>
