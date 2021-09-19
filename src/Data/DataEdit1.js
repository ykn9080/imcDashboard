import React from "react";
import _ from "lodash";
import { Groupby } from "Data/DataManipulation";
import { pickAndRename } from "components/functions/dataUtil";

export function GroupDataList(dtList, groupby) {
  let rtn = dtList;
  if (groupby) {
    const opt = {
      groupfields: groupby.fields,
      valuefields: groupby.values,
      groupbytype: groupby.groupby,
    };
    rtn = Groupby(dtList, opt);
  }
  return rtn;
}
export function GroupColumnList(columnlist, groupby) {
  let rtn = columnlist;
  if (groupby) {
    const gfields = groupby.values.concat(groupby.fields);
    rtn = _.remove(columnlist, function (n) {
      return gfields.indexOf(n.key) > -1;
    });
  }
  return rtn;
}

const filterList = (filList, columnList) => {
  let filList1 = [];
  const filterColumn = (type, decimal, data) => {
    Boolean.parse = function (str) {
      switch (str.toLowerCase()) {
        case "true":
          return true;
        case "false":
        default:
          return false;
      }
    };

    switch (type) {
      case "string":
        return data?.toString();
      case "int":
        return parseInt(data);
      case "float":
        return parseFloat(data).toFixed(parseInt(decimal));
      case "bool":
        return Boolean.parse(data);
      case "datetime":
        return Date.parse(data);
      default:
        break;
    }
  };

  if (filList && typeof filList === "object")
    filList.map((a, j) => {
      columnList.map((b, m) => {
        if (b.calculaterule) {
          a = {
            ...a,
            [b.key]: calcMaker(b.calculaterule, a),
          };
        }
        if (b.datatype) {
          a = {
            ...a,
            [b.key]: filterColumn(b.datatype, b.decimal, a[b.key]),
          };
        }
      });
      filList1.push(a);
      return null;
    });

  return filList1;
};
const calcMaker = (rule, row) => {
  //const rule="$wgt/3+10",row={wgt:3,src:1,tgt:2}
  if (!rule) return false;
  let spl1 = [],
    cond = [],
    rtn;
  const rkey = Object.keys(row);
  const rval = Object.values(row);
  const parseRule = (splitt) => {
    spl1 = splitt.split("$");
    //["", "wgt/3+10"];
    spl1.map((k, i) => {
      rkey.map((s, j) => {
        if (k.toLowerCase().indexOf(s.toLocaleLowerCase()) > -1)
          spl1.splice(i, 1, k.replace(s, rval[j]));
        return null;
      });
      return null;
    });
    return spl1.join("");
  };
  const tryEval = (str) => {
    try {
      str = eval(str);
    } catch (e) {}
    return str;
  };

  cond = rule.split(",");
  if (cond.length === 3) {
    if (tryEval(parseRule(cond[0]))) {
      rtn = tryEval(parseRule(cond[1]));
    } else rtn = tryEval(parseRule(cond[2]));
  } else {
    rtn = parseRule(rule);
    rtn = tryEval(rtn);
  }

  return rtn;
};
const makeColumn = (columns, colsetting) => {
  let col = [],
    dtt = [];

  columns.map((column, i) => {
    if (i === 0 && column.titletext === "0") column.titletext = "";
    let obj = {
      title: column.titletext,
      titletext: column.titletext,
      origin: column.origin,
      dataIndex: column.dataIndex,
      key: column.key,
      sort: column.sort,
      datatype: column.datatype,
      decimal: column.decimal,
      render(text, record) {
        let styleset = {};
        if (record[`color.${obj.origin}`])
          styleset = { background: record[`color.${obj.origin}`] };
        return {
          props: {
            style: { ...styleset },
          },
          children: <div>{text}</div>,
        };
      },
    };
    if (!obj.title | !obj.titletext) {
      obj.title = obj.origin;
      obj.titletext = obj.origin;
    }
    if (colsetting.order) {
      obj.sort = colsetting.order.indexOf(obj.key);
    }
    if (obj.sort) obj.sorter = (a, b) => a[column] - b[column];
    if (column.origin.indexOf("color") > -1) return false;
    col.push(obj);

    dtt.push({
      key: i,
      ...column,
    });
    return null;
  });

  col = _.sortBy(col, ["sort"]);
  return col;
};
export const UpdateColnData = (data) => {
  let columnList = [];
  let colArr = data?.setting?.column;
  let dttlist = data.dtlist;
  if (!colArr) return false;
  let ds = data.setting;

  colArr.map((k, i) => {
    if (!(ds && ds.delarr && ds.delarr.indexOf(k.key) > -1) | ds.reset)
      columnList.push(k);
    return null;
  });
  columnList = GroupColumnList(columnList, ds.groupby);
  dttlist = GroupDataList(dttlist, ds.groupby);
  const filList = filterList(dttlist, columnList);
  const cols = makeColumn(columnList, data.setting);

  return { dtlist: filList, column: cols };
};
export const UpdateColnDataAndApplyToDataList = (data) => {
  //After UpdateColnData, apply column to dtlist
  if (!data) return;

  const updated = UpdateColnData(data);
  //ex:array=[{a:1,b:2,c:3},{a:11,b:21,c:31}]
  //pickAndRename(array, ["a","b"],["aa","bb"])
  //result: [{aa: 1, bb: 2},{aa: 11, bb: 21}]
  let cobj = {};
  const sorted = _.orderBy(updated.column, ["sort"]);
  sorted.map((k, i) => {
    cobj = { ...cobj, [k.origin]: k.title };
    return null;
  });
  const rtn = pickAndRename(
    updated.dtlist,
    Object.keys(cobj),
    Object.values(cobj)
  );
  return rtn;
};
export const baseData = (data1) => {
  let setting = {};
  if (!data1) return false;
  if (data1.setting) setting = data1.setting;
  let colArr,
    colCompare,
    colArr1 = [],
    diffnum = 0;

  colArr = setting.column;
  if (colArr && data1.dtlist && data1.dtlist.length > 0) {
    colCompare = Object.keys(data1.dtlist[0]);
    let colArrColumn = [];
    colArr.map((k, i) => {
      colArrColumn.push(k.key);
      return null;
    });
    diffnum = _.difference(colArrColumn, colCompare).length;
  }
  if (!colArr | (diffnum > 0)) {
    if (data1.dtlist && data1.dtlist.length > 0 && !colArr) {
      colArr = setting.colArr || Object.keys(data1.dtlist[0]);
      colArr.map((k, i) => {
        colArr1.push({
          title: k,
          titletext: k,
          origin: k,
          dataIndex: k,
          key: k,
        });
        return null;
      });
      setting.column = colArr1;
      data1.setting = setting;
    }
  }
  return data1;
};
