import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { checkSetting, localList } from "Model";
import { List, Tooltip, Button } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import PageHead from "components/Common/PageHeader";

const ModelList = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  dispatch(globalVariable({ currentData: null }));
  const [list, setList] = useState();

  useEffect(() => {
    const chk = checkSetting();
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
        axios(config).then((r) => {
          setList(r.data);
        });
        break;
    }
  }, []);

  const editHandler = (item) => {
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
        <Button shape="circle" icon={<FileAddOutlined />} />
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
              actions={[
                <a href="#" onClick={() => editHandler(item)}>
                  edit
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
