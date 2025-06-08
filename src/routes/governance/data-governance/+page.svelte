<script>
    import BackToTop from "$lib/components/BackToTop.svelte";
</script>

<svelte:head>
    <title>Bread Breakers Singapore | Data Governance</title>
</svelte:head>

<section class="section">
    <div class="container">
        <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
            <ul>
                <li><a href="/">🏠Home</a></li>
                <li><a href="/governance">Governance</a></li>
                <li class="is-active">
                    <a href="./" aria-current="page">Data</a>
                </li>
            </ul>
        </nav>

        <h2 class="subtitle">Data Governance</h2>

        <div class="content">
            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">Purpose</h3>
            <p>
                Our Data Management Policy establishes a framework for
                identifying, classifying, and managing data assets within our
                organization. This policy provides procedures for documenting
                the types and locations of our data and defines ownership and
                accountability. By implementing effective data management
                practices, we aim to enhance governance, protect sensitive
                information, and ensure compliance with the <strong
                    >Personal Data Protection Act (PDPA)</strong
                > and other applicable data protection regulations.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">Scope</h3>
            <p>
                This policy applies to all organization volunteers, employees,
                contractors, and stakeholders. It encompasses the systematic
                identification, classification, and management of all data
                assets. It includes sensitive, personal, confidential, and
                regulated data. Procedures are defined for maintaining an
                accurate, up-to-date data inventory including retention periods,
                sharing agreements, and disposal practices. Compliance is
                mandatory, and exceptions require President approval.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Data Ownership
            </h3>
            <p>
                Bread Breakers Singapore is the designated data owner for all
                data sets. This includes responsibility for data classification,
                security, retention, sharing, and disposal in accordance with
                PDPA and organizational policies.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Safeguards
            </h3>
            <ul>
                <li>Maintain a data inventory.</li>
                <li>Document definitions for each data category.</li>
                <li>Define data owners for all data sets.</li>
                <li>Track the business purpose of each data set.</li>
                <li>Encrypt personal data at rest.</li>
                <li>Classify and track data sensitivity.</li>
                <li>Document data location throughout its lifecycle.</li>
                <li>
                    Integrate data inventory with the organization's asset
                    inventory.
                </li>
                <li>
                    Where possible, log events such as access, modifications,
                    and deletions.
                </li>
                <li>Define and enforce data retention periods.</li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Data Subject Rights
            </h3>
            <p>
                Individuals have the right to access and correct their personal
                data, and to withdraw consent for its use. Requests can be
                submitted to the Data Protection Officer. Responses will be
                provided in accordance with PDPA guidelines.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Breach Notification
            </h3>
            <p>
                Any suspected or confirmed data breach will be reported to the
                Data Protection Officer immediately. If the breach poses a risk
                of significant harm, the PDPC and affected individuals will be
                notified within the mandated timelines.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Policy Maintenance and Review
            </h3>
            <p>
                This policy is reviewed annually, or earlier if required by
                regulatory changes or organizational needs. Reviews ensure that
                data handling practices remain aligned with PDPA and operational
                realities.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Data Inventory
            </h3>
            <p>
                The Administrator (President) has full access to all data.
                Direct database access is disabled by default and temporarily
                enabled for troubleshooting or maintenance. All modification
                activities are logged. OS access is secured via SSH certificates
                and limited to the super administrator.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-medium">
                Roles and Responsibilities by Data Type
            </h3>
            <p>
                To ensure proper accountability and data protection practices,
                the following roles are mapped to each data category:
            </p>
            <ul>
                <li>
                    <strong>Data Protection Officer (DPO):</strong> The President.
                    Oversees data protection strategy, compliance, and responds to
                    PDPA-related requests and incidents.
                </li>
                <li>
                    <strong>Data Stewards:</strong> Partners and volunteers who are
                    responsible for handling beneficiary or member data in their
                    assigned capacity.
                </li>
                <li>
                    <strong>IT Administrator:</strong> Also the President (unless
                    delegated), responsible for secure configuration of storage platforms,
                    encryption, and access control.
                </li>
            </ul>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Data Category</th>
                            <th>Purpose(s) of Collection</th>
                            <th>Source of Data</th>
                            <th>Retention</th>
                            <th>Access Controls</th>
                            <th>Security Measures</th>
                            <th>Asset</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Beneficiary Name / Address / Mobile</td>
                            <td>Delivery of items</td>
                            <td>Social Worker</td>
                            <td>Until delivery completion (automated)</td>
                            <td
                                >Partners: Read-only access for assigned
                                beneficiaries; Admin: full access</td
                            >
                            <td
                                >Encrypted at rest and in transit; CRUD event
                                logging enabled</td
                            >
                            <td
                                >PostgreSQL Database (Hosted on Supabase
                                Platform)</td
                            >
                        </tr>
                        <tr>
                            <td>Donor Email</td>
                            <td>Receipts, communication</td>
                            <td>Donor</td>
                            <td>5 years</td>
                            <td>Gmail account (Admin only)</td>
                            <td>Google MFA; managed by President</td>
                            <td>Gmail</td>
                        </tr>
                        <tr>
                            <td>Member Name / Address / Mobile</td>
                            <td>Administrative filing</td>
                            <td>Members</td>
                            <td>Until membership termination</td>
                            <td>Google Drive (MC access only)</td>
                            <td
                                >Password-protected files; passwords known to
                                President and Secretary only</td
                            >
                            <td>Google Drive</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <BackToTop />
    </div>
</section>

<style>
    .table-container {
        overflow-x: auto;
    }
</style>
