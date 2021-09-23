import React, { useEffect } from "react";
import { DefaultEditor } from "react-simple-wysiwyg";
import AntFormDisplay from "imcformbuilder";

const SimpleEditor = (props) => {
  const [html, setHtml] = React.useState("my <b>HTML</b>");
  useEffect(() => {
    setHtml(props.html);
  }, [props]);
  function onChange(e) {
    setHtml(e.target.value);
    localStorage.setItem("editcontent1", e.target.value);
    let local = props.authObj,
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.content = e.target.value;
    localStorage.setItem("modelchart", JSON.stringify(local));
  }

  return (
    <>
      <DefaultEditor value={html} onChange={onChange} />
      <AntFormDisplay />
    </>
  );
};
export default SimpleEditor;
