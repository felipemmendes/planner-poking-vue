<script setup lang="ts">
import Line from "@/components/Line.vue";
import router from "@/router";
import SocketioService from "@/services/socketio.service";
import type { User } from "@/types";
import { generateSlug } from "random-word-slugs";
import { ref } from "vue";

const { roomId } = router.currentRoute.value.params;
const username = ref("");

const enter = () => {
  const user: User = {
    id: generateSlug(),
    username: username.value,
    isReady: false,
  };

  SocketioService.emit("createUser", { roomId, user });

  router.push(`/room/${roomId}`);
};
</script>

<template>
  <main>
    <h1 class="text-xl">
      Entering room: <span class="font-bold">{{ roomId }}</span>
    </h1>
    <Line />
    <form class="w-full flex-1 flex flex-col items-center gap-8">
      <div class="flex gap-4 items-center justify-center">
        <label htmlFor="username">Username:</label>
        <input
          name="username"
          id="username"
          required
          autocomplete="off"
          v-model="username"
          class="bg-transparent border-b border-l border-[#70C1B3] h-12 p-4 outline-none ring-0"
          placeholder="username..."
        />
      </div>
      <button
        :disabled="!username"
        class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 w-56 hover:bg-[#70C1B3] hover:text-[#50514F] transition-colors disabled:opacity-30 disabled:pointer-events-none"
        @click.prevent="enter"
      >
        Entrar
      </button>
    </form>
  </main>
</template>
