/* eslint-disable import/no-anonymous-default-export */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../config";
import axios from "axios";
import { setPostFields } from "../../utils";

const initialState = {
  posts: [],
  post: null,
  status: 0,
};

export const fetchPosts = createAsyncThunk("fetchPosts", async () => {
  const response = await axios.get(
    config.STRAPI_URL + "/v1/posts?populate=deep&status=published"
  );
  response.data.data.forEach((post) => {
    setPostFields(post);
  });
  return response;
});

export const fetchPostBySlug = createAsyncThunk(
  "fetchPostBySlug",
  async (slug) => {
    const response = await axios.get(
      config.STRAPI_URL + "/v1/posts/" + slug + "?populate=deep"
    );
    setPostFields(response.data.data);
    return response.data.data;
  }
);

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 0;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.posts = action.payload.data.data;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = action.payload ? action.payload.status : 0;
        state.error = action.error.message;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.post = action.payload;
      });
  },
});

export default postSlice.reducer;
