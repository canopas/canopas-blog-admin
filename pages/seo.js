import React from "react";
import Head from "next/head";

const Seo = ({
  title,
  description,
  authorName,
  url,
  image_url,
  publishedAt,
  publishedTime,
  readingTime,
  article,
  keywords,
}) => {
  return (
    <Head>
      {article ? (
        <>
          <title>{title}</title>
          <meta property="og:site_name" content="Canopas blogs" />
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={publishedTime} />
          <meta property="title" content={title} />
          <meta property="og:title" content={title} />
          <meta property="twitter:title" content={title} />
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta property="twitter:description" content={description} />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image_url} />
          <meta property="twitter:image:src" content={image_url} />
          <meta property="twitter:tile:image" content={image_url} />
          <meta property="article:author" content={authorName} />
          <meta name="author" content={authorName} />
          <meta property="twitter:site" content="https://canopas.com/" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:label1" content="Reading time" />
          <meta property="twitter:data1" content={`${readingTime} min read`} />
          <meta property="twitter:tile:info1:icon" content="Person" />
          <meta property="twitter:tile:info1:text" content={authorName} />
          <meta property="twitter:tile:info2:icon" content="Calendar" />
          <meta property="twitter:tile:info2:text" content={publishedAt} />
          <meta property="twitter:cta" content="Read on Canopas" />
          <meta property="keywords" content={keywords} />
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "${article ? "Article" : "WebSite"}",
                "headline": "${title}",
                "image": "${image_url}",
                "publisher": {
                  "@type": "Organization",
                  "name": "Canopas",
                  "url": "https://canopas.com/"
                },
                "url": "${url}",
                "datePublished": "${publishedAt}",
                "dateModified": "${publishedAt}",
                "description": "${description}",
                "author": {
                  "@type": "Person",
                  "name": "${authorName}"
                },
                "mainEntityOfPage": {
                  "@type": "Blog Website",
                  "@id": "https://canopas.com/resources"
                }
              }
            `}
          </script>
        </>
      ) : (
        <>
          <title>{title}</title>
          <meta property="title" content={title} />
          <meta name="description" content={description} />
          <meta name="author" content={authorName} />
        </>
      )}
    </Head>
  );
};

export default Seo;
