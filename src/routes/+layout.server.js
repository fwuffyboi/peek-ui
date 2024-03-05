/** @type {import('./$types').PageLoad} */
export async function load({cookies}) {
    const gdprEnabled = cookies.get("gdpr");
    const currentYear = new Date().getFullYear();

    return {
        gdprEnabled,
        currentYear
    }
}