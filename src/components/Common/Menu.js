import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Menu } from "antd";
import { getTreeFromFlatData } from "components/functions/dataUtil";

const { SubMenu } = Menu;

const AntMenu = (props) => {
  const history = useHistory();
  let location = useLocation();
  const [current, setCurrent] = useState("");
  const [gData, setgData] = useState([]);
  useEffect(() => {
    setgData(treeDt);
    setCurrent(location.pathname);
  }, [props.menuList, location.pathname]);

  // const routesMap = ({ path, breadcrumbName }) => {
  //   let newdt = [],
  //     links = "";
  //   path.split("/").filter((k, i) => {
  //     if (links.endsWith("/")) links += k;
  //     else {
  //       links += "/" + k;
  //     }
  //     if (i === 0) k = "Home";
  //     return(
  //     newdt.push({ path: links, breadcrumbName: k })
  //     )
  //   });
  //   if (typeof breadcrumbName != "undefined") {
  //     breadcrumbName
  //       .split("/")
  //       .filter((k, i) => (newdt[i]["breadcrumbName"] = k));
  //   }
  //   return newdt;
  // };
  const handleClick = (e) => {
    history.push(e.item.props.path);
    setCurrent(e.key);
    if (props.handleClick) props.handleClick(e.key);
  };

  let treeDt = getTreeFromFlatData({
    flatData: props.menuList.map((node) => ({ ...node, title: node.title })),
    getKey: (node) => node._id, // resolve a node's key
    getParentKey: (node) => node.pid, // resolve a node's parent's key
    rootKey: "", // The value of the parent key when there is no parent (i.e., at root level)
  });

  const loop = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <SubMenu title={item.title} key={item._id}>
            {loop(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path} path={item.path}>
          {item.title}
        </Menu.Item>
      );
    });
  };
  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
      theme="dark"
    >
      {loop(gData)}
    </Menu>
  );
};

export default AntMenu;
