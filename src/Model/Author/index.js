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
import Data from "../../Data";
import AuthorHtml from "Model/Author/AuthorHtml";

const Author = (props) => {
  const [authObj, setAuthObj] = useState();
  const [title, setTitle] = useState();

  let tempModel = useSelector((state) => state.global.tempModel);
  let tempModelList = useSelector((state) => state.global.tempModelList);
  const history = useHistory();
  const dispatch = useDispatch();
  const findmatch = useRouteMatch("/author/:id");
  let match = findmatch?.url?.split("/");
  const location = useLocation();
  useEffect(() => {
    $(".MuiIconButton-root").css("padding", 0);
    $(".ant-col.ant-col-2").css("text-align", "right");

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
    let local,
      local1 = localStorage.getItem("modelchart");
    if (local1) {
      local = JSON.parse(local1);
      onChange(local);
    }

    localStorage.removeItem("modelchart");
    history.push("/edit");
    //dispatch(globalVariable({ triggerChild: ["save", "list"] }));
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

    tempModelList.map((k, i) => {
      if (k.id === tempModel.id) {
        tempModelList.splice(i, 1, tempModel);
      }
    });
    console.log("dashboard", tempModel);
    dispatch(globalVariable({ tempModelList: _.cloneDeep(tempModelList) }));
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
                <EasyTable
                  authObj={authObj}
                  onChange={onChange}
                  showmenu={false}
                  edit={true}
                />
              );
            case "html":
              return (
                <AuthorHtml authObj={authObj} onChange={onChange} edit={true} />
              );
            case "chart":
              return (
                <EasyChart
                  authObj={authObj}
                  onChange={onChange}
                  showmenu={false}
                  edit={true}
                />
              );
            case "data":
              return <Data authObj={authObj} onChange={onChange} />;
            default:
              return null;
          }
        })()}
      </div>
    </>
  );
};

export default Author;
