import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { globalVariable } from "actions";
import _ from "lodash";
import $ from "jquery";
import { Alert, message } from "antd";
import { loadCSS } from "fg-loadcss";
import GridLay1 from "Model/Author/ReactGridLayout";
import "Model/Author/react-grid-layout.css";
import { localInit } from "Model";
// import { ErrorBoundary } from "react-error-boundary";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { isJSON } from "components/functions/dataUtil";

// function ErrorFallback({ error, resetErrorBoundary }) {
//   return (
//     <div role="alert">
//       <Spin />
//       {/* <p>Something went wrong:</p>
//       <pre>{error.message}</pre> */}
//       {/* <button onClick={resetErrorBoundary}>Try again</button> */}
//     </div>
//   );
// }

const ModelLayout = (props) => {
  const dispatch = useDispatch();
  let tempModel = useSelector((state) => state.global.tempModel);

  const [tempLayout, setTempLayout] = useState();
  const [show, setShow] = useState(false);
  const [imsiModel, setImsiModel] = useState();

  useEffect(() => {
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
  useEffect(() => {
    $("#fullScreenModalId").css({ width: "100px" });
  });
  let items = [];
  // const myErrorHandler = (error, info) => {
  //   //window.location.reload(false);
  //   if (props.errorurl) window.location.href = props.errorurl;
  //   else window.location.reload(true);
  //   // Do something with the error
  //   // E.g. log to an error logging client here
  // };

  const onDetailItem = async (val) => {
    let param = val?.detailsetting?.parameter;
    if (typeof param !== "undefined") {
      if (typeof param === "string" && isJSON(param)) param = JSON.parse(param);
      else {
        message.error("parameter json format is wrong!");
        return false;
      }
    }
    const rtn = await localInit("mysql", param);

    let temp = _.find(rtn.data, (o) => {
      return o.id === val.detailsetting?.dashid;
    });
    temp.resultsAuthor.map((k, i) => {
      k.detail = true;
      temp.resultsAuthor.splice(i, 1, k);
    });
    dispatch(globalVariable({ tempModel: temp }));
    setImsiModel(tempModel);
    setShow(true);
  };
  const onReturnPrev = () => {
    setShow(false);
    dispatch(globalVariable({ tempModel: imsiModel }));
    // setTimeout(() => {
    //   $(".react-resizable").css({
    //     width: $(".react-resizable").parent().width() - 19,
    //   // });
    // }, 300);
  };
  const onFullScreenItem = (val) => {
    console.log(tempModel, val);
    val.h = 22;
    val.w = 12;
    delete val.detailsetting;
    val.fullscreen = false;
    let newtemp = _.cloneDeep(tempModel);
    newtemp.resultsAuthor = [val];
    dispatch(globalVariable({ tempModel: newtemp }));
    setImsiModel(tempModel);
    setShow(true);
    setTimeout(() => {
      $("#fullScreenModalId").addClass("fullscreen-modal");
    }, 300);
  };
  return (
    <>
      {tempLayout && tempLayout.length > 0 ? (
        <>
          {/* <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={myErrorHandler}
          > */}

          <GridLay1
            show={false}
            resultsLayout={tempLayout}
            onDetailItem={onDetailItem}
            onFullScreenItem={onFullScreenItem}
            draggableCancel=".dashboard-item-content"
            draggableHandle=".dashboard-item-header"
          >
            {items}
          </GridLay1>

          {/* </ErrorBoundary> */}
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

      <Modal
        id="fullScreenModalId"
        show={show}
        onHide={() => {
          onReturnPrev();
        }}
        dialogClassName="fullscreen-modal"
      >
        <Modal.Header>
          <Modal.Title>Ranking</Modal.Title>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onReturnPrev}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <GridLay1 show={false} resultsLayout={tempLayout}>
            {items}
          </GridLay1>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="primary" onClick={onReturnPrev}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default ModelLayout;
