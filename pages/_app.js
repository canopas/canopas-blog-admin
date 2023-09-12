import "../assets/css/global.css";
import dynamic from "next/dynamic";
import mixpanel from "mixpanel-browser";
import Script from "next/script";
import { Suspense } from "react";
import localFont from "@next/font/local";
const Header = dynamic(() => import("../components/partials/header"));
const Footer = dynamic(() => import("../components/partials/footer"), {
  ssr: false,
});

const Inter = localFont({
  src: [
    {
      path: "../assets/fonts/Inter-ExtraLight.woff2",
      weight: "200",
    },
    {
      path: "../assets/fonts/Inter-Regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/Inter-Medium.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/Inter-SemiBold.woff2",
      weight: "600",
    },
    {
      path: "../assets/fonts/Inter-Bold.woff2",
      weight: "700",
    },
  ],
});

const Comme = localFont({
  src: [
    {
      path: "../assets/fonts/Comme-Light.woff2",
      weight: "300",
    },
    {
      path: "../assets/fonts/Comme-Regular.woff2",
      weight: "400",
    },
    {
      path: "../assets/fonts/Comme-Medium.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/Comme-SemiBold.woff2",
      weight: "600",
    },
  ],
});

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, { debug: true });

export default function App({ Component, pageProps }) {
  return (
    <div className="overflow-x-clip">
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      ></Script>
      <style jsx global>{`
        :root {
          --inter-font: ${Inter.style.fontFamily};
          --comme-font: ${Comme.style.fontFamily};
        }
      `}</style>
      <Suspense fallback={<p>Loading</p>}>
        <Header mixpanel={mixpanel} />
        <Component {...pageProps} mixpanel={mixpanel} />
        <Footer mixpanel={mixpanel} />
      </Suspense>
    </div>
  );
}
