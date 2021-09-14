import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import axios from "axios";
import _ from "lodash";
import querySearch from "stringquery";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import IconArray1 from "components/SKD/IconArray1";
import { Modal } from "antd";
import ModelViewLayout from "Model/ModelViewLayout";
import ListGen from "components/SKD/ListGen";
import { localList, checkSetting } from "Model";

const imcsvr = process.env.REACT_APP_SERVER;

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

  useEffect(() => {
    dispatch(globalVariable({ display: "list" })); //modellist compact

    if (!tempModel) {
      dispatch(globalVariable({ tempModel: location.state }));
      const id = "613f3aae990a4b5b34e8d781";
      const type = checkSetting();

      switch (type) {
        case "local":
        default:
          const cdata = _.find(localList(), (o) => {
            return o._id === id;
          });
          dispatch(globalVariable({ tempModel: cdata }));
          break;
        case "mongodb":
          let config = {
            method: "get",
            url: `${imcsvr}/dashboard/${id}`,
          };

          axios(config).then((r) => {
            dispatch(globalVariable({ tempModel: r.data }));
          });
          break;
      }
    }
  }, [tempModel]);

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

      onClick: () => setVisible(true), //history.push("./model/list"),
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
      <Modal
        title="Title"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <>
          <ListGen
            url="dashboard"
            path="model"
            notitle={true}
            nodelete
            noedit
            selectHandler={selectHandler}
            dataformat={["_id", "data", "title", "desc", "type"]}
          />
        </>
      </Modal>
    </>
  );
};

export default ModelView;
