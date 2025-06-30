<script>
    import Zoom from "svelte-medium-image-zoom";
    import "svelte-medium-image-zoom/dist/styles.css";
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Partner With Us</title>
</svelte:head>

<section class="section">
    <div class="container">
        <h2 class="subtitle has-text-weight-semibold pt-4 is-4">Partner With Us</h2>
        <div class="content">
            <p>
                We believe that everyone has a role to play in this work of
                practical compassion, whether through giving, serving, or simply
                showing care.
            </p>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                🪙 Fund the Mission (Donors)
            </h3>
            <p>
                If you're in a season where you can give financially, <a class="link" 
                    href="/donate">we invite you to sow into our mission</a
                >. Your donation goes directly into meeting specific, verified
                needs, real people, real items, real impact.
            </p>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                💪🏻 Execute the Mission (Partners)
            </h3>
            <p>
                If you may not be able to give financially but have time,
                energy, or skills, <a class="link" href="https://forms.gle/w5ptTEM3UvxESy5M7"
                    >come join us as an active procurement partner</a
                >. We provide the funds. You help us turn compassion into
                action.
            </p>
            <p>Partners may support in one of two ways:</p>
            <div class="columns">
                <div class="column">
                    <strong>1. Procurement & Delivery</strong>
                    <p class="mt-4">Take charge of fulfilling
                    item requests by purchasing and delivering them to beneficiaries
                    on our behalf.</p>
                    <Zoom>
                <enhanced:img
                    src="$lib/images/flowchart.png"
                    alt="Flowchart"
                    class="flowchart-image"
                />
            </Zoom>
            <p class="flowchart-info">🔎 Enlarge</p>
                </div>
                <div class="column">
                    <strong>2. Adopt a Family</strong>
                    <p class="mt-4">Commit to supporting a family’s
                    recurring needs (e.g. groceries) over a defined period of time.
                    This arrangement is coordinated in agreement with a supporting
                    social worker to ensure appropriateness and alignment.</p>
                    <Zoom>
                <enhanced:img
                    src="$lib/images/flowchart-adopt.png"
                    alt="Flowchart"
                    class="flowchart-image"
                />
            </Zoom>
            <p class="flowchart-info">🔎 Enlarge</p>
                </div>
            </div>

            <p>
                Due to our lean, volunteer-led model, individuals serving on the
                Working Group may also directly serve as Partners involved to
                aid procurement and delivery. To maintain strict integrity and
                transparency, a Working Group member acting as a Partner cannot
                approve their own requests, and must be approved by another
                designated member from the Working Group.
            </p>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                🙏🏻 Minister the Mission (Encouragers)
            </h3>
            <p>
                Not all help needs to be physical or financial. If you have a
                heart to encourage, you can serve as someone who sends messages
                of hope, encouragement, and dignity after a delivery is made.
            </p>
            <p>
                These simple acts of kindness remind our beneficiaries that they
                are not alone, and they are deeply valued and loved by God.
            </p>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Accountability Matters
            </h3>
            <p>
                Because we are stewarding public donations with transparency and
                care, all partners go through a simple screening and onboarding
                process. This helps ensure that every action taken under the
                Bread Breakers (SG) name upholds the trust and integrity we are
                committed to.
            </p>
        </div>
        <BackToTop />
    </div>
</section>

<style>
    .flowchart-image {
        max-width: 100%;
        height: auto;
    }

    .flowchart-info {
        text-align: center;
        font-size: 0.8em;
        margin-top: 0.5em;
    }

    @media (max-width: 600px) {
        .flowchart-image {
            width: 80%;
            display: block;
            margin: 0 auto;
        }
    }
</style>
