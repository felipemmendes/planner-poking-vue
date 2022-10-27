<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import SocketioService from "./services/socketio.service";

onMounted(() => SocketioService.setupSocketConnection());

onUnmounted(() => SocketioService.disconnect());
</script>

<template>
  <Header />
  <RouterView
    class="mx-auto flex flex-col justify-center items-center gap-12 max-w-3xl md:max-w-7xl w-full flex-1 px-12 py-8"
  />
  <footer class="flex items-center justify-center h-12">fmmendes.com</footer>
</template>
