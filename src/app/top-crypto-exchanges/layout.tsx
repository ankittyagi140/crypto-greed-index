import { Metadata } from 'next';
import { metadata as pageMetadata } from './metadata';
import TopCryptoExchanges from './page';

export const metadata: Metadata = pageMetadata;

export default function TopCryptoExchangesLayout() {
  return <TopCryptoExchanges />;
} 