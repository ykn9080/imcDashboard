import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import $ from "jquery";
import { globalVariable } from "actions";
import { idMake } from "components/functions/dataUtil";
import { Typography, Descriptions, Table, Row, Col, Button } from "antd";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import {
  UpdateColnData,
  UpdateColnDataAndApplyToDataList,
} from "Data/DataEdit1";
import "components/Common/Antd_Table.css";
import SimpleEditor from "Model/Editor/simpleEditor";
import parse from "html-react-parser";

const { Title, Text } = Typography;
export const Description = ({ dtslist, format, column }) => {
  if (!format) format = -1;
  if (!column) column = 1;

  return (
    <>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }]}>
        {dtslist.map((k, i) => {
          let title = "";
          if (k.title) title = k.title.replace("[main]", "");
          return k.dtlist && k.dtlist.length > 0
            ? k.dtlist.length === 1
              ? makeSingeRowContent(k, title, format, column)
              : makeTableContent(k, title, format, column)
            : makeStringContent(k, title, format, column);
        })}
      </Row>
    </>
  );
};

const makeStringContent = (k, title, format, column) => {
  let txt = k.dtlist;
  if (typeof txt === "undefined" || txt.length <= 0) txt = k.dtorigin;
  if (!Number.isNaN(Number(txt)) && format !== "-1")
    txt = Number(txt).toFixed(format);
  return (
    <Col span={24 / column}>
      <Row>
        <Col>
          <Title level={5}>{title} : </Title>
        </Col>
        <Col>
          <Text> {txt}</Text>
        </Col>
      </Row>
    </Col>
  );
};

