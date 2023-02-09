import React from "react";
import Head from "next/head";

const Seo = ({ title, description, url, date, article }) => {
  return (
    <Head>
      <meta charset="UTF-8" />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {article ? (
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "${article ? "Article" : "WebSite"}",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "url": "${url}"
            },
            "headline": "${title}",
            "datePublished": "${date}",
            "dateModified": "${date}",
            "publisher": {
                "@type": "Canopas",
                "name": "Canopas",
                "url": "https://canopas.com/"
            },
            "description": "${description}"           
          }
        `}
        </script>
      ) : (
        ""
      )}
    </Head>
  );
};

export default Seo;
