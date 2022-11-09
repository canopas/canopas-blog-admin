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
