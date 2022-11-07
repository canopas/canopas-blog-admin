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
