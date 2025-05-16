<script>
  import { onMount } from 'svelte'
</script>

<section class="section">
  <div class="container">
    <h1 class="title is-1 has-text-centered mb-6">
      <i class="fas fa-hand-holding-heart mr-3"></i> About Us
    </h1>

    <div class="box has-background-primary-light mb-6">
      <h2 class="title is-3 has-text-primary">
        <i class="fas fa-eye mr-2"></i> Our Vision
      </h2>
      <p class="subtitle is-5">
        To embody active faith and compassionate stewardship by providing tangible, essential aid with radical transparency, ensuring that the basic needs of the vulnerable and often "invisible" members of our community in Singapore are met directly and effectively.
      </p>
    </div>

    <div class="box has-background-info-light mb-6">
      <h2 class="title is-3 has-text-info">
        <i class="fas fa-bullseye mr-2"></i> Our Mission
      </h2>
      <p class="subtitle is-5">
        To partner with verified social service professionals to identify specific material needs among individuals and families, mobilize community resources through a direct and agile channel to procure these items efficiently and transparently, and deliver them directly to beneficiaries, thereby demonstrating practical love in action and enabling social workers to focus on core casework.
      </p>
    </div>

    <div class="box has-background-warning-light mb-6">
      <h2 class="title is-3 has-text-warning-dark">
        <i class="fas fa-signature mr-2"></i> Our Name
      </h2>
      <p class="subtitle is-5 mb-4">
        "Bread Breakers" carries deep significance, reflecting the very heart of our mission and our ultimate aspiration:
      </p>
      <div class="content">
        <ul>
          <li class="mb-2">
            <strong>Sharing and Provision</strong> - ensuring everyone has their daily bread
          </li>
          <li class="mb-2">
            <strong>The Bread of Life</strong> - extending Christ's love through practical action
          </li>
          <li>
            <strong>Communion and Fellowship</strong> - fostering genuine relationships
          </li>
        </ul>
      </div>
    </div>

    <div class="box has-background-success-light">
      <h2 class="title is-3 has-text-success-dark">
        <i class="fas fa-handshake mr-2"></i> Our Commitment
      </h2>
      <div class="content">
        <ul>
          <li class="mb-2">
            <strong>Radical, Unprecedented Transparency</strong> - Full financial disclosure and accountability
          </li>
          <li class="mb-2">
            <strong>Exceptional Cost-Efficiency & Direct Impact</strong> - Maximizing donor impact
          </li>
          <li class="mb-2">
            <strong>Support for Frontline Workers</strong> - Empowering social workers
          </li>
          <li>
            <strong>Faith in Action & Tangible Love</strong> - Practical expressions of compassion
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

<style>

  .box {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,.05);
  }
  .title {
    margin-bottom: 1.5rem;
  }
</style>
