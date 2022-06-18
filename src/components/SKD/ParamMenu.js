import React, { useEffect, useState } from "react";
import _ from "lodash";
import {
  CaretRightOutlined,
  UpOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FcSearch } from "react-icons/fc";
import { MdOutlineCleaningServices } from "react-icons/md";
import {
  DatePicker,
  Space,
  Button,
  Select,
  TreeSelect,
  Typography,
  Tag,
} from "antd";
import moment from "moment";
import { country, usertype } from "./ParamMenu.json";

const { RangePicker } = DatePicker;
const { TreeNode, SHOW_PARENT } = TreeSelect;
const { Title } = Typography;

export default function ParamMenu(props) {
  const [show, setShow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [param, setParam] = React.useState([]);
  const [param1, setParam1] = React.useState({});
  const [value, setValue] = useState([]);

  const [period, setPeriod] = React.useState();
  useEffect(() => {
    if (props.param) {
      const restparam = restoreParam(props.curdata, props.param);
      console.log(props.param, restparam);
      setParam(restparam);
      let p1 = {};
      restparam.map((k, i) => {
        let newval = k.value;
        if (k.period) setPeriod(k.period);
        if (k.key === "country") setValue(k.value);
        p1 = { ...p1, [k.key]: newval };
      });
      setParam1(p1);
    }
    if (props.keepopen) setShow(true);
  }, []);
  const handleClick = (event) => {
    props.applyParam(param);
  };
  const resetParam = () => {
    props.applyParam([]);
    setParam1({});
    setParam([]);
  };
  /**
   *
   * mapping된 파라미터 키을 파라미터 창에 있는 원래값으로 복원함.
   * (data<-createdata, data<-datatime)
   * @param {*} arr : tempModel
   * @param {*} param parameter mapping된
   * @returns
   */
  const restoreParam = (arr, param) => {
    console.log(arr, param);
    arr.resultsAuthor.map((k, i) => {
      param.map((s, j) => {
        if (k?.dtsetting?.parammapping) {
          const pmap = JSON.parse(k.dtsetting.parammapping);
          const invpmap = _.invert(pmap);
          if (invpmap[s.key]) {
            s["key"] = invpmap[s.key];
            param.splice(j, 1, s);
          }
        }
        return null;
      });
      return null;
    });
    return param;
  };

  const replaceArr = (arr, keyobj, replaceobj) => {
    var index = _.findIndex(param, keyobj);
    if (index > -1) param.splice(index, 1, replaceobj);
    else param.push(replaceobj);
    setParam(param);
    setParam1({ ...param1, [replaceobj.key]: replaceobj.value });
    console.log(param);
    return param;
  };

  const onDateChange = (date, dateString) => {
    _.remove(dateString, function (c) {
      return c === "";
    });

    if (dateString.length > 0)
      replaceArr(
        param,
        { key: "date" },
        { key: "date", value: dateString, type: "date" }
      );
  };
  const onCustomDateChange = (val) => {
    const datefrom = new Date(
      new Date().setDate(new Date().getDate() - val)
    ).toDateString();
    const dateto = new Date().toDateString();
    const paramrtn = replaceArr(
      param,
      { key: "date" },
      { key: "date", value: [datefrom, dateto], period: val, type: "date" }
    );

    props.applyParam(paramrtn, true);
    //    setOpen(false);
  };
  const onSelectChange = (value) => {
    replaceArr(
      param,
      { key: "usertype" },
      { key: "usertype", value: value, type: "string" }
    );
  };

  const onChange = (newValue) => {
    _.remove(newValue, function (c) {
      return (c === "all") | (c === "");
    });
    setValue(_.cloneDeep(newValue));
    //const countries = replaceContinentToCountry(newValue);
    //console.log(countries);
    if (newValue.length > 0)
      replaceArr(
        param,
        { key: "country" },
        { key: "country", value: newValue, type: "array" }
      );
  };
  const paramText =
    Object.keys(param1).length > 0 ? (
      <div style={{ marginLeft: 18, left: 30 }}>
        <Space>
          {param1?.usertype && (
            <>
              <label>User:</label>
              {param1.usertype}
            </>
          )}

          {param1?.date && param1.date.length > 0 && (
            <>
              <label>Date</label>
              {param1.date[0]} ~ {param1.date[1]}
            </>
          )}
          {param1?.country && param1.country.length > 0 && (
            <>
              <label>Country: </label>
              {param1.country.toString()}
            </>
          )}

          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={resetParam}
          />
        </Space>
      </div>
    ) : null;

  const tProps = {
    treeData: country,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    defaultValue: param1.country,
    treeDefaultExpandAll: true,
    placeholder: "Country",
    style: {
      width: "250px",
      zIndex: 1000,
    },
  };
  const paramBox = (
    <div className="space-align-container">
      <div className="space-align-block">
        <Space>
          <Select
            placeholder="User type"
            onChange={onSelectChange}
            style={{ width: 100 }}
            options={usertype}
            defaultValue={param1?.usertype ? param1?.usertype : "all"}
          >
            {/* <Select.Option value="all">All</Select.Option>
            <Select.Option value="doctor">Doctor</Select.Option>
            <Select.Option value="director">Director</Select.Option>
            <Select.Option value="designer">Designer</Select.Option> */}
          </Select>
          <TreeSelect {...tProps} />

          <RangePicker
            onChange={onDateChange}
            defaultValue={[
              moment(param1?.date?.[0]),
              moment(param1?.date?.[1]),
            ]}
            style={{ width: "250px" }}
            open={open}
            onOpenChange={(open) => setOpen(open)}
            renderExtraFooter={() => {
              return (
                <div>
                  <Tag
                    color={period === 1 && "#55acee"}
                    className="point"
                    onClick={() => onCustomDateChange(1)}
                  >
                    Today
                  </Tag>
                  <Tag
                    className="point"
                    color={period === 7 && "#55acee"}
                    onClick={() => onCustomDateChange(7)}
                  >
                    1 week
                  </Tag>
                  <Tag
                    color={period === 30 && "#55acee"}
                    className="point"
                    onClick={() => onCustomDateChange(30)}
                  >
                    1 month
                  </Tag>
                  <Tag
                    color={period === 92 && "#55acee"}
                    className="point"
                    onClick={() => onCustomDateChange(92)}
                  >
                    3 months
                  </Tag>
                  <Tag
                    className="point"
                    color={period === 183 && "#55acee"}
                    onClick={() => onCustomDateChange(183)}
                  >
                    6 months
                  </Tag>
                  <Tag
                    className="point"
                    color={period === 365 && "#55acee"}
                    onClick={() => onCustomDateChange(365)}
                  >
                    1 year
                  </Tag>
                </div>
              );
            }}
          />
          <Button
            style={{ zIndex: 1001 }}
            icon={<CaretRightOutlined />}
            onClick={handleClick}
          ></Button>
          <Button
            style={{ zIndex: 1001, marginLeft: -10 }}
            icon={<MdOutlineCleaningServices />}
            onClick={resetParam}
          ></Button>
        </Space>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 70, marginBottom: -9 }}>
      <div
        style={{
          cursor: "pointer",
          position: "absolute",
          right: 5,
          top: 110,
        }}
      >
        {show === false ? (
          <Button icon={<SearchOutlined />} onClick={() => setShow(!show)} />
        ) : (
          <Button
            type="text"
            icon={<UpOutlined />}
            onClick={() => setShow(!show)}
          />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: 104,
        }}
      >
        {show ? paramBox : paramText}
      </div>
    </div>
  );
}

export const replaceContinentToCountry = (newValue) => {
  let countries = [];
  console.log(newValue);
  newValue.map((k, i) => {
    var index = _.findIndex(country, (o) => {
      return o.value === k;
    });
    if (index >= 0) {
      const ctrs = _.map(country[index].children, "value");
      countries = countries.concat(ctrs);
      //newValue.splice(i, 1);
    }
    return null;
  });
  newValue.map((k, i) => {
    var index = _.findIndex(country, (o) => {
      return o.value === k;
    });
    if (index >= 0) {
      newValue.splice(i, 1);
    }
    return null;
  });
  newValue = newValue.concat(countries);
  console.log(newValue);
  return newValue;
};
