import "../assets/css/global.css";
import Seo from "./seo";
import Header from "../components/partials/header";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Seo />
      <Header />
      <Component {...pageProps} />
    </>
  );
}
