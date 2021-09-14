import { globalVariable } from "actions";
import { message } from "antd";
import axios from "axios";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import $ from "jquery";
import React, { useEffect } from "react";
import { GoDeviceDesktop } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ModelEdit3 from "./ModelEdit3";
import ModelEdit4, { saveLayout } from "./ModelEdit4";
import { checkSetting } from "Model";

const imcsvr = process.env.REACT_APP_SERVER;

const ModelEdit = (props) => {
  const history = useHistory(); // do this inside the component
  const dispatch = useDispatch();

  let currentStep = useSelector((state) => state.global.currentStep);
  let tempModel = useSelector((state) => state.global.tempModel);

  useEffect(() => {
    $(".ant-col.ant-col-6").css({
      "text-align": "right",
      "padding-right": "30px",
    });
  }, []);

  const saveToserver = () => {
    // dispatch(globalVariable({ triggerChild: ["save"] }));
    if (tempModel === "") {
      message.error("Incomplete file.");
      return false;
    }

    let newtempModel = { ...saveLayout(tempModel) };
    switch (checkSetting()) {
      case "local":
      default:
        saveTolocal(newtempModel);
        break;
      case "mongodb":
        let method = "post",
          id = "";
        if (newtempModel.hasOwnProperty("_id")) {
          method = "put";
          id = newtempModel._id;
        }

        let config = {
          method: method,
          url: `${imcsvr}/dashboard/${id}`,
          data: newtempModel,
        };

        axios(config).then((r) => {
          if (method === "post") {
            tempModel._id = r.data._id;
            dispatch(globalVariable({ tempModel }));
          }
          message.success("File successfully saved");
        });
        break;
    }
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
      });
      if (notexist) dashdata.push(data);
      localStorage.setItem("dashdata", JSON.stringify(dashdata));
    }
  };
  const gotoView = () => {
    dispatch(globalVariable({ selectedKey: tempModel._id }));
    //history.push(`/Model/view?_id=${tempModel._id}`);
    history.push(`/view`);
  };
  const setting = () => {
    history.push(`/setting`);
  };
  const btnArr = [
    {
      tooltip: "View",
      icon: <GoDeviceDesktop color="white" onClick={gotoView} />,
    },
    {
      tooltip: "Save to Server",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      "aria-controls": "save_server",
      onClick: saveToserver,
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

export default ModelEdit;
