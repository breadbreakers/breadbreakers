const allowedColumns = ['date', 'title', 'contact_clean', 'description', 'id', 'votes'];

// Extract sort info from DataTables request
function getSortInfo(reqData) {
    let sortColumn = 'date';
    let sortDir = 'asc';

    if (reqData.order && reqData.order.length > 0) {
        const orderObj = reqData.order[0];
        const colIndex = orderObj.column;
        sortDir = orderObj.dir === 'desc' ? 'desc' : 'asc';
        if (reqData.columns && reqData.columns[colIndex]) {
            const candidate = reqData.columns[colIndex].data;
            if (allowedColumns.includes(candidate)) {
                sortColumn = candidate;
            }
        }
    }

    return { sortColumn, sortDir };
}

// Helper for building global search query
function buildOrSearch(searchValue) {
    const columns = ['id', 'title', 'contact_clean', 'description'];
    const filters = columns.map(col => `${col}.ilike.%${searchValue}%`).join(',');
    return filters;
}

// POST handler
export async function POST({ request, locals }) {
    const reqData = await request.json();
    const start = Number(reqData.start) || 0;
    const length = Number(reqData.length) || 10;
    const { sortColumn, sortDir } = getSortInfo(reqData);

    let query = locals.supabase
        .from('requests')
        .select('*', { count: 'exact' });

    const searchValue = reqData.search?.value?.trim();

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

