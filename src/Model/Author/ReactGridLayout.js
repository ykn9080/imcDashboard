import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import EasyChart from "imcchart";
import EasyTable from "imcgridtable";
import AuthorHtml from "Model/Author/AuthorHtml";
import { Tooltip, Typography, Space } from "antd";
import {
  DeleteOutlined,
  FormOutlined,
  FileSearchOutlined,
  FullscreenOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { AiOutlineExpand } from "react-icons/ai";
import IconArray1 from "components/SKD/IconArray1";
import "./react-grid-layout.css";
import DisplayMore from "components/SKD/DisplayMore";
import { makeStyles } from "@material-ui/core/styles";

const { Title } = Typography;
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const useStyles = makeStyles((theme) => ({
  card: {
    padding: 10,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardbutton: { fontSize: 50 },
}));

class ShowcaseLayout extends React.Component {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 300,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: "lg",
      compactType: null,
      verticalCompact: false,
      preventCollision: true,
      // mounted: false,
      // chartdata: [],
      newCounter: 0,
      items: this.props.resultsLayout,
      remove: props.remove,
      layouts: { lg: this.props.resultsLayout },
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
    this.createElement = this.createElement.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onDetailItem = this.onDetailItem.bind(this);
    // this.onSortAscending = this.onSortAscending.bind(this);
    // this.onSortDescending = this.onSortDescending.bind(this);
    //this.onAddItem = this.onAddItem.bind(this);
    this.onChartChange = this.onChartChange.bind(this);
    this.onChartChangeCancel = this.onChartChangeCancel.bind(this);
    this.onDetailDashSetting = this.onDetailDashSetting.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }
  componentWillReceiveProps = (nextProps) => {
    //if (this.props !== nextProps) {
    this.setState({
      items: _.cloneDeep(nextProps.resultsLayout),
      layouts: _.cloneDeep({ lg: nextProps.resultsLayout }),
    });
  };
  generateDOM(items) {
    return _.map(items, (el) => this.createElement(el));
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint,
    });
  }

  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  }

  onLayoutChange(layout) {
    localStorage.setItem("tempLayout", JSON.stringify(layout));
    this.props.onLayoutChange(layout);
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: this.state.item },
    });
  }
  onChartChange(el) {
    delete el.edit;
    el.type = el.type + "_edit";
    var index = _.findIndex(this.state.items, { i: el.i });
    if (index) {
      this.state.items.splice(index, 1, el);
    }
    this.setState({
      items: this.state.items,
    });
    // let path = {
    //   pathname: "/author/data",
    //   state: { author: { ...el } },
    // };

    // this.props.history.push(path);
  }
  onChartChangeCancel(el) {
    let newel = { ...el };
    newel.type = newel.type.replace("_edit", "");
    var index = _.findIndex(this.state.items, { i: newel.i });
    if (index) {
      this.state.items.splice(index, 1, newel);
    }
    this.setState({
      items: this.state.items,
    });
  }
  onDetailDashSetting(el) {
    delete el.edit;
    let path = {
      pathname: "/author/detailsetting",
      state: { ...el },
    };

    this.props.history.push(path);
  }
  createElement(el) {
    let removeStyle = {
      position: "absolute",
      right: "55px",
      top: "8px",
      cursor: "pointer",
    };
    let editStyle = { ...removeStyle, right: "28px" };
    if (this.props.remove === false)
      removeStyle = { ...removeStyle, display: "none" };
    if (this.props.edit === false) {
      editStyle = { ...editStyle, display: "none" };
      this.setState({
        draggableCancel: ".dashboard-item-content",
        draggableHandle: ".dashboard-item-header",
      });
    }
    if (el.i === "undefined") el.i = "0";
    const i = el.i;
    let style = {
      padding: 5,
      position: "relative",
      marginRight: 5,
      width: "100%",
      // display: "flex",
      // flexDirection: "column",
      borderRadius: 5,
      backgroundColor: "white",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };
    if (["graph"].indexOf(el.type) === -1) style = { ...style };
    let moreStyle = { ...removeStyle, right: "4px", top: "8px" };
    const barStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#EEEEEE",
      height: 35,
      borderBottom: "solid 1px #BBBBBB",
    };

    const menu = (i, el) => {
      return [
        {
          title: (
            <Tooltip title="Report Edit" placement="left">
              <FormOutlined />
            </Tooltip>
          ),
          onClick: () => {
            this.onChartChange(el);
          },
        },

        {
          title: (
            <Tooltip title="Linked Report" placement="left">
              <FileSearchOutlined />
            </Tooltip>
          ),
          onClick: () => this.onDetailDashSetting(el),
        },
        {
          title: (
            <Tooltip title="Remove" key="removelayout">
              <DeleteOutlined />
            </Tooltip>
          ),
          onClick: () => {
            if (window.confirm("Are you sure to remove?")) {
              this.onRemoveItem(i);
            }
          },
        },
      ];
    };
    const title = (
      <div
        style={{
          position: "absolute",
          top: 3,
          left: 10,
        }}
      >
        <Title level={5}>{el.setting.title}</Title>
      </div>
    );

    const fixground = <div style={barStyle} />;
    const moveground = <div style={{ ...barStyle, cursor: "move" }} />;
    const editbtn = (
      <div style={{ position: "absolute", top: -5, right: 5 }}>
        {/* <span className="icon1" style={editStyle}>
          <Tooltip title="Edit" key="editlayout">
            <EditOutlined onClick={() => this.onEditItem(i)} />
          </Tooltip>
        </span>
        <Popconfirm
          placement="top"
          title={"Delete?"}
          onConfirm={() => this.onRemoveItem(i)}
          okText="Yes"
          cancelText="No"
        >
          <span className="icon1" style={removeStyle}>
            <Tooltip title="Remove from layout" key="removelayout">
              <CloseOutlined />
            </Tooltip>
          </span>
        </Popconfirm> */}
        <span className="icon1" style={moreStyle}>
          <Tooltip title="More" key="morelayout">
            <DisplayMore menu={menu(i, el)} />
          </Tooltip>
        </span>
      </div>
    );
    const detailbtn = (
      <div style={{ position: "absolute", top: -5, right: 5 }}>
        <span className="icon1" style={editStyle}>
          <Tooltip title="Trophy" key="trophylayout">
            <TrophyOutlined onClick={() => this.props.onDetailItem(el)} />
          </Tooltip>
        </span>
      </div>
    );
    const fullbtn = (
      <div style={{ position: "absolute", top: -5, right: 5 }}>
        <span className="icon1" style={moreStyle}>
          <Tooltip title="Fullscreen" key="fullscreenlayout">
            <FullscreenOutlined
              onClick={() => this.props.onFullScreenItem(el)}
            />
          </Tooltip>
        </span>
      </div>
    );

    el = {
      ...el,
      edit: this.onEditItem,
      onDataget: this.onDataget,
    };

    return (
      <div key={i} data-grid={i} style={style}>
        <CreateContent {...el} cancel={this.onChartChangeCancel} />
        {this.props.show !== false ? moveground : fixground}
        {title}
        {this.props.show !== false && editbtn}
        {this.props.show === false && el.detailsetting && detailbtn}
        {this.props.show === false &&
          el.fullscreen !== false &&
          el.detail !== true &&
          fullbtn}
      </div>
    );
  }

  onEditItem(i) {
    this.props.onEditItem(i);
  }
  onDetailItem(i) {
    const trophy = _.find(this.state.items, { i: i });
    this.props.onDetailItem(trophy);
  }
  onRemoveItem(i) {
    let removedItems = _.reject(this.state.items, { i: i });
    // setItems([...removedItems]);
    this.setState({
      items: removedItems,
    });
    this.props.onRemoveItem(i);
  }

  // onAddItem() {
  //   /*eslint no-console: 0*/
  //   this.setState({
  //     // Add a new item. It must have a unique key!
  //     items: this.state.items.concat({
  //       i: "n" + this.state.newCounter,
  //       x: (this.state.items.length * 2) % (this.state.cols || 12),
  //       y: Infinity, // puts it at the bottom
  //       w: 2,
  //       h: 2,
  //     }),
  //     // Increment the counter to ensure key is always unique.
  //     newCounter: this.state.newCounter + 1,
  //   });
  // }
  // onFullScreenItem(el) {
  //   el.w = 12;
  //   el.h = 12;
  //   el.x = 0;
  //   el.y = 0;

  //   this.setState({
  //     items: [el],
  //   });
  // }

  render() {
    return (
      <ResponsiveReactGridLayout
        {...this.props}
        // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        layouts={this.state.layouts}
        onBreakpointChange={this.onBreakpointChange}
        onLayoutChange={this.onLayoutChange}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={this.state.mounted}
        compactType={this.state.compactType}
        preventCollision={!this.state.compactType}
      >
        {/* {this.generateDOM(this.props.resultsLayout)} */}
        {this.generateDOM(this.state.items)}
      </ResponsiveReactGridLayout>
    );
  }
}

