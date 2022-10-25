import axios from "axios";
import Multiselect from "multiselect-react-dropdown";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DownIcon, UpIcon } from "../../assets/Icons";
import { addSocketAction } from "../../stor/socketAction";
import { RootState } from "../../stor/stor";
import { ErrorPage } from "../ErrorPage";
import styles from "./money.css";

export function Money() {
  const token = useSelector<RootState, string>((state) => state.token);
  const socket = useSelector<RootState, any>((state) => state.socket);
  const [coinAccount, setCoinAccount] = useState<any>();
  const [arrSocket, setArrSocket] = useState<any>([]);
  const [selectFrom, setSelectFrom] = useState("BTC");
  const [selectTo, setSelectTo] = useState("ETH");
  const [value, setValue] = useState<any>(null);
  const [exchange, setExchange] = useState(false);
  const [isError, setIsError] = useState(false);
  const [titleError, setTitleError] = useState("");
  const dispatch = useDispatch();
  const optionsFrom = ["BTC", "ETH", "JPY", "USD", "RUB", "BYR"];
  const params = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Basic ${token}`,
    },
  };

  const ws = new WebSocket("ws:back-api-bank.herokuapp.com/currency-feed");

  useEffect(() => {
    axios.get("https://back-api-bank.herokuapp.com/all-currencies").then((response) => response);

    axios.get("https://back-api-bank.herokuapp.com/currencies", params).then((response) => {
      setCoinAccount(response.data.payload);
      setExchange(false);
    });
  }, [exchange]);

  useEffect(() => {
    ws.onmessage = (response) => {
      const msg = JSON.parse(response.data);
      dispatch(addSocketAction(msg));
    };
  }, [])

  useEffect(() => {
    socket.map((item: any) => {
      if (arrSocket.length < 13) {
        setArrSocket([...arrSocket, item]);
      } else if (arrSocket.length === 13) {
        setArrSocket([...arrSocket.slice(0, 0), ...arrSocket.slice(1)]);
      }
    });
  }, [socket])

  const exchangeCoin = (elem: any) => {
    elem.preventDefault();
    console.log(selectFrom);
    console.log(selectTo);
    console.log(value);
    fetch("https://back-api-bank.herokuapp.com/currency-buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({
        from: `${selectFrom}`,
        to: `${selectTo}`,
        amount: `${value}`,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      setExchange(true);
      switch (data.error) {
        case "Unknown currency code":
          setIsError(true);
          return setTitleError(
            "Incorrect currency code was sent, the code is not supported by the system (currency debit code or credit currency code)"
          );
        case "Invalid amount":
          setIsError(true);
          return setTitleError("transfer amount is not specified, or it is negative");
        case "Not enough currency":
          setIsError(true);
          return setTitleError("there are no funds on the debiting currency account");
        case "Overdraft prevented":
          setIsError(true);
          return setTitleError("an attempt to transfer more than is available on the debit account");
      }
    })
  }

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  
  let num = 1;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>currency exchange</h2>
      <div className={styles.wrapper}>
        <div className={styles.wrapperMoney}>
          <h3 className={styles.wrapperMoneyTitle}>Your currencies</h3>
          <div className={styles.wrapperMoneyInfo}>
            <div className={styles.wrapperMoneyInfoContainer}>
              <p className={styles.wrapperMoneyInfoContainerCoin}>ETH</p>
              <span className={styles.wrapperMoneyInfoContainerPoint}>
                .......................................................................................................................................................................................................................................................................
              </span>
              <p className={styles.wrapperMoneyInfoContainerPrice}>
                {coinAccount !== undefined && coinAccount.ETH.amount}
              </p>
            </div>
            <div className={styles.wrapperMoneyInfoContainer}>
              <p className={styles.wrapperMoneyInfoContainerCoin}>BTC</p>
              <span className={styles.wrapperMoneyInfoContainerPoint}>
                ........................................................................................................................................................................................................................................................................
              </span>
              <p className={styles.wrapperMoneyInfoContainerPrice}>
                {coinAccount !== undefined && coinAccount.BTC.amount}
              </p>
            </div>
            <div className={styles.wrapperMoneyInfoContainer}>
              <p className={styles.wrapperMoneyInfoContainerCoin}>JPY</p>
              <span className={styles.wrapperMoneyInfoContainerPoint}>
                ........................................................................................................................................................................................................................................................................
              </span>
              <p className={styles.wrapperMoneyInfoContainerPrice}>
                {coinAccount !== undefined && coinAccount.JPY.amount}
              </p>
            </div>
            <div className={styles.wrapperMoneyInfoContainer}>
              <p className={styles.wrapperMoneyInfoContainerCoin}>USD</p>
              <span className={styles.wrapperMoneyInfoContainerPoint}>
                ........................................................................................................................................................................................................................................................................
              </span>
              <p className={styles.wrapperMoneyInfoContainerPrice}>
                {coinAccount !== undefined && coinAccount.USD.amount}
              </p>
            </div>
            <div className={styles.wrapperMoneyInfoContainer}>
              <p className={styles.wrapperMoneyInfoContainerCoin}>RUB</p>
              <span className={styles.wrapperMoneyInfoContainerPoint}>
                ........................................................................................................................................................................................................................................................................
              </span>
              <p className={styles.wrapperMoneyInfoContainerPrice}>
                {coinAccount !== undefined && coinAccount.RUB.amount}
              </p>
            </div>
            <div className={styles.wrapperMoneyInfoContainer}>
              <p className={styles.wrapperMoneyInfoContainerCoin}>BYR</p>
              <span className={styles.wrapperMoneyInfoContainerPoint}>
                ........................................................................................................................................................................................................................................................................
              </span>
              <p className={styles.wrapperMoneyInfoContainerPrice}>
                {coinAccount !== undefined && coinAccount.BYR.amount}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.wrapperCourse}>
          <h3 className={styles.wrapperCourseTitle}>Changing rates in real time</h3>
          <div className={styles.wrapperCourseContainer}>
            {socket.length > 0 &&
              arrSocket.map((msg: any) => (
                <li className={styles.wrapperCourseContainerBlock} key={num++}>
                  <p className={styles.wrapperCourseContainerBlockCoin}>
                    {msg.from}/{msg.to}
                  </p>
                  <span className={styles.wrapperCourseContainerBlockPoint}>
                    ........................................................................................................................................................................................................................................................................................................................................................................................................................................................
                  </span>
                  <p className={styles.wrapperCourseContainerBlockPrice}>{msg.rate}</p>
                  <span className={styles.wrapperCourseContainerBlockIcon}>
                    {msg.change === 1 && <UpIcon />}
                    {msg.change === -1 && <DownIcon />}
                  </span>
                </li>
              ))}
          </div>
        </div>

        <div className={styles.wrapperExchange}>
          <h3 className={styles.wrapperExchangeTitle}>Currency exchange</h3>
          <form className={styles.form}>
            <div className={styles.formSelectContainer}>
              <div className={styles.formSelect}>
                <p className={styles.formSelectTitle}>From</p>
                <Multiselect
                  className="selectFrom"
                  isObject={false}
                  options={optionsFrom}
                  singleSelect
                  selectedValues={[selectFrom]}
                  onSelect={(event) => {
                    setSelectFrom(event[0]);
                  }}
                />
                <p className={styles.formSelectTitle}>to</p>
                <Multiselect
                  className="selectTo"
                  isObject={false}
                  options={optionsFrom}
                  singleSelect
                  selectedValues={[selectTo]}
                  onSelect={(event) => {
                    setSelectTo(event[0]);
                  }}
                />
              </div>

              <div className={styles.formInputContainer}>
                <p className={styles.formInputContainerTitle}>Amount</p>
                <input className={styles.formInputContainerInput} value={value} onChange={onChangeValue} type="number" />
              </div>
            </div>
            <button className={styles.formInputContainerBtn} onClick={exchangeCoin}>
              Exchange
            </button>
          </form>
        </div>
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
