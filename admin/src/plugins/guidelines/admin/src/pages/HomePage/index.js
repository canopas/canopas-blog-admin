/*
 *
 * HomePage
 *
 */

import React from "react";
import guideline from "!!html-loader!markdown-loader!../guidelines.md";
import "../../../../../../../public/assets/css/custom.css";

const HomePage = () => {
  return (
    <div
      class="guideline"
      dangerouslySetInnerHTML={{ __html: guideline }}
    ></div>
  );
};

export default HomePage;
