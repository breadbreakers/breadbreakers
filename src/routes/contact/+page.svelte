<script>
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";

  let name = "";
  let email = "";
  let message = "";
  let status = "";
  let csrfToken = "";

  // Fetch CSRF token on mount
  onMount(async () => {
    const res = await fetch("/api/csrf");
    const data = await res.json();
    csrfToken = data.csrfToken;
  });

  async function handleSubmit() {
    status = "submitting";

    // Generate reCAPTCHA token
    const recaptchaToken = await grecaptcha.execute(
      "6LeWZmErAAAAAJTf7_XmRU4Kl5uzi21akB_h5N2E",
      { action: "submit" },
    );

    console.log("Generated reCAPTCHA token:", recaptchaToken); 

    const response = await fetch("/api/contact/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        recaptchaToken,
        csrfToken,
      }),
    });

    const result = await response.json();
    console.log("API response:", result);

    if (result.success) {
      status = "success";
      name = "";
      email = "";
      message = "";
      invalidateAll();
    } else {
      status = "error";
    }
  }
</script>

<svelte:head>
  <title>Bread Breakers Singapore | Contact Us</title>
  <script
    src="https://www.google.com/recaptcha/api.js?render=6LeWZmErAAAAAJTf7_XmRU4Kl5uzi21akB_h5N2E"
  ></script>
</svelte:head>

<section class="section">
  <div class="container">
    <h2 class="subtitle is-5 has-text-weight-semibold">Contact Us</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label class="label" for="name">Name</label>
        <div class="control">
          <input
            class="input"
            type="text"
            id="name"
            bind:value={name}
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control">
          <input
            class="input"
            type="email"
            id="email"
            bind:value={email}
            required
          />
        </div>
      </div>

      <div class="field">
        <label class="label" for="message">Message</label>
        <div class="control">
          <textarea class="textarea" id="message" bind:value={message} required
          ></textarea>
        </div>
      </div>

      {#if status !== "success"}
        <div class="field">
          <div class="control">
            <button
              class="button is-primary is-fullwidth is-info"
              type="submit"
              disabled={status === "submitting"}
            >
              {#if status === "submitting"}
                Submitting...
              {:else}
                Submit
              {/if}
            </button>
          </div>
        </div>
      {/if}
    </form>

    {#if status === "success"}
      <div class="notification is-success mt-3 has-text-centered">
        Message sent successfully!
      </div>
    {:else if status === "error"}
      <div class="notification is-danger">
        There was an error sending your message. Please try again.
      </div>
    {/if}
  </div>
</section>
