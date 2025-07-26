<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers (SG) | Data Management Policy</title>
</svelte:head>

<section class="section">
    <div class="container">

        <h2 class="subtitle is-4 has-text-weight-bold pt-4">
            Data Management Policy
        </h2>

        <div class="content">
            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">Purpose</h3>
            <p>
                This policy establishes a framework for identifying,
                classifying, and managing data assets to ensure proper
                governance, protection, and regulatory compliance.
            </p>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">Scope</h3>
            <p>
                Applies to all Bread Breakers (SG) stakeholders. Covers all
                data assets including sensitive and regulated data, requiring
                adherence to inventory, retention, and disposal practices.
            </p>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Data Ownership
            </h3>
            <p>
                Bread Breakers (SG) is the data owner and is accountable
                for classification, protection, and retention aligned with PDPA
                and internal policies.
            </p>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
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
                    <strong>Data Custodian:</strong> President / President appointed member  — responsible
                    for storage, access control
                </li>
            </ul>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Data Inventory
            </h3>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Data Types</th>
                            <th>Purpose</th>
                            <th>Retention</th>
                            <th>Access Control</th>

                            <th>Storage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Beneficiary</td>
                            <td>Delivery Address (other contact information is only requested on a need-to basis)</td>
                            <td>Logistics coordination and delivery</td>
                            <td>Until delivery completion</td>
                            <td>Assigned Partners only</td>
          
                            <td>Database</td>
                        </tr>
                        <tr>
                            <td>Donor</td>
                            <td>Email</td>
                            <td>Receipts, donation follow-up</td>
                            <td>5 years</td>
                            <td>Data Custodian</td>

                            <td>Database</td>
                        </tr>
                        <tr>
                            <td>Partner/Volunteer</td>
                            <td>Name, Contact Number</td>
                            <td>Notifications, payment handling</td>
                            <td>Until notice of termination</td>
                            <td>Data Custodian</td>
                            <td>Database</td>
                        </tr>
                        <tr>
                            <td>Member</td>
                            <td>Name, Address, Contact Info</td>
                            <td>Regulatory compliance</td>
                            <td>Until membership ends</td>
                            <td>Data Custodian</td>
                            <td>Internal Admin Spreadsheet</td>
                        </tr>
                        <tr>
                            <td>Transactions</td>
                            <td>Procurement, delivery data</td>
                            <td>Proof of aid</td>
                            <td>5 years</td>
                            <td>Data Custodian</td>
                            <td>Database</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="subtitle is-5 mt-5 has-text-weight-bold">
                Policy Review
            </h3>
            <p>
                Reviewed annually or as needed to reflect changes in operations
                or regulation.
            </p>
        </div>
        <nav class="breadcrumb has-arrow-separator is-centered pt-5" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/governance">Governance</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">Data Management Policy</a>
                </li>
            </ul>
        </nav>
        <BackToTop />
    </div>
</section>

<style>
    .table-container {
        overflow-x: auto;
    }
</style>
