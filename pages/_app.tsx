import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { RainbowKitProvider, getDefaultWallets, darkTheme, midnightTheme, Theme} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import React, { useEffect, useState } from "react";
import merge from 'lodash.merge';
import { useConnect, useDisconnect, useAccount, useNetwork } from "wagmi";

// const { accountData } = useAccount();

const myTheme = merge(midnightTheme(), {
  colors: {
    accentColor: '#ffcc00',
    accentColorForeground: '#000',
    actionButtonSecondaryBackground: '#ffcc00',
  },
  fonts: {
    body: '',
  },
} as Theme);

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.goerli,
    chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
      : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: 'n46-IjLKgUkIxIrdeJkwyk0F8zpxgtZk',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider theme={myTheme} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
