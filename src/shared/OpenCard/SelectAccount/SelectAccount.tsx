import React, { useEffect, useState } from 'react';
import Multiselect from "multiselect-react-dropdown";
import { useDispatch, useSelector } from 'react-redux';
import styles from './selectaccount.css';
import { RootState } from '../../../stor/stor';
import { addSelectAccountAction } from '../../../stor/selectAccount';

export function SelectAccount(id: any) {
  const account = useSelector<RootState, Array<any>>((state) => state.account);
  const [number, setNumber] = useState<any>([]);
  const [select, setSelect] = useState();
  const dispatch = useDispatch();



  useEffect(() => {
    setNumber(
      account.filter((item) => {
        if (item !== id.id) return item;
      })
    );
  }, [account])

  useEffect(() => {
    if (select === undefined) return
    dispatch(addSelectAccountAction(select));
  }, [select]);

  return (
    <Multiselect
      className="selector"
      isObject={false}
      options={number}
      singleSelect
      onSelect={(event) => {
        setSelect(event[0]);
      }}
    />
  );
}
