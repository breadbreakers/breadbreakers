<script>
    import Zoom from "svelte-medium-image-zoom";
    import "svelte-medium-image-zoom/dist/styles.css";
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers Singapore | Partner With Us</title>
</svelte:head>

<section class="section">
    <div class="container">
        <h2 class="subtitle has-text-weight-semibold pt-4">Partner With Us</h2>
        <div class="content">
            <p>
                We believe that everyone has a role to play in this work of
                practical compassion, whether through giving, serving, or simply
                showing care.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                🪙 Fund the Mission (Donors)
            </h3>
            <p>
                If you're in a season where you can give financially, <a
                    href="/donate">we invite you to sow into our mission</a
                >. Your donation goes directly into meeting specific, verified
                needs, real people, real items, real impact.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                💪🏻 Execute the Mission (Partners)
            </h3>
            <p>
                If you may not be able to give financially but have time,
                energy, or skills, <a href="https://forms.gle/w5ptTEM3UvxESy5M7"
                    >come join us as an active procurement partner</a
                >. We provide the funds. You help us turn compassion into
                action.
            </p>
            <p>Partners may support in one of two ways:</p>
            <ul>
                <li>
                    <strong>Procurement & Delivery:</strong> Take charge of fulfilling
                    item requests by purchasing and delivering them to beneficiaries
                    on our behalf.
                </li>
                <li>
                    <strong>Adopt a Family:</strong> Commit to supporting a family’s
                    recurring needs (e.g. groceries) over a defined period of time.
                    This arrangement is coordinated in agreement with a supporting
                    social worker to ensure appropriateness and alignment.
                </li>
            </ul>

            <Zoom>
                <img
                    src="/flowchart-simple.png"
                    alt="Flowchart"
                    class="flowchart-image"
                />
            </Zoom>
            <p class="flowchart-info">🔎 Enlarge</p>

            <p>
                Due to our lean, volunteer-led model, individuals serving on the
                Working Group may also directly serve as Partners involved to
                aid procurement and delivery. To maintain strict integrity and
                transparency, a Working Group member acting as a Partner cannot
                approve their own requests, and must be approved by another
                designated member from the Working Group.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
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

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Accountability Matters
            </h3>
            <p>
                Because we are stewarding public donations with transparency and
                care, all partners go through a simple screening and onboarding
                process. This helps ensure that every action taken under the
                Bread Breakers name upholds the trust and integrity we are
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
