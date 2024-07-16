<script setup lang="ts">
import { logoutUser } from "@/api/auth";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import { useUserStore } from "@/store/UserStore";
import { RouterLink, useRoute, useRouter } from "vue-router";

const router = useRouter();
const store = useUserStore();
const route = useRoute();

const NotShowNavRoutes = ["/account/delete-account"];

const logout = async () => {
  await logoutUser();
  await router.push({
    name: "Login",
    replace: true,
  });
  store.setUser(null);
};
</script>

<template>
  <v-layout>
    <v-main style="min-height: 100vh">
      <Header />
      <div class="container">
        <div class="nav-container" v-if="!NotShowNavRoutes.includes(route.path)">
          <nav>
            <ul>
              <li><RouterLink to="/account/profile"> Profil </RouterLink></li>
              <li><RouterLink to="/account/orders"> Commandes </RouterLink></li>
              <li>
                <RouterLink to="/account/favorites"> Favoris </RouterLink>
              </li>
            </ul>
            <ul>
              <li @click="logout">Déconnexion</li>
            </ul>
          </nav>
        </div>
        <div class="router-container">
          <router-view></router-view>
        </div>
      </div>
    </v-main>
  </v-layout>
  <Footer />
</template>

<style scoped>
.container {
  padding: 0.75rem 1rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (max-width: 780px) {
    padding: 0;
  }
}

.router-container {
  max-width: 85%;
  width: 100%;
  @media (max-width: 780px) {
    max-width: 100%;
  }
}

.nav-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  & nav {
    padding: 1rem;
    width: 60%;
    border-radius: 0.5rem;
    background: white;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  & nav ul {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 2rem;
    & li {
      list-style-type: none;
      cursor: pointer;
      &:hover a {
        color: rgb(73, 73, 73);
      }
      & a {
        color: rgb(118, 118, 118);
        text-decoration: none;
        &.router-link-active {
          color: black;
        }
      }
    }
  }

  @media (max-width: 780px) {
    nav {
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 550px) {
    nav {
      overflow-x: scroll;
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 2rem;
    }
  }
}
</style>
