import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { globalVariable } from "actions";
import { message } from "antd";
import DenseAppBar from "components/Common/AppBar";
import $ from "jquery";
import ModelList from "Model/ModelList";
import ModelView from "Model/ModelView";
import ModelEdit, { saveToPermernent } from "Model/ModelEdit";
import ModelSetting from "Model/ModelSetting";
import IconArray1 from "components/SKD/IconArray1";
import background from "images/background.png";
import sampledata from "config/sampledata.json";
import axios from "axios";
import { UpdateColnData } from "../Data/SingleTable";
import _ from "lodash";
import { isJSON } from "components/functions/dataUtil";

require("dotenv").config();

const sqlsvr = process.env.REACT_APP_SERVER;
const mongosvr = process.env.REACT_APP_SERVER;

const Model = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  let tempModel = useSelector((state) => state.global.tempModel);
  let tempModelList = useSelector((state) => state.global.tempModelList);

  let title = match.params.name;

  if (typeof match.params.child != "undefined") title = match.params.child;
  if (typeof match.params.grandchild != "undefined")
    title = match.params.grandchild;

  if (title) {
    title = title.toLowerCase();
  }

  useEffect(() => {
    $(window).on("resize", () => {
      $("#dvbody").css({ minHeight: window.innerHeight + 600 });
    });

    const findList = async () => {
      if (!tempModel) {
        const rtn = await localInit("mysql");

        if (rtn.data.length > 0) {
          let index = _.findIndex(rtn.data, (o) => {
            return o.selected === true;
          });
          console.log(index);
          if (!index | (index === -1)) index = 0;
          dispatch(globalVariable({ tempModelList: rtn.data }));
          dispatch(globalVariable({ tempModel: rtn.data[index] }));
          dispatch(globalVariable({ selectedKey1: rtn.skey }));
          dispatch(globalVariable({ selectedKey: rtn.data[index]?.id }));
        }
      }
    };
    findList();
  }, []);
  const handleSave = () => {
    saveToPermernent(tempModel, tempModelList, "default");
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
        history.push("/view");
      },
    },
  ];
  return (
    <>
      <div
        id="dvbody"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "repeat",
          minHeight: window.innerHeight + 600,
        }}
      >
        {(() => {
          switch (title) {
            case "list":
              return (
                <>
                  <DenseAppBar
                    title={"Model"}
                    right={<IconArray1 btnArr={btnArr} />}
                  ></DenseAppBar>
                  <ModelList type={title} />
                </>
              );
            case "view":
              return (
                <>
                  <ModelView />
                </>
              );

            case "edit":
              return (
                <>
                  <ModelEdit />
                </>
              );

            case "setting":
              return (
                <>
                  <ModelSetting />
                </>
              );
            default:
              return (
                <>
                  <ModelView detour="edit" />
                </>
              );
          }
        })()}
      </div>
    </>
  );
};
export const findInitDash = (data) => {
  if (!data) return;
  return data[0];
};
export const localInit = async (type, paramUserInput, selectedKey) => {
  let url;
  switch (type) {
    case "local":
    default:
      if (!localStorage.getItem("dashdata"))
        localStorage.setItem("dashdata", JSON.stringify(sampledata));
      if (!localStorage.getItem("dashsetting")) {
        const set = { datatype: "local" };
        localStorage.setItem("dashsetting", JSON.stringify(set));
      }
      return sampledata;
    case "mysql":
      let config = {
        method: "get",
        url: `${sqlsvr}/api/dashboard?user=default`,
      };

      const r = await axios(config);
      if (r.data) {
        let data = [];

        if (r.data[0].data && r.data[0].data.length > 0)
          data = JSON.parse(r.data[0].data);
        let skey = r.data[0].selected;
        if (!skey) skey = "default";
        data = await loopRealtime(data, paramUserInput, selectedKey);

        localStorage.setItem("dashdata", JSON.stringify(data));
        localStorage.setItem(
          "dashsetting",
          JSON.stringify({ datatype: "mysql" })
        );
        return { data, skey };
      }
      return null;
    case "mongodb":
      url = checkSetting().url;
      if (!url) url = `${mongosvr}/dashboard`;
      config = {
        method: "get",
        url,
      };

      const mongortn = await axios(config);
      if (mongortn.data && mongortn.data.length > 0) {
        return mongortn.data[0];
      }
      return null;
  }
};
export async function loopRealtime(arr, paramUserInput, selectedKey) {
  return await Promise.all(
    arr.map(async (k, i) => {
      if (k.resultsAuthor) {
        if ((k.id === selectedKey) | !selectedKey) {
          const updatedt = await replaceRealtime(
            k.resultsAuthor,
            paramUserInput
          );
          k.resultsAuthor = updatedt;
        }
        return k;
      } else return k;
    })
  );
}
const attachParamValue = (paramUserInputObj) => {
  let val = paramUserInputObj.value;
  if (
    (paramUserInputObj.type === "array") |
    (paramUserInputObj.type === "date")
  )
    val = paramUserInputObj.value.join(",");

  switch (paramUserInputObj.type) {
    case "array":
      return val + "$in";
    case "date":
      return val + "$between";
    default:
      return val;
  }
};
const replaceParamValue = (psplit, paramUserInput) => {
  paramUserInput.map((s, j) => {
    if (psplit.length > 0)
      psplit.map((k, i) => {
        const kk = k.split("=");
        if (kk[0] === s.key) {
          kk[1] = attachParamValue(s);
          const kkk = kk.join("=");
          psplit.splice(i, 1, kkk);
        } else psplit.push(`${s.key}=${attachParamValue(s)}`);
        return null;
      });
    else {
      psplit.push(`${s.key}=${attachParamValue(s)}`);
    }
    return null;
  });
  return psplit;
};
const makeParam = (paramFixed, parammapping, paramUserInput) => {
  let psplit = [];
  if (paramFixed) psplit = paramFixed.split("&");
  paramUserInput.map((k, i) => {
    //replace param name with parammap
    if (parammapping?.[k.key]) {
      k["key"] = parammapping[k.key];
      paramUserInput.splice(i, 1, k);
    } else paramUserInput.splice(i, 1);
    return null;
  });

  psplit = replaceParamValue(psplit, paramUserInput);
  console.log(paramUserInput, parammapping, psplit);
  return psplit.join("&");
};
export async function replaceRealtime(lay, paramUserInput) {
  return await Promise.all(
    lay.map(async (k) => {
      if (k?.dtsetting?.dtype === "api") {
        //} && k?.dtsetting?.refresh === true) {

        let config = {
          method: k.dtsetting.method,
          url: k.dtsetting.url,
        };
        let paramFixed, parammapping;

        if (k.dtsetting.parammapping) {
          if (isJSON(k.dtsetting.parammapping))
            parammapping = JSON.parse(k.dtsetting.parammapping);
          else message.error("Incorrect Json format!!");
        }

        switch (k.dtsetting.method) {
          case "post":
            paramFixed = k.dtsetting.body;
            if (paramUserInput)
              paramFixed = makeParam(paramFixed, parammapping, paramUserInput);
            if (paramFixed) config.data = paramFixed;
            break;
          case "get":
          default:
            paramFixed = k.dtsetting.parameters;
            if (paramUserInput)
              paramFixed = makeParam(paramFixed, parammapping, paramUserInput);
            if (paramFixed) config.url = config.url + "?" + paramFixed;
            break;
        }

        const dt = await axios(config);
        k.originlist = dt.data;
        const rtn = UpdateColnData(k);
        k.dtlist = rtn.dtlist;
        return k;
      } else {
        const rtn = UpdateColnData(k);
        k.dtlist = rtn.dtlist;
        return k;
      }
    })
  );
}
export const checkSetting = () => {
  let setting = localStorage.getItem("dashsetting");
  if (setting) {
    setting = JSON.parse(setting);
    return setting;
  } else return { datatype: "local" };
};

export const localList = () => {
  let dt = localStorage.getItem("dashdata");
  if (dt) {
    dt = JSON.parse(dt);
    return dt;
  } else return sampledata;
};

export default Model;
