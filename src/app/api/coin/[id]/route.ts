import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Coin ID is required' }, { status: 400 });
    }

    // Fetch both coin details and historical data in parallel
    const [coinResponse, historyResponse] = await Promise.all([
      fetch(
        `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`
      ),
      fetch(
        `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=365&interval=daily`
      )
    ]);

    if (!coinResponse.ok || !historyResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch coin data: ${coinResponse.statusText || historyResponse.statusText}` },
        { status: coinResponse.status || historyResponse.status }
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

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}