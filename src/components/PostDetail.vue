<template>
  <div>
    <h1 class="text-pink-400 flex justify-center text-7xl mb-10">
      POST DETAIL
    </h1>
  </div>
  <div class="mb-4 ml-auto mr-auto">
    <div
      class="container mx-auto px-80 mb-8 space-y-6 py-3"
      v-for="detail in detail"
      :key="detail"
    >
      <h1 class="text-4xl"></h1>
      <div class="flex items-center gap-4 mb-10">
        <img class="w-7 h-7 rounded-full" src="/assets/flutter2.png" />
        <p class="text-xl">{{ detail.name }}</p>
      </div>
      <figure class="relative overflow-hidden shadow-md mb-10">
        <img
          :src="detail.image"
          alt="alt-image"
          class="object-top h-full w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg"
        />
      </figure>
      <div v-html="detail.Description"></div>
    </div>
  </div>
</template>

<script type="module">
import web from "../assets/web.jpeg";

export default {
  data() {
    return {
      detail: [
        {
          id: 1,
          image: web,
          name: "Priyanka Gour",
          date: "08-2-2022",
          title: "Qualities of an Effectively Creative People",
          Description: `I'm going to share with you some of the most important ideas that have ever been discovered in the area to be a Highly Creative person.
Creativity enables individuals to generate new or innovative ideas.<br/><br/>
Having the Trait of a creative thinker often enables individuals to generate novel solutions to any problem. Creative peoples have various qualities.
<ul>
<li>Dedication</li>
<li>Persistence & Patience</li>
<li>Creative Mindset</li>
<li>Opposable mind </li>
<li>Take Hobbies Seriously </li>
<li>Self-confidence</li>
<li>Self-talk</li>
<li class="text-pink-700 ">Curious:</li> They generally opt to live the examined life, and even as they get older, maintain a sense of curiosity about life. Creatives look at the world around them and want to know why, and how, it is the way it is.
<li class="text-pink-700 ">Observant:</li> Observant by nature and curious about the lives of others, creative types often love to people-watch-and they may generate some of their best ideas from it.
Experiment & explore: "I make more mistakes than anyone else I know, and sooner or later, I patent most of them." - Thomas Edison
</ul>
Here are 8 traits that I have described below about creative people.<br/><br/>
<span class="text-pink-700 ">1. Persistence & Patience:</span>
It is the quality of stubbornness or continuing something in spite of opposition.
Many times in our life we face the situation, but we give up easily when we don't get any results. We don't have patience. 
Here is a saying; "Good things come to those who wait." Patience allows you to persevere and make more productive decisions, often leading to greater success.
Life is that one coin that flips over and over again irrespective of what you do, what you say, what you try. The only thing that is in control is you.
"Persistence, patience, and hard work, bet at it, keep on doing it, and don't give up even if it's tough, and nothing in life is easier, it's all about the choices you make. 
You can lie to the world but not to yourself. Every single day when you put your head over the pillow, as if you are alone in your head, just trust your dignity, hard work, and honesty.
When you are conscious it's clear that you are successful. when you sleep you should be at peace.
There is a stanza from Robert frost's poem"
The woods are lovely, dark and deep,
But I have promises to keep,
And miles to go before I sleep,
And miles to go before I sleep.
its means, don't lose the grip on the dream of your life you have to fight to keep them alive.`,
          category: "Flutter",
        },
      ],
    };
  },
};
</script>
