function convertToHTML(jsonData) {
  let htmlContent = "";

  for (const block of jsonData.blocks) {
    switch (block.type) {
      case "header":
        htmlContent += `<h${block.data.level} id=${block.id}><span>${
          block.data.level == 3
            ? `<b>${block.data.text}</b>`
            : `${block.data.text}`
        }</span></h${block.data.level}>`;
        break;

      case "paragraph":
        htmlContent += `<p><span style="background-color:transparent;">${block.data.text}</span></p>`;
        break;

      case "quote":
        htmlContent += `<blockquote><p><span style="background-color:transparent;">${block.data.text}</span></p></blockquote>`;
        break;

      case "LinkTool":
        htmlContent += `<figure class="media"><oembed url="${block.data.link}" data-loaded="true"></oembed></figure>`;
        break;

      case "delimiter":
        htmlContent += `<hr />`;
        break;

      case "code":
        // Replace special characters with HTML entities
        const escapedCode = block.data.code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");

        // Create the HTML content
        htmlContent += `<pre><code>${escapedCode}</code></pre>`;
        break;

      case "raw":
        htmlContent += `<div class="raw-html-embed">${block.data.html}</div>`;
        break;

      case "list":
        htmlContent += "<ol>";
        for (const item of block.data.items) {
          htmlContent += `<li><span style="background-color:transparent;">${item}</span></li>`;
        }
        htmlContent += "</ol>";
        break;

      case "image":
        let style = "";

        if (block.data.withBackground) {
          style += "background-color:#d8d8d8a6;padding:20px 50px;";
        }
        if (block.data.withBorder) {
          style += "border: 1px solid #00000029;border-radius: 4px;";
        }
        htmlContent += `<figure class="image"><div style="${style}"><img src="${
          block.data.file.url
        }" alt="${block.data.file?.alt || "image"}" sizes="${
          block.data.file.size
        }"></div>${
          block.data.caption != ""
            ? `<figcaption style="
          text-align: center;">${block.data.caption}</figcaption>`
            : ""
        }</figure>`;
        break;

      default:
        break;
    }
  }

  return htmlContent;
}

module.exports = convertToHTML;
