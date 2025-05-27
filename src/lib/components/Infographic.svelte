<script>
import CurrencyFormatter from "$lib/components/CurrencyFormat.svelte";

export let beneficiaryCount;
export let nInNeed;
export let balanceN;
</script>

<section class="section">
    <div class="container">
        <div class="columns is-multiline">
            <div class="column">
                <div class="box">
                    <div class="box-content has-text-centered">
                        <h2 class="subtitle is-5">Beneficiaries Impacted</h2>

                        <p class="title is-3 pt-4 pb-2">
                            {beneficiaryCount}
                        </p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="box">
                    <div class="box-content has-text-centered">
                        <h2 class="subtitle is-5">Items In Need</h2>

                        <p class="title is-3 pt-4 pb-2">
                            {nInNeed}
                        </p>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="box">
                    <div class="box-content has-text-centered">
                        <h2 class="subtitle is-5">Waiting to Serve</h2>
                            <p class="title is-3 pt-4 pb-2">
                                <CurrencyFormatter value={balanceN} currency="SGD" locale="en-SG" />
                            </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>