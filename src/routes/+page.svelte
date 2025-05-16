<script>
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabase'
  import 'datatables.net-dt/css/dataTables.dataTables.css'
  import 'datatables.net-responsive-dt/css/responsive.dataTables.css'
  import jquery from 'jquery'
  import 'datatables.net'
  import 'datatables.net-responsive'
  

  let items = []
  let tableInitialized = false
  let beneficiaryCount = 0
  let isLoading = true
  const MIN_YEAR = 2024
  const MIN_MONTH = 'February' // Must match one of the month names below
  
  let selectedYear = MIN_YEAR
  let selectedMonth = ''
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() // 0-11

  $: {
    // Reset month selection when year changes
    if (selectedYear && selectedMonth) {
      const availableMonths = getAvailableMonths(selectedYear)
      if (!availableMonths.includes(selectedMonth)) {
        selectedMonth = ''
      }
    }
  }

  const getAvailableMonths = (year) => {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ]
    if (year === MIN_YEAR) {
      const minMonthIndex = months.indexOf(MIN_MONTH)
      return months.slice(minMonthIndex) // Show all months from MIN_MONTH to December
    } else if (year === currentYear) {
      return months.slice(0, currentMonth + 1) // Show months up to current month
    }
    return months // Show all months for other years
  }

  const downloadStatement = () => {
    if (!selectedYear || !selectedMonth) return
    const monthIndex = getAvailableMonths(selectedYear).indexOf(selectedMonth) + 1
    const monthPadded = String(monthIndex).padStart(2, '0')
    window.open(`/${selectedYear}/${selectedMonth}.pdf`, '_blank')
  }

  function getDataTableConfig(enableModal) {
    return {
      data: items,
      columns: [
        { title: 'ID', data: 'id', className: 'none dt-left' },
        { title: 'Item', data: 'item', className: 'all', responsivePriority: 1 },
        { 
          title: 'Cost', 
          data: 'Cost',
          render: (data) => data ? `$${parseFloat(data).toFixed(2)}` : '$0.00',
          className: 'none'
        },
        { title: 'Verified By', data: 'Verified By', className: 'all', responsivePriority: 2 },
        { title: 'POC', data: 'POC', className: 'none' },
        { title: 'Fulfiled', 
          data: 'fulfiled',
          render: (data) => data ? new Date(data).toLocaleDateString() : 'Not fulfilled',
          className: 'none'
        }
      ],
      responsive: {
        breakpoints: [
          { name: 'mobile', width: 600 },
          { name: 'desktop', width: Infinity }
        ],
        details: enableModal
          ? {
              display: jquery.fn.dataTable.Responsive.display.modal({
                header: function (row) {
                  var data = row.data();
                  return 'Details for ' + data.item + ' verified by ' + data['Verified By'];
                }
              }),
              renderer: jquery.fn.dataTable.Responsive.renderer.tableAll({
                tableClass: 'table'
              })
            }
          : false
      },
      lengthChange: false,
      searching: false,
      order: [[5, 'desc']] // Sort by Fulfiled column (index 5) descending
    }
  }

  let dtInstance = null;
  let lastEnableModal = null;

  function initDataTable(enableModal) {
    if (dtInstance) {
      dtInstance.destroy();
      jquery('#itemsTable').empty();
    }
    dtInstance = jquery('#itemsTable').DataTable(getDataTableConfig(enableModal));
    lastEnableModal = enableModal;
  }

  onMount(async () => {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .order('fulfiled', { descending: true })

      // First get one item to check available columns
      const { data: sampleItem, error: sampleError } = await supabase
        .from('items')
        .select('*')
        .limit(1)
        .single()

      if (sampleError) {
        console.error('Error checking items table:', sampleError)
        beneficiaryCount = 0
      } else {
        // Use whatever column exists that identifies beneficiaries
        const beneficiaryColumn = sampleItem.beneficiary_id ? 'beneficiary_id' : 
                                sampleItem.beneficiary ? 'beneficiary' : 
                                sampleItem.client_id ? 'client_id' : 'id'
        
        const { count, error: countError } = await supabase
          .from('items')
          .select(beneficiaryColumn, { count: 'exact', head: true })

        beneficiaryCount = countError ? 0 : count
      }

      if (itemsError) throw itemsError
      items = itemsData

      if (!tableInitialized) {
        setTimeout(() => {
          const enableModal = window.innerWidth <= 600;
          initDataTable(enableModal);
          tableInitialized = true;
        }, 100);
        window.addEventListener('resize', () => {
          const enableModal = window.innerWidth <= 600;
          if (enableModal !== lastEnableModal) {
            initDataTable(enableModal);
          }
        });
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      isLoading = false
    }
  })
</script>

