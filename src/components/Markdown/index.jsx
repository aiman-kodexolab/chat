import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./style.css";

export default function Markdown({ markdown }) {
  const renderMarkdown = (markdownString) => {
    const sanitizedHtml = DOMPurify.sanitize(marked(markdownString));
    return { __html: sanitizedHtml };
  };

  return (
    <div className={"container"}>
      <div
        dangerouslySetInnerHTML={renderMarkdown(markdown)}
        className={"content-messages"}
        style={{
          wordBreak: "break-word",
        }}
      ></div>
    </div>
  );
}
