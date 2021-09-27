import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import axios from "axios";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import { Input, Row, Col, Alert, Spin, message } from "antd";
import styled, { css } from "styled-components";
import { checkUploadSize, checkDatatype } from "Data";

const { TextArea } = Input;

const Dataget = ({ authObj, onDataUpdate, ...props }) => {
  const dispatch = useDispatch();
  const [initVal, setInitVal] = useState();
  const [result, setResult] = useState();
  const [showalert, setShowalert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowalert(false);
    setLoading(false);
    switch (checkDatatype()) {
      case "local":
      default:
        localStorage.setItem("modelchart", JSON.stringify(authObj));
        break;
      case "mongodb":
        dispatch(globalVariable({ tempModule: authObj }));
        break;
    }

    if (authObj.dtsetting) {
      setInitVal(authObj.dtsetting);

      if (authObj.dtlist) setResult(JSON.stringify(authObj.dtlist, null, 2));
    } else {
      setInitVal({
        url: "",
        method: "get",
        body: "",
        header: "",
        datafield: "",
      });
      setResult(" ");
    }
  }, []);
  const makeStringify = (array) => {
    array.map((k, i) => {
      Object.keys(k).map((s, j) => {
        if ((typeof k[s] === "object") | Array.isArray(k[s]) && k[s] !== null) {
          k[s] = JSON.stringify(k[s]);
          array.splice(i, 1, k);
        }
        return null;
      });
      return null;
    });
    return array;
  };
  const onFinish = (val) => {
    let options = {
      method: val.method,
      url: val.url,
    };
    if (val.header) options = { ...options, header: val.header };

    setLoading(true);
    // let local = {},
    //   local1 = localStorage.getItem("modelchart");
    // if (local1) local = JSON.parse(local1);
    val.dtype = "api";
    //local.dtsetting = val;
    axios
      .request(options)
      .then(function (response) {
        let rtn = response.data;
        //$("#dvResult").css({ visibility: "visible" });
        if (val.datafield) {
          const fields = val.datafield.split(".");

          fields.map((k, i) => {
            rtn = rtn[k];
            return null;
          });
        }

        setResult(JSON.stringify(rtn, null, 2));

        //use localstorage to prevent state change

        if (Array.isArray(rtn)) {
          if (!checkUploadSize(rtn)) {
            message.info("Data cannot exceed 500 rows", 15);
          } else {
            val.dtype = "api";
            onDataUpdate(authObj, rtn, val);
            setShowalert(false);

            //props.onDataGet(makeStringify(rtn));
          }
        } else setShowalert(true);
        setLoading(false);
        setInitVal(val);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
        setInitVal(val);
        //localStorage.setItem("modelchart", JSON.stringify(local));
      });
  };

  return (
    <>
      <Row gutter={4}>
        <Col flex={6}>
          {initVal && (
            <AntFormDisplay
              formArray={formdt["60fe76d93f6f282f238e01bb"]}
              onFinish={onFinish}
              initialValues={initVal}
            />
          )}
        </Col>
        <Col flex={6}>
          {result && <TextArea rows={10} id="code" value={result}></TextArea>}
          {showalert && (
            <div style={{ marginTop: 5 }}>
              <Alert
                message="Not array!, Select an array datafield"
                type="error"
              />
            </div>
          )}
        </Col>
      </Row>
      <DarkBackground disappear={loading}>
        <div style={{ position: "absolute", top: 200, left: "50%" }}>
          <Spin spinning={loading} />
        </div>
      </DarkBackground>
    </>
  );
};
export const DarkBackground = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  ${(props) =>
    props.disappear &&
    css`
      display: block; /* show */
    `}
`;
export default Dataget;
