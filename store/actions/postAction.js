import { GET_POSTS, POSTS_ERROR } from "../types";
import axios from "axios";

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(`https://blog-admin.canopas.com/v1/posts`);
    dispatch({
      type: GET_POSTS,
      payload: res,
    });
  } catch (error) {
    dispatch({
      type: POSTS_ERROR,
      payload: error,
    });
  }
};
