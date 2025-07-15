<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
    import { faqData } from "./faqData.js";

    let activeIndex = null;

    function toggleAccordion(index) {
        activeIndex = activeIndex === index ? null : index;
    }

    const categories = [...new Set(faqData.map(item => item.category))];
</script>

<svelte:head>
    <title>Bread Breakers (SG) | FAQ</title>
</svelte:head>

<section class="section">
    <div class="container">
        <h2 class="subtitle is-4 has-text-weight-bold pt-4">FAQ</h2>

        <div class="accordion">
            <div class="content">
                {#each categories as category}
                    <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                        {category}
                    </h3>
                    {#each faqData.filter(item => item.category === category) as faq, index}
                        <div class="accordion-item" class:is-active={activeIndex === faqData.indexOf(faq)}>
                            <button
                                type="button"
                                class="accordion-header"
                                on:click={() => toggleAccordion(faqData.indexOf(faq))}
                            >
                                <h3 class="is-size-6 has-text-weight-normal">
                                    {#if activeIndex === faqData.indexOf(faq)}👇🏻{/if}{activeIndex !== faqData.indexOf(faq) ? '👉🏻' : ''} {@html faq.question}
                                </h3>
                            </button>
                            <div class="accordion-content">
                                {@html faq.answer}
                            </div>
                        </div>
                    {/each}
                {/each}
            </div>
        </div>
        <nav class="breadcrumb has-arrow-separator is-centered pt-6" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">Home</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">FAQ</a>
                </li>
            </ul>
        </nav>
        <BackToTop />
    </div>
</section>

<style>
    /* Basic Accordion Styles */
    .accordion .accordion-header {
        background-color: #fff;
        padding: 0.75em 0.75em;
        cursor: pointer;
        border: none;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        text-align: left;
    }

    .accordion .accordion-content {
        padding: 1.25rem;
        border-bottom: 1px solid #dbdbdb;
        display: none;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }

    .accordion .accordion-item.is-active .accordion-content {
        display: block;
    }

    h3 {
        margin: 0;
    }
</style>