const CreateContent = (k) => {
  const classes = useStyles();
  const history = useHistory();
  //const dispatch = useDispatch();
  let kk = {
    checked: k.checked,
    h: k.h,
    i: k.i,
    seq: k.seq,
    w: k.w,
    x: k.x,
    y: k.y,
  };
  if (k.dtlist) kk.dtlist = k.dtlist;
  if (k.originlist) kk.originlist = k.originlist;
  if (k.dtsetting) kk.dtsetting = k.dtsetting;
  if (k.setting) kk.setting = k.setting;
  if (k.title) kk.title = k.title;
  localStorage.removeItem("blanki");
  localStorage.removeItem("modelchart");

  const btnArr = [
    {
      tooltip: "data",
      awesome: "database",
      fontSize: "large",
      color: "inherit",
      "aria-controls": "data",
      onClick: () => {
        localStorage.setItem("blanki", kk.i);
        history.push({
          pathname: "/author/data",
          state: { author: { ...kk } },
        });
      },
    },
    {
      tooltip: "chart",
      awesome: "chart-area",
      fontSize: "large",
      color: "inherit",
      "aria-controls": "chart",
      onClick: () => {
        localStorage.setItem("blanki", kk.i);
        history.push({
          pathname: "/author/chart",
          state: { author: { ...kk, type: "chart" } },
        });
      },
    },
    {
      tooltip: "Table",
      awesome: "table",
      fontSize: "large",
      color: "inherit",
      onClick: () => {
        localStorage.setItem("blanki", kk.i);
        history.push({
          pathname: "/author/table",
          state: {
            author: {
              ...kk,
              type: "table",
            },
          },
        });
      },
    },
    {
      tooltip: "Network graph",
      awesome: "project-diagram",
      fontSize: "large",
      color: "inherit",
      "aria-controls": "network graph",
      onClick: () => {
        localStorage.setItem("blanki", kk.i);
        history.push({
          pathname: "/author/graph",
          state: { author: { ...kk, type: "graph" } },
        });
      },
    },
    {
      tooltip: "Html",
      awesome: "file-code",
      fontSize: "large",
      color: "inherit",
      onClick: () => {
        localStorage.setItem("blanki", kk.i);
        history.push({
          pathname: "/author/html",
          state: { author: { ...kk, type: "html" } },
        });
      },
    },
    {
      tooltip: "Select from list",
      awesome: "list-alt",
      fontSize: "large",
      color: "inherit",
      "aria-controls": "archive list",
      onClick: () => {
        //dispatch(globalVariable({ tempModelNew: null }));
        //history.push("/model/author?type=list");
      },
    },
  ];
  const cancelArr = (el) => {
    return [
      {
        tooltip: "Back to previous",
        awesome: "level-up-alt",
        fontSize: "large",
        color: "inherit",
        "aria-controls": "return previous",
        onClick: () => {
          k.cancel(el);
        },
      },
    ];
  };
  return (() => {
    switch (k.type) {
      case "html":
        return <AuthorHtml authObj={k} title={true} />;
      case "table":
        return <EasyTable authObj={k} title={true} showmenu={false} />;
      case "chart":
        return <EasyChart authObj={k} title={true} showmenu={false} />;
      default:
        return (
          <div className={classes.card} style={{ marginTop: 50 }}>
            <Space size={"large"}>
              <div>
                <Title style={{ marginLeft: 22 }} level={5}>
                  Data
                </Title>
                <div className={classes.card}>
                  <IconArray1 btnArr={[btnArr.shift()]} />
                </div>
              </div>
              <div>
                <Title style={{ marginLeft: 22 }} level={5}>
                  Layout
                </Title>
                <div className={classes.card}>
                  <IconArray1 btnArr={btnArr} />
                </div>
              </div>
              {k.type && k.type.indexOf("_edit") > 0 && (
                <div>
                  <Title style={{ marginLeft: 22 }} level={5}>
                    Cancel
                  </Title>
                  <div className={classes.card}>
                    <IconArray1 btnArr={cancelArr(k)} />
                  </div>
                </div>
              )}
            </Space>
          </div>
        );
    }
  })();
};

ShowcaseLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
};

ShowcaseLayout.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  //initialLayout: generateLayout(),
  //initialLayout: extractLayout(this.props.resultsLayout),
};

export default withRouter(ShowcaseLayout);
