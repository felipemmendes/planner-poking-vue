import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NewRoomView from "../views/NewRoomView.vue";
import EnterRoomView from "../views/EnterRoomView.vue";
import RoomViewVue from "@/views/RoomView.vue";
import RoomNotFoundVue from "@/views/RoomNotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/new",
      name: "new",
      component: NewRoomView,
    },
    {
      path: "/room/:roomId",
      name: "room",
      component: RoomViewVue,
    },
    {
      path: "/room/:roomId/enter",
      name: "enter",
      component: EnterRoomView,
    },
    {
      path: "/room/:roomId/404",
      name: "roomNotFound",
      component: RoomNotFoundVue,
    },
  ],
});

export default router;
