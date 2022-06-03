<template>
  <v-container class="text-white fill-height">
    <v-row class="py-5 px-15">
      <v-col cols="12">
        <div class="d-flex justify-center align-items-center">
          <img src="../assets/W-safewhite.png" height="150px" alt="" />
        </div>
      </v-col>
      <v-col cols="6">
        <div class="">
          <h1>Check before you leave.</h1>
          <h1>Be safe.</h1>
          <h1>Help Others.</h1>
          <p class="mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Exercitationem,. Lorem ipsum, dolor sit amet consectetur adipisicing
            elit. Consequatur et cum facilis temporibus quisquam ipsam sunt,
            incidunt eaque nobis molestias!
          </p>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="pa-5">
          <v-card class="pa-10" max-width="30rem" max-height="20rem">
            <v-form v-if="isLogin" ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Password"
                required
              ></v-text-field>
              <v-btn color="error" class="mr-4" @click="isLogin = !isLogin">
                Login
              </v-btn>
            </v-form>
            <v-form v-else ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Password"
                required
              ></v-text-field>
              <v-btn color="error" class="mr-4" @click="isLogin = !isLogin">
                Register
              </v-btn>
            </v-form>
          </v-card>
        </div>
      </v-col>
      <v-col cols="6"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import logo from "";
export default {
  name: "Home",
  data() {
    return {
      isLogin: false,
    };
  },
};
</script>
