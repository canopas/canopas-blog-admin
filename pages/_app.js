import "../assets/css/global.css";
import Head from "next/head";
import Header from "../components/partials/header";

function BlogApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header></Header>
      <Component {...pageProps} />
    </>
  );
}

export default BlogApp;
