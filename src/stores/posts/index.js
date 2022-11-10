import { defineStore } from "pinia";
import axios from "axios";
import config from "../../config.js";

export const postStore = defineStore("posts", {
  state: () => {
    return {
      items: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async loadPosts() {
      return new Promise((resolve) => {
        this.isLoading = true;
        this.error = null;

        axios
          .get(config.API_BASE + "/api/posts?populate=*")
          .then((response) => {
            this.items = response.data.data;
            for (let i = 0; i <= this.items.length; i++) {
              let date = new Date();
              var month = date.toLocaleString("en-US", { month: "short" });
              const dates =
                date.getDate() + " " + month + " " + date.getFullYear();

              this.items[i].attributes.publishedAt = dates;
            }
            this.isLoading = false;
            resolve();
          })
          .catch((error) => {
            this.error = error;
            this.isLoading = false;
            resolve();
          });
      });
    },
  },
});

export const postDetailStore = defineStore("post-detail", {
  state: () => {
    return {
      item: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async loadPostDetail(id) {
      console.log("here");
      // No need of API call if the item is already loaded
      if (
        this.item != null &&
        this.item.unique_id == id &&
        this.error == null
      ) {
        this.isLoading = false;
        return;
      }

      return new Promise((resolve) => {
        this.isLoading = true;
        this.item = null;
        this.error = null;

        axios
          .get(config.API_BASE + "/api/posts/" + id + "?populate=*")
          .then((response) => {
            this.item = response.data;
            this.isLoading = false;
            resolve();
          })
          .catch((error) => {
            this.error = error;
            this.isLoading = false;
            resolve();
          });
      });
    },
  },
});
