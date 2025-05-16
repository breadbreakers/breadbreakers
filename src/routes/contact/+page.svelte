<script>
  import { onMount } from 'svelte'
  let name = ''
  let email = ''
  let subject = ''
  let message = ''
  let isSubmitting = false
  let submitSuccess = false

  function handleSubmit() {
    isSubmitting = true
    // Simulate form submission
    setTimeout(() => {
      isSubmitting = false
      submitSuccess = true
      name = ''
      email = ''
      subject = ''
      message = ''
      setTimeout(() => submitSuccess = false, 3000)
    }, 1000)
  }
</script>

<section class="section">
  <div class="container">
    <h1 class="title is-1 has-text-centered mb-6">
      <i class="fas fa-envelope mr-3"></i> Contact Us
    </h1>

    <div class="columns">
      <div class="column is-half">
        <div class="box has-background-primary-light">
          <h2 class="title is-3 has-text-primary mb-5">
            Send Us a Message
          </h2>
          
          {#if submitSuccess}
            <div class="notification is-success">
              <!-- svelte-ignore a11y_consider_explicit_label -->
              <button class="delete" on:click={() => submitSuccess = false}></button>
              Thank you for your message! We'll get back to you soon.
            </div>
          {/if}

          <form on:submit|preventDefault={handleSubmit}>
            <div class="field">
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label class="label">Name</label>
              <div class="control has-icons-left">
                <input class="input" type="text" bind:value={name} required>
                <span class="icon is-small is-left">
                  <i class="fas fa-user"></i>
                </span>
              </div>
            </div>

            <div class="field">
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label class="label">Email</label>
              <div class="control has-icons-left">
                <input class="input" type="email" bind:value={email} required>
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div class="field">
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label class="label">Subject</label>
              <div class="control has-icons-left">
                <input class="input" type="text" bind:value={subject} required>
                <span class="icon is-small is-left">
                  <i class="fas fa-tag"></i>
                </span>
              </div>
            </div>

            <div class="field">
              <!-- svelte-ignore a11y_label_has_associated_control -->
              <label class="label">Message</label>
              <div class="control">
                <textarea class="textarea" rows="5" bind:value={message} required></textarea>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-primary is-medium is-fullwidth" type="submit" disabled={isSubmitting}>
                  {#if isSubmitting}
                    <span class="icon">
                      <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    <span>Sending...</span>
                  {:else}
                    <span class="icon">
                      <i class="fas fa-paper-plane"></i>
                    </span>
                    <span>Send Message</span>
                  {/if}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="column is-half">
        <div class="box has-background-info-light">
          <h2 class="title is-3 has-text-info mb-5">
            <i class="fas fa-map-marker-alt mr-2"></i> Our Details
          </h2>
          
          <div class="content is-medium">
            <p>
              <span class="icon-text">
                <span class="icon has-text-info">
                  <i class="fas fa-building"></i>
                </span>
                <span><strong>Bread Breakers Singapore</strong></span>
              </span>
              <br>
              <span class="icon-text">
                <span class="icon has-text-info">
                  <i class="fas fa-map-pin"></i>
                </span>
                <span>123 Charity Road, Singapore 123456</span>
              </span>
              <br>
              <span class="icon-text">
                <span class="icon has-text-info">
                  <i class="fas fa-envelope"></i>
                </span>
                <span>contact@breadbreakers.sg</span>
              </span>
              <br>
              <span class="icon-text">
                <span class="icon has-text-info">
                  <i class="fas fa-phone"></i>
                </span>
                <span>+65 6123 4567</span>
              </span>
            </p>

            <hr>

            <h3 class="title is-4 has-text-info">
              <i class="fas fa-clock mr-2"></i> Operating Hours
            </h3>
            <ul>
              <li>Monday - Friday: 9am - 5pm</li>
              <li>Saturday: 9am - 1pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .navbar {
    box-shadow: 0 2px 4px rgba(0,0,0,.1);
  }
  .box {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,.05);
  }
  .title {
    margin-bottom: 1.5rem;
  }
  .icon-text {
    align-items: flex-start;
  }
</style>
