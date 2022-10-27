<script setup lang="ts">
import { ref, watch } from "vue";
import { generateSlug } from "random-word-slugs";
import SocketioService from "@/services/socketio.service";
import router from "@/router";
import type { Room } from "@/types";
import Line from "@/components/Line.vue";
import { calculateAPCards, calculateFibCards } from "@/utils";

const voteType = ref<"fib" | "ap">("fib");
const startAt = ref(0.25);
const commonDifference = ref(0.25);
const cards = ref<number[]>(calculateFibCards(6));

watch(
  [voteType, startAt, commonDifference],
  ([voteType, startAt, commonDifference]) => {
    console.log("mudou");
    if (voteType === "ap") {
      cards.value = calculateAPCards({
        startAt: startAt,
        commonDifference: commonDifference,
        size: 6,
      });
    }

    if (voteType === "fib") {
      cards.value = calculateFibCards(6);
    }
  }
);

const createRoom = () => {
  const room: Room = {
    id: generateSlug(4, {
      format: "kebab",
      partsOfSpeech: ["adjective", "adjective", "adjective", "noun"],
      categories: {
        noun: ["technology"],
        adjective: ["color", "condition", "quantity"],
      },
    }),
    ...(voteType.value === "ap"
      ? {
          voteType: voteType.value,
          startAt: startAt.value,
          commonDifference: commonDifference.value,
        }
      : {
          voteType: voteType.value,
        }),
  };

  SocketioService.emit("createRoom", room);

  router.push(`/room/${room.id}/enter`);
};
</script>

<template>
  <main>
    <h1 class="text-xl">Creating a new room</h1>
    <Line />
    <div class="flex flex-col items-center justify-center gap-8">
      <button
        @click.prevent="createRoom"
        class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 w-56 bg-[#70C1B3] text-[#50514F] hover:text-[#70C1B3] hover:bg-[#50514F] transition-colors"
      >
        Create Room
      </button>
      <div class="flex items-center gap-4">
        Cards example:
        <div
          v-for="card in cards"
          class="p-2 border border-dashed border-[#70C1B3]"
        >
          {{ card }}
        </div>
      </div>
    </div>
    <Line />
    Room Options:
    <form class="w-full flex-1 flex flex-col gap-12 items-center">
      <fieldset class="flex gap-4 items-center justify-center">
        <legend class="float-left">Vote type:</legend>
        <input
          type="radio"
          id="fib"
          name="vote-type"
          value="fib"
          v-model="voteType"
          class="appearance-none peer/fib"
        />
        <label
          htmlFor="fib"
          class="border border-[#70C1B3] p-2 peer-checked/fib:bg-[#70C1B3] peer-checked/fib:text-[#50514F] cursor-pointer flex justify-center items-center"
          >Fibonacci sequence</label
        >

        <input
          type="radio"
          id="ap"
          name="vote-type"
          value="ap"
          v-model="voteType"
          class="appearance-none peer/ap"
        />
        <label
          htmlFor="ap"
          class="border border-[#70C1B3] p-2 peer-checked/ap:bg-[#70C1B3] peer-checked/ap:text-[#50514F] cursor-pointer flex justify-center items-center"
          >Arithmetic progression</label
        >
      </fieldset>
      <div v-if="voteType === 'ap'" class="flex gap-8">
        <div class="flex gap-4 items-center">
          <label htmlFor="start-at" class="whitespace-nowrap"
            >Starting at:</label
          >
          <input
            type="number"
            name="start-at"
            id="start-at"
            required
            v-model="startAt"
            min="0"
            class="ml-auto w-24 bg-transparent border-b border-l border-[#70C1B3] h-12 p-4 outline-none ring-0"
          />
        </div>
        <div class="flex gap-4 items-center">
          <label htmlFor="sum">Sum:</label>
          <input
            type="number"
            name="sum"
            id="sum"
            required
            min="0"
            v-model="commonDifference"
            class="ml-auto w-24 bg-transparent border-b border-l border-[#70C1B3] h-12 p-4 outline-none ring-0"
          />
        </div>
      </div>
    </form>
  </main>
</template>
