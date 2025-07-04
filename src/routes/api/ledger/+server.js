// Only allow sorting on these columns (must match your DB column names)
const allowedColumns = ['description', 'amount', 'contact', 'id'];

// Helper for building global search query
function buildOrSearch(searchValue) {
    const columns = ['description', 'contact', 'id'];
    const filters = columns.map(col => `${col}.ilike.%${searchValue}%`).join(',');
    return filters;
}

// POST: DataTables AJAX (full server-side processing)
export async function POST({ request, locals }) {

    const reqData = await request.json();
    const start = Number(reqData.start) || 0;
    const length = Number(reqData.length) || 10;

    // Sorting
    let sortColumn = 'timestamp'; // default
    let sortDir = 'asc';
    if (reqData.order && reqData.order.length > 0) {
        const orderObj = reqData.order[0];
        const colIdx = orderObj.column;
        sortDir = orderObj.dir === 'desc' ? 'desc' : 'asc';
        if (reqData.columns && reqData.columns[colIdx]) {
            const candidate = reqData.columns[colIdx].data;
            if (allowedColumns.includes(candidate)) {
                sortColumn = candidate;
            }
        }
    }

    // Global search
    const searchValue = reqData.search?.value?.trim();

    let query = locals.supabase
        .from('ledger')
        .select('*', { count: 'exact' });

    if (searchValue) {
        query = query.or(buildOrSearch(searchValue));
    }

    query = query
        .order(sortColumn, { ascending: sortDir === 'asc' })
        .range(start, start + length - 1);

    const { data, count, error } = await query;

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({
        data,
        recordsTotal: count,
        recordsFiltered: count
    }));
}

// GET: For browser/manual testing (optional)
export async function GET({ url }) {
    const start = Number(url.searchParams.get('start')) || 0;
    const length = Number(url.searchParams.get('length')) || 10;
    const searchValue = url.searchParams.get('search')?.trim();
    const orderColIdx = url.searchParams.get('order[0][column]');
    const orderDir = url.searchParams.get('order[0][dir]') === 'desc' ? 'desc' : 'asc';

    // DataTables sends columns as columns[0][data], columns[1][data], etc.
    let sortColumn = 'timestamp'; // default
    if (orderColIdx !== undefined) {
        const colName = url.searchParams.get(`columns[${orderColIdx}][data]`);
        if (allowedColumns.includes(colName)) {
            sortColumn = colName;
        }
    }

    let query = locals.supabase
        .from('ledger')
        .select('*', { count: 'exact' });

    if (searchValue) {
        query = query.or(buildOrSearch(searchValue));
    }

    query = query
        .order(sortColumn, { ascending: orderDir === 'asc' })
        .range(start, start + length - 1);

    const { data, count, error } = await query;

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({
        data,
        recordsTotal: count,
        recordsFiltered: count
    }));
}
