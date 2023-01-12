import "../assets/css/global.css";
import Header from "../components/partials/header";

function BlogApp({ Component, pageProps }) {
  return (
    <>
      <Header></Header>
      <Component {...pageProps} />
    </>
  );
}

export default BlogApp;
