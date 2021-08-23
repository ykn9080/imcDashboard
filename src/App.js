import React, { useState } from "react";
import "./App.css";
import Admin from "Admin";
import Model from "Model";
import Author from "Model/Author";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { userContext } from "components/functions/userContext";

const App = (props) => {
  const [gvalue, setGvalue] = useState([{ test: "ok", hello: "hi" }]);

  return (
    <div style={{ flexGrow: 1 }}>
      <Router>
        <userContext.Provider value={[gvalue, setGvalue]}>
          <Switch>
            <Route path="/" exact component={Model} />

            <Route
              path="/author/:name?/:child?/:grandchild?"
              component={Author}
            />
            <Route
              path="/admin/:name?/:child?/:grandchild?"
              component={Admin}
            />
            <Route path="/:name?/:child?/:grandchild?" component={Model} />
          </Switch>
        </userContext.Provider>
      </Router>
    </div>
  );
};

export default App;
