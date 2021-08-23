import React, { useEffect } from "react";
import DenseAppBar from "components/Common/AppBar";
import $ from "jquery";
import ModelList from "Model/ModelList";
import ModelView from "Model/ModelView";
import ModelEdit from "Model/ModelEdit";
import ModelSetting from "Model/ModelSetting";
import background from "images/background.png";

const Model = ({ match }) => {
  let title = match.params.name;
  // titleUpper = "";
  if (typeof match.params.child != "undefined") title = match.params.child;
  if (typeof match.params.grandchild != "undefined")
    title = match.params.grandchild;

  if (title) {
    //titleUpper = title.charAt(0).toUpperCase() + title.slice(1);
    title = title.toLowerCase();
  }
  //const [adminMenu, setAdminMenu] = useState([]);

  useEffect(() => {
    $(window).on("resize", () => {
      $("#dvbody").css({ minHeight: window.innerHeight });
    });
  }, []);
  return (
    <>
      <div
        id="dvbody"
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "repeat",
          minHeight: window.innerHeight,
        }}
      >
        {(() => {
          switch (title) {
            case "list":
              return (
                <>
                  <DenseAppBar title={"Model"}></DenseAppBar>
                  <ModelList type={title} />
                </>
              );
            case "view":
            default:
              return (
                <>
                  <ModelView />
                </>
              );

            case "edit":
              return (
                <>
                  <ModelEdit />
                </>
              );

            case "setting":
              return (
                <>
                  <ModelSetting />
                </>
              );
            // case "graph":
            //   return (
            //     <>
            //       <ModelGraph />
            //     </>
            //   );
            // case "author":
            //   return (
            //     <>
            //       <ModelAuthor />
            //     </>
            //   );
          }
        })()}
      </div>
      {/* {(() => {
        switch (title) {
          case "authortable":
            return (
              <>
                <AuthorTable />
              </>
            );
          default:
            return null;
        }
      })()} */}
    </>
  );
};

export default Model;
