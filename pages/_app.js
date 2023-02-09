import "../assets/css/global.css";
import Header from "../components/partials/header";
import { Provider } from "react-redux";
import store from "../store/index";
import Seo from "./seo";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Seo />
        <Header></Header>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
