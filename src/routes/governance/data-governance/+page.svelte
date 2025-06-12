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
                    <a href="./" aria-current="page">Data Governance</a>
                </li>
            </ul>
        </nav>

        <h2 class="subtitle has-text-weight-semibold pt-4">Data Governance</h2>

        <div class="content">
            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Purpose</h3>
            <p>
                Our Data Management Policy establishes a framework for
                identifying, classifying, and managing data assets within our
                organization. This policy provides procedures for documenting
                the types and locations of our data and defines ownership and
                accountability. By implementing effective data management
                practices, we aim to enhance governance, protect sensitive
                information, and ensure compliance with the Personal Data
                Protection Act (PDPA) and other applicable data protection
                regulations.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Scope</h3>
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

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Data Ownership
            </h3>
            <p>
                Bread Breakers Singapore is the designated data owner for all
                data sets. This includes responsibility for data classification,
                security, retention, sharing, and disposal in accordance with
                PDPA and organizational policies.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">Safeguards</h3>
            <p>The following requirements have been established:</p>
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

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Data Subject Rights
            </h3>
            <p>
                Individuals have the right to access and correct their personal
                data, and to withdraw consent for its use. Requests can be
                submitted to the Data Protection Officer. Responses will be
                provided in accordance with PDPA guidelines.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Breach Notification
            </h3>
            <p>
                Any suspected or confirmed data breach will be reported to the
                Data Protection Officer immediately. If the breach poses a risk
                of significant harm, the PDPC and affected individuals will be
                notified within the mandated timelines.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Policy Maintenance and Review
            </h3>
            <p>
                This policy is reviewed annually, or earlier if required by
                regulatory changes or organizational needs. Reviews ensure that
                data handling practices remain aligned with PDPA and operational
                realities.
            </p>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
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

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Disclosure of Personal Data
            </h3>
            <p>
                We do not sell or rent your personal data to third parties. We
                only disclose personal data when necessary and in compliance
                with PDPA, such as:
            </p>
            <ul>
                <li>
                    Law Enforcement/Regulators: When required by law or a court
                    order, or to cooperate with government bodies.
                </li>
                <li>
                    With Consent: To any other third party with your explicit
                    consent.
                </li>
            </ul>

            <h3 class="subtitle is-6 mt-5 has-text-weight-bold">
                Data Inventory
            </h3>

            <p>
                We collect personal data that is reasonably necessary for our
                operations.
            </p>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Purpose(s) of Collection</th>
                            <th>Source of Data</th>
                            <th>Retention</th>
                            <th>Access Rights</th>
                            <th>Security Measures</th>
                            <th>Asset</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Beneficiary Name, Address, Mobile Number</td>
                            <td>Procurement and delivery of items</td>
                            <td>Social Workers</td>
                            <td>Until delivery completion</td>
                            <td
                                >Partners (only able to access the beneficiaries
                                they are serving)
                            </td>
                            <td
                                >Multi-factor authentication; Database encrypted
                                at rest and in transit; Database change event
                                logging; Row level security policies</td
                            >
                            <td>PostgreSQL Database</td>
                        </tr>
                        <tr>
                            <td>Donor Email</td>
                            <td>Receipts, communication</td>
                            <td>Donation web page</td>
                            <td>5 years</td>
                            <td>President</td>
                            <td
                                >Multi-factor authentication; Database encrypted
                                in transit; Database change event logging</td
                            >
                            <td>PostgreSQL Database</td>
                        </tr>
                        <tr>
                            <td>Partner Name, Mobile Number</td>
                            <td
                                >Notification of request and approvals;
                                Reimbursement via PayNow</td
                            >
                            <td>Partner registration forms</td>
                            <td>Until termination</td>
                            <td>President</td>
                            <td
                                >Multi-factor authentication; Database encrypted
                                in transit; Database change event logging</td
                            >
                            <td>Google Sheets; PostgreSQL Database</td>
                        </tr>
                        <tr>
                            <td>Member Name, Address, Mobile Number</td>
                            <td>Regulatory/administrative filing</td>
                            <td>Member registration forms</td>
                            <td>Until termination</td>
                            <td>President</td>
                            <td>Multi-factor authentication</td>
                            <td>Google Sheets</td>
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
