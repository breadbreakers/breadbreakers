<script>
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabase'
  import 'datatables.net-dt/css/dataTables.dataTables.css'
  import jquery from 'jquery'
  import DataTable from 'datatables.net'

  let items = []
  let tableInitialized = false

  onMount(async () => {
    console.log('Fetching items from Supabase...')
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        code: error.code,
        details: error.details
      })
      return
    }
    console.log('Fetched items:', data)

    items = data

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
          ]
        })
        tableInitialized = true
      }, 100)
    }
  })
</script>

<div class="container mt-5">
  <table id="itemsTable" class="display" style="width:100%"></table>
</div>

<style>
  @import 'datatables.net-dt';
  
  .container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
