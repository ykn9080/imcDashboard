import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import axios from "axios";
import _ from "lodash";
import querySearch from "stringquery";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import { Modal, List } from "antd";
import ModelViewLayout from "Model/ModelViewLayout";
import ListGen from "components/SKD/ListGen";
import { localList, checkSetting } from "Model";

const ModelView = (props) => {
  const imcsvr = process.env.REACT_APP_SERVER;

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  let tempModel = useSelector((state) => state.global.tempModel);
  let currentData = useSelector((state) => state.global.currentData);
  if (currentData) tempModel = currentData;
  let query = querySearch(location.search);
  console.log("location.state", location.state);
  useEffect(() => {
    if (location.state) {
      dispatch(globalVariable({ tempModel: location.state }));
    } else if (!tempModel) {
      const id = "613f3aae990a4b5b34e8d781";
      const type = checkSetting().datatype;

      switch (type) {
        case "local":
        default:
          const cdata = _.find(localList(), (o) => {
            return o._id === id;
          });
          dispatch(globalVariable({ tempModel: cdata }));
          break;
        case "mongodb":
          let url = checkSetting().url;
          if (!url) url = `${imcsvr}/dashboard`;
          let config = {
            method: "get",
            url,
          };

          axios(config).then((r) => {
            console.log(r.data);
            if (r.data && r.data.length > 0)
              dispatch(globalVariable({ tempModel: r.data[0] }));
          });
          break;
      }
    }
  }, [location.state, tempModel]);

  const edit = () => {
    dispatch(globalVariable({ selectedKey: query._id }));
    history.push(`/edit`);

    dispatch(globalVariable({ currentStep: 4 }));
  };

  const btnArr = [
    {
      tooltip: "List",
      awesome: "list-alt",
      fontSize: "small",
      color: "inherit",

      onClick: () => history.push("./list"), //setVisible(true),
    },
    {
      tooltip: "Edit",
      awesome: "pencil-alt",
      fontSize: "small",
      color: "inherit",
      onClick: edit,
    },
  ];

  const handleOk = () => {
    setConfirmLoading(true);
    setVisible(false);

    setConfirmLoading(false);
  };
  const selectHandler = (item) => {
    console.log("selected123", item, item.id);
    dispatch(globalVariable({ currentData: item }));
    dispatch(globalVariable({ selectedKey: item._id }));
    axios.get(`${imcsvr}/dashboard/${item._id}`).then((response) => {
      dispatch(globalVariable({ tempModel: response.data }));
    });
    history.push(`/view?_id=${item._id}`);
    setVisible(false);
  };
  return (
    <>
      {!props.blank && (
        <>
          <DenseAppBar
            title={"Dashboard"}
            right={<IconArray1 btnArr={btnArr} />}
          ></DenseAppBar>
          <div
            style={{
              paddingLeft: 10,
              paddingTop: 5,
            }}
          >
            <AntBreadCrumb />
          </div>
        </>
      )}
      {tempModel ? (
        <ModelViewLayout data={tempModel} errorurl={props.errorurl} />
      ) : null}
      {/* <Modal
        title="Title"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <>
          <List
            size="small"
            dataSource={localList()}
            renderItem={(item) => (
              <List.Item>
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
      </Modal> */}
    </>
  );
};

export default ModelView;
