import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import $ from "jquery";
import { globalVariable } from "actions";
import { idMake } from "components/functions/dataUtil";
import { Row, Col, Button } from "antd";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import "components/Common/Antd_Table.css";
import SimpleEditor from "Model/Editor/simpleEditor";
import parse from "html-react-parser";

const AuthorHtml = ({ authObj, onChange, edit }) => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState();
  const [init, setInit] = useState();
  const [econtent1, setEcontent1] = useState(); //simple
  const [htmlcontent, setHtmlcontent] = useState();

  let tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  useEffect(() => {
    if (authObj) {
      let st;
      let newAuth = _.cloneDeep(authObj);
      setAuth(authObj);

      if (newAuth.setting) st = newAuth.setting;

      if (newAuth.content) {
        setEcontent1(authObj.content);
      }
      if (st) {
        setInit({
          title: st.title,
          desc: st.desc,
          column: st.column,
          order: st.order,
          format: st.format,
        });
      }
    }
    return () => {
      $('link[href="Antd_Table.css"]').remove(); //.prop("disabled", true);
    };
  }, [authObj]);
  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.attribs.class === "remove") {
        return <></>;
      }
    },
  };
  useEffect(() => {
    if (econtent1) setHtmlcontent(parse(econtent1, options));
  }, [econtent1]);
  const makePatch = () => {
    let child = [],
      plist = [];

    if (auth && auth.dtslist)
      auth.dtslist.map((k, i) => {
        child.push({ text: k.title, value: k.key });
        return null;
      });
    plist.push({ name: "order", optionArray: child });
    return plist;
  };

  const makeData = (src, newAuth, odr) => {
    if (!newAuth.datas) return;
    let dts = _.filter(src, (o) => {
      return newAuth.datas.indexOf(o.key) > -1;
    });
    if (odr) {
      dts.map((s, j) => {
        const sodr = odr.indexOf(s.key);
        s.odr = sodr;
        dts.splice(j, 1, s);
        return null;
      });
      dts = _.sortBy(dts, ["odr"]);
    }
    return dts;
  };

  const saveHtml = () => {
    let newdata = { ...auth };
    let mdtb = authObj,
      local1 = localStorage.getItem("modelchart");
    if (local1) mdtb = JSON.parse(local1);

    let set = {};
    set = newdata.setting;

    set = { ...set, ...mdtb };
    // newdata = { ...newdata, ...mdtb };
    setInit({
      title: mdtb.title,
      desc: mdtb.desc,
      column: mdtb.column,
      order: mdtb.order,
      format: mdtb.format,
    });
    let src = tempModel?.properties?.source;
    newdata.dtslist = makeData(src, newdata, mdtb.order);
    if (!newdata.id) {
      newdata = { ...newdata, id: idMake(), type: "html" };
    }

    newdata = {
      ...newdata,
      setting: set,
    };

    setAuth(newdata);
    return newdata;
  };

  const saveTemp = (trigger) => {
    let authorlist = tempModel?.resultsAuthor;

    if (trigger.length > 0 && trigger[0] === "save") {
      let newdata = saveHtml();
      const editcontent = localStorage.getItem("editcontent");
      const editcontent1 = localStorage.getItem("editcontent1");

      if (editcontent) {
        newdata.content = JSON.parse(editcontent);
        localStorage.removeItem("editcontent");
      }
      if (editcontent1) {
        newdata.content = editcontent1;
        setEcontent1(newdata.content);
        if (onChange) onChange(newdata);
        localStorage.removeItem("editcontent1");
      }
      localStorage.removeItem("modelhtml");

      let notexist = true;
      authorlist.map((k, i) => {
        if (k.i === newdata.i) {
          authorlist.splice(i, 1, newdata);
          notexist = false;
        }
        return null;
      });
      if (notexist) {
        authorlist.push(newdata);
      }
      tempModel.resultsAuthor = authorlist;

      dispatch(globalVariable({ tempModel }));
      dispatch(globalVariable({ triggerChild: [] }));
    }
  };
  saveTemp(trigger);

  const onEditValuesChangeTable = (changedValues, allValues) => {
    let local = authObj,
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.setting = { ...local.setting, ...allValues };
    localStorage.setItem("modelchart", JSON.stringify(local));
  };

  return (
    <div className="gridcontent" style={{ margin: 5 }}>
      {edit && (
        <Row gutter={16}>
          <Col span={16}>
            <SimpleEditor html={econtent1} authObj={authObj} />
          </Col>
          <Col span={8}>
            <AntFormDisplay
              formArray={formdt["5f8e8ea4dbd58cbe2f3129f4"]}
              onValuesChange={onEditValuesChangeTable}
              patchlist={makePatch()}
              initialValues={init}
            />
            <div style={{ textAlign: "right", marginTop: 5 }}>
              <Button onClick={saveHtml}>Apply</Button>
            </div>
          </Col>
        </Row>
      )}

      <div
        id="dvtest"
        style={{
          width: "99%",
          padding: "30px 10px 10px 10px",
          marginBottom: -5,
          height: "auto",
        }}
      >
        {!edit && <div id="dvContent">{htmlcontent}</div>}
      </div>
    </div>
  );
};

export default AuthorHtml;
