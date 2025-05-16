<script>
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabase'
  import 'datatables.net-dt/css/dataTables.dataTables.css'
  import jquery from 'jquery'
  import DataTable from 'datatables.net'

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

  onMount(async () => {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .order('id', { ascending: true })

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
          new DataTable('#itemsTable', {
            data: items,
            columns: [
              { title: 'ID', data: 'id' },
              { title: 'Item', data: 'item' },
              { title: 'Verified By', data: 'Verified By' },
              { 
                title: 'Fulfiled', 
                data: 'fulfiled',
                render: (data) => data ? new Date(data).toLocaleDateString() : 'Not fulfilled'
              }
            ],
            responsive: true,
            lengthChange: false
          })
          tableInitialized = true
        }, 100)
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
        <div class="box has-background-primary-light">
          <h2 class="title is-4 has-text-primary">
            <i class="fas fa-users mr-2"></i> Beneficiaries Impacted
          </h2>
          {#if isLoading}
            <progress class="progress is-small is-primary" max="100">Loading...</progress>
          {:else}
            <p class="title is-1 has-text-centered has-text-primary">{beneficiaryCount}</p>
          {/if}
        </div>
      </div>

      <div class="column is-half">
        <div class="box has-background-info-light">
          <h2 class="title is-4 has-text-info">
            <i class="fas fa-file-invoice-dollar mr-2"></i> Bank Statements
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
                  <option value="">Select Month</option>
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

      <div class="column is-12">
        <div>
          <h2 class="title is-4">
            Latest Fulfilled
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
  }
  .title {
    margin-bottom: 1.5rem;
  }
</style>
