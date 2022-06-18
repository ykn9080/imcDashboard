import { message } from "antd";
import _ from "lodash";
import axios from "axios";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import $ from "jquery";
import React, { useEffect } from "react";
import { GoDeviceDesktop } from "react-icons/go";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import ModelEdit3 from "./ModelEdit3";
import ModelEdit4, { saveLayout } from "./ModelEdit4";
import { checkSetting } from "Model";

require("dotenv").config();
const sqlsvr = process.env.REACT_APP_SERVER;

const ModelEdit = (props) => {
  const history = useHistory(); // do this inside the component
  const location = useLocation();

  let currentStep = useSelector((state) => state.global.currentStep);
  let tempModel = useSelector((state) => state.global.tempModel);
  let tempModelList = useSelector((state) => state.global.tempModelList);
  let selectedKey1 = useSelector((state) => state.global.selectedKey1);

  useEffect(() => {
    $(".ant-col.ant-col-6").css({
      "text-align": "right",
      "padding-right": "30px",
    });
    const detour = location?.state?.detour;
    const keepopen = location?.state?.keepopen;
    const param = location?.state?.param;
    if (detour === "view") gotoView(param, keepopen);
  }, []);

  const gotoView = (param, keepopen) => {
    //if (tempModel) dispatch(globalVariable({ selectedKey: tempModel?._id }));
    //history.push(`/Model/view?_id=${tempModel._id}`);
    let pushcontent = {
      pathname: "/view",
    };
    if (param) {
      pushcontent.state = { from: "edit", param, keepopen };
    }

    history.push(pushcontent);
  };
  const setting = () => {
    history.push(`/setting`);
  };
  const saveToPermernent1 = () => {
    saveToPermernent(tempModel, tempModelList, selectedKey1);
  };
  const btnArr = [
    {
      tooltip: "View",
      icon: (
        <GoDeviceDesktop color="white" onClick={() => history.push("/view")} />
      ),
    },
    {
      tooltip: "Save to Server",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      "aria-controls": "save_server",
      onClick: saveToPermernent1,
    },
    {
      tooltip: "Setting",
      awesome: "cog",
      fontSize: "small",
      color: "inherit",
      onClick: setting,
    },
  ];

  return (
    <>
      <DenseAppBar
        title={"Dashboard Edit"}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div
        style={{
          paddingLeft: 10,
          paddingTop: 5,
          backgroundColor: "transparent",
        }}
      >
        <AntBreadCrumb />
      </div>

      {(() => {
        switch (currentStep) {
          // case 0:
          //   return <ModelEdit0 />;
          // case 1:
          //   return <ModelEdit1 />;
          // case 2:
          //   return <ModelEdit2 />;
          case 3:
            return <ModelEdit3 />;
          case 4:
            return <ModelEdit4 />;
          default:
            return null;
        }
      })()}
    </>
  );
};
export const saveToPermernent = (tempModel, tempModelList, selectedKey1) => {
  // dispatch(globalVariable({ triggerChild: ["save"] }));
  if (tempModel === "") {
    message.error("Incomplete file.");
    return false;
  }
  if (!tempModelList) tempModelList = [];
  let newtempModel = { ...saveLayout(tempModel) };

  let isexist = false;
  tempModelList.map((k, i) => {
    if (k.id === newtempModel.id) {
      tempModelList.splice(i, 1, newtempModel);
      isexist = true;
    }
    return false;
  });
  if (!isexist) {
    tempModelList.push(newtempModel);
  }
  // var index = _.findIndex(tempModelList, { id: newtempModel.id });
  // if (index) {
  //   tempModelList.splice(index, 1, newtempModel);
  // } else tempModelList.push(newtempModel);
  switch (checkSetting().datatype) {
    case "local":
    default:
      saveTolocal(tempModelList);
      break;
    case "mongodb":
      saveToServer(tempModelList);
      break;
    case "mysql":
      saveToMysql(tempModelList, selectedKey1);
      break;
  }
  return tempModelList;
};
const saveToServer = (newtempModel) => {
  // let method = "post",
  //   id = "";
  // if (newtempModel.hasOwnProperty("_id")) {
  //   method = "put";
  //   id = newtempModel._id;
  // }
  // let config = {
  //   method: method,
  //   url: `${imcsvr}/dashboard`,
  //   data: newtempModel,
  // };
  // axios(config).then((r) => {
  //   if (method === "post") {
  //     tempModel._id = r.data._id;
  //     dispatch(globalVariable({ tempModel }));
  //   }
  //   message.success("File saved Mongodb");
  // });
};

const saveTolocal = (data) => {
  let dashdata;
  const dashdt = localStorage.getItem("dashdata");

  if (dashdt) {
    dashdata = JSON.parse(dashdt);
    let notexist = true;
    dashdata.map((k, i) => {
      if (k._id === data._id) {
        dashdata.splice(i, 1, data);
        notexist = false;
      }
      return false;
    });
    if (notexist) dashdata.push(data);
    localStorage.setItem("dashdata", JSON.stringify(dashdata));
    //dispatch({ globalVariable: { tempModel: data } });
    message.success("File saved to localStorage");
  }
};
const removeDatalist = (list) => {
  return list.map((k, i) => {
    if (k.resultsAuthor) {
      k.resultsAuthor.map((l, j) => {
        if (l.dtsetting?.dtype === "api") {
          delete l.dtlist;
          delete l.originlist;
          k.resultsAuthor.splice(j, 1, l);
        }
        return null;
      });
      return k;
    }
    return k;
  });
};

export const saveToMysql = (newtempModelList, selectedKey1) => {
  let method = "post";
  let url = `${sqlsvr}/api/dashboard`;
  if (!selectedKey1) {
    selectedKey1 = "default";
  } else {
    method = "put";
    url = url + `/any?user=${selectedKey1}`;
  }
  let cloneList = _.cloneDeep(newtempModelList);
  const newList = removeDatalist(cloneList);

  let config = {
    method: method,
    url: url,
    data: { user: selectedKey1, data: JSON.stringify(newList) },
  };

  axios(config)
    .then((r) => {
      message.success("File saved mysql");
    })
    .catch((e) => {
      console.log(e);
    });
};
export default ModelEdit;
