<template>
  <div class="conatiner-fluid pa-5">
    <h1>Your Markers</h1>
    <div
      v-if="myMarkers.length == 0"
      class="conatiner-fluid d-flex flex-column justify-center align-center"
    >
      <v-img
        :src="notfound"
        alt="not found image"
        height="350px"
        width="350px"
      />
      <h1 class="mt-3">No Markers added.</h1>
    </div>
    <v-list v-else subheader two-line>
      <v-list-item v-for="(marker, index) in myMarkers" :key="index">
        <v-list-item-avatar>
          <v-icon class="grey lighten-1" dark> mdi-map-marker </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="marker.tag"></v-list-item-title>

          <v-list-item-subtitle
            v-text="'Created at : ' + marker.createdAt.substring(0, 10)"
          >
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn @click="deleteMarker(marker._id)" icon>
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
  computed: {
    myMarkers() {
      const markers = this.markers.filter((marker) => {
        return marker.email != "abhaychauhan232@gmail.com";
      });
      return markers;
    },
  },
  props: {
    markers: {
      type: Array,
    },
  },
  data() {
    return {
      notfound: require("../assets/notfound.svg"),
    };
  },
  methods: {
    deleteMarker(id) {
      // console.log(id);
      this.$emit("delete-marker", id);
    },
  },
};
</script>

<style></style>
