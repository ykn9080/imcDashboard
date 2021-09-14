import React from "react";
import { useHistory } from "react-router-dom";
import DenseAppBar from "components/Common/AppBar";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import IconArray1 from "components/SKD/IconArray1";
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
    {
      label: "Save",
      name: "submit",
      type: "button",
      seq: 2,
      action: "submit",
      btnColor: "primary",
      align: "right",
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
const ModelSetting = () => {
  const history = useHistory();
  const btnArr = [
    // {
    //   tooltip: "Back to List",
    //   awesome: "level-up-alt",
    //   fontSize: "small",
    //   color: "inherit",
    //   onClick: () => history.push("./model"),
    // },

    {
      tooltip: "Back to Dashboard",
      awesome: "level-up-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => history.push("/edit"),
    },
  ];
  const onFinish = (val) => {
    console.log(val);
    localStorage.setItem("dashsetting", JSON.stringify(val));
  };
  return (
    <div>
      <DenseAppBar
        title={"Setting"}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div
        style={{
          margin: 10,
          padding: 20,
          backgroundColor: "white",
          border: "solid 1px gray",
        }}
      >
        <AntFormDisplay
          formArray={formArray}
          // onValuesChange={onValuesChange}
          // initialValues={initialValues}
          onFinish={onFinish}
        />
      </div>
    </div>
  );
};

export default ModelSetting;
