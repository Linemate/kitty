type Params = {
    params: {
        id: string[];
    };
};

export async function generateMetadata({ params }: Params) {
    const id = params.id?.[0];
    const host = process.env.NEXT_PUBLIC_API_HOST || '';
    let title = '';
    let image = '';
    let pageUrl = '';

    try {
        if (id && host) {
            const res = await fetch(`${host.replace(/\/$/, '')}/api/v1/programs/${id}`, { cache: 'no-store' });
            const json = await res.json();
            const program = json?.data;
            title = program?.title || '';
            image = program?.thumbnail || (program?.images && program.images.length > 0 ? program.images[0].url : '') || '';
        }
    } catch (e) {
        console.error('Failed to fetch program for metadata', e);
    }

    if (process.env.NEXT_PUBLIC_SITE_URL && id) {
        pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/program/${id}`;
    } else if (typeof host === 'string' && host.startsWith('http') && id) {
        pageUrl = `${host.replace(/\/$/, '')}/program/${id}`;
    }

    return {
        title: title || undefined,
        openGraph: {
            title: title || undefined,
            description: title || undefined,
            url: pageUrl || undefined,
            images: image ? [{ url: image }] : undefined,
        },
    };
}
