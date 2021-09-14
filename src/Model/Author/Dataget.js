import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiOutlineViewList } from "react-icons/hi";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import {
  Input,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Alert,
  Spin,
} from "antd";
import styled, { css } from "styled-components";

const { Title } = Typography;
const { TextArea } = Input;

const Dataget = ({ authObj, ...props }) => {
  const [initVal, setInitVal] = useState();
  const [result, setResult] = useState();
  const [showalert, setShowalert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowalert(false);
    setLoading(false);
    console.log("props", authObj, props);
    localStorage.setItem("modelchart", JSON.stringify(authObj));
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
    let local = {},
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.dtsetting = val;
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

        local.dtlist = rtn;
        localStorage.setItem("modelchart", JSON.stringify(local));

        if (Array.isArray(rtn)) {
          props.onDataGet(makeStringify(rtn));
          setShowalert(false);
        } else setShowalert(true);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
        localStorage.setItem("modelchart", JSON.stringify(local));
      });
  };

  return (
    <div style={{ padding: "5px 5px 10px 10px" }}>
      <Row gutter={4}>
        <Col flex={11}>
          <Title level={4}>Data</Title>
        </Col>
        <Col flex={"auto"}>
          <div style={{ textAlign: "right" }}>
            <Button icon={<HiOutlineViewList />} />
          </div>
        </Col>
      </Row>

      <Divider style={{ marginTop: 0 }} />
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
    </div>
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
