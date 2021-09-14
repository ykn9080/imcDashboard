import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { globalVariable } from "actions";
import { loadCSS } from "fg-loadcss";
import {
  Row,
  Col,
  Button,
  Radio,
  Modal,
  Tooltip,
  Popover,
  Popconfirm,
  message,
  Select,
  Menu,
  Dropdown,
} from "antd";
import GridLay1 from "Model/Author/ReactGridLayout";
import "Model/Author/react-grid-layout.css";
import { pick } from "components/functions/LodashUtil";
import {
  UndoOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  FcMindMap,
  FcBarChart,
  FcLineChart,
  FcScatterPlot,
  FcCloseUpMode,
  FcPieChart,
} from "react-icons/fc";
import { ImTable } from "react-icons/im";

const { Option } = Select;

const ModelEdit4 = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [fullscreen, setFullscreen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [popvisible, setPopvisible] = useState(false);
  const [colnum, setColnum] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [tempLayout, setTempLayout] = useState();
  const [selectChart, setSelectChart] = useState();

  const [child, setChild] = useState();
  const [defaultlist, setDefaultlist] = useState();

  let tempModel = useSelector((state) => state.global.tempModel);
  let currentStep = useSelector((state) => state.global.currentStep);
  let trigger = useSelector((state) => state.global.triggerChild);

  useEffect(() => {
    localStorage.removeItem("tempAuthor");
  }, []);
  useEffect(() => {
    let tempAuthor = localStorage.getItem("tempAuthor");
    let tempAuthor1 = tempModel?.resultsAuthor;

    if (!_.isEqual(JSON.parse(tempAuthor), tempAuthor1)) {
      const author1 = JSON.stringify(tempModel?.resultsAuthor);
      let author = [];
      if (author1) author = JSON.parse(author1);
      localStorage.setItem("tempAuthor", JSON.stringify(author));

      let lay = _.filter(author, {
        checked: true,
      });

      lay.sort(function (a, b) {
        return parseInt(a.i) - parseInt(b.i);
      });

      dispatch(globalVariable({ tempModel }));
      console.log("tempLayout", lay);
      setTempLayout(lay);

      modalInit();
      const node = loadCSS(
        "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
        document.querySelector("#font-awesome-css")
      );
      return () => {
        node.parentNode.removeChild(node);
      };
    }
  }, [tempModel]);

  useEffect(() => {
    let lay = tempLayout;
    if (lay) {
      setTempLayout(null);
      lay.sort(function (a, b) {
        return parseInt(a.i) - parseInt(b.i);
      });
      if (colnum === -1) {
        //reset
        reverttempModel();
        return false;
      }
      let cnum = 12 / colnum;
      lay.map((k, i) => {
        k.w = cnum;
        //k.h = cnum * 3;
        k.x = (i % colnum) * cnum;
        k.y = parseInt(i / colnum) * cnum;
        lay.splice(i, 1, k);
        return null;
      });
      setTempLayout(lay);
      let newtempModel = { ...tempModel };
      newtempModel.resultsAuthor = lay;
      dispatch(globalVariable({ tempModel: newtempModel }));
      dispatch(globalVariable({ currentStep: 3 }));
      dispatch(globalVariable({ nextStep: 4 }));
    }
  }, [colnum]);

  const goback = [
    {
      tooltip: "Go to Previous",
      awesome: "expand-arrows-alt",
      fontSize: "small",
      color: "inherit",
      "aria-controls": "back",
      onClick: () => setFullscreen(!fullscreen),
    },
  ];

  const saveTemp = (trigger) => {
    if (trigger.length > 0 && trigger[0] === "save") {
      saveLayout(tempModel);
      dispatch(globalVariable({ triggerChild: [] }));
    }
  };
  if (trigger.length > 0 && trigger[0] === "save") saveTemp(trigger);
  const onLayoutChange = (layout, layouts) => {
    localStorage.setItem("tempLayout", JSON.stringify(layout));
  };

  const resetLayout = (e) => {
    e.stopPropagation();
    reverttempModel();
  };
  const createItem = (existing) => {
    console.log(existing);
    let num = 0,
      firstrow = 0,
      ii = 0,
      yy = 0;
    if (existing) {
      num = _.filter(existing, { checked: true }).length;
      firstrow = _.filter(existing, (o) => {
        return o.y === 0;
      }).length;
      existing.map((k, i) => {
        if (parseInt(k.i) >= ii) ii++;
        if (k.y > yy) yy = k.y;
        return null;
      });
    }
    if (firstrow === 0) firstrow = 1;
    let colnum1 = colnum;
    if (!colnum1) colnum1 = firstrow;
    let cnum = 12 / colnum1;
    return {
      x: (num % colnum1) * cnum,
      y: yy + cnum * 2,
      w: 4,
      h: 8,
      i: ii.toString(), //parseInt(Math.random() * 1000).toString(),
    };
  };
  const addItem = (j) => {
    let odr = tempModel.resultsAuthor;
    const addnew = createItem(odr);

    //x,y,w,h,i: w:6(half), h:6, x:(num%2*6), y:(parseInt(num/2)*6, i:num(sort and assiang index each)
    odr.map((k, i) => {
      if (j.indexOf(k.id) > -1) {
        k = { ...k, checked: true, ...addnew };
        odr.splice(i, 1, k);
      }
      return null;
    });
  };
  const removeItem = (j) => {
    let odr = tempModel.resultsAuthor;
    odr.map((k, i) => {
      if (j.indexOf(k.i) > -1) {
        // ["x", "y", "w", "h", "i", "checked"].map((a) => {
        //   delete k[a];
        //   return null;
        // });
        odr.splice(i, 1);
      }
      return null;
    });
  };
  const onRemoveItem = (i) => {
    let odr = tempModel.resultsAuthor;
    const obj = _.find(odr, { i });
    removeItem(obj.i);
    dispatch(globalVariable({ tempModel }));
    //편법!!, force reload by go back and forth
    dispatch(globalVariable({ currentStep: currentStep - 1 }));
    dispatch(globalVariable({ nextStep: currentStep }));
  };
  const onEditItem = (i) => {
    let odr = tempModel.resultsAuthor;
    const json = _.find(odr, { i });

    history.push({
      pathname: `/author/${json.type}`,
      state: { author: json },
    });
  };

  const addBlank = () => {
    console.log(tempModel);
    let newtempModel = { ...tempModel };
    const author = newtempModel.resultsAuthor;

    let newItem = createItem(author);
    console.log(author);
    newItem.type = "";

    newItem.id = parseInt(Math.random() * 100).toString();
    newItem.key = parseInt(Math.random() * 100000).toString();
    newItem.checked = true;
    newItem.setting = { title: `new Item${author.length + 1}` };
    author.push(newItem);
    console.log(_.cloneDeep(newtempModel));
    dispatch(globalVariable({ tempModel: newtempModel }));
    dispatch(globalVariable({ currentStep: currentStep - 1 }));
    dispatch(globalVariable({ nextStep: currentStep }));
    // console.log(newtempModel);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setVisible(false);
    if (selectChart) {
      let newtempModel = { ...tempModel };
      let odr = newtempModel.resultsAuthor;
      let filtered = _.filter(odr, { checked: true });
      let currArr = pick(filtered, "id");
      let removelist = [],
        addedlist = [];
      currArr.map((k, i) => {
        if (selectChart.indexOf(k) === -1) removelist.push(k);
        return null;
      });
      selectChart.map((k, i) => {
        if (currArr.indexOf(k) === -1) addedlist.push(k);
        return null;
      });
      addItem(addedlist);
      removeItem(removelist);
      dispatch(globalVariable({ tempModel: newtempModel }));
      //편법!!, force reload by go back and forth
      dispatch(globalVariable({ currentStep: currentStep - 1 }));
      dispatch(globalVariable({ nextStep: currentStep }));
    }
    setConfirmLoading(false);
  };

  const reverttempModel = () => {
    //reset
    let localAuthor = localStorage.getItem("tempAuthor");
    if (localAuthor) {
      localAuthor = JSON.parse(localAuthor);
      tempModel.resultsAuthor = localAuthor;
      dispatch(globalVariable({ tempModel }));
      dispatch(globalVariable({ currentStep: currentStep - 1 }));
      dispatch(globalVariable({ nextStep: currentStep }));
      localStorage.removeItem("tempAuthor");
    }
  };
  const PopoverContent = () => {
    const handleLayoutChange = (e) => {
      setColnum(e.target.value);
    };

    return (
      <div style={{ marginBottom: 10 }}>
        <Radio.Group value={colnum} onChange={handleLayoutChange}>
          <Radio.Button value="1">1</Radio.Button>
          <Radio.Button value="2">2</Radio.Button>
          <Radio.Button value="3">3</Radio.Button>
        </Radio.Group>
      </div>
    );
  };
  const genExtra = () => (
    <div style={{ textAlign: "right", margin: "0 5px -5px 0" }}>
      <Tooltip title="Create New1">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            addBlank();
          }}
        />
      </Tooltip>
      <Tooltip title="Reset Layout">
        <Popconfirm
          title="Are you sure to reset layout?"
          onConfirm={resetLayout}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" icon={<UndoOutlined />} />
        </Popconfirm>
      </Tooltip>
      <Tooltip title="How many Columns">
        <Popover
          content={
            <>
              <PopoverContent />
              <a
                href="#!"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopvisible(false);
                }}
              >
                Close
              </a>
            </>
          }
          title="Select columns"
          placement="leftTop"
          trigger="click"
          visible={popvisible}
          onVisibleChange={(e) => {
            setPopvisible(!popvisible);
          }}
        >
          <Button
            type="primary"
            onClick={(e) => e.stopPropagation()}
            icon={<AppstoreOutlined />}
          />
        </Popover>
      </Tooltip>
    </div>
  );

  function handleChange(value, e) {
    setSelectChart(value);
  }
  const modalInit = () => {
    const children = [],
      deflist = [];

    const chartType = (type) => {
      switch (type) {
        case "bar":
          return <FcBarChart />;
        case "line":
          return <FcLineChart />;
        case "pie":
          return <FcPieChart />;
        case "scatter":
          return <FcScatterPlot />;
        case "graph":
          return <FcMindMap />;
        case "table":
          return <ImTable />;
        default:
          return <FcCloseUpMode />;
      }
    };
    if (tempModel?.resultsAuthor) {
      tempModel.resultsAuthor.map((k, i) => {
        let type = k.type,
          title = "No title";
        if (type === "chart") type = k.setting.charttype;
        if (k?.setting?.title) title = k.setting.title;
        children.push(
          <Option key={k.id}>
            {chartType(type)} {title}
            {/* {`[${sourcename}_${type}] ${title}`} */}
          </Option>
        );
        if (k.checked === true) deflist.push(k.id);
        return null;
      });
      setChild(children);
      setDefaultlist(deflist);
    }
  };
  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          //createMain(tempModel);
          dispatch(globalVariable({ currentStep: currentStep - 1 }));
          dispatch(globalVariable({ nextStep: currentStep }));
        }}
      >
        <Tooltip title="Add Model Summary " placement="right">
          Add Model Summary
        </Tooltip>
      </Menu.Item>
    </Menu>
  );
  const ModalContent = (
    <>
      <div
        style={{
          marginBottom: 2,
          color: "#afafaf",
        }}
      >
        <Row gutter={4}>
          <Col flex="auto">
            <Select
              mode="multiple"
              showArrow
              style={{ width: "100%" }}
              placeholder="Please select"
              defaultValue={defaultlist}
              onChange={handleChange}
            >
              {child}
            </Select>
          </Col>
          <Col flex="30px">
            <Dropdown overlay={menu} trigger={["contextMenu"]}>
              <Tooltip title="Create New Chart/Table/Graph">
                <Button
                  icon={<PlusOutlined />}
                  onClick={(e) => {
                    setVisible(false);
                    history.push("./author");
                    message.info("Select data for new authoring");
                  }}
                >
                  New
                </Button>
              </Tooltip>
            </Dropdown>
          </Col>
        </Row>
      </div>
    </>
  );
  console.log(tempLayout);
  return (
    <>
      {genExtra()}
      {tempLayout && (
        <GridLay1
          resultsLayout={tempLayout}
          onLayoutChange={onLayoutChange}
          onRemoveItem={onRemoveItem}
          onEditItem={onEditItem}
        ></GridLay1>
      )}

      <Modal
        title="Select chart/graph/table"
        visible={visible}
        onOk={handleOk}
        width={450}
        confirmLoading={confirmLoading}
        onCancel={(e) => {
          e.stopPropagation();
          setVisible(!visible);
        }}
      >
        <p>{ModalContent}</p>
      </Modal>
      <Button
        onClick={() => {
          console.log(tempModel);
        }}
      >
        tempModel
      </Button>
    </>
  );
};

export const saveLayout = (tempModel) => {
  let layout = localStorage.getItem("tempLayout");
  if (layout) {
    layout = JSON.parse(layout);
    let odr = tempModel.resultsAuthor;
    layout.map((k, i) => {
      odr.map((a, b) => {
        if (a.i === k.i) {
          a.x = k.x;
          a.y = k.y;
          a.w = k.w;
          a.h = k.h;
          odr.splice(b, 1, a);
          return null;
        }
        return null;
      });
      return null;
    });
    localStorage.removeItem("tempLayout");
  }
  return tempModel;
};
export default ModelEdit4;
