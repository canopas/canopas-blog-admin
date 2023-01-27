import "../assets/css/global.css";
import Head from "next/head";
import Header from "../components/partials/header";
import { Provider } from "react-redux";
import store from "../store/index";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Head>
          <meta charset="UTF-8" />
          <meta name="robots" content="noindex, nofollow" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Header></Header>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
