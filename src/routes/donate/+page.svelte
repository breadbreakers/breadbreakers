<script>
    import CurrencyFormatter from "$lib/components/CurrencyFormat.svelte";

    let amount = "";
    let recurring = false;
    let presetAmounts = [10, 25, 50, 100];
    let selectedAmount = null;
    let paymentType = "card"; // Default to card
    let totalAmount = 0;

    function handlePreset(amountValue) {
        selectedAmount = amountValue;
        amount = amountValue;
    }

    function calculateTotal(amount, paymentType) {
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            totalAmount = 0;
            return;
        }

        /*if (paymentType === "card") {
            totalAmount = amount * 1.034 + 0.5;
        } else if (paymentType === "paynow") {
            totalAmount = amount * 1.013;
        } else {
            totalAmount = amount;
        }*/

        totalAmount = parseFloat(totalAmount.toFixed(2));
    }

    $: calculateTotal(amount, paymentType);
</script>

<section class="section">
    <div class="container">
        <h2 class="subtitle is-5 has-text-weight-semibold">🎁 Donate</h2>
        <form method="POST" action="/api/donate">
            <div class="field">
                <div class="field-body">
                    <div class="field is-grouped">
                        <label class="label">
                            <input
                                class="radio"
                                type="radio"
                                bind:group={recurring}
                                value={false}
                                checked
                            />
                            One-time
                        </label>
                        <label class="label">
                            <input
                                class="radio"
                                type="radio"
                                bind:group={recurring}
                                value={true}
                            />
                            Monthly
                        </label>
                    </div>
                </div>
            </div>

            <div class="field is-grouped">
                {#each presetAmounts as preset}
                    <button
                        class="button is-info is-light is-fullwidth"
                        type="button"
                        on:click={() => handlePreset(preset)}>{preset}</button
                    >
                {/each}
            </div>

            <div class="field">
                <div class="control">
                    <input
                        class="input"
                        type="number"
                        bind:value={amount}
                        min="1"
                        placeholder="Custom amount"
                        required
                    />
                </div>
            </div>

            <!--<div class="field">
                <div class="field-body">
                    <div class="field is-grouped">
                        <label class="label">
                            <input
                                class="radio"
                                type="radio"
                                value="card"
                                bind:group={paymentType}
                            />
                            Credit Card
                        </label>
                        <label class="label">
                            <input
                                class="radio"
                                type="radio"
                                value="paynow"
                                bind:group={paymentType}
                            />
                            PayNow
                        </label>
                    </div>
                </div>
            </div>

            <div class="field">
                <p class="is-size-6 has-text-weight-semibold">Total Amount: <CurrencyFormatter
                            value={totalAmount}
                            currency="SGD"
                            locale="en-SG"
                        /></p>
            </div>-->

            <input type="hidden" name="recurring" value={recurring} />
            <input type="hidden" name="amount" value={totalAmount} />

            <button
                class="button is-fullwidth is-warning is-light mt-4"
                type="submit">Donate</button
            >
            <p class="has-text-centered">Still in development. Payments will not go through.</p>
            <div class="content mt-4 is-size-7">
                <p>
                    We use <a href="https://stripe.com/en-sg">Stripe</a> as our payment processor to ensure your
                    donation is handled securely and efficiently.
                </p>
                <ul>
                    <li>
                        Donations made by credit or debit card are subject to a
                        processing fee of 3.4% + S$0.50 per transaction.
                    </li>
                    <li>
                        Donations made via PayNow are subject to a processing
                        fee of 1.3% per transaction.
                    </li>
                    <li>
                        For recurring donations, only credit or debit card
                        payments are accepted at this time.
                    </li>
                </ul>
                <p>
                    Please note that processing fees are <a
                        href="https://stripe.com/en-sg/pricing"
                        >deducted by Stripe</a
                    > and help cover the cost of secure payment handling. Your support
                    is greatly appreciated!
                </p>
            </div>
        </form>
    </div>
</section>

<style>
    a {
        text-decoration: underline;
    }
</style>
