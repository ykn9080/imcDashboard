import React from "react";
import { useHistory } from "react-router-dom";
import DenseAppBar from "components/Common/AppBar";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import IconArray1 from "components/SKD/IconArray1";

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
      onClick: () => history.push("/"),
    },
  ];
  return (
    <div>
      <DenseAppBar
        title={"Setting"}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div style={{ marginTop: 10 }}>
        <AntFormDisplay
          formArray={formdt["5f0e8d8689db1023b0165b18"]}
          // onValuesChange={onValuesChange}
          // initialValues={initialValues}
        />
      </div>
    </div>
  );
};

export default ModelSetting;
