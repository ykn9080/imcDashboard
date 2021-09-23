import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import EasyChart from "imcchart";
import EasyTable from "imcgridtable";
import AuthorHtml from "Model/Author/AuthorHtml";
import { Popconfirm, Tooltip, Typography, Space } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  RiseOutlined,
  FallOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { GoDatabase } from "react-icons/go";
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
      compactType: "vertical",
      // verticalCompact: false,
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
    this.onSortAscending = this.onSortAscending.bind(this);
    this.onSortDescending = this.onSortDescending.bind(this);
    this.onAddItem = this.onAddItem.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

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
    this.props.onLayoutChange(layout);
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: this.state.item },
    });
  }
  onRouteChange(el) {
    delete el.edit;
    let path = {
      pathname: "/author/data",
      state: { author: { ...el } },
    };

    this.props.history.push(path);
  }
  createElement(el) {
    let removeStyle = {
      position: "absolute",
      right: "50px",
      top: "8px",
      cursor: "pointer",
    };
    let editStyle = { ...removeStyle, right: "31px" };
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
      marginRight: 5,
      height: "auto",
      display: "flex",
      flexDirection: "column",
      borderRadius: 5,
      backgroundColor: "white",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };
    if (["graph"].indexOf(el.type) === -1)
      style = { ...style, overflow: "hidden" };
    let moreStyle = { ...removeStyle, right: "8px", top: "8px" };

    const menu = [
      {
        title: (
          <Tooltip title="data edit" placement="left">
            <GoDatabase />
          </Tooltip>
        ),
        onClick: () => {
          this.onRouteChange(el);
        },
      },
      {
        title: (
          <Tooltip title="ascending" placement="left">
            <RiseOutlined />
          </Tooltip>
        ),
        onClick: () => this.onSortAscending(el),
      },
      {
        title: (
          <Tooltip title="descending" placement="left">
            <FallOutlined />
          </Tooltip>
        ),
        onClick: () => this.onSortDescending(el),
      },
      {
        title: (
          <Tooltip title="fullscreen" placement="left">
            <FullscreenOutlined />
          </Tooltip>
        ),
        onClick: () => this.onFullScreenItem(el),
      },
    ];
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
    const barStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#EEEEEE",
      height: 35,
      borderBottom: "solid 1px #BBBBBB",
    };
    const fixground = <div style={barStyle} />;
    const moveground = <div style={{ ...barStyle, cursor: "move" }} />;
    const editbtn = (
      <div>
        <span className="icon1" style={editStyle}>
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
        </Popconfirm>
        <span className="icon1" style={moreStyle}>
          <Tooltip title="More" key="morelayout">
            {/* <Dropdown.Button overlay={menu}></Dropdown.Button> */}
            {/* <MoreOutlined className="moreb" onClick={() => this.onMoreItem(el)} /> */}
            <DisplayMore menu={menu} />
          </Tooltip>
        </span>
      </div>
    );
    el = { ...el, edit: this.onEditItem, onDataget: this.onDataget };
    return (
      <div key={i} data-grid={i} style={style}>
        <CreateContent {...el} />
        {this.props.show !== false ? moveground : fixground}
        {title}
        {this.props.show !== false && editbtn}
      </div>
    );
  }

  onSortDescending(el) {
    const data = el.dtlist;
    const value = el.setting.value[0];

    el.dtlist = _.sortBy(data, value).reverse();

    this.setState({ chartdata: el.dtlist });
  }

  onEditItem(i) {
    this.props.onEditItem(i);
  }
  onRemoveItem(i) {
    let removedItems = _.reject(this.state.items, { i: i });
    // setItems([...removedItems]);
    this.setState({
      items: removedItems,
    });
    this.props.onRemoveItem(i);
  }

  onSortAscending(el) {
    if (!el.setting) return;
    const data = el.dtlist;
    const value = el.setting.value[0];

    el.dtlist = _.sortBy(data, value);

    this.setState({ chartdata: el.dtlist });
  }
  onAddItem() {
    /*eslint no-console: 0*/
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        i: "n" + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
      }),
      // Increment the counter to ensure key is always unique.
      newCounter: this.state.newCounter + 1,
    });
  }
  onFullScreenItem(el) {
    el.w = 12;
    el.h = 12;
    el.x = 0;
    el.y = 0;

    this.setState({
      items: [el],
    });
  }

  render() {
    return (
      <div>
        <ResponsiveReactGridLayout
          {...this.props}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
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
          {this.generateDOM(this.props.resultsLayout)}
        </ResponsiveReactGridLayout>
      </div>
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
        console.log(kk);
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
  return (() => {
    switch (k.type) {
      case "html":
        return <AuthorHtml authObj={k} title={true} />;
      case "table":
        return <EasyTable authObj={k} title={true} />;
      case "chart":
        return <EasyChart authObj={k} title={true} />;
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
  rowHeight: 20,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  //initialLayout: generateLayout(),
  //initialLayout: extractLayout(this.props.resultsLayout),
};

export default withRouter(ShowcaseLayout);
