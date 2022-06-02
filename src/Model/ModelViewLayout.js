import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import _ from "lodash";
import { Spin, Alert } from "antd";
import { loadCSS } from "fg-loadcss";
import GridLay1 from "Model/Author/ReactGridLayout";
import "Model/Author/react-grid-layout.css";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <Spin />
      {/* <p>Something went wrong:</p>
      <pre>{error.message}</pre> */}
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
    </div>
  );
}

const ModelLayout = (props) => {
  let tempModel = useSelector((state) => state.global.tempModel);
  const [tempLayout, setTempLayout] = useState();

  useEffect(async () => {
    if (!tempModel?.resultsAuthor) return;
    let lay = _.filter(tempModel.resultsAuthor, (o) => {
      return o.type;
    });
    lay.sort(function (a, b) {
      return parseInt(a.i) - parseInt(b.i);
    });

    setTempLayout(lay);

    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, [tempModel]);

  let items = [];
  const myErrorHandler = (error, info) => {
    //window.location.reload(false);
    if (props.errorurl) window.location.href = props.errorurl;
    else window.location.reload(true);
    // Do something with the error
    // E.g. log to an error logging client here
  };

  return (
    <>
      {tempLayout && tempLayout.length > 0 ? (
        <>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={myErrorHandler}
          >
            <GridLay1
              show={false}
              resultsLayout={tempLayout}
              draggableCancel=".dashboard-item-content"
              draggableHandle=".dashboard-item-header"
            >
              {items}
            </GridLay1>
          </ErrorBoundary>
        </>
      ) : (
        <div style={{ position: "absolute", top: "45%", left: "45%" }}>
          <Alert
            message="No data available"
            description="Pls press edit button on top"
            type="error"
          />
        </div>
      )}
    </>
  );
};

export default ModelLayout;
