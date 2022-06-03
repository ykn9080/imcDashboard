import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import axios from "axios";
import _ from "lodash";
import querySearch from "stringquery";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import ParamMenu from "components/SKD/ParamMenu";
import ModelViewLayout from "Model/ModelViewLayout";
import { localList, checkSetting, findInitDash } from "Model";
import "./model.css"
require("dotenv").config();

const ModelView = (props) => {
  const imcsvr = process.env.REACT_APP_SERVER;

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  let tempModel = useSelector((state) => state.global.tempModel);
  let tempModelList = useSelector((state) => state.global.tempModelList);
  let reloadModel = useSelector((state) => state.global.reloadModel);
  let currentData = useSelector((state) => state.global.currentData);
  if (currentData) tempModel = currentData;
  let query = querySearch(location.search);

  // useEffect(() => {
  //   // if (location.state && reloadModel !== true) {
  //   //   dispatch(globalVariable({ tempModel: location.state }));
  //   // }
  //   // //else if (!tempModel | (reloadModel === true)) {
  //   // else {
  //   //   dispatch(globalVariable({ reloadModel: _.cloneDeep(false) }));

  //     //let selectdt = findInitDash(tempModelList);
  //     //if (!selectdt) return;
  //     // const id = "613f3aae990a4b5b34e8d781";
  //     const type = checkSetting().datatype;
  //     // console.log(type);
  //     let config, url;
  //     //console.log(selectdt, type);
  //     // switch (type) {
  //     //   case "local":
  //     //     // const cdata = _.find(localList(), (o) => {
  //     //     //   return o._id === "613f3aae990a4b5b34e8d781";
  //     //     // });
  //     //     //replaceRealtime(cdata);
  //     //     dispatch(globalVariable({ tempModel: selectdt }));
  //     //     break;
  //     //   case "mongodb":
  //     //     url = checkSetting().url;
  //     //     if (!url) url = `${imcsvr}/dashboard`;
  //     //     config = {
  //     //       method: "get",
  //     //       url,
  //     //     };

  //     //     axios(config).then((r) => {
  //     //       if (r.data && r.data.length > 0)
  //     //         //replaceRealtime(r.data[0]);
  //     //         dispatch(globalVariable({ tempModel: r.data[0] }));
  //     //     });
  //     //     break;
  //     // case "mysql":
  //     // default:

  //     // const id = 1;
  //     // url = imcsvr;
  //     // config = {
  //     //   method: "get",
  //     //   url: `${url}/${id}`,
  //     // };
  //     // console.log(config);
  //     // axios(config).then((r) => {
  //     //   console.log("r", r);
  //     //   if (r.data)
  //     //     // //replaceRealtime(r.data[0]);
  //     //     localStorage.setItem("dashdata", JSON.stringify(r.data.data));
  //     //   localStorage.setItem(
  //     //     "dashsetting",
  //     //     JSON.stringify({ datatype: "mysql" })
  //     //   );

  //     //   dispatch(globalVariable({ tempModel: JSON.parse(r.data.data) }));
  //     // });
  //     //     break;
  //     // }
  //   }
  // }, [location.state, reloadModel, tempModelList]);

  const reloadHandler = () => {
    dispatch(globalVariable({ reloadModel: true }));
  };
  const edit = () => {
    dispatch(globalVariable({ selectedKey: query._id }));
    history.push(`/edit`);

    dispatch(globalVariable({ currentStep: 4 }));
  };
  const applyParam=(param)=>{
    console.log(param);
  }
  const btnArr = [
    {
      tooltip: "List",
      awesome: "list-alt",
      fontSize: "small",
      color: "inherit",

      onClick: () => history.push("./list"), //setVisible(true),
    },
    {
      tooltip: "Reload",
      awesome: "sync-alt",
      fontSize: "small",
      color: "inherit",

      onClick: reloadHandler, //setVisible(true),
    },
    {
      tooltip: "Edit",
      awesome: "pencil-alt",
      fontSize: "small",
      color: "inherit",
      onClick: edit,
    },
  ];

  return (
    <>
      {!props.blank && (
        <>
          <DenseAppBar
            title={"Dashboard"}
            right={<IconArray1 btnArr={btnArr} />}
          ></DenseAppBar>
          <div
            style={{
              paddingLeft: 10,
              paddingTop: 5,
            }}
          >
            <AntBreadCrumb />
          </div>
        </>
      )}
      {tempModel ? (
        <>
        <ParamMenu applyParam={applyParam}/>
        <ModelViewLayout data={tempModel} errorurl={props.errorurl} />
        </>
      ) : null}
    </>
  );
};

export default ModelView;
