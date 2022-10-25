import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stor/stor";
import { addTokenAction } from "../../stor/tokenAction";
import { ErrorPage } from "../ErrorPage";
import styles from "./login.css";

export function LogIn() {
  const token = useSelector<RootState, string>((state) => state.token);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [titleError, setTitleError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function getToken(log: string, pas: string) {
    setLogin("");
    setPassword("");
    await axios
      .post("https://back-api-bank.herokuapp.com/login", {
        login: log,
        password: pas,
      })
      .then((response) => {
        switch (response.data.error) {
          case "Invalid password":
            setIsError(true);
            return setTitleError("trying to login with wrong password");
          case "No such user":
            setIsError(true);
            return setTitleError("user with this login does not exist");
        }

        if (response.data.payload.token === "ZGV2ZWxvcGVyOnNraWxsYm94") {
          dispatch(addTokenAction(response.data.payload.token));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if (token === "ZGV2ZWxvcGVyOnNraWxsYm94") {
      navigate("/cards", { replace: true });
    }
  }, [token]);

  const onChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign in</h2>
      <p className={styles.text}>login: developer password: time</p>
      <div className={styles.form}>
        <div className={styles.formLogin}>
          <p className={styles.formLoginTitle}>Login</p>
          <input
            className={styles.formLoginInput}
            onChange={onChangeLogin}
            value={login}
            type="text"
            placeholder="developer"
          />
        </div>
        <div className={styles.formPassword}>
          <p className={styles.formPasswordTitle}>Password</p>
          <input
            className={styles.formPasswordInput}
            onChange={onChangePassword}
            value={password}
            type="password"
            placeholder="time"
          />
        </div>
        <button className={styles.btn} onClick={() => getToken(login, password)}>
          Enter
        </button>
      </div>
      {isError && (
        <ErrorPage
          title={titleError}
          onClose={() => {
            setIsError(false);
          }}
        />
      )}
    </div>
  );
}
