<template>
  <v-app>
    <v-navigation-drawer temporary v-model="drawer" app>
      <!-- -->
      <div class="container d-flex justify-center align-center">
        <v-avatar color="error" size="48">
          <span class="white--text text-h5">{{
            userData.name.substring(0, 2).toUpperCase()
          }}</span>
        </v-avatar>
      </div>

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
          :key="index"
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
      <v-list>
        <v-list-item @click="logout" class="logout-button" link>
          <v-list-item-icon>
            <v-icon>mdi-export</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <!-- -->
      <!-- <v-app-bar-title shrink-on-scroll> W-safe </v-app-bar-title> -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-nav-icon @click="gotoHome()">
        <v-img height="50px" width="50px" src="../assets/W-safe.png"> </v-img>
      </v-app-bar-nav-icon>
      <h2 class="ml-3">W-Safe</h2>
      <v-spacer></v-spacer>

      <v-badge
        color="blue"
        v-if="friendRequests.length > 0"
        :content="friendRequests.length"
        :value="friendRequests.length"
        overlap
      >
        <v-btn @click="setFriendRequestModal" text color="error">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-badge>
    </v-app-bar>
    <v-main>
      <v-dialog
        :hide-overlay="true"
        v-model="friendRequestModal"
        transition="dialog-bottom-transition"
        max-width="500"
      >
        <v-card class="pa-5">
          <v-card-title>
            <h4>Pending Friend Requests</h4>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="request in getfriendRequests"
                :key="request.senderId"
              >
                <v-list-item-avatar>
                  <v-icon class="grey lighten-1" dark> mdi-account </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    v-text="request.senderName"
                  ></v-list-item-title>

                  <v-list-item-subtitle> Abhay </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <span
                    ><v-btn
                      class="ml-5"
                      @click="rejectRequest(request.senderId)"
                      icon
                    >
                      <v-icon color="error lighten-1">mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                      class="ml-5"
                      @click="acceptRequest(request.senderId)"
                      icon
                    >
                      <v-icon color="green lighten-1">mdi-check</v-icon>
                    </v-btn>
                  </span>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
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
                <v-card class="mb-12" color="grey lighten-1" height="250px">
                  <v-img height="250" src="../assets/stepper1.png"></v-img>
                </v-card>
                <p>
                  W-Safe is a web application that helps you navigate your
                  neighbourhood that you might be visiting in the near future.
                  It helps the community to make a better decision about the
                  places one might travel.
                </p>

                <v-btn color="primary" @click="e1 = 2"> Next </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color="grey lighten-1" height="250px">
                  <v-img height="250" src="../assets/stepper2.png"></v-img>
                </v-card>
                <p>
                  You can help others by marking the places where you have been
                  to recently and experienced something which was not safe. You
                  can select from different types of markers to provide a
                  detailed description about that place.
                </p>
                <v-btn color="primary" @click="e1 = 1"> Go Back </v-btn>
                <v-btn color="primary" class="ml-3" @click="e1 = 3">
                  Next
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-row justify="center" align="center" class="mb-5">
                  <v-card class="mb-12" color="grey lighten-1" height="250px">
                    <v-img height="250" src="../assets/stepper3.png"></v-img>
                  </v-card>
                </v-row>
                <p>
                  Just double click on the location to place the marker on the
                  map and fill out an easy form to add information .
                  <strong> And thats it!! . </strong>
                </p>
                <div class="mt-5">
                  <v-btn color="primary" @click="e1 = 2"> Go Back </v-btn>

                  <v-btn class="ml-5" text @click="closeHelper"> Cancel </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-dialog>
      <v-dialog
        persistent
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
                v-model="marker.markerTag"
                :items="states"
                menu-props="auto"
                label="Select"
                hide-details
                prepend-icon="mdi-bullhorn"
                class="mb-5"
                single-line
              ></v-select>
              <v-text-field
                v-model="marker.markerDescription"
                counter
                prepend-icon="mdi-bullhorn"
                maxlength="50"
                hint="Describe under 3 lines."
                label="Description"
              ></v-text-field>
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
      <keep-alive>
        <v-container
          fluid
          class="ma-0 pa-0 grey lighten-5"
          style="height: 100%"
        >
          <component
            ref="map"
            @mark="markFlag"
            @delete-marker="deleteMarker"
            :markers="markers"
            :friends="friends"
            :is="current"
          ></component>
        </v-container>
      </keep-alive>
    </v-main>
    <v-footer color="red accent-3 text-white" app>
      <!-- -->
      <v-row align="center" justify="center">
        <v-col cols="12" class="white--text d-flex justify-center align-center">
          <span>
            <strong>W-Safe</strong> - {{ new Date().getFullYear() }}
          </span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Cookie from "js-cookie";
