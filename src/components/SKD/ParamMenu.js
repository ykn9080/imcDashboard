import React from "react";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { DatePicker, Space, Button, Select, TreeSelect,Typography  } from "antd";
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
const { Title } = Typography;

export default function ParamMenu(props) {
  const [show, setShow] = React.useState(false);
  const [param, setParam] = React.useState({});


  const handleClick = (event) => {
    setShow(!show);
  };
  const onChange = (date, dateString) => {
    console.log(dateString);
    setParam({ ...param, date: dateString });
  };
  const onRadioChange = (value) => {
    console.log("radio checked", value);
    setParam({ ...param, usertype: value });
  };
  const onTreeChange = (newValue) => {
    console.log(newValue);
    setParam({ ...param, country: newValue });
  };
  const paramBox = (
    <div className="space-align-container">
      <div className="space-align-block">
        <Space>
        <Title level={5}>h5. Ant Design</Title>
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
            onChange={onChange}
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
          <RangePicker onChange={onTreeChange} style={{ width: "150px" }} />
          <Button type="primary" onClick={handleClick}>
            Submit
          </Button>
        </Space>
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ textAlign: "right", marginRight: 20, cursor: "pointer" }}>
        {show === false ? (
          <DownOutlined onClick={handleClick} />
        ) : (
          <UpOutlined onClick={handleClick} />
        )}
      </div>
      <div>{show && paramBox}</div>
    </div>
  );
}
