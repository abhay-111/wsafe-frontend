<template>
  <v-container class="text-white fill-height">
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
          <v-card class="pa-10" max-width="30rem" max-height="25rem">
            <v-form v-if="isLogin" ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="loginUser.email"
                label="E-mail"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                v-model="loginUser.password"
                :rules="passwordRules"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <div>
                <p class="caption">
                  Dont have an account ?
                  <v-btn color="error" text x-small @click="isLogin = !isLogin">
                    Register</v-btn
                  >
                </p>
              </div>
              <v-btn color="error" @click="login" class="mr-4 mt-2">
                Login
              </v-btn>
            </v-form>
            <v-form v-else ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="registerUser.name"
                :rules="nameRules"
                label="Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="registerUser.email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
              <v-text-field
                v-model="registerUser.password"
                :rules="passwordRules"
                type="password"
                label="Password"
                required
              ></v-text-field>
              <p class="caption">
                Already have an account ?
                <v-btn color="error" text x-small @click="isLogin = !isLogin">
                  Login</v-btn
                >
              </p>
              <v-btn color="error" class="mr-4 mt-2" @click="register">
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
      loginUser: {
        email: "",
        password: "",
      },
      registerUser: {
        name: "",
        email: "",
        password: "",
      },
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 8) || "Password must be greater than 8 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      snackbar: false,
      timeout: 2000,
      errorText: "",
    };
  },
  methods: {
    login() {
      if (this.loginUser.email == "" || this.loginUser.password == "") {
        this.errorText = "Please fill in the form";
        this.snackbar = true;

        return;
      }
      this.$store
        .dispatch("loginUser", this.loginUser)
        .then((res) => {
          this.errorText = res.data.message;
          this.snackbar = true;

          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 500);
        })
        .catch((err) => {
          this.errorText = err.response.data.error.message;
          this.snackbar = true;
        });
    },
    register() {
      if (
        this.registerUser.email == "" ||
        this.registerUser.password == "" ||
        this.registerUser.name == ""
      ) {
        this.errorText = "Please fill in the form";
        this.snackbar = true;
        return;
      }
      this.$store
        .dispatch("registerUser", this.registerUser)
        .then((res) => {
          this.errorText = res.data.message;
          this.snackbar = true;
          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.errorText = err.response.data.error.message;
          this.snackbar = true;
        });
    },
  },
};
</script>
