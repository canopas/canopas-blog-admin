import PluginId from "../pluginId";

import Table from "@editorjs/table";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";

const customTools = {
  table: {
    class: Table,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  code: Code,
  LinkTool: {
    class: LinkTool,
    config: {
      endpoint: `/v1/${PluginId}/link`,
    },
  },
  raw: {
    class: Raw,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Quote",
      captionPlaceholder: "Quote`s author",
    },
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
  inlineCode: InlineCode,
};

export default customTools;
