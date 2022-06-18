import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import AntFormDisplay from "imcformbuilder";
import formdt from "./AntFormDisplay.json";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { checkSetting } from "Model";
import { List, Tooltip, Button, Popover, Popconfirm, Checkbox } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageHead from "components/Common/PageHeader";
import { saveToPermernent } from "./ModelEdit";
import { localInit } from "Model";

const ModelList = () => {
  const history = useHistory();
  let tempModelList = useSelector((state) => state.global.tempModelList);
  const dispatch = useDispatch();

  dispatch(globalVariable({ currentData: null }));
  const [list, setList] = useState();
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    const chk = checkSetting();
    switch (chk.datatype) {
      case "local":
      default:
        //setList(localList());
        if (!tempModelList) setList([]);
        else {
          setList(_.uniq(tempModelList));
        }
        break;
      // case "mongodb":
      //   config = {
      //     method: "get",
      //     url: chk.apiurl,
      //   };
      //   axios(config).then((r) => {
      //     setList(r.data);
      //   });
      //   break;
      // case "mysql":
      //   url = chk.apiurl;
      //   const id = 1;
      //   if (!url) url = `https://orm.ezdentone.com/api/dashboard`;
      //   config = {
      //     method: "get",
      //     url: `${url}/${id}`,
      //   };

      //   axios(config).then((r) => {
      //     console.log("r", r);
      //     console.log(JSON.parse(r.data.data));
      //     //if (r.data)
      //     // //replaceRealtime(r.data[0]);
      //     //setList(JSON.parse(r.data.data));
      //   });
      //   break;
    }
  }, []);
  const reloadTemp = async (item) => {
    const rtn = await localInit("mysql", null, item.id);
    let index = _.findIndex(rtn.data, (o) => {
      return o.id === item.id;
    });
    return rtn.data[index];
  };
  const editHandler = async (item) => {
    const tmp = await reloadTemp(item);
    dispatch(globalVariable({ tempModel: tmp }));
    dispatch(globalVariable({ selectedKey: item.id }));
    history.push(`/view?detour=edit`);
  };
  const deleteHandler = (item, index) => {
    tempModelList.splice(index, 1);
    setList(tempModelList);

    dispatch(globalVariable({ tempModelList: _.cloneDeep(tempModelList) }));
  };
  const viewHandler = async (item) => {
    const tmp = await reloadTemp(item);
    dispatch(globalVariable({ tempModel: tmp }));
    dispatch(globalVariable({ selectedKey: item.id }));
    history.push(`/view`);
  };
  const selectHandler = (item, index) => {
    tempModelList.map((itm, idx) => {
      delete itm.selected;
      tempModelList.splice(idx, 1, itm);
      return null;
    });
    item.selected = true;
    tempModelList.splice(index, 1, item);
    setList(tempModelList);

    dispatch(globalVariable({ tempModelList: tempModelList }));
  };
  const onParamChange = (e, item, index) => {
    console.log(e.target.checked);

    if (e.target.checked) {
      item.parameters = true;
    } else {
      delete item.parameters;
    }
    tempModelList.splice(index, 1, item);

    setList(tempModelList);

    dispatch(globalVariable({ tempModelList: tempModelList }));
  };
  const onFinish = (values) => {
    const newModel = {
      id: parseInt(Math.random() * 1000000),
      title: values.title,
      desc: values.desc,
      resultsAuthor: [],
    };

    const list = saveToPermernent(newModel, tempModelList, "default");

    setList(list);

    dispatch(globalVariable({ tempModelList: list }));

    setVisible(false);
  };
  const text = <span>New Dashboard</span>;
  const content = (
    <div>
      <AntFormDisplay
        formArray={formdt["newdashInput"]}
        onFinish={onFinish}
        // initialValues={initVal}
      />
    </div>
  );
  const extra = [
    <Tooltip title="Create New" key="1create">
      <Popover
        placement="bottomRight"
        title={text}
        content={content}
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <Button shape="circle" icon={<PlusOutlined />} />
      </Popover>
    </Tooltip>,
  ];

  return (
    <div style={{ backgroundColor: "white" }}>
      <>
        <PageHead title={"List"} extra={extra}></PageHead>
        <List
          size="small"
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => viewHandler(item)}>
                  view
                </Button>,
                <Button type="link" onClick={() => editHandler(item)}>
                  edit
                </Button>,
                <Popconfirm
                  title="Are you sure to delete this task?"
                  onConfirm={() => deleteHandler(item, index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link">delete</Button>
                </Popconfirm>,
                <Button type="link" onClick={() => selectHandler(item, index)}>
                  default
                </Button>,
                <Checkbox
                  checked={item.parameters && true}
                  onChange={(e) => onParamChange(e, item, index)}
                >
                  Parameter
                </Checkbox>,
              ]}
            >
              <List.Item.Meta
                title={item.selected === true ? "▶ " + item.title : item.title}
                description={item.desc}
              />
            </List.Item>
          )}
        />
      </>
    </div>
  );
};

export default ModelList;
