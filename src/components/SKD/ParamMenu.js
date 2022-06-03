import React from "react";

import { DownOutlined, UpOutlined, CloseOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Space,
  Button,
  Select,
  TreeSelect,
  Typography,
} from "antd";
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
const { Title } = Typography;

export default function ParamMenu(props) {
  const [show, setShow] = React.useState(false);
  const [param, setParam] = React.useState({});

  const handleClick = (event) => {
    props.applyParam(param);
    // setShow(!show);
  };
  const onDateChange = (date, dateString) => {
    console.log(dateString);
    let param1 = {};
    if (param) param1 = { ...param };
    setParam({ ...param1, date: dateString });
  };
  const onRadioChange = (value) => {
    console.log("radio checked", value);
    let param1 = {};
    if (param) param1 = { ...param };
    setParam({ ...param1, usertype: value });
  };
  const onTreeChange = (newValue) => {
    console.log(newValue);
    let param1 = {};
    if (param) param1 = { ...param };
    setParam({ ...param1, country: newValue });
  };
  const paramText = param ? (
    <div style={{ marginLeft: 18 }}>
      <Space>
        {param?.usertype && (
          <>
            <Title level={5}>User:</Title>
            <div style={{ marginTop: -8 }}>{param.usertype}</div>
          </>
        )}
        {param?.date && (
          <>
            <Title level={5}>Date</Title>
            <div style={{ marginTop: -8 }}>
              {param.date[0]} ~ {param.date[1]}
            </div>
          </>
        )}
        {param?.country && (
          <>
            <Title level={5}>Country: </Title>
            <div style={{ marginTop: -8 }}>{param.country.toString()}</div>
          </>
        )}
        {/* {Object.keys(param).length > 0 && (
          <div style={{ marginTop: -8 }}>
            <Button icon={CloseOutlined} />
          </div>
        )} */}
      </Space>
    </div>
  ) : null;
  const paramBox = (
    <div className="space-align-container">
      <div className="space-align-block">
        <Space>
          <Select
            placeholder="User type"
            onChange={onRadioChange}
            style={{ width: 100 }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="doctor">Doctor</Select.Option>
            <Select.Option value="director">Director</Select.Option>
            <Select.Option value="designer">Designer</Select.Option>
          </Select>
          <TreeSelect
            showSearch
            style={{ width: "150px" }}
            // value={value}
            dropdownStyle={{ maxHeight: 1000, overflow: "auto" }}
            placeholder="Country"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={onTreeChange}
          >
            <TreeNode value="all" title="All">
              <TreeNode value="asia" title="Asia">
                <TreeNode value="korea" title="Korea" />
                <TreeNode value="japan" title="Japan" />
                <TreeNode value="tailand" title="Tailand" />
              </TreeNode>
              <TreeNode value="africa" title="Africa">
                <TreeNode value="egypt" title="Egypt" />
              </TreeNode>
              <TreeNode value="europe" title="Europe">
                <TreeNode value="poland" title="Poland" />
                <TreeNode value="czech" title="Czech" />
              </TreeNode>
              <TreeNode value="america" title="America"></TreeNode>
              <TreeNode value="oceania" title="Oceania"></TreeNode>
              <TreeNode value="others" title="Others"></TreeNode>
            </TreeNode>
          </TreeSelect>
          <RangePicker onChange={onDateChange} style={{ width: "150px" }} />
          <Button type="primary" onClick={handleClick}>
            Submit
          </Button>
          <Button onClick={() => setParam()}>Clear</Button>
        </Space>
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ textAlign: "right", marginRight: 20, cursor: "pointer" }}>
        {show === false ? (
          <DownOutlined onClick={() => setShow(!show)} />
        ) : (
          <UpOutlined onClick={() => setShow(!show)} />
        )}
      </div>
      <div>{show ? paramBox : paramText}</div>
    </div>
  );
}
