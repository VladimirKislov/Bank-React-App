import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Multiselect from "multiselect-react-dropdown";
import { RootState } from "../../stor/stor";
import styles from "./cards.css";
import { useDispatch } from "react-redux";
import { addAccountNumberAction } from "../../stor/accountNumber";
import { Loader } from "../../utils/Loader";

export function Cards() {
  const token = useSelector<RootState, string>((state) => state.token);
  const [select, setSelect] = useState();
  const [dataCards, setDataCards] = useState<any>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [filterWithElem, setFilterWithElem] = useState<any>([]);
  const [filterWithoutElem, setFilterWithoutElem] = useState<any>([]);
  const [createAccount, setCreateAccount] = useState(false);
  const dispatch = useDispatch();

  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Basic ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("https://back-api-bank.herokuapp.com/accounts", {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Basic ${token}`,
        },
      })
      .then((response) => {
        setDataCards(response.data.payload);
        setCreateAccount(false);
        setIsLoader(true);
      });
  }, [createAccount]);

  useEffect(() => {
    const acc = dataCards.map((item: any) => {
      return item.account;
    });
    dispatch(addAccountNumberAction(acc));
  }, [dataCards]);

  const newAccount = () => {
    fetch("https://back-api-bank.herokuapp.com/create-account", params)
      .then((response) => response.json())
      .then((data) => {
        if (data.payload !== null) setCreateAccount(true);
      });
  };

  useEffect(() => {
    setFilterWithElem(
      dataCards.filter((item: any) => {
        if (item.transactions.length !== 0) return item;
      })
    );

    setFilterWithoutElem(
      dataCards.filter((item: any) => {
        if (item.transactions.length === 0) return item;
      })
    );
  }, [isLoader])

  useEffect(() => {
    if (select !== undefined) {
      switch (select) {
        case "Number":
          return setDataCards(
            [...dataCards].sort((a: any, b: any) => {
              return a.account > b.account ? 1 : -1;
            })
          );
        case "Balance":
          return setDataCards(
            [...dataCards].sort((a: any, b: any) => {
              return a.balance > b.balance ? -1 : 1;
            })
          );
        case "last transaction":
          return setDataCards(
            filterWithElem
              .sort((a: any, b: any) => {
                return new Date(a.transactions[0].date).getMilliseconds() >
                  new Date(b.transactions[0].date).getMilliseconds()
                  ? 1
                  : -1;
              })
              .concat(filterWithoutElem)
          );
      }
    }
  }, [select]);
  
  let num = 1;

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <div className={styles.sort}>
          <h2 className={styles.sortTitle}>Your accounts</h2>
          <div className={styles.sortBtn}>
            <Multiselect
              className="selector"
              isObject={false}
              options={["Number", "Balance", "last transaction"]}
              singleSelect
              placeholder="Sorting"
              onSelect={(event) => {
                setSelect(event[0]);
              }}
            />
          </div>
        </div>
        <button className={styles.containerHeaderBtn} onClick={() => newAccount()}>
          + Create a new account
        </button>
      </div>
      {!isLoader ? (
        <Loader />
      ) : (
        <div className={styles.containerContent}>
          <ul className={styles.cardList}>
            {dataCards.map((item: any) => (
              <li className={styles.card} key={num++}>
                <div className={styles.wrapperCount}>
                  <p className={styles.cardNumber}>{item.account}</p>
                  <p className={styles.cardMoney}>{item.balance} ₽</p>
                </div>
                <div className={styles.wrapperInfo}>
                  <p className={styles.cardText}>Last transaction:</p>
                  <p className={styles.cardDate}>
                    {item.transactions.length > 0
                      ? new Date(item.transactions[0].date).toJSON().slice(0, 10).split("-").join(".")
                      : "No transaction"}
                  </p>
                </div>
                <Link to={`/cards&id=${item.account}`} className={styles.cardOpen}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
