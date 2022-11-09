<template>
  <div class="container">
    <h1 class="text-pink-400 flex justify-center text-7xl mt-10 mb-20">
      CANOPAS BLOG
    </h1>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 xl:grid-cols-3">
      <a
        class="flex flex-col basis-[30%] justify-center hover:animate-jump-card -translate-y-6 m-2.5 flex-[1_1_0%] active:scale-[0.98] z-0 shadow-[0_4px_4px_rgba(0,0,0,0.5)] rounded-b-lg"
        v-for="blog in posts"
        :key="blog"
        :href="'/post/' + blog.attributes.slug"
      >
        <div class="rounded-t-lg overflow-hidden relative pt-[52%]">
          <div class="absolute inset-0">
            <div class="relative">
              <div v-for="image in blog.attributes.images.data" :key="image">
                <img
                  :src="'https://blog-admin.canopas.com' + image.attributes.url"
                  class="w-full h-full object-cover font-bold rounded-t-lg"
                  :alt="image.attributes.title"
                />
              </div>
              <div
                v-for="category in blog.attributes.categories.data"
                :key="category"
                class="px-5 py-2 bg-pink-600 rounded-lg absolute top-[15px] right-[20px] cursor-pointer z-10 text-white hover:text-white active:scale-[0.98]"
              >
                {{ category.attributes.name }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col justify-between flex-[1_0_0%] px-2.5 py-5 sm:p-5 rounded-b-lg"
        >
          <div class="text-black text-xl">
            {{ blog.attributes.title }}
          </div>
          <div>
            <div class="text-gray-800 mt-5 text-sm line-clamp-3">
              {{ blog.attributes.content }}
            </div>
            <div class="w-full overflow-hidden mt-6">
              <div class="float-left text-gray-800">
                {{ blog.attributes.publishedAt }}
              </div>
              <div class="float-right text-gray-800">
                <div
                  v-for="author in blog.attributes.authors.data"
                  :key="author"
                >
                  {{ author.attributes.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
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
