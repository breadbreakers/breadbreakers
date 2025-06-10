<svelte:head>
    <title>Bread Breakers Singapore | Offer Assistance</title>
</svelte:head>

<script>
  import { onMount } from "svelte";

  let itemId = "";
  let email = "";
  let subject = "";
  let body = "";
  let isLoading = false;
  let success = false;
  let error = "";

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    itemId = params.get("id") || "";
    email = params.get("email") || "";
    subject = params.get("subject") || "";
    body = params.get("body") || "";
  });

  async function sendEmail() {
    isLoading = true;
    error = "";
    success = false;

    try {
      const response = await fetch("/api/offer/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          email,
          subject,
          body,
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
    <h2 class="subtitle is-4">Send Offer</h2>

    {#if success}
      <div class="notification is-success">Submitted!</div>
    {:else if error}
      <div class="notification is-danger">
        {error}
      </div>
    {/if}

    {#if !success}
    <form class="box" on:submit|preventDefault={sendEmail}>
      <div class="field">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="label">Item ID</label>
        <div class="control">
          <input class="input" type="text" bind:value={itemId} required readonly />
        </div>
      </div>

      <div class="field">
        <label for="swemail" class="label">Social Worker Email</label>
        <div class="control">
          <input class="input" type="email" bind:value={email} required />
        </div>
      </div>

      <div class="field">
        <label for="subject" class="label">Subject</label>
        <div class="control">
          <input class="input" type="text" bind:value={subject} required />
        </div>
      </div>

      <div class="field">
        <label for="body" class="label">Body</label>
        <div class="control">
          <textarea class="textarea" bind:value={body} required></textarea>
        </div>
      </div>

      <div class="field">
        <div class="control mt-4">
          <button class="button is-primary" type="submit" disabled={isLoading}>
            {#if isLoading}
            Sending... <i class="demo-icon icon-spin6 animate-spin">&#xe839;</i>
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
