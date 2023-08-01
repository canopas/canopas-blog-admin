import "../assets/css/global.css";
import dynamic from "next/dynamic";
import mixpanel from "mixpanel-browser";
import Script from "next/script";
import { Suspense } from "react";
const Header = dynamic(() => import("../components/partials/header"));
const Footer = dynamic(() => import("../components/partials/footer"), {
  ssr: false,
});

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, { debug: true });

export default function App({ Component, pageProps }) {
  return (
    <div className="overflow-x-clip">
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      ></Script>
      <Suspense fallback={<p>Loading</p>}>
        <Header mixpanel={mixpanel} />
        <Component {...pageProps} mixpanel={mixpanel} />
        <Footer mixpanel={mixpanel} />
      </Suspense>
    </div>
  );
}
