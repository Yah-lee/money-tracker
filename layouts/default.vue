<template>
  <v-app dark>
    <!-- Sidebar Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <!-- <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar> -->

    <!-- Main Content -->
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app>
      <span>&copy; {{ currentDate }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      date: new Date(),
      drawer: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "summarize",
          to: "/summarize",
        },
      ],
      title: "Yah lpl",
    };
  },
  computed: {
    currentDate() {
      const day = String(this.date.getDate()).padStart(2, "0");
      const month = String(this.date.getMonth() + 1).padStart(2, "0");
      const year = this.date.getFullYear();
      const hours = String(this.date.getHours()).padStart(2, "0");
      const minutes = String(this.date.getMinutes()).padStart(2, "0");
      const seconds = String(this.date.getSeconds()).padStart(2, "0");

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    },
  },
  mounted() {
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  },
};
</script>
