/* eslint-disable import/no-anonymous-default-export */
import { GET_POSTS, GET_SINGLE_POST, POSTS_ERROR } from "../types";
import config from "../../config";

const initialState = {
  blogs: [],
  currentPost: null,
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
    case GET_SINGLE_POST:
      return {
        ...state,
        currentPost: action.payload,
        loading: false,
        status: config.SUCCESS,
      };
    case POSTS_ERROR:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
