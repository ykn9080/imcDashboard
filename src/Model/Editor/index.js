import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { Input } from "antd";

import parse from "html-react-parser";

const { TextArea } = Input;
// let content = {
//   entityMap: {},
//   blocks: [
//     {
//       key: "637gr",
//       text: "Initialized from content state.",
//       type: "unstyled",
//       depth: 0,
//       inlineStyleRanges: [],
//       entityRanges: [],
//       data: {},
//     },
//   ],
// };
const Reditor = (props) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentState, setContentState] = useState();
  const [htmlcontent, setHtmlcontent] = useState();

  useEffect(() => {
    if (props.content) {
      const simplecontent = { entityMap: {}, blocks: props.content.blocks };
      const contentstate = convertFromRaw(simplecontent);
      const editorstate = EditorState.createWithContent(contentstate);
      // var myString = draftToHtml(convertToRaw(editorstate.getCurrentContent()));
      // var $jQueryObject = $($.parseHTML(myString));
      // setHtmlcontent($jQueryObject.html());
      setEditorState(editorstate);
    }
  }, [props]);
  useEffect(() => {
    if (editorState) {
      var myString = draftToHtml(convertToRaw(editorState.getCurrentContent()));

      setHtmlcontent(parse(myString, options));
    }
  }, [editorState]);
  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.attribs.class === "remove") {
        return <></>;
      }
    },
  };
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };
  const onContentStateChange = (contentState) => {
    setContentState(contentState);
    props.onContentStateChange(contentState);
  };

  return (
    <div>
      {(() => {
        switch (props.type) {
          case "view":
            return <div>{htmlcontent}</div>;
          default:
            return (
              <>
                <Editor
                  editorState={editorState}
                  wrapperClassName="wrapper-class"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  onEditorStateChange={onEditorStateChange}
                  onContentStateChange={onContentStateChange}
                />
                {/* <textarea
                  value={draftToHtml(
                    convertToRaw(editorState.getCurrentContent())
                  )}
                /> */}
              </>
            );
        }
      })()}
    </div>
  );
};

export default Reditor;
