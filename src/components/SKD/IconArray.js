import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { globalVariable } from "actions";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import $ from "jquery";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconBtn from "components/Common/IconButton";
import Layout1 from "images/Layout/Layout1.png";
import Layout2 from "images/Layout/Layout2.png";
import Layout3 from "images/Layout/Layout3.png";
import Layout4 from "images/Layout/Layout4.png";
import Layout5 from "images/Layout/Layout5.png";
import Layout6 from "images/Layout/Layout6.png";
import Layout7 from "images/Layout/Layout7.png";
import Layout8 from "images/Layout/Layout8.png";

const IconArray = () => {
  const layout = [
    { col: [1], repeat: 1 },
    { col: [1], repeat: 2 },
    { col: [2], repeat: 2 },
    { col: [3], repeat: 3 },
    { col: [1, 2], repeat: 1 },
    { col: [2, 1], repeat: 1 },
    { col: [1, 3], repeat: 1 },
    { col: [3, 1], repeat: 1 },
  ];
  let ctrList = useSelector((state) => state.global.control);

  if (typeof ctrList === "undefined") ctrList = [];
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [layoutIndex, setLayoutIndex] = useState(0); //selected layout form index

  const handleReset = () => {
    dispatch(globalVariable({ control: [] }));
    dispatch(globalVariable({ menuedit: false }));
    handleClose();
  };
  const handleClick = (event) => {
    const id = $(event.currentTarget).attr("aria-controls");

    switch (id) {
      case "editMenu":
        setAnchorEl(event.currentTarget);
        break;
      case "layoutMenu":
        setAnchorEl1(event.currentTarget);
        break;
      default:
        return null;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose1 = (num) => {
    setLayoutIndex(num - 1);
    LayoutControl(layout[num - 1]);
    setAnchorEl1(null);
  };

  const handleMenuEdit = () => {
    dispatch(globalVariable({ menuedit: true }));
    dispatch(globalVariable({ control: [] }));
    handleClose();
  };
  const handleNavigate = (e) => {
    //e.preventDefault();
    history.push("/controls");
    handleClose();
  };

  const findNthWidth = (seq, arr) => {
    //find nth round
    const ttl = _.sum(arr);
    const index = seq % ttl;
    //find arr index
    if (index + 1 <= arr[0]) return 12 / arr[0];
    else return 12 / arr[1];
  };
  let addCtr = (seq, size) => {
    //const id = new ObjectID();
    const id = parseInt(Math.random() * 100000);

    return {
      _id: id,
      ctrid: "",
      type: "",
      seq: seq,
      size: size,
    };
  };
  const handleAddControl = () => {
    const ctrLength = ctrList.length;
    const layObj = layout[layoutIndex];

    let seq = ctrLength;
    ctrList.push(addCtr(seq, findNthWidth(seq, layObj.col)));
    console.log(ctrList);
    dispatch(globalVariable({ control: ctrList }));
    LayoutControl(layObj, ctrList);
  };

  const LayoutControl = (layObj, ctrl) => {
    if (typeof layObj === "undefined") return false;
    if (typeof ctrl != "undefined") ctrList = ctrl;

    // let unitwidth = 12 / _.sum(layObj.col);
    if (ctrList.length === 0) {
      //| isBlank()) {
      ctrList = [];
      let seq = 0;
      for (let i = 0; i < layObj.repeat; i++) {
        layObj.col.map((v, i) => {
          for (let j = 0; j < v; j++) {
            ctrList.push(addCtr(seq, findNthWidth(seq, layObj.col)));
            seq++;
          }
          return null;
        });
      }
    } else {
      ctrList = _.sortBy(ctrList, ["seq"]);
      ctrList.map((ctr, j) => {
        ctr.seq = j;
        ctr.size = findNthWidth(j, layObj.col);
        return null;
      });
    }

    dispatch(globalVariable({ control: ctrList }));
  };

  const layoutMenu = (
    <Menu
      id="layoutMenu"
      anchorEl={anchorEl1}
      keepMounted
      open={Boolean(anchorEl1)}
      onClose={handleClose1}
    >
      {/* <MenuItem onClick={() => handleClose1(1)}>
        </MenuItem> */}
      <MenuItem onClick={() => handleClose1(1)}>
        <ListItemIcon>
          <img src={Layout1} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={() => handleClose1(2)}>
        <ListItemIcon>
          <img src={Layout2} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={() => handleClose1(3)}>
        <ListItemIcon>
          <img src={Layout3} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={() => handleClose1(4)}>
        <ListItemIcon>
          <img src={Layout4} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={() => handleClose1(5)}>
        <ListItemIcon>
          <img src={Layout5} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={() => handleClose1(6)}>
        <ListItemIcon>
          <img src={Layout6} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={() => handleClose1(7)}>
        <ListItemIcon>
          <img src={Layout7} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={() => handleClose1(8)}>
        <ListItemIcon>
          <img src={Layout8} alt="img" width={25} />
        </ListItemIcon>
      </MenuItem>
    </Menu>
  );

  const editMenu = (
    <Menu
      id="editMenu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleMenuEdit}>Edit</MenuItem>
      <MenuItem onClick={handleReset}>Reset</MenuItem>
      <MenuItem onClick={handleNavigate}>Navigate</MenuItem>
    </Menu>
  );
  return (
    <>
      <IconBtn
        tooltip="Go to Previous"
        awesome="chevron-circle-left"
        fontSize="small"
        aria-controls="back"
        onClick={() => history.goBack()}
      />
      <IconBtn
        tooltip="Other menus"
        awesome="caret-square-down"
        fontSize="small"
        aria-controls="editMenu"
        onClick={handleClick}
      />
      {layoutMenu}
      <IconBtn
        tooltip="Layout for controls"
        awesome="grip-vertical"
        fontSize="small"
        aria-controls="layoutMenu"
        onClick={handleClick}
      />
      {editMenu}
      <IconBtn
        tooltip="Add Controls"
        awesome="plus-square"
        fontSize="small"
        onClick={handleAddControl}
      />
    </>
  );
};

export default IconArray;
