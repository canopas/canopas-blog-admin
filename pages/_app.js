import "../assets/css/global.css";
import Header from "../components/partials/header";
import { Provider } from "react-redux";
import store from "../store/store";

function BlogApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Header></Header>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default BlogApp;
