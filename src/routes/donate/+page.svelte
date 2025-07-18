<script>
    import CurrencyFormatter from "$lib/components/CurrencyFormat.svelte";

    let amount = "";
    let recurring = false;
    let presetAmounts = [10, 25, 50, 100, 200];
    let paymentType = "card"; // Default to card
    let totalAmount = 0;
    let operatingFundTarget = 1;
    let singaporeConfirmed = false;

    export let data;

    function handlePreset(amountValue) {
        amount = amountValue;
    }

    function calculateTotal(amount) {
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            totalAmount = 0;
            return;
        }

        totalAmount = amount;

        totalAmount = parseFloat(totalAmount.toFixed(2));
    }

    $: calculateTotal(amount, paymentType);
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Donate</title>
</svelte:head>

<section class="section">
    <div class="container">
        <h2 class="subtitle is-4 has-text-weight-bold">🎁 Donate</h2>
        <div class="notification is-warning is-light">
            Bread Breakers (SG) will never solicit or accept donations through
            any channels other than this official donate webpage. We do not
            accept donations via direct bank transfers, cryptocurrency, or any
            quasi-currency platforms. To ensure the security and transparency of
            your contribution, always donate exclusively through the designated
            form on this page.
        </div>

        {#if data.beneFund < data.targetDonation}
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
                    {#each presetAmounts as preset (preset)}
                        <button
                            class="button is-info is-light is-fullwidth"
                            type="button"
                            on:click={() => handlePreset(preset)}
                            >${preset}</button
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

                <div class="field">
                    <label for="fund" class="label">Fund</label>
                    <div class="control">
                        <div class="select is-fullwidth">
                            <select name="fund" id="type" required>
                                {#if data.beneFund < data.targetDonation}
                                    <option value="mission" selected
                                        >Beneficary Fund</option
                                    >
                                {/if}
                                {#if data.operatingFund < operatingFundTarget}
                                    <option value="operating"
                                        >Operating Fund</option
                                    >
                                {/if}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label for="email" class="label">Email address</label>
                    <div class="control">
                        <input
                            class="input"
                            type="email"
                            name="email"
                            required
                        />
                    </div>
                </div>

                <input type="hidden" name="recurring" value={recurring} />
                <input type="hidden" name="amount" value={totalAmount} />
                <div class="field mt-4">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            bind:checked={singaporeConfirmed}
                            required
                        />
                        My billing address is in Singapore and I am a resident or
                        PR.
                    </label>
                </div>
                <button
                    class="button is-fullwidth is-info mt-4"
                    type="submit"
                    disabled={!singaporeConfirmed}
                    >Coming Soon</button
                >
            </form>
        {:else}
            <div class="notification is-success is-light">
                <p>Thank you for your incredible support!</p>
                <p></p>
                <p>Our current funding goals have been met.</p>
                <p>
                    We’re committed to collecting only what’s necessary. Nothing
                    more.
                </p>
            </div>
        {/if}
        <hr>
        <div class="content mt-4 is-size-6">
            <p class="mb-4">These are the current fundraising goals:</p>

            <strong>Beneficiary Fund</strong>
            <div class="is-flex is-justify-content-space-between">
                Raised:
                <CurrencyFormatter
                    value={data.beneFund}
                    currency="SGD"
                    locale="en-SG"
                />
            </div>
            <div class="is-flex is-justify-content-space-between">
                Target:
                <CurrencyFormatter
                    value={data.targetDonation}
                    currency="SGD"
                    locale="en-SG"
                />
            </div>
            <progress
                class="progress is-primary mt-2"
                value={data.beneFund}
                max={data.targetDonation}
            >
            </progress>

            <strong>Operating Fund</strong>
            <div class="is-flex is-justify-content-space-between">
                Raised:
                <CurrencyFormatter
                    value={data.operatingFund}
                    currency="SGD"
                    locale="en-SG"
                />
            </div>
            <div class="is-flex is-justify-content-space-between">
                Target:
                <CurrencyFormatter
                    value={operatingFundTarget}
                    currency="SGD"
                    locale="en-SG"
                />
            </div>
            <progress
                class="progress is-primary mt-2"
                value={data.operatingFund}
                max="1"
            >
            </progress>

            <p><em>Operating Expenses</em></p>
            <ul>
                <li>
                    Rental: <CurrencyFormatter
                        value="0"
                        currency="SGD"
                        locale="en-SG"
                    /> (Made possible through
                    <a
                        class="link"
                        target="_blank"
                        rel="noopener"
                        href="https://mystorytreasury.com">My Story Treasury</a
                    >)
                </li>
                <li>Domain name: $50.00/year</li>
                <li>
                    IT infrastructure: $0.00 (Currently within free-tier limits)
                </li>
            </ul>
            <hr>
            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Tax Exemptions
            </h3>
            <p>
                Donations made to us are currently not tax-deductible. This is
                because we are not an Institution of a Public Character (IPC).
                Achieving IPC status requires a significant track record of good
                governance and charitable work, which we will diligently build
                towards. Your generosity, even without tax exemption, makes an
                immediate and tangible difference.
            </p>
            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">Our Funds</h3>
            <p>
                We operate with two distinct funds to ensure clarity and
                accountability. The Beneficiary Fund is used solely to procure
                and deliver essential items directly to individuals and families
                in need. Every dollar goes toward verified, tangible needs. The
                Operating Fund supports the behind-the-scenes infrastructure
                that makes our work possible, covering necessary expenses such
                as logistics, technology, and basic administrative support. This
                separation ensures that donations are used purposefully and
                transparently, whether for direct aid or sustaining the means to
                deliver it.
            </p>
            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Processing Fees
            </h3>
            <p>
                We use <a class="link" href="https://stripe.com/en-sg">Stripe</a
                > as our payment processor to ensure your donation is handled securely
                and efficiently.
            </p>
            <ul>
                <li>
                    Donations made by credit or debit card are subject to a
                    processing fee of 3.4% + S$0.50 per transaction.
                </li>
                <li>
                    Donations made via PayNow are subject to a processing fee of
                    1.3% per transaction.
                </li>
                <li>
                    For recurring donations, only credit or debit card payments
                    are accepted at this time.
                </li>
            </ul>
            <p>
                Please note that processing fees are <a
                    class="link"
                    href="https://stripe.com/en-sg/pricing"
                    >deducted by Stripe</a
                > and help cover the cost of secure payment handling. Your support
                is greatly appreciated!
            </p>
        </div>
    </div>
</section>
