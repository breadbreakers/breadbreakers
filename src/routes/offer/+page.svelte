<script>
  import { onMount } from "svelte";
  import { OFFER_EMAIL, OFFER_SUBJECT } from "$lib/strings";

  export let data;

  let email = "";
  let mailto;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    email = params.get("email") || "";

    mailto = `mailto:${email}?subject=${OFFER_SUBJECT} ${data.requests.title}&body=${OFFER_EMAIL}%0D%0A%0D%0AWarmest regards,%0D%0A%0D%0A--%0D%0A%0D%0A${data.requests.title}%0D%0A${data.requests.description}%0D%0A%0D%0ARef: ${data.requests.id}`;
  });
</script>

<svelte:head>
  <title>Bread Breakers Singapore | Offer Assistance</title>
</svelte:head>

<div class="section">
  <div class="container">
    

    <p class="mb-2"><strong>Item:</strong> {data.requests.title}</p>
    <p class="mb-2"><strong>Description:</strong> {data.requests.description}</p>
    <p class="mb-2"><strong>Contact:</strong> {data.requests.contact_clean}</p>
    <p class="mb-2"><strong>Reference:</strong> {data.requests.id}</p>

    <h2 class="subtitle is-5 has-text-centered mt-6">
      <i class="demo-icon icon-mail">&#xe804;</i><a
        href={mailto}
        class="pr-2 has-text-weight-normal has-text-black has-text-weight-bold">Offer Aid</a
      >
    </h2>
  </div>
</div>
