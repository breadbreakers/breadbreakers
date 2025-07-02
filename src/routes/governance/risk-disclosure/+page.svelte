<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Risk Disclosure</title>
</svelte:head>

<section class="section">
    <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">🏠Home</a></li>
                <li><a href="/governance">Governance</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">Risk Disclosure</a>
                </li>
            </ul>
        </nav>

        <h2 class="subtitle has-text-weight-semibold pt-4">General Risk Disclosure</h2>

        <div class="content">
            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Important Notice</h3>
            <p>
                While Bread Breakers (SG) implements robust security measures and transparency 
                protocols, donors should be aware of potential risks associated with online donations 
                and charitable giving. Please read this disclosure carefully before making any contribution.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Online Platform Risks</h3>
            <h4 class="subtitle is-6 mt-4 has-text-weight-semibold">Website Security</h4>
            <ul>
                <li>
                    <strong>Phishing and Fraudulent Sites</strong> Always verify you are on the correct 
                    domain before making donations. Fraudulent sites may impersonate legitimate charities.
                </li>
                <li>
                    <strong>Data Breaches</strong> While we implement industry-standard security measures, 
                    no online platform can guarantee absolute protection against all cyber threats.
                </li>
                <li>
                    <strong>Technical Failures</strong> System outages, server failures, or technical 
                    glitches may temporarily affect donation processing or website accessibility.
                </li>
            </ul>

            <h4 class="subtitle is-6 mt-4 has-text-weight-semibold">Payment Processing</h4>
            <ul>
                <li>
                    <strong>Payment Gateway Risks</strong> We use Stripe as our payment processor. 
                    Transaction failures, processing delays, or gateway outages may occur.
                </li>
                <li>
                    <strong>Unauthorized Transactions</strong> Protect your payment information and 
                    monitor your accounts for unauthorized charges.
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Organizational Risks</h3>
            <h4 class="subtitle is-6 mt-4 has-text-weight-semibold">Operational Continuity</h4>
            <ul>
                <li>
                    <strong>Volunteer Dependency</strong> As a volunteer-led organization, service 
                    delivery may be affected by volunteer availability or capacity constraints.
                </li>
                <li>
                    <strong>Regulatory Changes</strong> Changes in charity regulations or compliance 
                    requirements may affect our operations or service delivery.
                </li>
                <li>
                    <strong>Cessation of Operations</strong> In the unlikely event that Bread Breakers (SG) 
                    ceases operations, remaining funds will be distributed in accordance with our 
                    constitution and applicable laws.
                </li>
            </ul>

            <h4 class="subtitle is-6 mt-4 has-text-weight-semibold">Fund Utilization</h4>
            <ul>
                <li>
                    <strong>Aid Delivery Challenges</strong> External factors such as beneficiary 
                    availability, address changes, or delivery restrictions may affect aid distribution.
                </li>
                <li>
                    <strong>Verification Limitations</strong> While we work with qualified social workers 
                    to verify needs, there may be instances where information provided is incomplete 
                    or circumstances change after verification.
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Legal and Regulatory Risks</h3>
            <ul>
                <li>
                    <strong>Tax Implications</strong> Donations to Bread Breakers (SG) are currently 
                    not tax-deductible as we are not an Institution of a Public Character (IPC).
                </li>
                <li>
                    <strong>Compliance Requirements</strong> Changes in charity law or regulations 
                    may require operational adjustments that could affect service delivery.
                </li>
                <li>
                    <strong>Jurisdictional Limitations</strong> Our services are primarily designed 
                    for Singapore residents and does not apply to international donors or beneficiaries.
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Data Protection Risks</h3>
            <ul>
                <li>
                    <strong>Personal Data Handling</strong> We will endeavour to comply with Singapore's 
                    Personal Data Protection Act (PDPA). Nonetheless, data processing activities carry inherent or residual risks.
                </li>
                <li>
                    <strong>Third-Party Integrations</strong> Our use of third-party services (payment 
                    processors, hosting providers) may expose data to additional risks beyond our direct control.
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">How We Mitigate These Risks</h3>
            <ul>
                <li>
                    <strong>Transparency</strong> All financial transactions are published in real-time 
                    on our public ledger with supporting documentation.
                </li>
                <li>
                    <strong>Verification Processes</strong> We work exclusively with qualified social 
                    workers from registered agencies to verify beneficiary needs.
                </li>
                <li>
                    <strong>Audit Trail</strong> Complete audit logging of all database operations 
                    and retention of all transaction records for regulatory compliance.
                </li>
                <li>
                    <strong>Segregation of Duties</strong> Clear separation between request initiation, 
                    approval, procurement, and delivery processes.
                </li>
                <li>
                    <strong>Regular Reviews</strong> Ongoing assessment of our policies, procedures, 
                    and security measures.
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Donor Responsibilities</h3>
            <p>To minimize risks, donors should:</p>
            <ul>
                <li>Verify they are on the official Bread Breakers (SG) website before donating</li>
                <li>Use secure internet connections when making donations</li>
                <li>Keep records of their donation confirmations</li>
                <li>Monitor their payment accounts for unauthorized transactions</li>
                <li>Report any suspicious activity immediately</li>
                <li>Contact us directly if they have concerns about their donation</li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Contact and Reporting</h3>
            <p>
                If you encounter any issues, suspicious activity, or have concerns about your donation, 
                please <a class="link" href="/contact">contact us</a> immediately. We are committed to 
                addressing all concerns promptly and transparently.
            </p>

            <p>
                <strong>Remember</strong> Never provide personal or financial information through 
                unsolicited emails or phone calls claiming to be from Bread Breakers (SG). 
                We will never request sensitive information outside of our secure donation process.
            </p>
        </div>

        <BackToTop />
    </div>
</section>