const makeSingeRowContent = (k, title, format, column) => {
  const dtlist = UpdateColnDataAndApplyToDataList(k);
  if (!dtlist) return;
  return (
    <Col span={24 / column}>
      <Descriptions title={title} size={"middle"} className="none">
        {Object.keys(dtlist[0]).map((a, b) => {
          let txt = dtlist[0][a];
          if (!Number.isNaN(Number(txt)) && format !== "-1")
            txt = Number(txt).toFixed(format);
          return (
            <Descriptions.Item label={a} key={a + b}>
              {txt}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </Col>
  );
};

const UpdateMultiColumns = (data) => {
  if (!data) return;
  const columns = data.column;
  const datalist = data.dtlist;
  if (columns.some((e) => e.key.split("_").length > 1)) {
    console.log(
      "This column have multi header: ",
      columns.find((e) => e.key.split("_").length > 1).title
    );
  }

  let topHeaders = new Map();
  let firstSubHeaders = new Map();
  let processedColumns = [];

  columns.forEach((e) => {
    if (e.key.split(".").length > 1) {
      const titles = e.title.split(".", 2);
      if (!topHeaders.has(titles[0])) {
        topHeaders.set(titles[0], { title: titles[0], children: [] });
        firstSubHeaders.set(titles[0], { title: e.title, size: 1 });
      } else {
        firstSubHeaders.get(titles[0]).size++;
      }
      e.title = titles[1];
      e.titletext =
        e.titletext.split(".").length > 1
          ? e.titletext.split(".", 2)[1]
          : e.titletext;
      topHeaders.get(titles[0]).children.push(e);
    } else {
      processedColumns.push(e);
    }
  });

  if (topHeaders.size > 0) {
    topHeaders.forEach((h) => processedColumns.push(h));
  }

  datalist.forEach((e) => {
    firstSubHeaders.forEach((v, k) => {
      if (e.hasOwnProperty(k)) {
        e[v.title] = e[k];
      }
    });
  });

  return { columns: processedColumns, datalist: datalist };
};

const makeTableContent = (k, title, format, column) => {
  let col = [],
    dtlist = [];
  if (k.dtlist) {
    const rtn = UpdateColnData(k);
    dtlist = rtn.dtlist;
    const multipleColumned = UpdateMultiColumns(rtn);
    if (!multipleColumned) return;
    col = multipleColumned.columns;
    dtlist = multipleColumned.datalist;
    dtlist.map((a, b) => {
      a.key = b;
      _.forIn(a, function (value, key) {
        if (!Number.isNaN(Number(value)) && format !== "-1") {
          value = Number(value).toFixed(format);
        }
        a[key] = value;
      });
      dtlist.splice(b, 1, a);
      return null;
    });
  }

  return (
    <>
      <Col span={24 / column}>
        <Title level={5}>{title}</Title>
        <Table
          columns={col}
          dataSource={dtlist}
          size="small"
          pagination={false}
          className="none"
        />
      </Col>
    </>
  );
};

const AuthorHtml = ({ authObj, edit }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [init, setInit] = useState();
  const [column, setColumn] = useState();
  const [format, setFormat] = useState();
  const [econtent1, setEcontent1] = useState(); //simple
  const [htmlcontent, setHtmlcontent] = useState();

  let tempModel = useSelector((state) => state.global.tempModel);
  const trigger = useSelector((state) => state.global.triggerChild);

  useEffect(() => {
    dispatch(globalVariable({ helpLink: "model/edit/graph?type=html" }));
    if (authObj) {
      let dts = [],
        odr,
        st;
      let newAuth = _.cloneDeep(authObj);
      let src = tempModel?.properties?.source;

      if (newAuth.setting) st = newAuth.setting;
      if (st) odr = st.order;
      if (newAuth.content) {
        setEcontent1(authObj.content);
      }
      if (src) {
        dts = makeData(src, newAuth, odr);
        if (dts)
          dts.map((a, b) => {
            const rtn = UpdateColnData(a);
            if (!rtn.dtlist) return null;
            a.dtlist = rtn.dtlist;

            dts.splice(b, 1, a);
            return null;
          });

        newAuth.dtslist = dts;

        if (st) {
          setInit({
            title: st.title,
            desc: st.desc,
            column: st.column,
            order: st.order,
            format: st.format,
          });
          setColumn(st.column);
          setFormat(st.format);
        }
        setData(newAuth);
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

    if (data && data.dtslist)
      data.dtslist.map((k, i) => {
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
    let newdata = { ...data };
    let mdtb = localStorage.getItem("modelhtml");
    let set = {};
    set = newdata.setting;
    if (mdtb) {
      mdtb = JSON.parse(mdtb);
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
    }
    setData(newdata);
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
        localStorage.removeItem("editcontent1");
      }
      localStorage.removeItem("modelhtml");

      let notexist = true;
      authorlist.map((k, i) => {
        if (k.i === newdata.i) {
          console.log("her");
          authorlist.splice(i, 1, newdata);
          notexist = false;
        }
        return null;
      });
      if (notexist) {
        authorlist.push(newdata);
      }
      console.log(authorlist);
      tempModel.resultsAuthor = authorlist;

      dispatch(globalVariable({ tempModel }));
      dispatch(globalVariable({ triggerChild: [] }));
    }
  };
  saveTemp(trigger);

  const onEditValuesChangeTable = (changedValues, allValues) => {
    localStorage.setItem("modelhtml", JSON.stringify(allValues));
    if (changedValues.column) setColumn(changedValues.column);
    if (changedValues.format) setFormat(changedValues.format);
  };

  return (
    <div className="gridcontent" style={{ margin: 5 }}>
      {edit && (
        <Row gutter={16}>
          <Col span={16}>
            <SimpleEditor html={econtent1} />
            {/* <Editor
              content={econtent}
              onContentStateChange={onContentStateChange}
            /> */}
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
        {data && data.dtslist && (
          <Description dtslist={data.dtslist} format={format} column={column} />
        )}
        {/* {econtent ? <Editor content={econtent} type="view" /> : null} */}
        {!edit && <div id="dvContent">{htmlcontent}</div>}
      </div>
    </div>
  );
};

export default AuthorHtml;
