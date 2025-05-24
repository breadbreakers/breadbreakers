import { supabase } from '$lib/supabase';

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

function buildSearchFilter(searchValue) {
    return `title.ilike.%${searchValue}%,contact_clean.ilike.%${searchValue}%,description.ilike.%${searchValue}%`;
}

// POST handler
export async function POST({ request }) {
    const reqData = await request.json();
    const start = Number(reqData.start) || 0;
    const length = Number(reqData.length) || 10;
    const { sortColumn, sortDir } = getSortInfo(reqData);

    let query = supabase
        .from('requests_with_votes')
        .select('*', { count: 'exact' });

    const searchValue = reqData.search?.value?.trim();
    if (searchValue) {
        query = query.or(buildSearchFilter(searchValue));
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

// GET handler (fallback)
export async function GET({ url }) {
    const start = Number(url.searchParams.get('start')) || 0;
    const length = Number(url.searchParams.get('length')) || 10;
    const draw = Number(url.searchParams.get('draw')) || 1;
    const orderCol = url.searchParams.get('order[0][column]');
    const orderDir = url.searchParams.get('order[0][dir]') || 'asc';
    const searchValue = url.searchParams.get('search[value]')?.trim();

    const columnName = url.searchParams.get(`columns[${orderCol}][data]`);
    const sortColumn = allowedColumns.includes(columnName) ? columnName : 'date';

    let query = supabase
        .from('requests_with_votes')
        .select('*', { count: 'exact' });

    if (searchValue) {
        query = query.or(buildSearchFilter(searchValue));
    }

    query = query
        .order(sortColumn, { ascending: orderDir === 'asc' })
        .range(start, start + length - 1);

    const { data, count, error } = await query;

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({
        draw,
        data,
        recordsTotal: count,
        recordsFiltered: count
    }));
}
