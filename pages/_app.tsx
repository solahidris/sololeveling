import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlayerProvider } from "@/context/PlayerContext";
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return  (
    <>
      <PlayerProvider>
        <Component {...pageProps} />
        <Analytics />
      </PlayerProvider>
    </>
  )
}
