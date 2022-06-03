<template>
  <v-app>
    <v-main class="red accent-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import "./assets/css/global.css";
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
<style></style>
