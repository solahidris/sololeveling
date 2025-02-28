import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PlayerProvider } from "@/context/PlayerContext";
import { Analytics } from "@vercel/analytics/react";
import { MusicProvider } from "@/context/MusicContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MusicProvider>
        <PlayerProvider>
          <Component {...pageProps} />
          <Analytics />
        </PlayerProvider>
      </MusicProvider>
    </>
  );
}
