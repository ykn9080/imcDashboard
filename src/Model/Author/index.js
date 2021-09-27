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
// import Data from "../../Data";
import Data from "imcdata";
import AuthorHtml from "Model/Author/AuthorHtml";

const Author = (props) => {
  const [authObj, setAuthObj] = useState();
  const [title, setTitle] = useState();

  let tempModel = useSelector((state) => state.global.tempModel);
  let tempModule = useSelector((state) => state.global.tempModule);
  const history = useHistory();
  const dispatch = useDispatch();
  let match = useRouteMatch("/author/:id").url.split("/");
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
    //saveTemp();
    localStorage.removeItem("modelchart");
    history.push("/edit");
    dispatch(globalVariable({ triggerChild: ["save", "list"] }));
  };

  // const saveTemp = () => {
  //   let sett = localStorage.getItem("dashsetting");
  //   if (sett) sett = JSON.parse(sett);
  //   let data;
  //   switch (sett?.datatype) {
  //     case "local":
  //     default:
  //       let local = {},
  //         local1 = localStorage.getItem("modelchart");
  //       if (local1) local = JSON.parse(local1);
  //       data = local;
  //       break;
  //     case "mongodb":
  //       data = tempModule;
  //       break;
  //   }

  //   let authorlist = tempModel?.resultsAuthor;

  //   let notexist = true;
  //   authorlist.map((k, i) => {
  //     if (k.i === data.i) {
  //       authorlist.splice(i, 1, data);
  //       notexist = false;
  //     }
  //     return null;
  //   });
  //   if (notexist) {
  //     authorlist.push(data);
  //   }

  //   tempModel.resultsAuthor = authorlist;

  //   dispatch(globalVariable({ tempModel: _.cloneDeep(tempModel) }));
  // };
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
  const onChange = (data) => {
    let authorlist = tempModel?.resultsAuthor;

    let notexist = true;
    authorlist.map((k, i) => {
      if (k.i === data.i) {
        authorlist.splice(i, 1, data);
        notexist = false;
      }
      return null;
    });
    if (notexist) {
      authorlist.push(data);
    }

    tempModel.resultsAuthor = authorlist;
    console.log("dashboard", data, authorlist);
    dispatch(globalVariable({ tempModel: _.cloneDeep(tempModel) }));
  };
  return (
    <>
      <DenseAppBar
        title={"Authoring"}
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
              return (
                <EasyTable authObj={authObj} onChange={onChange} edit={true} />
              );
            case "html":
              return (
                <AuthorHtml authObj={authObj} onChange={onChange} edit={true} />
              );
            case "chart":
              return (
                <EasyChart authObj={authObj} onChange={onChange} edit={true} />
              );
            case "data":
              return <Data data={authObj} onChange={onChange} />;
            default:
              return null;
          }
        })()}
      </div>
    </>
  );
};

export default Author;
