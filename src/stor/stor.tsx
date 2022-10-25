import { AnyAction, Reducer } from "redux";

const ADD_TOKEN = "ADD_TOKEN";
const ADD_ACCOUNT_NUMBER = "ADD_ACCOUNT_NUMBER";
const ADD_SELECT_ACCOUNT = "ADD_SELECT_ACCOUNT";
const ADD_WEBSOCKET = "ADD_WEBSOCKET";

export type RootState = {
  token: string;
  account: Array<any>;
  selectAccount: number;
  socket: Array<any>;
};
const initialState: RootState = {
  token: "",
  account: [],
  selectAccount: 0,
  socket: [],
};

export const RootReducer: Reducer<RootState, AnyAction> = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case ADD_ACCOUNT_NUMBER:
      return {
        ...state,
        account: action.account,
      };
    case ADD_SELECT_ACCOUNT:
      return {
        ...state,
        selectAccount: action.selectAccount,
      };
    case ADD_WEBSOCKET:
      return {
        ...state,
        socket: [...state.socket, action.socket],
      };
    default:
      return state;
  }
};
