<template>
  <l-map
    ref="map"
    @dblclick="onMapClick"
    :zoom="zoom"
    :center="[
      position.lat || userLocation.lat || defaultLocation.lat,
      position.lng || userLocation.lng || defaultLocation.lng,
    ]"
  >
    <l-tile-layer
      :url="tileProvider.url"
      :attribution="tileProvider.attribution"
    />
    <l-geosearch :options="geoSearchOptions"></l-geosearch>
    <l-control position="bottomleft">
      <v-btn @click="enterViewMode" small>
        {{ getControlButtonText }}
      </v-btn>
    </l-control>
    <l-circle
      v-if="getUserCircle.center[0]"
      :lat-lng="getUserCircle.center"
      :radius="getUserCircle.radius"
      :color="getUserCircle.color"
    />
    <l-marker
      v-if="position.lat && position.lng && isPlacing"
      visible
      draggable
      :icon="icon"
      :lat-lng.sync="position"
      @dragstart="dragging = true"
      @dragend="sendConfirmation"
    >
      <l-tooltip class="" :options="{ permanent: true }">
        <div v-html="tooltipContent"></div>
      </l-tooltip>
    </l-marker>
    <l-marker
      v-for="(mark, index) in markers"
      :key="index"
      :icon="getIcon(mark.tag)"
      :lat-lng="[mark.lat, mark.lng]"
    >
      <l-popup>
        <div>
          <strong> {{ mark.tag }}</strong>
          <br />
          <span>{{ mark.description }}</span>
        </div>
      </l-popup>
    </l-marker>
    <l-marker
      v-for="mark in friends"
      :key="mark.friendName"
      :icon="friendIcon"
      :lat-lng="[mark.friendLocation.latitude, mark.friendLocation.longitude]"
    >
      <l-popup>
        <div>
          <strong> {{ mark.friendName }} was here </strong>
          <br />
          <span>{{ mark.friendName }} was last active here</span>
        </div>
      </l-popup>
    </l-marker>
    <l-marker
      :icon="icon"
      :lat-lng="[
        this.userLocation.lat || defaultLocation.lat,
        this.userLocation.lng || defaultLocation.lng,
      ]"
    >
      <l-popup>You are here!</l-popup>
      <!-- <l-tooltip :content="getCurrentPosition" :options="{ permanent: true }" /> -->
    </l-marker>
  </l-map>
</template>
<script>
import {
  LMap,
  LMarker,
  LTileLayer,
  LTooltip,
  LPopup,
  LControl,
  LCircle,
} from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import LGeosearch from "vue2-leaflet-geosearch";
import { icon } from "leaflet";
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LGeosearch,
    LPopup,
    LControl,
    LCircle,
  },
  props: {
    value: {
      type: Object,
      required: false,
    },
    defaultLocation: {
      type: Object,
      default: () => ({
        lat: 28.566547327321654,
        lng: 77.38246147950397,
      }),
    },
    markers: {
      type: Array,
      required: true,
    },
    friends: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      geoSearchOptions: {
        provider: new OpenStreetMapProvider(),
        showMarker: false,
        autoClose: true,
      },
      userLocation: {},
      icon: icon({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      }),
      friendIcon: icon({
        iconRetinaUrl: require("../assets/friend.png"),
        iconUrl: require("../assets/friend.png"),
        shadowUrl: require("../assets/friend.png"),
      }),
      position: {},
      address: "",
      tileProvider: {
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      },
      circle: {
        center: [],
        radius: 450,
        color: "red",
      },
      currentPosition: [],
      zoom: 16,
      dragging: false,
      viewMode: false,
      isPlacing: false,
    };
  },
  created() {
    this.getUserPosition();
  },
  mounted() {
    this.$refs.map.mapObject.on("geosearch/showlocation", this.onSearch);
  },
  watch: {
    position: {
      deep: true,
      async handler(value) {
        this.address = await this.getAddress();
        this.$emit("input", { position: value, address: this.address });
      },
    },
  },
  computed: {
    getControlButtonText() {
      return this.viewMode ? "Exit View Mode" : "Enter View Mode";
    },
    tooltipContent() {
      if (this.dragging) return "...";
      if (this.loading) return "Loading...";
      return `<strong>${this.address.replace(
        ",",
        "<br/>"
      )}</strong> <hr/><strong>lat:</strong> ${
        this.position.lat
      }<br/> <strong>lng:</strong> ${this.position.lng}  `;
    },
    getCurrentPosition() {
      return `<strong>You are here</strong>`;
    },
    getUserCircle() {
      const { lat, lng } = this.userLocation;
      const circle = {
        center: [lat, lng],
        radius: 450,
        color: "red",
      };
      console.log(circle);
      return circle;
    },
  },
  methods: {
    enterViewMode() {
      this.viewMode = !this.viewMode;
      console.log(this.viewMode);
    },
    async getAddress() {
      this.loading = true;
      let address = "Unresolved address";
      try {
        const { lat, lng } = this.position;
        const result = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        if (result.status === 200) {
          const body = await result.json();
          address = body.display_name;
        }
      } catch (e) {
        console.error("Reverse Geocode Error->", e);
      }
      this.loading = false;
      return address;
    },
    async onMapClick(value) {
      // place the marker on the clicked spot
      if (this.viewMode) {
        return;
      }
      this.isPlacing = true;
      this.position = value.latlng;
      this.$emit("mark");
    },
    onSearch(value) {
      const loc = value.location;
      this.position = { lat: loc.y, lng: loc.x };
    },
    async getUserPosition() {
      if (navigator.geolocation) {
        // get GPS position
        navigator.geolocation.getCurrentPosition((pos) => {
          // set the user location
          const data = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          this.userLocation = data;
          this.currentPosition.push(pos.coords.latitude);
          this.currentPosition.push(pos.coords.longitude);
          this.circle.center.push(pos.coords.latitude);
          this.circle.center.push(pos.coords.longitude);
          console.log(data);
          this.$store.dispatch("setCurrentLocation", data).then(() => {
            console.log("location set");
          });
        });
      }
    },
    sendConfirmation() {
      this.dragging = false;
      this.$emit("mark");
    },
    getMarkerTag(tag) {
      return `<strong>${tag}</strong>`;
    },
    getIcon(tag) {
      switch (tag) {
        case "Pickpocket":
          return icon({
            iconRetinaUrl: require(`../assets/pickpocket.png`),
            iconUrl: require(`../assets/pickpocket.png`),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
        case "Eve Teasers":
          return icon({
            iconRetinaUrl: require(`../assets/heckler.png`),
            iconUrl: require(`../assets/heckler.png`),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
        case "No lights":
          return icon({
            iconRetinaUrl: require(`../assets/nolight.png`),
            iconUrl: require(`../assets/nolight.png`),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
        case "Robbers":
          return icon({
            iconRetinaUrl: require(`../assets/robber.png`),
            iconUrl: require(`../assets/robber.png`),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
        case "Criminals":
          return icon({
            iconRetinaUrl: require(`../assets/criminal.png`),
            iconUrl: require(`../assets/criminal.png`),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
        case "Others":
          return icon({
            iconRetinaUrl: require(`../assets/redFlag.png`),
            iconUrl: require(`../assets/redFlag.png`),
            shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
          });
      }
    },
  },
};
</script>
<style>
.leaflet-container {
  z-index: 1;
}
</style>
