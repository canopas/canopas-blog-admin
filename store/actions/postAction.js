import { GET_POSTS, GET_SINGLE_POST, POSTS_ERROR } from "../types";
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

export const getPost = (slug) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://blog-admin.canopas.com/v1/posts/${slug}`
    );
    dispatch({
      type: GET_SINGLE_POST,
      payload: res,
    });
  } catch (error) {
    dispatch({
      type: POSTS_ERROR,
      payload: error,
    });
  }
};
