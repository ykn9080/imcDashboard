import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import _ from "lodash";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import ParamMenu, { replaceContinentToCountry } from "components/SKD/ParamMenu";
import ModelViewLayout from "Model/ModelViewLayout";
import { localInit } from "Model";
import "./model.css";
require("dotenv").config();

const ModelView = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  let tempModel = useSelector((state) => state.global.tempModel);
  let showDetail = useSelector((state) => state.global.showDetail);
  let currentData = useSelector((state) => state.global.currentData);
  let selectedKey = useSelector((state) => state.global.selectedKey);
  if (currentData) tempModel = currentData;
  const param = location?.state?.param;
  const keepopen = location?.state?.keepopen;

  const edit = () => {
    history.push(`/edit`);
    dispatch(globalVariable({ currentStep: 4 }));
  };
  if (location.search === "?detour=edit") {
    edit();
  }

  const applyParam = async (param, keepopen) => {
    let newparam = allRemove(_.cloneDeep(param));
    console.log(newparam);
    newparam.map((k, i) => {
      if (k.key === "country") {
        k.value = replaceContinentToCountry(k.value);
        console.log(k.value);
        newparam.splice(i, 1, k);
      }
      return null;
    });
    console.log(newparam);
    const rtn = await localInit("mysql", newparam, selectedKey);

    if (rtn.data.length > 0) {
      dispatch(globalVariable({ tempModelList: rtn.data }));
      let index = _.findIndex(rtn.data, (o) => {
        return o.id === selectedKey;
      });
      if (!index) index = 0;
      dispatch(globalVariable({ tempModel: _.cloneDeep(rtn.data[index]) }));
      history.push({
        pathname: "/edit",
        state: { detour: "view", param, keepopen },
      });
    }
  };

  const btnArr = [
    {
      tooltip: "List",
      awesome: "list-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => history.push("./list"), //setVisible(true),
    },
    {
      tooltip: "Edit",
      awesome: "pencil-alt",
      fontSize: "small",
      color: "inherit",
      onClick: edit,
    },
  ];

  const detailArr = [
    {
      tooltip: "Go to Previous",
      awesome: "level-up-alt",
      fontSize: "small",
      color: "inherit",
      onClick: () => {
        dispatch(globalVariable({ showDetail: true }));
      },
    },
  ];
  const topbar = (
    <DenseAppBar
      title={"Dashboard"}
      right={<IconArray1 btnArr={btnArr} />}
    ></DenseAppBar>
  );
  const detailbar = (
    <DenseAppBar
      title={"Ranking"}
      right={<IconArray1 btnArr={detailArr} />}
    ></DenseAppBar>
  );
  const breadcrumb = (
    <div
      style={{
        paddingLeft: 10,
        paddingTop: 5,
      }}
    >
      <AntBreadCrumb />
    </div>
  );
  return (
    <>
      {!props.blank && (
        <>
          {showDetail === true ? detailbar : topbar}
          {breadcrumb}
        </>
      )}
      {tempModel ? (
        <>
          {tempModel.parameters && (
            <ParamMenu
              applyParam={applyParam}
              curdata={tempModel}
              param={param}
              keepopen={keepopen}
            />
          )}
          <ModelViewLayout errorurl={props.errorurl} />
        </>
      ) : null}
    </>
  );
};

export default ModelView;
export const allRemove = (param) => {
  _.remove(param, (o) => {
    return (o.value === "all") | (o.value === ["all"]);
  });

  return param;
};
