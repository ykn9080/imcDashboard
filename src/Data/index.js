import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import Dataget from "./Dataget";
import DataPaste from "./DataPaste";
import SheetJSApp from "./Excel/Sheetjs";
import {
  Select,
  Row,
  Col,
  Typography,
  Button,
  Divider,
  Tooltip,
  message,
} from "antd";
import { BiReset } from "react-icons/bi";

const { Option } = Select;
const { Title } = Typography;

const Index = ({ authObj, onChange }) => {
  const dispatch = useDispatch();
  const [dtype, setDtype] = useState();

  useEffect(() => {
    if (authObj && authObj?.dtsetting) setDtype(authObj.dtsetting.dtype);
  }, []);
  function handleChange(value) {
    setDtype(value);
  }
  const onDataUpdate = (authObj, dtlist, dtsetting) => {
    authObj.dtlist = dtlist;
    authObj.dtsetting = dtsetting;
    switch (checkDatatype()) {
      case "local":
      default:
        localStorage.setItem("modelchart", JSON.stringify(authObj));
        break;
      case "mongodb":
        dispatch(globalVariable({ tempModule: authObj }));
        break;
    }
    onChange(authObj);
  };
  return (
    <div style={{ padding: "5px 5px 10px 10px" }}>
      <Row gutter={4}>
        <Col flex={11}>
          <Title level={4}>Data</Title>
        </Col>
        <Col flex={"auto"}>
          <div style={{ float: "right" }}>
            <Tooltip title="Reset data">
              <Button
                type="primary"
                size="small"
                icon={<BiReset />}
                onClick={() => setDtype(null)}
              />
            </Tooltip>
          </div>
        </Col>
      </Row>

      <Divider style={{ marginTop: 0 }} />
      {(() => {
        switch (dtype) {
          case "api":
            return (
              <div>
                <Dataget authObj={authObj} onDataUpdate={onDataUpdate} />
              </div>
            );
          case "excel":
            return (
              <>
                <SheetJSApp authObj={authObj} onDataUpdate={onDataUpdate} />
              </>
            );
          case "paste":
            return (
              <>
                <DataPaste authObj={authObj} onDataUpdate={onDataUpdate} />
              </>
            );
          default:
            return (
              <div>
                <label
                  for="dtype"
                  style={{ width: 50, marginRight: 10, marginLeft: 20 }}
                >
                  Data type:
                </label>
                <Select
                  name="dtype"
                  defaultValue={dtype}
                  onChange={handleChange}
                  style={{ width: 200 }}
                  placeholder="Select data type"
                >
                  <Option value=""></Option>
                  <Option value="api">API</Option>
                  <Option value="excel">Excel</Option>
                  <Option value="paste">Direct Paste</Option>
                </Select>
              </div>
            );
        }
      })()}
    </div>
  );
};

export const checkUploadSize = (val) => {
  let rtn = true;

  if (checkDatatype() === "local" && val.length > 500) {
    rtn = false;
  }
  return rtn;
};
export const checkDatatype = () => {
  let sett = localStorage.getItem("dashsetting");
  if (sett) sett = JSON.parse(sett);
  return sett.datatype;
};

export default Index;
