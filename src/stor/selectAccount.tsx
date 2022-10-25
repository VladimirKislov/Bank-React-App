import { ActionCreator } from "redux";

const ADD_SELECT_ACCOUNT = "ADD_SELECT_ACCOUNT";

export type addSelectAccount = {
  type: typeof ADD_SELECT_ACCOUNT,
  selectAccount: number,
};

export const addSelectAccountAction: ActionCreator<addSelectAccount> = (selectAccount) => ({
  type: ADD_SELECT_ACCOUNT,
  selectAccount,
});