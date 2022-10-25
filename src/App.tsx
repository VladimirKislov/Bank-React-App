import "./main.global.css";
import React, { useEffect, useState } from "react";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import styles from "./app.css";
import { hot } from "react-hot-loader/root";
import { Layout } from "./shared/Layout/Layout";
import { RootReducer, RootState } from "./stor/stor";
import { LogIn } from "./shared/LogIn";
import { Cards } from "./shared/Cards";
import { OpenCard } from "./shared/OpenCard";
import { HistoryBalance } from "./shared/HistoryBalance";
import { Money } from "./shared/Money";
import { Maps } from "./shared/Map";
import { useSelector } from "react-redux";

const store = createStore(RootReducer, composeWithDevTools(applyMiddleware(thunk)));

function AppComponent() {
  const token = useSelector<RootState, string>((state) => state.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<LogIn />} />
              <Route
                path="/cards"
                element={token === "ZGV2ZWxvcGVyOnNraWxsYm94" ? <Cards /> : <Navigate to="/" />}
              />
              <Route
                path="/cards&id=:id"
                element={token === "ZGV2ZWxvcGVyOnNraWxsYm94" ? <OpenCard /> : <Navigate to="/" />}
              />
              <Route
                path="/cards/history_balance&id=:id"
                element={token === "ZGV2ZWxvcGVyOnNraWxsYm94" ? <HistoryBalance /> : <Navigate to="/" />}
              />
              <Route
                path="/money"
                element={token === "ZGV2ZWxvcGVyOnNraWxsYm94" ? <Money /> : <Navigate to="/" />}
              />
              <Route
                path="/maps"
                element={token === "ZGV2ZWxvcGVyOnNraWxsYm94" ? <Maps /> : <Navigate to="/" />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export const App = hot(() => (
  <Provider store={store}>
    <AppComponent />
  </Provider>
));
