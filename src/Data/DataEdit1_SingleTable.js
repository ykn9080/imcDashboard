import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { globalVariable } from "actions";
import { Button, Popconfirm, Row, Col, Tooltip } from "antd";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import Popup from "components/Common/Popup";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import IconButton from "@material-ui/core/IconButton";
import { GrFormClose, GrRevert } from "react-icons/gr";
import {
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineCalculator,
  AiOutlineUngroup,
  AiOutlineGroup,
} from "react-icons/ai";
import { RiBracesLine } from "react-icons/ri";
import MoreMenu from "components/SKD/MoreMenu";
import { DraggableColumns } from "components/Table/DraggableColumns";

import { baseData, UpdateColnData, arrayToObject } from "Data/DataEdit1";

const SingleTable = (props) => {
  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);
  const [tbsetting, setTbsetting] = useState();
  const [data, setData] = useState();
  const [filtered, setFiltered] = useState(); //dtlist filtered by datatype etc
  const [popup, setPopup] = useState({});
  const [initCol, setInitCol] = useState();
  const [grpby, setGrpby] = useState();
  const [delColumnShow, setDelColumnShow] = useState(false);
  let edit = props.edit;
  if (!edit) edit = false;
  let tempData = useSelector((state) => state.global.tempData);
  let selectedKey1 = useSelector((state) => state.global.selectedKey1);

  useEffect(() => {
    let data1 = _.find(tempData?.source, { key: selectedKey1 });

    if (props.dataObj) data1 = props.dataObj;
    const rtndt = baseData(data1);
    if (rtndt) {
      if (rtndt?.setting) {
        let setting = rtndt.setting;
        let size = setting.size;
        if (!size) size = "small";
        setTbsetting({ size: size });
        setting.reset = delColumnShow;
      }
      setData(rtndt);
    }

    if (props.edit !== true) dispatch(globalVariable({ openPopup: false }));
  }, [props.dataObj]);

  useEffect(() => {
    setTbsetting(props.tbsetting);
  }, [props.tbsetting]);
  useEffect(() => {
    let rtn;
    if (data) {
      //updateColumn();
      rtn = UpdateColnData(data);
      setFiltered(rtn.dtlist);
      let editcolumn = columnEditFilter(rtn.column, data.setting);
      setColumns(editcolumn);

      if (data?.setting?.groupby)
        setGroupbyTable(data.setting.groupby, rtn.dtlist);
    }
  }, [data]);

  const columnEdit = (column, popsetting) => {
    setPopup(popsetting); //popup position,size info
    setInitCol(column);
    dispatch(globalVariable({ openPopup: true }));
  };
  const columnDelete = (column, colsetting) => {
    let newData = { ...data };
    let delarr = [];
    if (newData.setting.delarr) delarr = [...newData.setting.delarr];
    delarr = _.uniq(_.concat(delarr, column.key));
    newData.setting.delarr = delarr;
    setData(newData);
  };

  const columnEditFilter = (columns, colsetting) => {
    if (!edit) return columns;
    if (columns)
      columns.map((column, i) => {
        const colbtns = (
          <>
            <Button
              type="link"
              size="small"
              style={{ color: "gray", marginLeft: 20, marginRight: -5 }}
              icon={<EditOutlined />}
              onClick={(e) => {
                e.preventDefault();
                dispatch(globalVariable({ openPopup: false }));
                columnEdit(column, {
                  x: e.clientX,
                  y: e.clientY,
                  w: 450,
                  h: 550,
                });
              }}
            />
            <Popconfirm
              title="Are you sure delete ?"
              placement="topLeft"
              onConfirm={(e) => {
                e.persist();
                columnDelete(column, colsetting);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="small" icon={<GrFormClose />} />
            </Popconfirm>
          </>
        );
        column = {
          ...column,
          title: (
            <span>
              {column.titletext} {colbtns}
            </span>
          ),
        };
        columns.splice(i, 1, column);

        return null;
      });
    return columns;
  };
  const setGroupbyTable = (initialValues, fildata) => {
    let child = [],
      plist = [];
    let columnlist = filtered;
    if (fildata) columnlist = fildata;
    if (columnlist.length > 0) {
      Object.keys(columnlist[0]).map((k, i) => {
        child.push({ text: k, value: k });

        return null;
      });
    }

    plist.push({ name: "fields", optionArray: child });
    plist.push({ name: "values", optionArray: child });

    let init = {};
    if (initialValues) init = { initialValues };

    const groupby = {
      formid: "5f45e11e9461621a00fbe013",
      patchlist: plist,
      onValuesChange: (changedValues, allValues) => {
        localStorage.removeItem("persist:root");
        localStorage.setItem("groupby", JSON.stringify(allValues));
      },
      ...init,
    };
    setGrpby(groupby);
  };
  const saveTemp = () => {
    const localtoObject = (itemname) => {
      let item = localStorage.getItem(itemname);
      if (item)
        try {
          item = JSON.parse(item);
        } catch (e) {
          console.log(e);
        }
      localStorage.removeItem(itemname);
      return item;
    };
    let grpby = localtoObject("groupby");

    let newdata = { ...data };

    let setting1 = { ...newdata.setting };

    if (setting1.delarr) {
      //calc field if deleted remove from column
      setting1.delarr.map((k, i) => {
        if (k.indexOf("calc") > -1) {
          setting1.delarr.splice(i, 1);
          _.remove(setting1.column, function (n) {
            return n.key === k;
          });
        }

        return null;
      });
    }

    if (grpby) {
      setting1.groupby = grpby;
    }

    newdata = {
      ...newdata,
      setting: {
        ...setting1,
      },
    };
    setData(newdata);
    props.save(newdata, props.activeKey);
  };

  const onFinishColumn = (val) => {
    dispatch(globalVariable({ openPopup: false }));
    let newData = { ...data };
    let columnlist = newData.setting.column || [];

    columnlist.map((k, i) => {
      if (k.key === val.key) {
        let newk = { ...k, ...val };
        columnlist.splice(i, 1, newk);
      }

      return null;
    });

    setData(newData);
    // updateColumn();
  };
  const onDragEnd = (columns) => {
    let newData = { ...data };
    let odr = [];
    columns.map((k, i) => {
      odr.push(k.key);

      return null;
    });
    newData.setting.order = odr;
    setData(newData);
  };

  const handleAction = (type) => {
    let newdata = { ...data };
    switch (type) {
      case "showcolumn":
        //newdata.setting.delarr = [];
        newdata.setting.reset = true;
        setData(newdata);
        break;
      case "hidecolumn":
        delete newdata.setting.reset;
        setData(newdata);
        break;
      case "revertcolumn":
        delete newdata.setting.reset;
        newdata.setting.delarr = [];
        setData(newdata);
        break;
      case "calc":
        let colArr = newdata.setting.column;
        let cnt = 1;
        colArr.map((k, i) => {
          if (k.key.indexOf("calc") > -1) {
            const num = parseInt(k.key.replace("calc", ""));
            if (num >= cnt) cnt = num + 1;
          }
          return null;
        });
        const cn = `calc${cnt}`;
        colArr.push({ key: cn, title: cn, origin: cn, dataIndex: cn });
        setData(newdata);
        break;
      case "groupby":
        setGroupbyTable();
        break;
      case "cancelgroupby":
        setGrpby(null);
        delete newdata.setting.groupby;
        setData(newdata);
        break;
      case "arraytoobject":
        newdata.setting.arraytoobject = ["group"];
        const rtn = arrayToObject(newdata.dtlist, ["group"]);
        newdata.setting = { ...newdata.setting, column: rtn.cols };
        newdata = { ...newdata, dtlist: rtn.dt };
        setData(newdata);
        setColumns(rtn.cols);
        break;
      default:
        break;
    }
  };

  const menu = [
    {
      title: delColumnShow ? (
        <Tooltip title="Show deleted columns" style={{ zIndex: 10000 }}>
          <AiOutlineEye />
        </Tooltip>
      ) : (
        <Tooltip title="Hide deleted columns">
          <AiOutlineEyeInvisible />
        </Tooltip>
      ),
      onClick: () => {
        setDelColumnShow(!delColumnShow);
        handleAction(delColumnShow ? "hidecolumn" : "showcolumn");
      },
    },
    {
      title: (
        <Tooltip title="Revert column delete" placement="left">
          <GrRevert />
        </Tooltip>
      ),
      onClick: () => {
        if (window.confirm("Are you sure to reset column?"))
          handleAction("revertcolumn");
      },
    },
    {
      title: (
        <Tooltip title="Add calculated column" placement="left">
          <AiOutlineCalculator />
        </Tooltip>
      ),
      onClick: () => handleAction("calc"),
    },
    {
      title: !grpby ? (
        <Tooltip title="Execute group by" placement="left">
          <AiOutlineGroup />
        </Tooltip>
      ) : (
        <Tooltip title="Cancel group by" placement="left">
          <AiOutlineUngroup />
        </Tooltip>
      ),
      onClick: () => {
        handleAction(!grpby ? "groupby" : "cancelgroupby");
      },
    },
    {
      title: (
        <Tooltip title="Array to Object" placement="left">
          <RiBracesLine />
        </Tooltip>
      ),
      onClick: () => {
        handleAction("arraytoobject");
      },
    },
  ];

  return (
    <>
      {columns && (
        <div style={{ marginTop: 10, marginRight: 5, height: "auto" }}>
          {edit === true && (
            <>
              {grpby && <AntFormDisplay {...grpby} />}
              <Row justify="end">
                <Col>
                  <Tooltip title="Save temporarily">
                    <IconButton aria-label="save" onClick={saveTemp}>
                      <SaveOutlined />
                    </IconButton>
                  </Tooltip>
                </Col>
                <Col>
                  <MoreMenu menu={menu} handleAction={handleAction} />
                </Col>
              </Row>
            </>
          )}

          <DraggableColumns
            columns={columns}
            data={filtered}
            onDragEnd={onDragEnd}
            //tbsetting={{ size: "small" }}
            tbsetting={tbsetting}
          />

          <Popup {...popup}>
            <AntFormDisplay
              formArray={formdt["5f101b3289db1023b0165b1a"]}
              showtitle={true}
              onFinish={onFinishColumn}
              initialValues={initCol}
            />
          </Popup>
        </div>
      )}
    </>
  );
};

export default SingleTable;
