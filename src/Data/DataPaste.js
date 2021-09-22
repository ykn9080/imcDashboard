import React, { useEffect, useState } from "react";
import { Input, Row, Col, Typography, Alert } from "antd";
import XLSX from "xlsx";
import {makeCols} from "./Excel/Sheetjs"

const { Title } = Typography;
const { TextArea } = Input;

const DataPaste = ({ authObj }) => {
  const [result, setResult] = useState();
  const [initVal, setInitVal] = useState();
  const [showalert, setShowalert] = useState(false);

  useEffect(() => {
    if(authObj.dtlist)
    userInput(authObj.dtlist)
    //setInitVal(JSON.stringify(authObj.dtlist));
    
  }, []);

  const onChange=(e)=>{
    setInitVal(e.target.value);
    console.log(e.target.value, csvToexcel(e.target.value))
    if(IsJsonString(e.target.value)){
userInput(JSON.parse(e.target.value))
    }
    else{
       csvToexcel(e.target.value)
}
  }  
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
const csvToexcel=(inputdt)=>{
var data = new Buffer(inputdt);//"1;2;3\n4;5;6"
var wb = XLSX.read(data, {type:"buffer"});
var js = XLSX.utils.sheet_to_json(wb.Sheets.Sheet1, {header:1, raw:true});

js.map((k,i)=>{
  
  k.map((s,j)=>{
    if(typeof s==="string"){
    s=s.replace(/\s+/g, '')
    s=s.replace(/"/g, '');
    
    k.splice(j,1,s)
    }
  })
  js.splice(i,1,k)
})
const rtn=arrayToJson(js)
setResult(JSON.stringify(rtn, null, 2));
chkArrayNupdate(rtn)
}
const arrayToJson=(data)=>{
  const head=data.shift();
  let rtn=[]
  data.map((k,i)=>{
    let obj={}
    head.map((s,j)=>{
      obj[s]=k[j]
    })
  rtn.push(obj)
  })
  return rtn;
}
const chkArrayNupdate=(inputval)=>{
   if (Array.isArray(inputval)) {
      setShowalert(false);
      successUpdate(inputval);
    } else setShowalert(true);
}
 const successUpdate = (val) => {
      //use localstorage to prevent state change
      let local = {},
        local1 = localStorage.getItem("modelchart");
      if (local1) local = JSON.parse(local1);
      local.dtlist = val;
      local.setting.dtype = "paste";
      localStorage.setItem("modelchart", JSON.stringify(local));
    };
const userInput = (inputval) => {
    setResult(JSON.stringify(inputval, null, 2));
    chkArrayNupdate(inputval)
  };
  /* list of supported file types */
const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]
  .map(function(x) {
    return "." + x;
  })
  .join(",");

  return (
    <>
      <Row gutter={4}>
        <Col flex={6}>
          <TextArea
            rows={10}
            onChange={onChange}
            accept={SheetJSFT}
            value={initVal}
          />
        </Col>
        <Col flex={6}>
          {result && <TextArea rows={10} id="code" value={result}></TextArea>}
          <div style={{ marginTop: 5 }}>
          {showalert ?(
              <Alert
                message="Not array!, Select an array datafield"
                type="error"
              />):(
              <Alert
                message="Good Json format!"
                type="success"
              />)}
            </div>
        </Col>
      </Row>
    </>
  );
};

export default DataPaste;