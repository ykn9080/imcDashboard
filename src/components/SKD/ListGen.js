import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { useHistory } from "react-router-dom";

import axios from "axios";
import { currentsetting } from "config/index.js";
import AntList from "components/Common/List";
import { Tooltip, Button } from "antd";
import PageHead from "components/Common/PageHeader";
import {
  FileAddOutlined,
  FormOutlined,
  SisternodeOutlined,
} from "@ant-design/icons";
import useForceUpdate from "use-force-update";

const ListGen = (props) => {
  let title = props.type,
    titleUpper = "",
    dataformat;
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const forceUpdate = useForceUpdate();
  const history = useHistory();
  const dispatch = useDispatch();
  let avataricon = <FormOutlined />;
  if (props.avataricon) avataricon = props.avataricon;
  if (props.dataformat) dataformat = props.dataformat;
  const datamapping = (k) => {
    let data = {
      _id: k._id,
      data: k.data && k.data,
      name: k.title,
      description: k.desc,
      titleHandler: true,
      href: {
        pathname: `/${props.url}/view`,
        search: `?_id=${k._id}`,
        state: k,
      },
      avatar: {
        size: 32,
        style: { backgroundColor: "#87d068" },
        shape: "square",
        icon: { avataricon },
      },
      desc: k.desc,
    };
    let obj = {
      href: {
        pathname: `/${props.url}/view`,
        search: `?_id=${k._id}`,
        state: k,
      },
      avatar: {
        size: 32,
        style: { backgroundColor: "#1890FF" },
        shape: "square",
        icon: <SisternodeOutlined />,
      },
    };
    if (dataformat) {
      dataformat.map((a, j) => {
        obj[a] = k[a];
        if (a === "title") return (obj.name = k[a]);
        if (a === "desc") return (obj.description = k[a]);
        return null;
      });
      data = obj;
    }
    return data;
  };
  useEffect(() => {
    setLoading(true);

    axios
      .get(`${currentsetting.webserviceprefix}${props.url}`)
      .then((response) => {
        let imsiData1 = [];
        response.data.map((k, i) => {
          return imsiData1.push(datamapping(k));
        });
        setListData(imsiData1);

        dispatch(globalVariable({ listData: imsiData1 }));
        setLoading(false);
      });
  }, []);

  const createHandler = () => {
    dispatch(globalVariable({ tempModel: "" }));
    dispatch(globalVariable({ selectedKey: "" }));
    history.push(`/${props.url}/edit`);
  };

  const editHandler = (item) => {
    dispatch(globalVariable({ tempModel: item }));
    dispatch(globalVariable({ selectedKey: item._id }));
    history.push(`/${props.url}/edit`);
  };
  const selectHandler1 = (item) => {
    dispatch(globalVariable({ tempModel: item }));
    dispatch(globalVariable({ selectedKey: item._id }));
    history.push(`/${props.url}/view`);
    // history.push({
    //   pathname: "/project/view",
    //   search: "?_id=5ef99d0b48fbce0ff8541448",
    //   state: { detail: "response.data" },
    // });
    // history.go();
  };
  const deleteHandler = (item) => {
    let config = {
      method: "delete",
      url: `${currentsetting.webserviceprefix}${props.url}/${item._id}`,
    };
    axios(config).then((r) => {
      _.remove(listData, function (currentObject) {
        return currentObject._id === item._id;
      });
      dispatch(globalVariable({ listData: listData }));
      setListData(listData);
      forceUpdate();
    });
  };
  const footer = (
    <div>
      <b>NetMiner365</b>
    </div>
  );
  let pagination = {
    onChange: (page) => {
      console.log(page);
    },
    pageSize: 5,
  };
  if (props.pagination) pagination = props.pagination;
  const extra = [
    <Tooltip title="Create New" key="1create">
      <Button
        shape="circle"
        icon={<FileAddOutlined />}
        onClick={createHandler}
      />
    </Tooltip>,
  ];
  let setting = {};
  setting = { editHandler, deleteHandler };
  if (props.return) setting = { ...setting, selectHandler: selectHandler1 };

  if (title) titleUpper = title.charAt(0).toUpperCase() + title.slice(1);
  return (
    <>
      <PageHead title={titleUpper} extra={extra}></PageHead>
      <AntList
        listData={listData}
        loading={loading}
        // editHandler={editHandler}
        // deleteHandler={deleteHandler}
        size={"small"}
        layout={"horizontal"}
        footer={footer}
        pagination={pagination}
        {...setting}
      />
    </>
  );
};
export default ListGen;
