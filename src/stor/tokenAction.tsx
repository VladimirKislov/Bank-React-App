import { ActionCreator } from "redux";

const ADD_TOKEN = "ADD_TOKEN";

type addToken = {
  type: typeof ADD_TOKEN;
  token: string;
};

export const addTokenAction: ActionCreator<addToken> = (token) => ({
  type: ADD_TOKEN,
  token,
});
