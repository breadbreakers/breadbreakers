<script>
  import { invalidateAll } from '$app/navigation';
  let name = '';
  let email = '';
  let message = '';
  let status = '';

  async function handleSubmit() {
    status = 'submitting';
    const response = await fetch('/api/contact/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();

    if (result.success) {
      status = 'success';
      name = '';
      email = '';
      message = '';
      invalidateAll();
    } else {
      status = 'error';
    }
  }
</script>

<svelte:head>
  <title>Contact</title>
  <meta name="description" content="Contact us" />
</svelte:head>

<section class="section">
  <div class="container">
     <h2 class="subtitle is-5 has-text-weight-semibold">Contact Us</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label class="label" for="name">Name</label>
        <div class="control">
          <input class="input" type="text" id="name" bind:value={name} required>
        </div>
      </div>

      <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control">
          <input class="input" type="email" id="email" bind:value={email} required>
        </div>
      </div>

      <div class="field">
        <label class="label" for="message">Message</label>
        <div class="control">
          <textarea class="textarea" id="message" bind:value={message} required></textarea>
        </div>
      </div>

      {#if status !== 'success'}
      <div class="field">
        <div class="control">
          <button class="button is-primary is-fullwidth is-primary" type="submit" disabled={status === 'submitting'}>
            {#if status === 'submitting'}
              Submitting...
            {:else}
         
              Submit
            
            {/if}
          </button>
        </div>
      </div>
      {/if}
    </form>

    {#if status === 'success'}
      <div class="notification is-success mt-3 has-text-centered">
        Message sent successfully!
      </div>
    {:else if status === 'error'}
      <div class="notification is-danger">
        There was an error sending your message. Please try again.
      </div>
    {/if}
  </div>
</section>
