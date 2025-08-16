import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Optional API key support (Pro or free demo if provided)
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

const defaultHeaders: HeadersInit = {
	accept: 'application/json',
	'content-type': 'application/json',
	// Provide a UA to avoid some providers blocking requests without one
	'User-Agent': 'cryptogreedindex/1.0 (+https://www.cryptogreedindex.com)'
};

if (COINGECKO_API_KEY) {
	(defaultHeaders as any)['x-cg-pro-api-key'] = COINGECKO_API_KEY;
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, init: RequestInit = {}, retries = 3, backoffMs = 500): Promise<Response> {
	let attempt = 0;
	while (true) {
		try {
			const res = await fetch(url, {
				cache: 'no-store',
				// @ts-ignore - Next.js runtime supports next option
				next: { revalidate: 0 },
				...init,
				headers: { ...defaultHeaders, ...(init.headers || {}) }
			});

			// Successful response
			if (res.ok) return res;

			// Rate limit handling
			if ((res.status === 429 || res.status === 403) && attempt < retries) {
				attempt += 1;
				await sleep(backoffMs);
				backoffMs *= 2;
				continue;
			}

			// Non-retriable error
			return res;
		} catch (err) {
			if (attempt >= retries) throw err;
			attempt += 1;
			await sleep(backoffMs);
			backoffMs *= 2;
		}
	}
}

export async function GET() {
	try {
		// Fetch Bitcoin data from CoinGecko with resiliency
		const [priceRes, networkRes] = await Promise.all([
			fetchWithRetry(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`),
			fetchWithRetry(`${COINGECKO_API}/coins/bitcoin?localization=false&tickers=false&market_data=false&community_data=true&developer_data=true&sparkline=false`)
		]);

		let priceResult: any | null = null;
		let networkResult: any | null = null;

		if (priceRes.ok) {
			priceResult = await priceRes.json();
		}
		if (networkRes.ok) {
			networkResult = await networkRes.json();
		}

		// If both failed, return graceful error
		if (!priceResult && !networkResult) {
			const errorText = `CoinGecko request failed (price: ${priceRes.status}, network: ${networkRes.status})`;
			console.error(errorText);
			return NextResponse.json({ error: 'Failed to fetch Bitcoin metrics' }, { status: 502 });
		}

		// Extract and format the data with fallbacks
		const metrics = {
			price: priceResult?.bitcoin?.usd ?? null,
			marketCap: priceResult?.bitcoin?.usd_market_cap ?? null,
			priceChange24h: priceResult?.bitcoin?.usd_24h_change ?? null,
			activeAddresses: networkResult?.community_data?.active_addresses ?? 0,
			hashRate: networkResult?.developer_data?.closed_issues ?? 0, // Placeholder for free API
			difficulty: networkResult?.developer_data?.total_issues ?? 0, // Placeholder for free API
			networkCongestion: 'low'
		};

		return NextResponse.json({ data: metrics }, { status: 200 });
	} catch (error) {
		console.error('Error fetching Bitcoin metrics:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch Bitcoin metrics' },
			{ status: 500 }
		);
	}
} 