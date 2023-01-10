import "../assets/css/global.css";
import Header from "../components/partials/Header";

function BlogApp({ Component, pageProps }) {
  return (
    <>
      <Header></Header>
      <Component {...pageProps} />
    </>
  );
}

export default BlogApp;
