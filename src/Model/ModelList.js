import React, { useEffect, useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { checkSetting, localList } from "Model";
import { List, Tooltip, Button } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import PageHead from "components/Common/PageHeader";
import querySearch from "stringquery";

const ModelList = () => {
  const location = useLocation();
  const history = useHistory();
  const dataformat = ["_id", "data", "title", "desc", "type"];
  const dispatch = useDispatch();
  let tempModel = useSelector((state) => state.global.tempModel);
  let currentStep = useSelector((state) => state.global.currentStep);

  //dispatch(globalVariable({ currentStep: 0 }));
  dispatch(globalVariable({ currentData: null }));
  //dispatch(globalVariable({ tempModel: null }));
  const [list, setList] = useState();

  useEffect(() => {
    const chk = checkSetting();
    console.log(chk);
    switch (chk.datatype) {
      case "local":
      default:
        setList(localList());
        break;
      case "mongodb":
        let config = {
          method: "get",
          url: chk.apiurl,
        };
        console.log(config);
        axios(config).then((r) => {
          console.log(r.data);
          setList(r.data);
        });
        break;
    }
  }, []);
  let setting = {
    size: "small",
    layout: "horizontal",
    pagination: {
      pageSize: 20,
    },
    path: "",
    url: "dashboard",
  };
  let query = querySearch(location.search);
  if (query.from) {
    const str = location.search.replace("?from=", "");
    setting = { return: str };
  }

  const createHandler = () => {
    //dispatch(globalVariable({ tempModel: null }));
    dispatch(globalVariable({ currentStep: 3 }));
    history.push(`/edit`);
  };
  const editHandler = (item) => {
    console.log(item);
    dispatch(globalVariable({ tempModel: item }));
    history.push(`/edit?detour=view`);
  };
  const extra = [
    <Tooltip title="Create New" key="1create">
      <Link
        to={{
          pathname: "/view",
          state: { title: "noname", desc: "", resultsAuthor: [] },
        }}
      >
        <Button
          shape="circle"
          icon={<FileAddOutlined />}
          //onClick={createHandler}
        />
      </Link>
    </Tooltip>,
  ];

  return (
    <div style={{ backgroundColor: "white" }}>
      <>
        <PageHead title={"List"} extra={extra}></PageHead>
        <List
          size="small"
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              actions={[<a onClick={() => editHandler(item)}>edit</a>]}
            >
              <List.Item.Meta
                title={
                  <Link
                    to={{
                      pathname: "/view",
                      state: item,
                    }}
                  >
                    {item.title}
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
