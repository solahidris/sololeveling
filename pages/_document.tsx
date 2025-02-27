import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Solo Leveling Fitness Tracker by Solah</title>
        <meta name="description" content="Level up like nobody's business with the anime inspired Solo Leveling daily routine. Level up the ranks and claim your throne." />
        <meta name="keywords" content="solo, leveling, solo leveling, anime, solah, idris, solah idris" />
        <meta name="author" content="Solah Idris" />
        <meta property="og:title" content="Solo Leveling Fitness Tracker by Solah" />
        <meta property="og:description" content="Level up like nobody's business with the anime inspired Solo Leveling daily routine. Level up the ranks and claim your throne." />
        <meta property="og:url" content="https://www.oursololeveling.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.oursololeveling.com/images/main.png" />
        {/* <!-- Cloudflare Web Analytics --> */}
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "9fa6a3af8cd04548854f5491b219f08c"}'></script>
        {/* <!-- End Cloudflare Web Analytics --> */}
      </Head>
      <body className="antialiased bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
