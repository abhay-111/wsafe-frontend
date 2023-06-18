<template>
  <v-container class="pa-5">
    <h1>Your Friends</h1>
    <v-snackbar v-model="snackbar">
      {{ errorText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-container>
      <h4>Add a new friend</h4>
      <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="description"
        item-value="API"
        label="Search User to add as a friend"
        placeholder="Start typing to Search"
        prepend-icon="mdi-account"
        return-object
        class="mt-3"
      ></v-autocomplete>
      <v-expand-transition>
        <v-list v-if="model">
          <v-list-item class="mt-2">
            <v-list-item-content>
              <v-list-item-title v-text="model.name"></v-list-item-title>
              <v-list-item-subtitle v-text="model.email"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn x-small color="error" @click="sendFriendRequest"
                >Add friend</v-btn
              >
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-expand-transition>
    </v-container>
    <v-container>
      <h4>Existing Friends ({{ getFriends.length }})</h4>

      <v-list class="mt-3" v-if="getFriends.length > 0">
        <v-list-item v-for="friend in getFriends" :key="friend._id">
          <v-list-item-content>
            <v-list-item-title> {{ friend.friendName }} </v-list-item-title>
            <v-list-item-subtitle>
              {{ friend.friendEmail }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn class="ml-5" @click="removeFriend(friend.friendId)" icon>
              <v-icon color="grey lighten-1">mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-container v-else>
        Add your friends and see their last active location on your map.
      </v-container>
    </v-container>
  </v-container>
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";
export default {
  data: () => ({
    descriptionLimit: 50,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
    friends: null,
    snackbar: false,
    errorText: "",
  }),
  mounted() {
    this.$store.dispatch("getAllFriends").then((res) => {
      console.log(res);
      this.friends = res.data.friends;
      console.log(this.friends);
    });
  },
  computed: {
    fields() {
      if (!this.model) return [];

      return this.model;
    },
    items() {
      return this.entries.map((ele) => {
        const description = ele.name + " - " + ele.email;
        return Object.assign({}, ele, { description });
      });
    },
    getFriends() {
      return this.friends;
    },
  },

  watch: {
    search(val) {
      console.log(val);
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      axios
        .get(
          `https://wsafeb.onrender.com/user/getUsers/${Cookie.get(
            "userId"
          )}`
        )
        .then((res) => {
          console.log(res);
          const { count, users } = res.data;
          this.count = count;
          this.entries = users;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  methods: {
    sendFriendRequest() {
      this.$store
        .dispatch("sendFriendRequest", this.model.description)
        .then(() => {
          console.log("heww");
          this.snackbar = true;
          this.errorText = "Friend Request sent";
          this.model = null;
        })
        .catch((err) => {
          this.snackbar = true;
          this.errorText = err.response.data.error.message;
        });
    },
    removeFriend(id) {
      console.log(id);
      this.$store.dispatch("removeFriend", id).then(() => {
        this.$store.dispatch("getAllFriends").then((res) => {
          this.friends = res.data.friends;
        });
      });
    },
  },
};
</script>

<style></style>
