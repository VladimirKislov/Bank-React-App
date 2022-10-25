import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stor/stor";
import { addTokenAction } from "../../stor/tokenAction";
import styles from "./header.css";

export function Header() {
  const token = useSelector<RootState, string>((state) => state.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteToken = () => {
    dispatch(addTokenAction(''));
  }
  
  return (
    <div className={styles.container}>
      <a className={styles.link} href="#">
        Coin.
      </a>
      {token !== '' && (
        <div className={styles.containerButton}>
          <button className={styles.btn} onClick={() => navigate("/maps")}>
            ATMs
          </button>
          <button className={styles.btn} onClick={() => navigate("/cards")}>
            Bank account
          </button>
          <button className={styles.btn} onClick={() => navigate("/money")}>
            Money
          </button>
          <button className={styles.btn} onClick={() => {deleteToken()}}>
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
