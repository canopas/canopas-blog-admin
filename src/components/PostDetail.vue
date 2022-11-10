<template>
  <div>
    <h1 class="text-pink-400 flex justify-center text-7xl mb-10">
      POST DETAIL
    </h1>
  </div>
  <div class="mb-4 ml-auto mr-auto">
    <div
      class="container mb-8 space-y-6 py-3"
      v-for="post in posts"
      :key="post"
    >
      <h1 class="text-4xl"></h1>
      <div class="flex items-center gap-4 mb-10">
        <img class="w-7 h-7 rounded-full" src="" />
        <p class="text-xl">
          {{ post.title }}
        </p>
      </div>
      <figure class="relative overflow-hidden mb-10">
        <div v-for="image in post.attributes.images.data" :key="image">
          <img
            :src="'https://blog-admin.canopas.com' + image.attributes.url"
            class="w-full h-full object-cover font-bold rounded-t-lg"
            :alt="image.attributes.title"
          />
        </div>
      </figure>
      <div v-html="post.content"></div>
      <div>{{ post.publishedAt }}</div>
      <reading-time :text="post.content"></reading-time>
    </div>
  </div>
</template>

<script lang="ts">
import { postDetailStore } from "../stores/posts";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import ReadingTime from "./ReadingTime.vue";

export default {
  props: ["postId"],
  data() {
    return {
      id: this.postId,
    };
  },
  components: {
    ReadingTime,
  },
  async mounted() {
    await this.setPostDetails();
  },
  computed: {
    ...mapState(postDetailStore, {
      posts: "item",
      postsError: "error",
      isLoading: "isLoading",
    }),
  },
  methods: {
    ...mapActions(postDetailStore, ["loadPost"]),
    async setPostDetails() {
      await this.loadPost(this.id);

      if (this.postsError != null) {
        this.showErrorMessagePopup = true;
      }
    },
  },
};
</script>
