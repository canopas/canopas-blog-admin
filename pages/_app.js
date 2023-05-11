import "../assets/css/global.css";
import Header from "../components/partials/header";
import Head from "next/head";
import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, { debug: true });

export default function App({ Component, pageProps }) {
  return (
    <div className="overflow-x-clip">
      <Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/resources/favicon.ico" />
      </Head>
      <Header mixpanel={mixpanel} />
      <Component {...pageProps} mixpanel={mixpanel} />
    </div>
  );
}
