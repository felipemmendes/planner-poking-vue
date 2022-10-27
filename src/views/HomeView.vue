<script setup lang="ts">
import Line from "@/components/Line.vue";
import { ref } from "vue";

const roomId = ref("");
</script>

<template>
  <main>
    <section class="flex flex-col gap-4 items-center w-full max-w-lg">
      <label for="roomId">Enter a room ID</label>
      <input
        v-model="roomId"
        id="roomId"
        class="bg-transparent border-b border-l border-[#70C1B3] h-12 p-4 outline-none ring-0 w-full"
        placeholder="room ID..."
      />
      <RouterLink
        :to="`/room/${roomId}/enter`"
        :disabled="!roomId"
        class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 w-56 bg-[#70C1B3] text-[#50514F] hover:text-[#70C1B3] hover:bg-[#50514F] transition-colors"
        >GO!</RouterLink
      >
    </section>
    <div class="flex gap-4 w-full justify-center items-center">
      <Line />
      OR
      <Line />
    </div>
    <section class="w-full flex items-center justify-center">
      <RouterLink
        to="/new"
        class="flex items-center justify-center h-12 border border-[#70C1B3] p-4 w-56 hover:bg-[#70C1B3] hover:text-[#50514F] transition-colors"
      >
        Create a new room
      </RouterLink>
    </section>
  </main>
</template>
