import { ActionCreator } from "redux";

const ADD_ACCOUNT_NUMBER = "ADD_ACCOUNT_NUMBER";

type addAccountNumber = {
  type: typeof ADD_ACCOUNT_NUMBER;
  account: Array<any>;
};

export const addAccountNumberAction: ActionCreator<addAccountNumber> = (account) => ({
  type: ADD_ACCOUNT_NUMBER,
  account,
});