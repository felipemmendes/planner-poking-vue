<script setup lang="ts">
import Line from "@/components/Line.vue";
import router from "@/router";
import SocketioService from "@/services/socketio.service";
import type { Room, User, Votes } from "@/types";
import { calculateAPCards, calculateFibCards, calculateAverage } from "@/utils";
import { computed, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const { roomId } = router.currentRoute.value.params;
const user = ref<Pick<User, "id" | "username"> | null>(null);
const room = ref<Room | null>(null);
const cards = ref<number[] | null>(null);
const cardsSize = ref(8);
const selectedCard = ref<number | null>(null);
const isReady = ref(false);
const votes = ref<Votes | null>(null);
const average = ref<number | null>(null);
const users = ref<User[]>([]);

const orderedUsers = computed(() => {
  return users.value.sort(({ username: uA }, { username: uB }) => {
    const parsedA = uA.toUpperCase();
    const parsedB = uB.toUpperCase();
    if (parsedA < parsedB) {
      return -1;
    }
    if (parsedA > parsedB) {
      return 1;
    }

    return 0;
  });
});

watch([room, cardsSize], ([room, cardsSize]) => {
  if (!room) {
    return;
  }
  if (room.voteType === "fib") {
    cards.value = calculateFibCards(cardsSize);
  }

  if (room.voteType === "ap") {
    cards.value = calculateAPCards({
      startAt: room.startAt,
      commonDifference: room.commonDifference,
      size: cardsSize,
    });
  }
});

watch(votes, (votes) => {
  average.value = calculateAverage(votes);
});

const vote = () => {
  SocketioService.emit("sendVote", { roomId, vote: selectedCard.value });
  isReady.value = true;
};

const showResult = () => {
  SocketioService.emit("getVotes", roomId);
};

const clearVotes = () => {
  SocketioService.emit("resetVotes", roomId);
};

SocketioService.subscribeToEvent("forbiddenRoom", () => {
  router.push(`/room/${roomId}/404`);
});

SocketioService.subscribeToEvent("noUserFound", () => {
  router.push(`/room/${roomId}/enter`);
});

SocketioService.subscribeToEvent("updateUsers", (usersData: User[]) => {
  users.value = usersData;
});

SocketioService.subscribeToEvent(
  "getRoom",
  ({
    room: roomData,
    users: usersData,
    user: userData,
  }: {
    room: Room;
    users: User[];
    user: User;
  }) => {
    users.value = usersData;
    room.value = roomData;
    user.value = userData;
  }
);

SocketioService.subscribeToEvent("showVotes", (votesData) => {
  votes.value = votesData;
});

SocketioService.subscribeToEvent("clearVotes", (usersData: User[]) => {
  votes.value = null;
  selectedCard.value = null;
  console.log(usersData);
  users.value = usersData;
  isReady.value = false;
});

onMounted(() => {
  SocketioService.emit("enterRoom", roomId);
});

onBeforeRouteLeave(() => {
  SocketioService.emit("leaveRoom", roomId);
});
</script>

<template>
  <main>
    <h1 class="text-xl">
      Room: <span class="font-bold">{{ roomId }}</span>
    </h1>
    <Line />
    <div class="flex-1 flex flex-col w-full gap-8">
      <div class="flex flex-col items-center gap-8">
        <ul
          class="flex gap-4 flex-wrap items-center justify-center"
          v-if="!votes"
        >
          <li
            v-for="user in orderedUsers"
            class="p-4 w-32 h-32 border border-[#70C1B3] flex flex-col items-center justify-center"
          >
            <div v-if="!user.isReady" class="flex gap-2 my-auto">
              <span
                class="h-2 w-2 rounded-full bg-[#70C1B3] animate-pulse"
              ></span>
              <span
                class="h-2 w-2 rounded-full bg-[#70C1B3] animate-pulse"
              ></span>
              <span
                class="h-2 w-2 rounded-full bg-[#70C1B3] animate-pulse"
              ></span>
            </div>
            <div v-if="user.isReady" class="flex my-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-8 h-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <div class="mt-auto">{{ user.username }}</div>
          </li>
        </ul>
        <div
          class="flex flex-col items-center justify-center gap-8"
          v-if="votes"
        >
          <div class="text-xl">Average</div>
          <div class="font-bold text-8xl">{{ average ?? "-" }}</div>
        </div>
        <ul
          class="flex gap-4 flex-wrap items-start justify-center"
          v-if="votes"
        >
          <li
            v-for="(voters, number) in votes"
            class="p-4 w-32 min-h-[48px] h-full border border-[#70C1B3] flex flex-col items-center justify-around gap-8"
          >
            <div class="text-5xl font-bold">{{ number }}</div>
            <ul class="flex flex-col items-center justify-center gap-4">
              <li v-for="voter in voters">
                {{ voter.username }}
              </li>
            </ul>
          </li>
        </ul>

        <div class="flex flex-col items-center flex-1"></div>
        <button
          v-if="!votes"
          @click="showResult"
          class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 w-56 bg-[#70C1B3] text-[#50514F] hover:text-[#70C1B3] hover:bg-[#50514F] transition-colors"
        >
          See results
        </button>

        <button
          v-else
          @click="clearVotes"
          class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 w-56 bg-[#70C1B3] text-[#50514F] hover:text-[#70C1B3] hover:bg-[#50514F] transition-colors"
        >
          Start over
        </button>
      </div>
      <Line v-if="!votes" />
      <div class="flex flex-col items-center gap-8" v-if="!votes">
        <div class="flex items-center justify-between w-full">
          <div class="flex gap-4">
            <button
              @click="cardsSize++"
              class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 hover:bg-[#70C1B3] hover:text-[#50514F] transition-colors"
            >
              Add card
            </button>
            <button
              :disabled="cardsSize <= 1"
              @click="if (cardsSize > 1) cardsSize--;"
              class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 hover:bg-[#70C1B3] hover:text-[#50514F] transition-colors disabled:pointer-events-none disabled:opacity-60"
            >
              Remove card
            </button>
          </div>
          <button
            @click="vote"
            :disabled="selectedCard === null"
            class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 w-56 bg-[#70C1B3] text-[#50514F] hover:text-[#70C1B3] hover:bg-[#50514F] transition-colors disabled:pointer-events-none disabled:opacity-30"
          >
            {{ isReady ? "Change choice" : "Confirm choice" }}
          </button>
        </div>
        <div>Select a card and vote!</div>
        <ul class="flex gap-4 items-center justify-center w-full flex-wrap">
          <li
            v-for="card in cards"
            class="p-4 w-24 h-24 text-2xl border border-[#70C1B3] flex items-center justify-center cursor-pointer hover:bg-[#70C1B3] hover:text-[#50514F] transition-colors"
            :class="
              selectedCard === card
                ? 'text-[#50514F] bg-[#70C1B3]'
                : 'border-dashed'
            "
            @click="selectedCard = card"
          >
            {{ card }}
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
