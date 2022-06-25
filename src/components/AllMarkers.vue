<template>
  <div class="conatiner-fluid pa-5">
    <h1>Your Markers</h1>
    <v-list subheader two-line>
      <v-list-item v-for="(marker, index) in markers" :key="index">
        <v-list-item-avatar>
          <v-icon class="grey lighten-1" dark> mdi-map-marker </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="marker.tag"></v-list-item-title>

          <v-list-item-subtitle v-text="marker.lat"></v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon>
            <v-icon color="grey lighten-1">mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset></v-divider>
    </v-list>
  </div>
</template>

<script>
export default {
  props: {
    markers: {
      type: Array,
    },
  },
};
</script>

<style></style>
