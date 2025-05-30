import { decrypt } from '$lib/crypto';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent, locals }) => {
    const code = url.searchParams.get('source');

    let decrypted;
    try {
        decrypted = await decrypt(code);
    } catch (err) {
        throw redirect(303, '/');
    }

    const itemId = decrypted.split("_")[0];
    const partnerEmail = decrypted.split("_")[1];
    const swEmail = decrypted.split("_")[2];

    // if item already exists in PD, redirect
    const { data: pdData, error: wipError } = await locals.supabase
        .from('pd')
        .select('id')
        .eq('id', itemId)
        .single();

    if (pdData) {
        throw redirect(303, '/');
    }

    const { data: requestsData, error: requestsError } = await locals.supabase
        .from('requests')
        .select('*')
        .eq('id', itemId)
        .single();

    return { itemId, partnerEmail, requestsData, swEmail, code };
};
