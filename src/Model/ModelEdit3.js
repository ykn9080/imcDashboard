import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import { Spin } from "antd";
import "components/Common/Antd.css";
import _ from "lodash";

export const fillNodelist = (author, source) => {
  const fillnode = (k) => {
    if (!k.nodelist) {
      const obj = _.find(source, (o) => {
        return o.key === k.key;
      });

      if (obj) {
        return obj.dtlist;
      }
    } else return k.dtlist;
  };

  if (author) {
    author.map((k, i) => {
      k.dtlist = fillnode(k);
      author.splice(i, 1, k);
      return null;
    });
  }
  return author;
};
export const createSource = (tempModel) => {
  //create source from current nodes, link and api returned dataset
  let sourceArr = [];
  const tmp = tempModel.properties;
  if (!tmp) return false;
  const makedataTab = (code, name, subtype) => {
    let rtn = {
      key: parseInt(Math.random() * 100000).toString(),
      title: name,
      type: { stype: "current data", code: code, subtype: subtype },
    };
    return rtn;
  };
  if (tmp.linknode) {
    const lk = tmp.linknode;

    switch (lk.type.toLowerCase()) {
      case "linkset":
        lk._id.map((s, j) => {
          if (
            _.filter(sourceArr, (o) => {
              return o.title === lk.name[j];
            }).length === 0
          )
            sourceArr.push(makedataTab(s, lk.name[j], "layer"));
          return null;
        });
        if (
          _.filter(sourceArr, (o) => {
            return o.title === lk.nodesetname[0];
          }).length === 0
        )
          sourceArr.push(
            makedataTab(lk.nodesetid[0], lk.nodesetname[0], "nodeset")
          );
        break;
      case "nodeset":
        if (
          _.filter(sourceArr, (o) => {
            return o.title === lk.name;
          }).length === 0
        )
          sourceArr.push(makedataTab(lk._id, lk.name, "nodeset"));
        break;
      case "rawdataset":
        if (
          _.filter(sourceArr, (o) => {
            return o.title === lk.name;
          }).length === 0
        )
          sourceArr.push(makedataTab(lk._id, lk.name, "rawdataset"));
        break;
      default:
        return null;
    }
  }
  if (tmp.results) {
    Object.keys(tmp.results).map((k, i) => {
      let result = {
        key: "ext" + i,
        title: k,
        dtlist: tmp.results?.[k] | [],
        type: { stype: "result" },
      };
      if (tmp.colArr?.[k]) {
        result.setting = { colArr: tmp.colArr[k] };
      }
      sourceArr.push(result);
      return null;
    });
  }
  return sourceArr;
};
export const refreshModelData = (tempModel, tempData) => {
  const rtn = maketempData(tempModel, tempData);
  let newtempModel = rtn.tempModel;
  //setTimeout(function () {
  //if resultsAuthor has no nodelist, copy from source
  const newAuthor = fillNodelist(newtempModel?.resultsAuthor, rtn.sourceArr);
  if (newAuthor) {
    //let newtempModel = { ...rtn.tempModel };
    newtempModel.resultsAuthor = newAuthor;

    //dispatch(globalVariable({ tempModel: newtempModel }));
  }
  //}, 300);
  return { tempModel: newtempModel, tempData: rtn.tempData };
};

export const maketempData = (tempModel, tempData) => {
  const existdtlist = (list) => {
    let chk = false;
    const arr = _.filter(list, (o) => {
      return o.dtlist;
    });
    if (arr.length > 0) chk = true;
    return chk;
  };
  let newtempData = {},
    sourceArr,
    sourceNew = createSource(tempModel);
  if (tempData) {
    newtempData = { ...tempData };
  } else if (
    tempModel?.properties?.source &&
    existdtlist(tempModel?.properties?.source)
  ) {
    newtempData.source = tempModel.properties.source;
  } else if (tempModel?.properties?.origindata?.dataset) {
    delete tempModel.properties.origindata.dataset.source;
    newtempData = tempModel.properties.origindata.dataset;
  }
  if (tempModel.newrun === true) {
    newtempData.source = sourceNew;
    tempModel.properties.source = sourceNew;
    delete tempModel.newrun;
  }
  if (!newtempData.source) {
    newtempData.source = sourceNew;
    if (tempModel?.properties) tempModel.properties.source = sourceNew;
  }
  sourceArr = newtempData.source;

  // dispatch(globalVariable({ tempData: newtempData }));
  // dispatch(globalVariable({ tempModel }));

  return { sourceArr, tempModel, tempData: newtempData };
};

const ModelEdit3 = (props) => {
  const dispatch = useDispatch();
  let nextStep = useSelector((state) => state.global.nextStep);

  if (nextStep) {
    dispatch(globalVariable({ currentStep: nextStep }));
    dispatch(globalVariable({ nextStep: null }));
  }
  // useEffect(() => {
  //   dispatch(globalVariable({ helpLink: `/model/edit?step=${currentStep}` }));
  // }, []);
  // useEffect(() => {
  //   const rtn = refreshModelData(tempModel, tempData);
  //   dispatch(globalVariable({ tempModel: rtn.tempModel }));
  //   dispatch(globalVariable({ tempData: rtn.tempData }));
  // }, [filtered]);

  // const menu = (
  //   <Menu>
  //     <Menu.Item key="1" onClick={() => resetData("all")}>
  //       <Tooltip title="Reset results,resultAuthor,source" placement="right">
  //         Reset All
  //       </Tooltip>
  //     </Menu.Item>
  //   </Menu>
  // );
  // const resetData = (type) => {
  //   if (!tempModel) return false;
  //   let newtempModel = { ...tempModel };
  //   const pro = newtempModel?.properties;
  //   if (!pro) return false;
  //   delete pro.source;
  //   if (type === "all") {
  //     delete pro.results;
  //     delete pro.resultsAuthor;
  //   }
  //   newtempModel.properties = pro;
  //   dispatch(globalVariable({ tempModel: newtempModel }));
  //   dispatch(globalVariable({ tempData: [] }));

  //   dispatch(globalVariable({ currentStep: currentStep - 1 }));
  //   if (type === "source") dispatch(globalVariable({ nextStep: currentStep }));
  // };

  // const slot = ["right"].reduce(
  //   (acc, left) => ({
  //     ...acc,
  //     [left]: (
  //       <>
  //         <Dropdown overlay={menu} trigger={["contextMenu"]}>
  //           <Tooltip title="Reset source" placement="right">
  //             <Popconfirm
  //               placement="top"
  //               title={"Are you sure to reset?"}
  //               onConfirm={() => resetData("source")}
  //               okText="Yes"
  //               cancelText="No"
  //             >
  //               <Button icon={<GrClearOption />} style={{ width: 80 }} />
  //             </Popconfirm>
  //           </Tooltip>
  //         </Dropdown>
  //       </>
  //     ),
  //   }),
  //   {}
  // );

  return (
    <div
      className="card-container"
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "300px",
        alignItems: "center",
      }}
    >
      {/* <Tabs defaultActiveKey={0} tabPosition={"left"} tabBarExtraContent={slot}>
        <TabPane tab="Edit" key="1">
          {tempData && <DataEdit1 />}
        </TabPane>
      </Tabs>
      */}
      <Spin size="large" />
    </div>
  );
};
export default ModelEdit3;
