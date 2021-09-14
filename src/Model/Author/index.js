import React, { useEffect, useState } from "react";
import { useRouteMatch, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import _ from "lodash";
import { globalVariable } from "actions";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import EasyTable from "imcgridtable";
import EasyChart from "imcchart";
import Dataget from "./Dataget";
import AuthorHtml from "Model/Author/AuthorHtml";

const Author = (props) => {
  const [authObj, setAuthObj] = useState();
  const [title, setTitle] = useState();

  let tempModel = useSelector((state) => state.global.tempModel);
  const history = useHistory();
  const dispatch = useDispatch();
  let match = useRouteMatch("/author/:id").url.split("/");
  //const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    $(".MuiIconButton-root").css("padding", 0);
    $(".ant-col.ant-col-2").css("text-align", "right");

    console.log("match id is ", match);
    let tt = match[match.length - 1];
    if (tt) {
      setTitle(tt.toLowerCase());
    }

    const author = location?.state?.author;
    if (author) {
      setAuthObj(author);
    }
  }, []);
  const handleSave = () => {
    console.log("imin");
    saveTemp();
    dispatch(globalVariable({ triggerChild: ["save", "list"] }));
  };

  const saveTemp = () => {
    let authorlist = tempModel?.resultsAuthor;

    const modelchart1 = localStorage.getItem("modelchart");
    let modelchart;
    if (!modelchart1) return;

    modelchart = JSON.parse(modelchart1);

    let notexist = true;
    authorlist.map((k, i) => {
      if (k.i === modelchart.i) {
        authorlist.splice(i, 1, modelchart);
        notexist = false;
      }
      return null;
    });
    if (notexist) {
      authorlist.push(modelchart);
    }
    console.log(authorlist);
    tempModel.resultsAuthor = authorlist;

    dispatch(globalVariable({ tempModel: _.cloneDeep(tempModel) }));
  };
  const btnArr = [
    {
      tooltip: "Save and Show Authoring List",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      onClick: handleSave,
    },
    {
      tooltip: "Go to Previous",
      awesome: "level-up-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => {
        localStorage.removeItem("modelchart");
        history.push("/edit");
      },
    },
  ];

  return (
    <>
      <DenseAppBar
        title={"Author"}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div
        style={{
          paddingLeft: 20,
          paddingTop: 5,
          paddingBottom: 10,
        }}
      >
        <AntBreadCrumb />
      </div>
      <div style={{ marginTop: 20 }}>
        {(() => {
          switch (title) {
            case "table":
              return <EasyTable authObj={authObj} edit={true} />;
            case "html":
              return <AuthorHtml authObj={authObj} edit={true} />;
            case "chart":
              return <EasyChart authObj={authObj} edit={true} />;
            case "data":
              return <Dataget authObj={authObj} />;
            default:
              return null;
          }
        })()}
      </div>
    </>
  );
};

export default Author;
