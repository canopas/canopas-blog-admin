import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import EditorJs from "react-editor-js";
import requiredTools from "./requiredTools";
import customTools from "../../config/customTools";

import MediaLibAdapter from "../medialib/adapter";
import MediaLibComponent from "../medialib/component";
import { changeFunc, getToggleFunc } from "../medialib/utils";

const Editor = ({ onChange, name, value }) => {
  const [editorInstance, setEditorInstance] = useState();
  const [mediaLibBlockIndex, setMediaLibBlockIndex] = useState(-1);
  const [isMediaLibOpen, setIsMediaLibOpen] = useState(false);

  const mediaLibToggleFunc = useCallback(
    getToggleFunc({
      openStateSetter: setIsMediaLibOpen,
      indexStateSetter: setMediaLibBlockIndex,
    }),
    [],
  );

  const handleMediaLibChange = useCallback(
    (data) => {
      changeFunc({
        indexStateSetter: setMediaLibBlockIndex,
        data,
        index: mediaLibBlockIndex,
        editor: editorInstance,
      });
      mediaLibToggleFunc();
    },
    [mediaLibBlockIndex, editorInstance],
  );

  const customImageTool = {
    mediaLib: {
      class: MediaLibAdapter,
      config: {
        mediaLibToggleFunc,
      },
    },
  };

  async function autosave(newData) {
    const urlPart = window.location.href.split("/");
    const postId = urlPart[urlPart.length - 1];

    try {
      await fetch("/v1/post/autosave", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          newData,
        }),
      })
        .then((response) => {
          // console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Autosave error:", error);
    }
  }

  return (
    <>
      <div
        style={{
          border: `1px solid rgb(227, 233, 243)`,
          borderRadius: `2px`,
          marginTop: `4px`,
        }}
      >
        <EditorJs
          // data={JSON.parse(value)}
          // enableReInitialize={true}
          onReady={(api) => {
            if (value && JSON.parse(value).blocks.length) {
              api.blocks.render(JSON.parse(value));
            }
            document.querySelector('[data-tool="image"]').remove();
          }}
          onChange={(api, newData) => {
            if (!newData.blocks.length) {
              newData = null;
              onChange({ target: { name, value: newData } });
            } else {
              onChange({ target: { name, value: JSON.stringify(newData) } });
              autosave(newData);
            }
          }}
          tools={{ ...requiredTools, ...customTools, ...customImageTool }}
          instanceRef={(instance) => setEditorInstance(instance)}
        />
      </div>
      <MediaLibComponent
        isOpen={isMediaLibOpen}
        onChange={handleMediaLibChange}
        onToggle={mediaLibToggleFunc}
      />
    </>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;
