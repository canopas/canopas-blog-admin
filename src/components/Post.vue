<template>
  <div class="text-center text-pink-500">Canopas Blogs</div>
</template>

<script lang="ts">
import { postStore } from "../stores/posts";
import { mapState } from "pinia";
import { mapActions } from "pinia";

export default {
  async mounted() {
    await this.loadPosts();
  },
  computed: {
    ...mapState(postStore, {
      posts: "items",
      postsError: "error",
    }),
  },
  methods: {
    ...mapActions(postStore, ["loadPosts"]),
  },
};
</script>
