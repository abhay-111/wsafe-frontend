<template>
  <v-container fluid class="pa-3">
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      color="white"
      hide-no-data
      hide-selected
      item-text="Description"
      item-value="API"
      label="Search User to add as a friend"
      placeholder="Start typing to Search"
      prepend-icon="mdi-account"
      return-object
    ></v-autocomplete>
    <v-expand-transition>
      <v-list v-if="model" class="">
        <v-list-item v-for="(field, i) in fields" class="mt-2" :key="i">
          <v-list-item-content>
            <v-list-item-title v-text="field.value"></v-list-item-title>
            <v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn x-small color="error">Add friend</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-expand-transition>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    descriptionLimit: 30,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
  }),

  computed: {
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
    },
    items() {
      return this.entries.map((ele) => {
        return ele.name + " - " + ele.email;
      });
    },
  },

  watch: {
    search(val) {
      // Items have already been loaded
      console.log(val);
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      axios
        .get(`http://localhost:8000/user/getUsers?search=${val}`)
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
};
</script>

<style></style>
