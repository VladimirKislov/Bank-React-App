import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from './historybalance.css';
import { getMonth } from '../../utils/getMonth';

export function HistoryBalance() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const [arrChart, setArrChart] = useState<any>([]);
  const chartRef = useRef<any>(null);
  const maxValue = Math.max(...arrChart);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

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
  const labels = getMonth(11);
  const arrayDate = [
    "2022-10",
    "2022-09",
    "2022-08",
    "2022-07",
    "2022-06",
    "2022-05",
    "2022-04",
    "2022-03",
    "2022-02",
    "2022-01",
    "2021-12",
    "2021-11",
  ];

  useEffect(() => {
    let arr: any[] = [];
      arrayDate.map((el) => {
        let dataFilters = location.state.transactions.filter((item: any) => {
          if (item.date.includes(el)) {
            return item;
          }
        });
        let total = dataFilters.reduce((a: any, b: any) => (a += b.amount), 0);
        arr.unshift(Math.round(total));
      });
      setArrChart(arr);
  }, []);

  const goBack = () => {
    navigate(-1);
  };

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
          <p className={styles.descInfoPrice}>{Math.round(location.state.balance)} ₽</p>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.wrapperBalance}>
          <h3 className={styles.wrapperBalanceTitle}>Balance dynamics</h3>
          <div className={styles.wrapperBalanceChart}>
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

        <div className={styles.wrapperTransfer}>
          <h3 className={styles.wrapperTransferTitle}>Ratio of incoming outgoing transactions</h3>
          <div className={styles.wrapperTransferChart}>
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

        <div className={styles.wrapperHistory}>
          <h3 className={styles.wrapperHistoryTitle}>Translation history</h3>
          <div className={styles.wrapperHistoryTab}>
            <div className={styles.wrapperHistoryTabHeader}>
              <div className={styles.wrapperHistoryTabHeaderWrap}>
                <h3 className={styles.wrapperHistoryTabHeaderText}>Sender's account</h3>
                <h3 className={styles.wrapperHistoryTabHeaderText}>Beneficiary's account</h3>
                <h3 className={styles.wrapperHistoryTabHeaderText}>Amount</h3>
                <h3 className={styles.wrapperHistoryTabHeaderText}>Date</h3>
              </div>
            </div>
            <ul className={styles.cardListContainer}>
              {location.state.transactions.length > 0 &&
                location.state.transactions.map((item: any) => (
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
      </div>
    </div>
  );
}
