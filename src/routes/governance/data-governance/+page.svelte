<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Data Management Policy</title>
</svelte:head>

<section class="section">
    <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">🏠Home</a></li>
                <li><a href="/governance">Governance</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">Data Management Policy</a>
                </li>
            </ul>
        </nav>

        <h2 class="subtitle has-text-weight-semibold pt-4">
            Data Management Policy
        </h2>

        <div class="content">
            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Purpose</h3>
            <p>
                This policy establishes a framework for identifying,
                classifying, and managing data assets to ensure proper
                governance, protection, and regulatory compliance.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Scope</h3>
            <p>
                Applies to all Bread Breakers (SG) stakeholders. Covers all
                data assets including sensitive and regulated data, requiring
                adherence to inventory, retention, and disposal practices.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Data Ownership
            </h3>
            <p>
                Bread Breakers (SG) is the data owner and is accountable
                for classification, protection, and retention aligned with PDPA
                and internal policies.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Safeguards</h3>
            <ul>
                <li>Maintain data inventory</li>
                <li>Define categories and data owners</li>
                <li>Track purposes, sensitivity, location</li>
                <li>Encrypt personal data at rest</li>
                <li>Log access and changes where possible</li>
                <li>Align data and asset inventories</li>
                <li>Enforce data retention rules</li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Roles and Responsibilities
            </h3>
            <ul>
                <li>
                    <strong>Data Protection Officer:</strong> President — ensures
                    compliance and handles requests
                </li>
                <li>
                    <strong>Data Stewards:</strong> Partners and volunteers — manage
                    data in their duties
                </li>
                <li>
                    <strong>IT Administrator:</strong> President or delegate — responsible
                    for storage, access control
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Data Inventory
            </h3>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Person Type</th>
                            <th>Data Types</th>
                            <th>Purpose</th>
                            <th>Retention</th>
                            <th>Access Control</th>
                            <th>Security Measures</th>
                            <th>Storage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Beneficiary</td>
                            <td>Delivery Address</td>
                            <td>Logistics coordination and delivery</td>
                            <td>Until delivery completion</td>
                            <td>Assigned Partners only</td>
                            <td
                                >Self-disappearing messages (7 days), MFA, Row-level
                                security</td
                            >
                            <td>Secure Database</td>
                        </tr>
                        <tr>
                            <td>Donor</td>
                            <td>Email</td>
                            <td>Receipts, donation follow-up</td>
                            <td>5 years</td>
                            <td>Management Commitee</td>
                            <td>Encryption in transit, Event logging, MFA</td>
                            <td>Secure Database</td>
                        </tr>
                        <tr>
                            <td>Partner</td>
                            <td>Name, Contact Number</td>
                            <td>Notifications, payment handling</td>
                            <td>Until volunteer termination</td>
                            <td>Management Committee</td>
                            <td>Access-controlled, MFA</td>
                            <td>Internal Admin Spreadsheet + Database</td>
                        </tr>
                        <tr>
                            <td>Member</td>
                            <td>Name, Address, Contact Info</td>
                            <td>Regulatory compliance</td>
                            <td>Until membership ends</td>
                            <td>President</td>
                            <td>MFA, limited admin access</td>
                            <td>Internal Admin Spreadsheet</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Policy Review
            </h3>
            <p>
                Reviewed annually or as needed to reflect changes in operations
                or regulation.
            </p>
        </div>

        <BackToTop />
    </div>
</section>

<style>
    .table-container {
        overflow-x: auto;
    }
</style>
