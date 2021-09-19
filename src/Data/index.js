import React, { useEffect, useState } from "react";
import Dataget from "./Dataget";
import { SheetJSApp } from "./Excel/Sheetjs";
import { Select, Row, Col, Typography, Button, Divider, Tooltip } from "antd";
import { BiReset } from "react-icons/bi";

const { Option } = Select;
const { Title } = Typography;

const Index = ({ authObj }) => {
  const [datatype, setDatatype] = useState();
  useEffect(() => {
    if (authObj && authObj?.properties?.datatype)
      setDatatype(authObj.properties.datatype);
  }, []);
  function handleChange(value) {
    setDatatype(value);
    // let setting = localStorage.getItem("dashsetting");
    // if (setting) {
    //   setting = JSON.parse(setting);
    //   setting.datatype = value;
    //   localStorage.setItem("dashsetting", JSON.stringify(setting));
    // }

    // console.log(`selected ${value}`);
  }
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
                onClick={() => setDatatype(null)}
              />
            </Tooltip>
          </div>
        </Col>
      </Row>

      <Divider style={{ marginTop: 0 }} />
      {(() => {
        switch (datatype) {
          case "api":
            return (
              <div>
                <Dataget authObj={authObj} />
              </div>
            );
          case "excel":
            return (
              <>
                <SheetJSApp authObj={authObj} />
              </>
            );
          default:
            return (
              <div>
                <label
                  for="datatype"
                  style={{ width: 50, marginRight: 10, marginLeft: 20 }}
                >
                  Data type:
                </label>
                <Select
                  name="datatype"
                  onChange={handleChange}
                  style={{ width: 200 }}
                  placeholder="Select data type"
                >
                  <Option value=""></Option>
                  <Option value="api">API</Option>
                  <Option value="excel">Excel</Option>
                  <Option value="input">Direct Paste</Option>
                </Select>
              </div>
            );
        }
      })()}
    </div>
  );
};

export default Index;
