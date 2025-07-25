// Only allow sorting on these columns (must match your DB column names)
const allowedColumns = ['fulfiled', 'item', 'contact', 'id'];

// Helper for building global search query
function buildOrSearch(searchValue) {
    const columns = ['fulfiled', 'item', 'contact', 'id', 'delivery'];
    const filters = columns.map(col => `${col}.ilike.%${searchValue}%`).join(',');
    return filters;
}

// POST: DataTables AJAX (full server-side processing)
export async function POST({ request, locals }) {

    const reqData = await request.json();
    const start = Number(reqData.start) || 0;
    const length = Number(reqData.length) || 10;

    // Sorting
    let sortColumn = 'fulfiled'; // default
    let sortDir = 'asc';
    if (reqData.order && reqData.order.length > 0) {
        const orderObj = reqData.order[0];
        const colIdx = orderObj.column;
        sortDir = orderObj.dir === 'desc' ? 'desc' : 'asc';
        if (reqData.columns?.[colIdx]) {
            const candidate = reqData.columns[colIdx].data;
            if (allowedColumns.includes(candidate)) {
                sortColumn = candidate;
            }
        }
    }

    // Global search
    const searchValue = reqData.search?.value?.trim();

    let query = locals.supabase
        .from('items')
        .select('*', { count: 'exact' });

    if (searchValue) {
        query = query.or(buildOrSearch(searchValue));
    }

    query = query
        .order(sortColumn, { ascending: sortDir === 'asc' })
        .order('id', { ascending: false })
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