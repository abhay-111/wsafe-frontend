<template>
  <v-app>
    <v-navigation-drawer app>
      <!-- -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ userData.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Email : {{ userData.email }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="(item, index) in items"
          :key="item.title"
          link
          @click="handle(index)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-model="current" :value="item.value">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <!-- -->
      <!-- <v-app-bar-title shrink-on-scroll> W-safe </v-app-bar-title> -->
      <v-app-bar-nav-icon>
        <v-img height="50px" width="50px" src="../assets/W-safe.png"> </v-img>
      </v-app-bar-nav-icon>
      <h2 class="ml-3">W-Safe</h2>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main class="ma-0 pa-0">
      <v-dialog
        :hide-overlay="true"
        v-model="dialog"
        persistent
        max-width="800"
      >
        <v-card>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                How to use ?
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2">
                How you can help others ?
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3">
                How to mark red flags ?
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12" color="grey lighten-1" height="200px">
                  <v-img height="200" src="../assets/stepper1.png"></v-img>
                </v-card>
                <p>
                  W-Safe is a web application that helps you check the
                  neighbourhood that you might be visiting in the near future.
                  It helps to community to make a better decision on places to
                  travel.
                </p>

                <v-btn color="primary" @click="e1 = 2"> Continue </v-btn>

                <v-btn text @click="dialog = !dialog"> Cancel </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color="grey lighten-1" height="200px">
                  <v-img height="200" src="../assets/stepper2.png"></v-img>
                </v-card>
                <p>
                  You can help others by marking the places where you have been
                  recently and experienced something which was not safe. It can
                  be anything like you got robbed , you were heckled etc.
                </p>
                <v-btn color="primary" @click="e1 = 3"> Continue </v-btn>

                <v-btn text @click="dialog = !dialog"> Cancel </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-row justify="center" align="center" class="mb-5">
                  <video
                    height="200px"
                    width="300px"
                    controls
                    autoplay
                    src="../assets/demo1.mp4"
                  ></video>
                </v-row>
                <p>
                  Just double click on the location to place the marker onto the
                  map and fill out an easy form to add information . And thats
                  it .
                </p>
                <div class="mt-5">
                  <v-btn color="primary" @click="e1 = 1"> Continue </v-btn>

                  <v-btn class="ml-2" text @click="dialog = !dialog">
                    Cancel
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-dialog>
      <v-dialog
        :hide-overlay="true"
        v-model="markerDialog"
        transition="dialog-bottom-transition"
        max-width="500"
      >
        <v-form ref="form">
          <v-card class="pa-5">
            <v-card-title>
              <h4>Do you want to put flag here ?</h4>
            </v-card-title>
            <v-card-text>
              <strong>Please add a tag to the marker.</strong>
              <v-select
                v-model="markerTag"
                :items="states"
                menu-props="auto"
                label="Select"
                hide-details
                prepend-icon="mdi-bullhorn"
                class="mb-5"
                single-line
              ></v-select>
              <v-btn color="success accent-3 mt-5" @click="addMarker" small
                >Confirm</v-btn
              >
              <v-btn
                color="success accent-3 mt-5 ml-4"
                @click="cancelDialog(1)"
                small
                >Relocate Marker</v-btn
              >
              <v-btn class="error ml-4 mt-5" @click="cancelDialog(2)" small text
                >Cancel</v-btn
              >
            </v-card-text>
          </v-card>
        </v-form>
      </v-dialog>
      <!-- Provides the application the proper gutter -->
      <!-- If using vue-router -->
      <keep-alive>
        <v-container fluid class="ma-0 pa-0" style="height: 86vh">
          <component ref="map" @mark="markFlag" :is="current"></component>
        </v-container>
      </keep-alive>
    </v-main>

    <v-footer color="red accent-3 text-white" app>
      <!-- -->
      <v-row align="center">
        <v-col cols="6">
          <v-btn small color="error"> Logout</v-btn>
        </v-col>
        <v-col justify="center" align="center" cols="6" class="white--text">
          {{ new Date().getFullYear() }} — <strong>W-Safe</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Cookie from "js-cookie";
import MapComponent from "../components/MapView.vue";
export default {
  components: {
    MapComponent,
  },
  mounted() {
    if (Cookie.get("access-token") == undefined) {
      this.$router.push("/");
      return;
    }
    this.userData.name = Cookie.get("name");
    this.userData.email = Cookie.get("email");
  },
  data() {
    return {
      dialog: true,
      markerDialog: false,
      e1: 1,
      markerTag: "Pickpocket",
      items: [
        {
          title: "Mark a flag",
          icon: "mdi-view-dashboard",
          value: "MapComponent",
        },
        { title: "Your Flags", icon: "mdi-image", value: "Bi" },
        // { title: "About", icon: "mdi-help-box", value: "Super" },
      ],
      right: null,
      current: "MapComponent",
      userData: {
        name: "",
        email: "",
      },
      states: [
        "Pickpocket",
        "Hecklers",
        "No lights",
        "Robbers",
        "Criminals",
        "Others",
      ],
    };
  },
  methods: {
    handle(index) {
      console.log(this.items[index].value);
      this.current = this.items[index].value;
    },
    markFlag() {
      this.markerDialog = true;
    },
    addMarker() {
      console.log(this.markerTag);
      const data = this.$refs.map.position;
      data["tag"] = this.markerTag;
      this.$refs.map.markers.push(data);
      this.$refs.map.position = {};
      this.markerDialog = false;
    },
    cancelDialog(id) {
      this.markerDialog = false;
      if (id === 2) {
        this.$refs.map.position = {};
      }
    },
  },
};
</script>

<style></style>
