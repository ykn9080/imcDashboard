import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import DenseAppBar from "components/Common/AppBar";
import $ from "jquery";
import ModelList from "Model/ModelList";
import ModelView from "Model/ModelView";
import ModelEdit from "Model/ModelEdit";
import ModelSetting from "Model/ModelSetting";
import background from "images/background.png";
import sampledata from "config/sampledata.json";
import axios from "axios";
require("dotenv").config();

const sqlsvr = process.env.REACT_APP_SERVER;
const mongosvr = process.env.REACT_APP_SERVER;

const Model = ({ match }) => {
  const dispatch = useDispatch();
  let tempModel = useSelector((state) => state.global.tempModel);
  let title = match.params.name;
  // titleUpper = "";
  if (typeof match.params.child != "undefined") title = match.params.child;
  if (typeof match.params.grandchild != "undefined")
    title = match.params.grandchild;

  if (title) {
    title = title.toLowerCase();
  }

  useEffect(async () => {
    $(window).on("resize", () => {
      $("#dvbody").css({ minHeight: window.innerHeight });
    });
    if (!tempModel) {
      const data = await localInit("mysql");
      console.log(data);
      dispatch(globalVariable({ tempModelList: data }));
      dispatch(globalVariable({ tempModel: data[0] }));
    }
  }, []);
  return (
    <>
      <div
        id="dvbody"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "repeat",
          minHeight: window.innerHeight,
        }}
      >
        {(() => {
          switch (title) {
            case "list":
              return (
                <>
                  <DenseAppBar title={"Model"}></DenseAppBar>
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
  console.log(data);
  if (!data) return;
  return data[0];
};
export const localInit = async (type) => {
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
      const id = 1;
      const config = {
        method: "get",
        url: `${sqlsvr}/${id}`,
      };

      const r = await axios(config);

      if (r.data) {
        let data = [];
        if (r.data.data && r.data.data.length > 0)
          data = JSON.parse(r.data.data);
        data = await loopRealtime(data);

        localStorage.setItem("dashdata", JSON.stringify(data));
        localStorage.setItem(
          "dashsetting",
          JSON.stringify({ datatype: "mysql" })
        );
        return data;
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
export async function loopRealtime(arr) {
  return await Promise.all(
    arr.map(async (k, i) => {
      if (k.resultsAuthor) {
        const updatedt = await replaceRealtime(k.resultsAuthor);
        k.resultsAuthor = updatedt;
        return k;
      } else return k;
    })
  );
}
export async function replaceRealtime(lay) {
  return await Promise.all(
    lay.map(async (k) => {
      if (k?.dtsetting?.dtype === "api") {
        //} && k?.dtsetting?.refresh === true) {

        let config = {
          method: k.dtsetting.method,
          url: k.dtsetting.url,
        };
        switch (k.dtsetting.method) {
          case "post":
            if (k.dtsetting.body) config.data = k.dtsetting.body;
            break;
          case "get":
            if (k.dtsetting?.params)
              config.url = config.url + "?" + k.dtsetting.parameters;
            break;
        }

        const dt = await axios(config);
        k.dtlist = dt.data;
        return k;
      } else {
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
