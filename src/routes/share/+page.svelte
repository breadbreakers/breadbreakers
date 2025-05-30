<script>
  let name;
  let address;
  let mobile;
  let lift;
  let consent;
  let isLoading = false;
  let success = false;
  let error;

  export let data;

  const partnerEmail = data.partnerEmail;
  const swEmail = data.swEmail;
  const code = data.code;
  let itemId = data.itemId;

  async function handleSubmit(event) {
    event.preventDefault();
    isLoading = true;
    error = "";
    success = false;

    try {
      const response = await fetch("/api/share/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          partnerEmail,
          swEmail,
          name,
          address,
          mobile,
          code,
          lift,
          consent
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send email");
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
    <h2 class="subtitle is-4">Beneficiary Details</h2>

    <p class="mt-4">
      Your are sharing this information with <strong>{partnerEmail}</strong>
    </p>
    <p class="is-size-7 mt-4">{data.requestsData.title}</p>
    <p class="is-size-7 mt-4">{data.requestsData.description}</p>
    {#if success}
      <div class="mt-4 notification is-success">Submitted!</div>
    {:else if error}
      <div class="mt-4 notification is-danger">
        {error}
      </div>
    {/if}

    {#if !success}
      <form class="box mt-4" on:submit|preventDefault={handleSubmit}>
        <div class="field">
          <div class="control">
            <input
              class="input"
              type="hidden"
              bind:value={itemId}
              required
              disabled
            />
          </div>
        </div>

        <div class="field mt-5">
          <label for="name" class="label">Beneficiary Name</label>
          <p class="is-size-7 mb-4">
            E.g. Mr Tan. Does not need to be full name.
          </p>
          <div class="control">
            <input
              id="name"
              class="input"
              type="text"
              bind:value={name}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div class="field mt-5">
          <label for="address" class="label">Address, Unit Number, Postal Code
          </label>
          <p class="is-size-7 mb-4">
            Full address with unit number and postal code.
          </p>
          <div class="control">
            <input
              id="address"
              class="input"
              type="text"
              disabled={isLoading}
              bind:value={address}
              required
            />
          </div>
        </div>

        <div class="field mt-5">
          <label for="lift" class="label">Does unit have lift access?</label>
          <p class="is-size-7 mb-4">
            Required as additional charges may apply to units without lift
            access .
          </p>
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                name="lift"
                value="Yes"
                bind:group={lift}
                disabled={isLoading}
                required
              />
              Yes
            </label>
            <label class="radio">
              <input
                type="radio"
                name="lift"
                value="No"
                bind:group={lift}
                disabled={isLoading}
                required
              />
              No
            </label>
          </div>
        </div>

        <div class="field mt-5">
          <label for="mobile" class="label">Mobile Number</label>
          <p class="is-size-7 mb-4">Required to facilitate deliveries.</p>
          <div class="control">
            <input
              id="mobile"
              class="input"
              type="text"
              disabled={isLoading}
              minlength="8"
              maxlength="8"
              bind:value={mobile}
              required
            />
          </div>
        </div>

        <div class="field mt-5">
          <label class="checkbox">
            <input
              type="checkbox"
              bind:checked={consent}
              disabled={isLoading}
              required
            />
            By providing this information to Bread Breakers Singapore, you consent to the collection and use of the personal data solely for the purpose of facilitating the delivery of items to the intended beneficiary. 
          </label>
        </div>

        <p>All provided data is encrypted at storage and transmission. Data will be permanently deleted once the delivery is completed.</p>

        <div class="field">
          <div class="control mt-5">
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
      <h3 class="is-size-7 mt-4">Item ID {data.itemId}</h3>
    {/if}
  </div>
</div>
