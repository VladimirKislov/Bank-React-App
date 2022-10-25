import axios from "axios";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { RootState } from "../../stor/stor";
import styles from "./opencard.css";
import { getMonth } from "../../utils/getMonth";
import { SelectAccount } from "./SelectAccount";
import { Loader } from "../../utils/Loader";
import { ErrorPage } from "../ErrorPage";

export function OpenCard() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const chartRef = useRef<any>(null);
  const token = useSelector<RootState, string>((state) => state.token);
  const selectAccount = useSelector<RootState, number>((state) => state.selectAccount);
  const [dataCards, setDataCards] = useState<any>({});
  const [arrChart, setArrChart] = useState<any>([]);
  const [getData, setGetData] = useState(false);
  const [isError, setIsError] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [value, setValue] = useState("");
  const [historyDataCards, setHistoryDataCards] = useState<any>({});
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const arrayDate = ["2022-10", "2022-09", "2022-08", "2022-07", "2022-06", "2022-05"];
  const labels = getMonth(5);
  const maxValue = Math.max(...arrChart);
  const params = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Basic ${token}`,
    },
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        left: 35,
        right: 35,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        min: 0,
        max: maxValue,
      },
    },
  };

  useEffect(() => {
    axios.get(`https://back-api-bank.herokuapp.com/account/${id}`, params).then((response) => {
      setDataCards(response.data.payload);
      setLoad(true);
      setGetData(false);
    });
  }, [getData]);


  function transfer() {
    if (selectAccount === 0) {
      setIsError(true);
      return setTitleError(
        "the debit account address is not specified, or this account does not belong to us"
      );
    } else if(value === "") {
      setIsError(true);
      return setTitleError("transfer amount not specified");
    }

    fetch(`https://back-api-bank.herokuapp.com/transfer-funds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({
        from: `${id}`,
        to: `${selectAccount}`,
        amount: `${value}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        switch (data.error) {
          case "Invalid account from":
            setIsError(true);
            return setTitleError(
              "the debit account address is not specified, or this account does not belong to us"
            );
          case "Invalid account to":
            setIsError(true);
            return setTitleError("the crediting account is not specified, or this account does not exist");
          case "Invalid amount":
            setIsError(true);
            return setTitleError("transfer amount is negative");
          case "Overdraft prevented":
            setIsError(true);
            return setTitleError("we tried to transfer more money than is available on the debit account");
        }
        setGetData(true);
        setValue("");
      });
  }

  useEffect(() => {
    let arr: any[] = [];
    if (load) {
      setHistoryDataCards(dataCards.transactions.slice(-10));
      arrayDate.map((el) => {
        let dataFilters = dataCards.transactions.filter((item: any) => {
          if (item.date.includes(el)) {
            return item;
          }
        });
        let total = dataFilters.reduce((a: any, b: any) => (a += b.amount), 0);
        arr.unshift(Math.round(total));
      });
      setArrChart(arr);
    }
  }, [load, getData]);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target.value).trim());
  };

  const goBack = () => {
    navigate(-1);
  }

  const goHistory = () => {
    navigate(`/cards/history_balance&id=${id}`, { state: dataCards });
  }
  
  let num = 1;

  return (
    <div className={styles.container}>
      <div className={styles.descAcc}>
        <h2 className={styles.descAccTitle}>View Account</h2>
        <button className={styles.descAccBtn} onClick={goBack}>
          Hark back
        </button>
      </div>

      <div className={styles.descInfo}>
        <h2 className={styles.descInfoTitle}>№ {id}</h2>
        <div className={styles.descInfoWrapper}>
          <p className={styles.descInfoBlc}>Balance</p>
          <p className={styles.descInfoPrice}>{!load ? 0 : Math.round(dataCards.balance)} ₽</p>
        </div>
      </div>

      {!load ? (
        <Loader />
      ) : (
        <div className={styles.detailInfo}>
          <div className={styles.detailInfoTransfer}>
            <h3 className={styles.detailInfoTransferTitle}>New Transfer:</h3>
            <div className={styles.detailInfoTransferWrapper}>
              <div className={styles.detailInfoTransferWrapperInput}>
                <p className={styles.detailInfoTransferText}>Beneficiary's account number</p>
                <SelectAccount id={id} />
              </div>
              <div className={styles.detailInfoTransferWrapperInput}>
                <p className={styles.detailInfoTransferText}>Transfer amount</p>
                <input className={styles.detailInfoTransferInput} value={value} onChange={onChangeInput} type="number" />
              </div>
              <button className={styles.detailInfoTransferBtn} onClick={() => transfer()}>
                send
              </button>
            </div>
          </div>

          <div className={styles.detailInfoBalance}>
            <h3 className={styles.detailInfoBalanceTitle} onClick={goHistory}>
              Balance dynamics
            </h3>
            <div className={styles.detailInfoBalanceChart}>
              <p className={styles.detailInfoBalanceChartMaxValue}>{maxValue === -Infinity ? 0 : maxValue}</p>
              <p className={styles.detailInfoBalanceChartMinValue}>0</p>
              <Bar
                ref={chartRef}
                options={options}
                data={{
                  labels,
                  datasets: [
                    {
                      label: "",
                      data: arrChart,
                      backgroundColor: "#116ACC",
                    },
                  ],
                }}
              />
            </div>
            <ul className={styles.detailInfoBalanceMonth}>
              {labels.map((item) => (
                <li className={styles.detailInfoBalanceMonthItem} key={num++}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.detailInfoHistory}>
            <h3 className={styles.detailInfoHistoryTitle} onClick={goHistory}>
              Translation history
            </h3>
            <div className={styles.detailInfoHistoryTab}>
              <div className={styles.detailInfoHistoryTabHeader}>
                <div className={styles.detailInfoHistoryTabHeaderWrap}>
                  <h3 className={styles.detailInfoHistoryTabHeaderText}>Sender's account</h3>
                  <h3 className={styles.detailInfoHistoryTabHeaderText}>Beneficiary's account</h3>
                  <h3 className={styles.detailInfoHistoryTabHeaderText}>Amount</h3>
                  <h3 className={styles.detailInfoHistoryTabHeaderText}>Date</h3>
                </div>
              </div>
            </div>
            <ul className={styles.cardListContainer}>
              {load &&
                historyDataCards.length > 0 &&
                historyDataCards.map((item: any) => (
                  <li className={styles.cardList} key={num++}>
                    <p className={styles.cardItem}>{item.from}</p>
                    <p className={styles.cardItem}>{item.to}</p>
                    {Math.sign(item.amount) === -1 && (
                      <p className={styles.cardItemAmountRed}>{item.amount}</p>
                    )}
                    {Math.sign(item.amount) === 1 && (
                      <p className={styles.cardItemAmountGreen}>{item.amount}</p>
                    )}
                    {Math.sign(item.amount) === 0 && (
                      <p className={styles.cardItemAmountRed}>{item.amount}</p>
                    )}
                    <p className={styles.cardItemDate}>
                      {new Date(item.date).toJSON().slice(0, 10).split("-").join(".")}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
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
