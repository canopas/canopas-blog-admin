import "../assets/css/global.css";
import Header from "../components/partials/header";
import Footer from "../components/partials/footer";
import Head from "next/head";
import mixpanel from "mixpanel-browser";
import Script from "next/script";

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, { debug: true });

export default function App({ Component, pageProps }) {
  return (
    <div className="overflow-x-clip">
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/resources/favicon.ico" />
      </Head>
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      ></Script>
      <Header mixpanel={mixpanel} />
      <Component {...pageProps} mixpanel={mixpanel} />
      <Footer mixpanel={mixpanel} />
    </div>
  );
}