<section class="section">
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-half">
        <div class="box">
          <div class="box-content has-text-centered">
            <h2 class="title is-5" style="color:#1a237e;">
              <i class="fas fa-users mr-2"></i> Beneficiaries Impacted
            </h2>
            {#if isLoading}
              <progress class="progress is-small is-primary" max="100">Loading...</progress>
            {:else}
              <p class="title is-1 has-text-centered" style="color:#1a237e; font-size:2.8rem; font-weight:700; margin-bottom:0;">{beneficiaryCount}</p>
            {/if}
          </div>
        </div>
      </div>

      <div class="column is-half">
        <div class="box">
          <div class="box-content">
            <h2 class="title is-5 has-text-info">
              <i class="fas fa-file-invoice-dollar mr-2"></i> Statements
            </h2>
            <div class="field is-grouped">
              <div class="control is-expanded">
                <div class="select is-fullwidth">
                  <select bind:value={selectedYear}>
                    <option value={MIN_YEAR}>{MIN_YEAR}</option>
                    <option value={currentYear}>{currentYear}</option>
                  </select>
                </div>
              </div>
              <div class="control is-expanded">
                <div class="select is-fullwidth">
                  <select bind:value={selectedMonth} disabled={!selectedYear}>
                    <option value="">Month</option>
                    {#if selectedYear}
                      {#each getAvailableMonths(selectedYear) as month}
                        <option value={month}>{month}</option>
                      {/each}
                    {/if}
                  </select>
                </div>
              </div>
            </div>
            <button 
              class="button is-info is-fullwidth" 
              on:click={downloadStatement}
              disabled={!selectedYear || !selectedMonth}
            >
              <i class="fas fa-download mr-2"></i> Download
            </button>
          </div>
        </div>
      </div>

      <div class="column is-12">
        <div>
          <h2 class="title is-5">
            ✨ Latest Items Fulfilled
          </h2>
          <div class="table-container">
            <table id="itemsTable" class="table is-fullwidth is-striped is-hoverable"></table>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .box {
    min-height: 185px;
    margin-bottom: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid #e0e3e7;
    height: 100%;
    padding: 1.25rem 1.5rem !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .box-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
  }
  .box-content h2 {
    margin-bottom: 1.25rem;
    width: 100%;
  }
  .box-content .field.is-grouped {
    width: 100%;
    justify-content: flex-start;
  }
  .box-content .button {
    margin-top: 1.25rem;
  }
  .columns {
    gap: 2rem 0;
    align-items: stretch;
  }
  .table-container {
    margin-top: 1.5rem;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    background: var(--color-surface);
    padding: 0.5rem 0.5rem 0 0.5rem;
  }
  .field.is-grouped {
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .select select {
    min-width: 100px;
    font-size: 1.05rem;
    padding-right: 2rem;
  }
  .title {
    margin-bottom: 1.5rem;
  }

  /* DataTables custom styling for world-class look */
  :global(.dataTables_wrapper) {
    font-family: 'Inter', system-ui, sans-serif;
    color: var(--color-text);
    background: none;
    margin-top: 0.5rem;
  }
  :global(.dataTables_filter label) {
    font-size: 1rem;
    color: var(--color-text);
    font-weight: 500;
  }
  :global(.dataTables_filter input) {
    border-radius: var(--radius-md);
    border: 1px solid #e0e3e7;
    background: #f8fafc;
    padding: 0.4rem 0.8rem;
    font-size: 1rem;
    margin-left: 0.5rem;
    outline: none;
    transition: border 0.18s;
  }
  :global(.dataTables_filter input:focus) {
    border: 1.5px solid var(--color-primary);
    background: #fff;
  }
  :global(.dataTables_paginate) {
    margin-top: 1rem;
    text-align: center;
  }
  :global(.dataTables_paginate .paginate_button) {
    border-radius: var(--radius-md);
    border: none !important;
    background: #f0f4f8 !important;
    color: var(--color-text) !important;
    margin: 0 0.15rem;
    padding: 0.35em 0.85em;
    font-weight: 500;
    transition: background 0.18s, color 0.18s;
    box-shadow: none !important;
  }
  :global(.dataTables_paginate .paginate_button.current),
  :global(.dataTables_paginate .paginate_button:hover) {
    background: var(--color-primary) !important;
    color: #fff !important;
  }
  :global(.dataTables_info) {
    color: var(--color-muted);
    font-size: 0.98rem;
    margin-top: 0.5rem;
  }
  :global(.dataTables_length),
  :global(.dataTables_length label),
  :global(.dataTables_length select) {
    display: none !important;
  }
  /* Force all columns to be visible on desktop, allow hiding only on mobile */
  @media (min-width: 601px) {
    :global(table.dataTable td.dtr-hidden),
    :global(table.dataTable th.dtr-hidden) {
      display: table-cell !important;
    }
  }
</style>
