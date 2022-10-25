import { ActionCreator } from "redux";

const ADD_WEBSOCKET = "ADD_WEBSOCKET";

type addSocket = {
  type: typeof ADD_WEBSOCKET;
  socket: Array<any>;
};

export const addSocketAction: ActionCreator<addSocket> = (socket) => ({
  type: ADD_WEBSOCKET,
  socket,
});
