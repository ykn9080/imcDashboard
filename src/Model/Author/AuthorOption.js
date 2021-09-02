import React, { useState, useEffect } from "react";
import _ from "lodash";
import "components/Common/Antd.css";
import { List, Card, Collapse, Button } from "antd";
import PieChart from "Model/Chart/antv/PieChart";
import BarChart from "Model/Chart/antv/BarChart";
import LineChart from "Model/Chart/antv/LineChart";
import ColumnChart from "Model/Chart/antv/ColumnChart";
import ScatterPlot from "Model/Chart/antv/ScatterPlot";
import AreaChart from "Model/Chart/antv/AreaChart";
import Options from "Model/Chart/antv/OptionArray";
import { CleanupObj } from "imcchart";

const { Panel } = Collapse;

const ChartOption = (props) => {
  useEffect(() => {
    setDataSource(Options[props.type]);
    setSelected([]);
  }, [props.type]);

  const [dataSource, setDataSource] = useState();
  const [selected, setSelected] = useState([]);

  const onCardClick = (item) => {
    if (selected.indexOf(item.key) > -1) {
      const indx = selected.indexOf(item.key);
      const nsel = selected.splice(indx);
      setSelected(nsel);
      props.onOptionClick(null);
    } else {
      setSelected([item.key]);
      props.onOptionClick(item.option);
    }
  };
  return (
    <>
      <Collapse defaultActiveKey={["1"]} ghost>
        <Panel header="Options" key="1">
          {dataSource && (
            <List
              grid={{ gutter: 16, column: 6 }}
              dataSource={dataSource}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{
                      border:
                        selected && selected.indexOf(item.key) > -1
                          ? "1px solid #3994F7"
                          : "1px solid #d8d4d4",
                      borderRadius: 5,
                    }}
                    hoverable
                    onClick={() => onCardClick(item)}
                    cover={
                      <div style={{ padding: 15 }}>
                        {FindChart(props.type, props.config, item.option)}
                      </div>
                    }
                  ></Card>
                </List.Item>
              )}
            />
          )}
        </Panel>
      </Collapse>
      {/* <Button
        onClick={() => {
          console.log(selected);
        }}
      >
        selected
      </Button> */}
    </>
  );
};
const FindChart = (type, config, option) => {
  if (!(config?.data && config.data.length > 0)) return null;
  let originfig = {
    data: config.data,
    xField: config.xField,
    yField: config.yField,
  };
  [
    "xField",
    "yField",
    "seriesField",
    "colorField",
    "angleField",
    "sizeField",
  ].map((k, i) => {
    if (config[k]) originfig = { ...originfig, [k]: config[k] };
    return null;
  });

  originfig = { ...originfig, height: 90, autoFit: true, ...option };
  originfig = CleanupObj(originfig);
  switch (type) {
    case "pie":
      return <PieChart config={originfig} />;
    case "line":
      return <LineChart config={originfig} />;
    case "area":
      return <AreaChart config={originfig} />;
    case "column":
      return <ColumnChart config={originfig} />;
    case "bar":
      return <BarChart config={originfig} />;
    case "scatter":
      return <ScatterPlot config={originfig} />;
    default:
      return null;
  }
};
export default ChartOption;
