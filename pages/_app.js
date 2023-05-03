import "../assets/css/global.css";
import Header from "../components/partials/header";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <div className="overflow-x-clip">
      <Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/resources/favicon.ico" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}
