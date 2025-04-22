import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Define params type with Promise
type Params = {
  id: string;
};

/**
 * Fetches data with retry logic and exponential backoff
 * @param url The URL to fetch
 * @param options Fetch options
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in ms before retrying
 * @returns The fetch response
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3, 
  baseDelay = 1000
): Promise<Response> {
  let retries = 0;
  
  while (true) {
    try {
      const response = await fetch(url, options);
      
      // If not rate limited or we've used all retries, return the response
      if (response.status !== 429 || retries >= maxRetries) {
        return response;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, retries);
      console.log(`Rate limited. Retrying in ${delay}ms (attempt ${retries + 1}/${maxRetries})`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    } catch (error) {
      // For network errors, also use retry logic
      if (retries >= maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, retries);
      console.log(`Network error. Retrying in ${delay}ms (attempt ${retries + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    if (!id) {
      return NextResponse.json({ error: 'Coin ID is required' }, { status: 400 });
    }

    // Fetch both coin details and historical data in parallel with retry
    const [coinResponse, historyResponse] = await Promise.all([
      fetchWithRetry(
        `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`,
        {
          headers: {
            'Accept': 'application/json',
          },
          next: {
            revalidate: 300 // Cache for 5 minutes
          }
        }
      ),
      fetchWithRetry(
        `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=365&interval=daily`,
        {
          headers: {
            'Accept': 'application/json',
          },
          next: {
            revalidate: 300 // Cache for 5 minutes
          }
        }
      )
    ]);

    if (!coinResponse.ok || !historyResponse.ok) {
      const status = coinResponse.status === 429 || historyResponse.status === 429 ? 429 : 
                   (coinResponse.status || historyResponse.status);
      
      return NextResponse.json(
        { error: `Failed to fetch coin data: ${coinResponse.statusText || historyResponse.statusText}` },
        { 
          status,
          headers: {
            'Cache-Control': 'public, max-age=60, s-maxage=60'
          }
        }
      );
    }

    const [coinData, historyData] = await Promise.all([
      coinResponse.json(),
      historyResponse.json()
    ]);

    // Format historical data
    const historicalData = historyData.prices.map(([timestamp, price]: [number, number]) => ({
      date: new Date(timestamp).toISOString(),
      price: price
    }));

    const formattedData = {
      id: coinData?.id || null,
      symbol: coinData?.symbol || null,
      name: coinData?.name || null,
      currentPrice: coinData?.market_data?.current_price?.usd || null,
      marketCap: coinData?.market_data?.market_cap?.usd || null,
      marketCapRank: coinData?.market_data?.market_cap_rank || null,
      volume24h: coinData?.market_data?.total_volume?.usd || null,
      volumeChange24h: coinData?.market_data?.total_volume_change_24h || null,
      high24h: coinData?.market_data?.high_24h?.usd || null,
      low24h: coinData?.market_data?.low_24h?.usd || null,
      priceChange: {
        '24h': coinData?.market_data?.price_change_percentage_24h || null,
        '7d': coinData?.market_data?.price_change_percentage_7d || null,
        '30d': coinData?.market_data?.price_change_percentage_30d || null,
      },
      marketCapChange24h: coinData?.market_data?.market_cap_change_percentage_24h || null,
      supply: {
        total: coinData?.market_data?.total_supply || null,
        circulating: coinData?.market_data?.circulating_supply || null,
        max: coinData?.market_data?.max_supply || null,
      },
      links: {
        homepage: coinData?.links?.homepage?.[0] || null,
        blockchain: coinData?.links?.blockchain_site?.[0] || null,
        forum: coinData?.links?.official_forum_url?.[0] || null,
        chat: coinData?.links?.chat_url?.[0] || null,
        announcements: coinData?.links?.announcement_url?.[0] || null,
        twitter: coinData?.links?.twitter_screen_name
          ? `https://twitter.com/${coinData.links.twitter_screen_name}`
          : null,
        facebook: coinData?.links?.facebook_username
          ? `https://facebook.com/${coinData.links.facebook_username}`
          : null,
        telegram: coinData?.links?.telegram_channel_identifier
          ? `https://t.me/${coinData.links.telegram_channel_identifier}`
          : null,
        reddit: coinData?.links?.subreddit_url || null,
        github: coinData?.links?.repos_url?.github?.[0] || null,
        bitbucket: coinData?.links?.repos_url?.bitbucket?.[0] || null,
      },
      community: {
        facebook: coinData?.community_data?.facebook_likes || null,
        twitter: coinData?.community_data?.twitter_followers || null,
        reddit: coinData?.community_data?.reddit_subscribers || null,
        telegram: coinData?.community_data?.telegram_channel_user_count || null,
      },
      development: {
        forks: coinData?.developer_data?.forks || null,
        stars: coinData?.developer_data?.stars || null,
        subscribers: coinData?.developer_data?.subscribers || null,
        issues: {
          total: coinData?.developer_data?.total_issues || null,
          closed: coinData?.developer_data?.closed_issues || null,
        },
        pullRequests: {
          merged: coinData?.developer_data?.pull_requests_merged || null,
          contributors: coinData?.developer_data?.pull_request_contributors || null,
        },
        activity: {
          additions: coinData?.developer_data?.code_additions_deletions_4_weeks?.additions || null,
          deletions: coinData?.developer_data?.code_additions_deletions_4_weeks?.deletions || null,
          commits: coinData?.developer_data?.commit_count_4_weeks || null,
        },
      },
      historicalData,
    };

    return NextResponse.json({ data: formattedData }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error fetching coin data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    const status = errorMessage.includes('Rate limit') ? 429 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { 
        status,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60'
        }
      }
    );
  }
} 