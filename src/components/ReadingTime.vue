<template>
  <span class="reading-time">{{ time }} minutes</span>
</template>
<script lang="ts">
const WORDS_PER_MINUTE = 250; // Average person wpm
export default {
  props: ["text"],
  computed: {
    time() {
      console.log(this.text);
      const words = this.text.trim().split(/\s+/).length;
      return Math.ceil(words / WORDS_PER_MINUTE);
    },
  },
};
</script>
