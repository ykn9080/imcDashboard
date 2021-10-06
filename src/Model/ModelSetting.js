import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import DenseAppBar from "components/Common/AppBar";
import _ from "lodash";
import AntFormDisplay from "imcformbuilder";
import { globalVariable } from "actions";
import { Typography } from "antd";
import IconArray1 from "components/SKD/IconArray1";
import formList from "./AntFormDisplay.json";

const { Title } = Typography;
const formArray = {
  list: [
    {
      label: "Datatype",
      name: "datatype",
      type: "select",
      seq: 0,
      optionArray: [
        {
          value: "local",
          text: "local",
        },
        {
          value: "mongodb",
          text: "mongodb",
        },
      ],
      formColumn: 1,
      layout: "horizontal",
      formItemLayout: {
        labelCol: {
          span: 2,
        },
        wrapperCol: {
          span: 22,
        },
      },
      editable: true,
      initialValues: {},
      defaultValue: "local",
    },
    {
      label: "Apiurl",
      name: "apiurl",
      type: "input",
      seq: 1,
      formColumn: 1,
      layout: "vertical",
      formItemLayout: null,
      editable: true,
      initialValues: {
        datatype: "local",
      },
      shouldupdate: true,
      shouldfield: "datatype",
      shouldvalue: "mongodb",
    },
  ],
  setting: {
    formItemLayout: {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    },
    formColumn: 1,
    layout: "vertical",
    size: "middle",
  },
};

const summaryArray = formList["newdash"];

const ModelSetting = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [summaryInit, setSummaryInit] = useState();
  const [settingInit, setSettingInit] = useState();
  let tempModel = useSelector((state) => state.global.tempModel);

  useEffect(() => {
    const sum = { title: tempModel?.title, desc: tempModel?.desc };
    setSummaryInit(sum);
    localStorage.setItem("summary", JSON.stringify(sum));
    makeSetting();
  }, []);

  const btnArr = [
    {
      tooltip: "Save Setting",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      "aria-controls": "savesetting",
      onClick: () => {
        let summary = localStorage.getItem("summary");
        let dashList = localStorage.getItem("dashdata");
        if (dashList) dashList = JSON.parse(dashList);
        if (summary) {
          tempModel = { ...tempModel, ...JSON.parse(summary) };
          var index = _.findIndex(dashList, { _id: tempModel._id });
          dashList.splice(index, 1, tempModel);
          localStorage.setItem("dashdata", JSON.stringify(dashList));
          dispatch(globalVariable({ tempModel }));
          localStorage.removeItem("summary");
        }
        history.push("/edit");
      },
    },

    {
      tooltip: "Back to Dashboard",
      awesome: "level-up-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => history.push("/edit"),
    },
  ];

  const onValuesSetting = (changedValues, allValues) => {
    let setting = localStorage.getItem("dashsetting");
    if (setting) setting = JSON.parse(setting) | {};
    setting = { ...setting, ...allValues, ...changedValues };
    localStorage.setItem("dashsetting", JSON.stringify(setting));
  };
  const makeSetting = () => {
    let setting = localStorage.getItem("dashsetting");
    if (setting) {
      setting = JSON.parse(setting);
      setSettingInit(setting);
    }
  };
  const onValuesChange = (changedValues, allValues) => {
    let summary = localStorage.getItem("summary") | {};
    if (summary) summary = JSON.parse(summary);
    summary = { ...summary, ...changedValues };
    localStorage.setItem("summary", JSON.stringify(summary));
  };
  const barStyle = {
    width: "100%",
    backgroundColor: "#EEEEEE",
    height: 35,
    borderRadius: 5,
    borderBottom: "solid 1px #BBBBBB",
    paddingLeft: 20,
    paddingTop: 5,
  };
  const containStyle = {
    marginTop: 30,
    margin: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
  };
  const innerStyle = {
    padding: 20,
  };
  const Headtitle = ({ title }) => {
    return (
      <div style={barStyle}>
        <Title level={5}>{title}</Title>
      </div>
    );
  };
  return (
    <div>
      <DenseAppBar
        title={"Setting"}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>

      <div style={containStyle}>
        <Headtitle title="Summary" />
        <div style={innerStyle}>
          <AntFormDisplay
            formArray={summaryArray}
            onValuesChange={onValuesChange}
            initialValues={summaryInit}
          />
        </div>
      </div>
      <div style={containStyle}>
        <Headtitle title="Setting" />
        <div style={innerStyle}>
          <AntFormDisplay
            formArray={formArray}
            onValuesChange={onValuesSetting}
            initialValues={settingInit}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelSetting;
