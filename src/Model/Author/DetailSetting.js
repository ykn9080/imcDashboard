import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AntFormDisplay from "imcformbuilder";
import { Typography } from "antd";

const { Title } = Typography;

const DetailSetting = ({ authObj, onChange }) => {
  const location = useLocation();
  const [formArray, setFormArray] = useState();
  const [settingInit, setSettingInit] = useState();
  let tempModelList = useSelector((state) => state.global.tempModelList);

  useEffect(() => {
    if (tempModelList) {
      formArray1.list[0].optionArray = [];
      tempModelList.map((k, i) => {
        formArray1.list[0].optionArray.push({
          value: k.id,
          text: k.title,
        });
        return null;
      });
      setFormArray(formArray1);
    }
    makeSetting(location.state.detailsetting);
  }, []);

  const onValuesSetting = (changedValues, allValues) => {
    let setting = localStorage.getItem("modelchart");

    let detailsetting = { ...allValues, ...changedValues };
    if (setting) setting = JSON.parse(setting);
    else setting = { ...location.state };
    setting = { ...setting, detailsetting: { ...detailsetting } };
    localStorage.setItem("modelchart", JSON.stringify(setting));
    //  if (onChange) onChange(authObj);
  };
  const makeSetting = (setting) => {
    if (setting) {
      setSettingInit(setting);
    }
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
      <div style={containStyle}>
        <Headtitle title="Setting" />
        <div style={innerStyle}>
          {formArray && (
            <AntFormDisplay
              formArray={formArray}
              onValuesChange={onValuesSetting}
              initialValues={settingInit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailSetting;

let formArray1 = {
  list: [
    {
      label: "Redirect Dashboard",
      name: "dashid",
      type: "select",
      seq: 0,
      optionArray: [],
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
    },
    {
      label: "Parameter",
      name: "parameter",
      type: "input",
      seq: 1,
      formColumn: 1,
      layout: "vertical",
      formItemLayout: null,
      editable: true,
      placeholder: "write [{key, value,type},...] as below",
      msglow:
        "[{ key: 'country', value: 'korea', type: 'string' },{ key: 'date', value: ['2021-01-12'], type: 'datetime' },...]",
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
