import React, { useEffect } from "react";
import { DefaultEditor } from "react-simple-wysiwyg";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";

const SimpleEditor = (props) => {
  const [html, setHtml] = React.useState("my <b>HTML</b>");
  useEffect(() => {
    setHtml(props.html);
  }, [props]);
  function onChange(e) {
    setHtml(e.target.value);
    localStorage.setItem("editcontent1", e.target.value);
  }

  return (
    <>
      <DefaultEditor value={html} onChange={onChange} />
      <AntFormDisplay />
    </>
  );
};
export default SimpleEditor;
