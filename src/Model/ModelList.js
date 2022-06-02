import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import AntFormDisplay from "imcformbuilder";
import formdt from "./AntFormDisplay.json";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { checkSetting, localList } from "Model";
import { List, Tooltip, Button, Popover } from "antd";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import PageHead from "components/Common/PageHeader";
import { saveToPermernent } from "./ModelEdit";

const ModelList = () => {
  const history = useHistory();
  let tempModelList = useSelector((state) => state.global.tempModelList);
  const dispatch = useDispatch();

  dispatch(globalVariable({ currentData: null }));
  const [list, setList] = useState();
  const [visible, setVisible] = useState(false);
  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    const chk = checkSetting();
    let config, url;
    switch (chk.datatype) {
      case "local":
      default:
        //setList(localList());
        if (!tempModelList) setList([]);
        else setList(_.uniq(tempModelList));
        //console.log(localList());
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

  const editHandler = (item) => {

    dispatch(globalVariable({ tempModel: item }));
    history.push(`/edit`);
  };
  const deleteHandler = (item, index) => {
    tempModelList.splice(index, 1);
    setList(tempModelList);

    dispatch(globalVariable({ tempModelList: _.cloneDeep(tempModelList) }));
  };
  const viewHandler = (item) => {
    dispatch(globalVariable({ tempModel: item }));
    history.push(`/view`);
  };
  const selectHandler = (item, index) => {

    tempModelList.map((itm, idx) => {
      delete itm.selected;
      tempModelList.splice(idx, 1, itm);
    });
    item.selected = true;
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

    const list = saveToPermernent(newModel, tempModelList);

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
        {/* <Link
        to={{
          pathname: "/view",
          state: {
            id: parseInt(Math.random() * 1000000),
            title: "noname",
            desc: "",
            resultsAuthor: [],
          },
        }}
      >
        
      </Link> */}
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
                <a href="#" onClick={() => viewHandler(item)}>
                  view
                </a>,
                <a href="#" onClick={() => editHandler(item)}>
                  edit
                </a>,
                <a href="#" onClick={() => deleteHandler(item, index)}>
                  delete
                </a>,
                <a href="#" onClick={() => selectHandler(item, index)}>
                  select
                </a>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Link
                    to={{
                      pathname: "/view",
                      state: item,
                    }}
                  >
                    {item.selected === true ? "★ " + item.title : item.title}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </>
    </div>
  );
};

export default ModelList;
