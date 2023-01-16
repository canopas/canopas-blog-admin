/* eslint-disable import/no-anonymous-default-export */
import { GET_POSTS, POSTS_ERROR } from "../types";
import config from "../../config";

const initialState = {
  blogs: [],
  loading: true,
  status: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      if (action.payload.data.data.length > 0) {
        return {
          ...state,
          blogs: action.payload.data,
          loading: false,
          status: config.SUCCESS,
        };
      } else {
        return {
          ...state,
          blogs: null,
          loading: false,
          status: config.NOT_FOUND,
        };
      }
    case POSTS_ERROR:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
