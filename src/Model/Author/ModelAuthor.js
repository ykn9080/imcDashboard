import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import $ from "jquery";
import _ from "lodash";
import { globalVariable } from "actions";
import DenseAppBar from "components/Common/AppBar";
import AntBreadCrumb from "components/Common/BreadCrumb";
import AntFormDisplay from "imcformbuilder";
import formdt from "Model/AntFormDisplay.json";
import { Button } from "antd";
import IconArray1 from "components/SKD/IconArray1";
import AuhorTable from "Model/Author/AuhorTable";
import EasyChart from "imceasychart";
import AuthorHtml from "./AuthorHtml";
import querySearch from "stringquery";

const ModelAuthor = (props) => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  let query = querySearch(location.search);

  let dataResults, authorlist;

  let tempModel = useSelector((state) => state.global.tempModel);
  console.log(tempModel);
  //if (!tempModel) history.push("/model");
  dataResults = tempModel?.properties?.source; //blockdensity object
  if (!tempModel?.properties) tempModel.properties = {};
  if (!tempModel?.properties?.resultsAuthor)
    tempModel.properties.resultsAuthor = [];
  authorlist = tempModel.properties.resultsAuthor;
  if (authorlist === 0) dispatch(globalVariable({ tempModel }));

  const [type, setType] = useState();
  const [showType, setShowType] = useState("list");
  const [source, setSource] = useState(dataResults); //propertiest.source["blockdensity"]
  const [authArr, setAuthArr] = useState(); //authoring array
  const [authObj, setAuthObj] = useState(); //results.edgelist
  const [initialValues, setInitialValues] = useState();

  if (authArr && authorlist.length !== authArr.length) {
    setAuthArr(authorlist);
  }
  const onValuesChange = (changedValues, allValues) => {
    setType(allValues.type);
    let obj = { ...authObj, ...allValues };
    let obj1 = _.find(source, (o) => {
      return o.key === obj.data;
    });

    if (allValues.type === "html") setAuthObj(obj);
    else setAuthObj(obj1);
  };

  const handleSave = () => {
    dispatch(globalVariable({ triggerChild: ["save", "list"] }));
  };

  const goback = [
    {
      tooltip: "Go to Previous",
      awesome: "step-backward",
      fontSize: "small",
      color: "inherit",
      "aria-controls": "back",
      onClick: () => history.push("/model/edit/graph"),
    },
  ];
  const btnArr = [
    {
      tooltip: "Save and Show Authoring List",
      awesome: "save",
      fontSize: "small",
      color: "inherit",
      onClick: handleSave,
    },
    // {
    //   tooltip: "Back to List",
    //   awesome: "level-up-alt",
    //   fontSize: "small",
    //   color: "inherit",
    //   onClick: handleAddControl,
    // },
    showType === "list"
      ? {
          tooltip: "Go to Previous",
          awesome: "level-up-alt",
          fontSize: "small",
          color: "inherit",
          onClick: () => {
            history.push("/model/edit/graph");
          },
        }
      : {},
  ];
  console.log("authObj", authObj, "type", type);
  useEffect(() => {
    $(".MuiIconButton-root").css("padding", 0);
    $(".ant-col.ant-col-2").css("text-align", "right");
    dispatch(globalVariable({ helpLink: null }));
    console.log(tempModel, query);
    if (tempModel.properties.resultsAuthor && query.key) {
      const obj = _.find(tempModel.properties.resultsAuthor, (o) => {
        return o.key === query.key;
      });
      //   setAuthObj(obj);
      setAuthObj(obj);
      setType(obj.type);
    }
  }, []);

  const makePatch = () => {
    let child = [],
      plist = [];
    if (source)
      source.map((k, i) => {
        child.push({ text: k.title, value: k.key });
        return null;
      });
    plist.push({ name: "data", optionArray: child });
    plist.push({ name: "datas", optionArray: child });
    return plist;
  };

  const addnew = (
    <div
      style={{
        paddingRight: 5,
        marginTop: 20,
      }}
    >
      <div style={{ marginTop: 10 }}>
        <AntFormDisplay
          formArray={formdt["5f0e8d8689db1023b0165b18"]}
          onValuesChange={onValuesChange}
          patchlist={makePatch()}
          initialValues={initialValues}
        />
      </div>
    </div>
  );

  return (
    <>
      <DenseAppBar
        title={"Graph Authoring"}
        left={<IconArray1 btnArr={goback} />}
        right={<IconArray1 btnArr={btnArr} />}
      ></DenseAppBar>
      <div
        style={{
          paddingLeft: 20,
          paddingTop: 5,
          paddingBottom: 10,
        }}
      >
        <AntBreadCrumb />
      </div>
      {/*  <div style={{ marginTop: 10, marginLeft: 20 }}>
        {(() => {
          switch (showType) {
            case "addnew":
              return addnew;
            case "list":
              return list;
            default:
              return null;
          }
        })()} */}

      <div
        style={{
          marginTop: 10,
          marginLeft: 20,
          marginRight: 5,
          height: "auto",
        }}
      >
        {!query.key && addnew}
        {(() => {
          switch (type) {
            case "html":
              return <AuthorHtml authObj={authObj} edit={true} title={true} />;
            case "table":
              return <AuhorTable authObj={authObj} edit={true} title={true} />;
            case "chart":
              return <EasyChart authObj={authObj} edit={true} title={true} />;

            default:
              return null;
          }
        })()}
        {/* {linkclick && <MakeProjectBundle selectedKey={linknode_id} />} */}
        {/* {linkclick && <DataBundleClick linkid={linknode_id} />} */}

        <Button onClick={() => console.log(tempModel.properties)}>
          tempModel123
        </Button>
      </div>
    </>
  );
};

export default ModelAuthor;