import MapComponent from "../components/MapView.vue";
import getAllMarkers from "../components/AllMarkers.vue";
import yourFriends from "../components/YourFriends.vue";
import Pusher from "pusher-js";
export default {
  name: "Dashboard",
  components: {
    MapComponent,
    getAllMarkers,
    yourFriends,
  },
  mounted() {
    if (Cookie.get("access-token") == undefined) {
      this.$router.push("/");
      return;
    }
    Pusher.logToConsole = true;

    var pusher = new Pusher("bdef54def6986d3e5f5a", {
      cluster: "ap2",
    });

    var channel = pusher.subscribe("my-channel");
    const context = this;
    channel.bind("my-event", function (data) {
      console.log(data, Cookie.get("userId"));
      if (data.data.recieverId == Cookie.get("userId")) {
        context.friendRequests.push(data.data);
      }
    });

    this.userData.name = Cookie.get("name");
    this.userData.email = Cookie.get("email");
    this.$store
      .dispatch("getAllMarkers")
      .then((res) => {
        this.markers = res.data.markers;
      })
      .then(() => {
        this.$store.dispatch("getAllFreindRequests").then((data) => {
          this.friendRequests = data.data.data || [];
        });
      })
      .then(() => {
        this.$store.dispatch("getAllFriends").then((data) => {
          console.log(data);
          this.friends = data.data.friends;
          console.log("friends", this.friends);
        });
      });
  },
  data() {
    return {
      dialog: false,
      markerDialog: false,
      e1: 1,
      marker: {
        markerTag: "Pickpocket",
        markerDescription: "",
      },
      items: [
        {
          title: "Mark a flag",
          icon: "mdi-view-dashboard",
          value: "MapComponent",
        },
        { title: "Your Flags", icon: "mdi-image", value: "getAllMarkers" },
        { title: "Your Friends", icon: "mdi-account", value: "yourFriends" },
      ],
      right: null,
      current: "MapComponent",
      userData: {
        name: "",
        email: "",
      },
      states: [
        "Pickpocket",
        "Eve Teasers",
        "No lights",
        "Robbers",
        "Criminals",
        "Others",
      ],
      markers: null,
      friendRequestModal: false,
      friendRequests: [],
      friends: null,
      drawer: false,
    };
  },
  computed: {
    getfriendRequests() {
      return this.friendRequests;
    },
  },
  methods: {
    handle(index) {
      if (index) {
        this.dialog = false;
      }
      console.log(this.items[index].value);
      this.current = this.items[index].value;
      this.markerDialog = false;
      this.dialog = false;
    },
    markFlag() {
      this.markerDialog = true;
    },
    addMarker() {
      const data = this.$refs.map.position;
      data["tag"] = this.marker.markerTag;
      data["email"] = this.userData.email;
      data["description"] = this.marker.markerDescription;
      console.log(data);
      this.$store.dispatch("addMarker", data).then(() => {
        this.$store.dispatch("getAllMarkers").then((res) => {
          this.markers = res.data.markers;
        });
      });
      this.marker.markerDescription = "";
      this.$refs.map.isPlacing = false;
      this.markerDialog = false;
    },
    cancelDialog(id) {
      this.markerDialog = false;
      if (id === 2) {
        this.$refs.map.isPlacing = false;
        this.markerDialog = false;
      }
    },
    logout() {
      localStorage.clear();
      Cookie.remove("access-token");
      this.$router.push("/");
    },
    deleteMarker(e) {
      this.$store.dispatch("deleteMarker", e).then(() => {
        console.log("d");
        this.$store.dispatch("getAllMarkers").then((res) => {
          this.markers = res.data.markers;
        });
      });
    },
    gotoHome() {
      this.current = this.items[0].value;
    },
    closeHelper() {
      this.dialog = !this.dialog;
    },
    setFriendRequestModal() {
      this.friendRequestModal = !this.friendRequestModal;
    },
    rejectRequest(senderId) {
      this.$store.dispatch("rejectFriendRequest", senderId).then(() => {
        this.$store.dispatch("getAllFreindRequests").then((data) => {
          this.friendRequests = data.data.data;
          if (this.friendRequests.length == 0) {
            this.friendRequestModal = false;
          }
        });
      });
    },
    acceptRequest(senderId) {
      console.log(senderId);
      this.$store.dispatch("acceptFriendRequest", senderId).then(() => {
        this.$store.dispatch("getAllFreindRequests").then((data) => {
          this.friendRequests = data.data.data;
          if (this.friendRequests.length == 0) {
            this.friendRequestModal = false;
          }
        });
      });
    },
  },
};
</script>

<style>
.user-icon {
  padding: 10px 10px;
  border: 1px solid #ff1744;
  border-radius: 50%;
}
.logout-button {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
