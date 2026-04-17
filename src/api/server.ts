import { cookies } from 'next/headers';

export const getProgramDetailsServer = async (id: string) => {
	const host = (process.env.NEXT_PUBLIC_API_HOST || '').replace(/\/$/, '');
	if (!host) {
		throw new Error('NEXT_PUBLIC_API_HOST is not set');
	}

	// Optional Authorization from USERINFO cookie (if present)
	let token: string | undefined = undefined;
	try {
		const cookieStore = await cookies();
		const userCookie = cookieStore.get('USERINFO')?.value;
		if (userCookie) {
			const parsed = JSON.parse(userCookie);
			if (parsed?.token) token = parsed.token as string;
		}
	} catch {
		// ignore cookie parse errors; proceed without auth
	}

	const headers: Record<string, string> = {
		country: 'KR',
	};
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(`${host}/api/v1/programs/${id}`, {
		method: 'GET',
		cache: 'no-store',
		headers,
	});

	// Backend returns envelope: { status, code, message, data }
	const json = (await res.json().catch(() => null)) as any;
	if (!res.ok || !json?.status) {
		const msg = json?.message || `Failed to load program details (HTTP ${res.status})`;
		throw new Error(msg);
	}

	return json.data;
};

export const getProgramSchedulesServer = async (id: string, date: string) => {
	const host = (process.env.NEXT_PUBLIC_API_HOST || '').replace(/\/$/, '');
	if (!host) {
		throw new Error('NEXT_PUBLIC_API_HOST is not set');
	}

	const res = await fetch(`${host}/api/v1/programs/${id}/reservation/schedules?date=${date}`, {
		method: 'GET',
		cache: 'no-store',
		headers: {
			country: 'KR',
		},
	});

	const json = (await res.json().catch(() => null)) as any;
	if (!res.ok || !json?.status) {
		return null;
	}

	return json.data;
};

