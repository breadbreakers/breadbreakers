<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Donation Policy</title>
</svelte:head>

<section class="section">
    <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">🏠Home</a></li>
                <li><a href="/governance">Governance</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">Donation Policy</a>
                </li>
            </ul>
        </nav>

        <h2 class="subtitle has-text-weight-semibold pt-4">Donation Policy</h2>
        <div class="content">
            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">How the Donation Process Works</h3>
            
            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Secure Online Donation</h4>
            <ul>
                <li>
                    <strong>Payment Processing</strong> All online donations are processed exclusively through <a href="https://stripe.com/en-sg" class="link" target="_blank">Stripe</a>, a PCI DSS compliant payment gateway that ensures industry-standard security for all transactions.
                </li>
                <li>
                    <strong>Accepted Methods</strong> We accept PayNow, major credit and debit cards via Stripe. To ensure traceability and comply with AML/CFT guidelines, we do not accept anonymous cash donations, cryptocurrency, or unverified third-party transfers.
                </li>
                <li>
                    <strong>Transaction Confirmation</strong> Donors receive an immediate email confirmation from our platform with our official acknowledgment and receipt.
                </li>
            </ul>

            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Fund Allocation & Transparency</h4>
             <p>
                To ensure clarity, all donations are allocated to one of two funds. Donors are required to specify their preference.
            </p>
            <ul>
                <li>
                    <strong>Beneficiary Fund</strong> Used exclusively to support our beneficiaries through direct aid, supplies, and services.
                </li>
                <li>
                    <strong>Operating Fund</strong> Supports essential administrative expenses required to run our programmes. All operating costs are publicly documented.
                </li>
                <li>
                    <strong>Live Updates</strong> Our website provides real time updates on the total funds collected.
                </li>
            </ul>

            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Due Diligence & Aid Disbursement</h4>
            <ul>
                <li>
                    <strong>Beneficiary Verification</strong> We conduct due diligence by verifying all beneficiary needs through social workers. This ensures aid is directed to legitimate cases.
                </li>
                <li>
                    <strong>Internal Approval</strong> Every aid request requires documented approval from the society's President before any funds are disbursed, ensuring proper oversight.
                </li>
                 <li>
                    <strong>Direct, Traceable Delivery</strong> All aid is procured from approved retailers and delivered directly to addresses provided by the respective social worker. We retain proof of delivery for every transaction, which is available in our public financial ledger.
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Duties, Responsibilities & Governance</h3>
            
            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Our Responsibilities</h4>
            <ul>
                <li><strong>Fiduciary Duty</strong> We manage all donated funds with the highest standard of care, ensuring they are used for their intended charitable purposes.</li>
                <li><strong>Data Security</strong> We are committed to protecting donor information. Our platform has security measures in place, and all transaction data is handled securely by Stripe. Audit logging is enabled and access to data requires multi-factor authentication.</li>
                <li><strong>Record Keeping</strong> We maintain complete and proper records of all donations and expenditures for a minimum of five years. These records are reconciled monthly against our public bank statements.</li>
            </ul>

             <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Fees and Charges</h4>
            <p>We are committed to 100% transparency on all costs.</p>
            <ul>
                <li><strong>Stripe Processing Fees</strong> Standard Stripe transaction fees (e.g., 3.4% + $0.50 SGD) are the only fees deducted from donations.
                </li>
                <li><strong>No Administrative Fees</strong> Bread Breakers (SG) charges zero administrative or service fees. 100% of your donation after Stripe's fee goes to the designated fund.</li>
                 <li><strong>Published Expenses</strong> All fees from Stripe and any operational costs are published as line items in our public financial ledger for full transparency.</li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Compliance & Cooperation</h3>
            
            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Regulatory Cooperation</h4>
            <p>
                Bread Breakers (SG) is committed to full cooperation with Singapore's regulatory authorities. We are open to periodic audits and reviews of our systems and processes to ensure they align with the Code of Practice. We will liaise closely with the Commissioner of Charities (COC), the Registry of Societies (ROS), and other relevant bodies as required.
            </p>

            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">AML/CFT Policy</h4>
            <p>
                We have implemented an Anti-Money Laundering and Countering the Financing of Terrorism (AML/CFT) policy. Our measures include donor verification, transaction monitoring, and a strict policy against anonymous donations. For more details, please see our <a target="_blank" class="link" href="/governance/aml-cft">full AML/CFT Policy</a>.
            </p>

            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">General Risk Disclosure</h4>
            <p>
                While we take extensive measures to secure our platform, all online activities carry inherent or residual risks. We encourage donors to be vigilant. Please read our <a class="link" target="_blank" href="/governance/risk-disclosure">General Risk Disclosure Policy</a> for more information.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Donation Terms</h3>

            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Refund & Tax Policy</h4>
            <p>
                All donations made to Bread Breakers (SG) are <strong>non-refundable</strong> once processed, as funds are immediately allocated for our charitable work.
            </p>
            <p>
                As we are not an Institution of a Public Character (IPC), donations are not tax-deductible under Singapore law. 
            </p>

            <h4 class="subtitle is-6 mt-5 has-text-weight-semibold">Contact Us</h4>
            <p>
                If you have any questions about our policies or your donation, please do not hesitate to <a class="link" href="/contact">contact us</a>.
            </p>
        </div>

        <BackToTop />
    </div>
</section>