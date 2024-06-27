<script setup lang="tsx">
import { computed, onMounted, ref } from "vue";
import type { Stats, UserCountDate } from "@/interfaces/User";
import { getUsersStats } from "@/api/user";
import { Bar } from "vue-chartjs";
import { Chart, CategoryScale, BarElement, LinearScale, Title } from "chart.js";

Chart.register(CategoryScale, BarElement, LinearScale, Title);

const groupUsersByMonth = (
  users: UserCountDate[],
): { count: number; date: string }[] => {
  const grouped = users.reduce(
    (acc, user) => {
      const monthYear = new Date(user.date).toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = { count: 0, date: monthYear };
      }
      acc[monthYear].count += user.count;
      return acc;
    },
    {} as Record<string, { count: number; date: string }>,
  );

  return Object.values(grouped);
};

const loading = ref(true);
const stats = ref<Stats>({
  totalUsers: 0,
  newUsers: [],
  totalRevenue: 0,
});
const getStats = async () => {
  const response = await getUsersStats();
  stats.value = response.data;
  loading.value = false;
};

const datasets = computed(() => [
  {
    label: "Nouveaux utilisateurs",
    backgroundColor: "#3281ED",
    data: groupUsersByMonth(stats.value.newUsers).map((stat) => stat.count),
  },
]);

onMounted(() => getStats());
</script>

<template>
  <h2>Dashboard</h2>
  <v-row class="mt-8">
    <v-col cols="12" md="6" sm="12">
      <v-card class="py-4 px-4">
        <v-card-title>
          <span class="headline">Nombre d'utilisateurs</span>
        </v-card-title>
        <v-card-text>
          <span class="display-1 text-h3 font-weight-bold">{{
            stats.totalUsers
          }}</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" sm="12">
      <v-card class="py-4 px-4">
        <v-card-title>
          <span class="headline">Revenu total</span>
        </v-card-title>
        <v-card-text>
          <span class="display-1 text-h3 font-weight-bold"
            >{{ stats.totalRevenue }} €</span
          >
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row class="mt-8">
    <v-col cols="12" md="12" sm="12">
      <v-card class="py-4 px-4">
        <v-card-title>
          <span class="headline">Nouveaux utilisateurs par mois</span>
        </v-card-title>
        <v-card-text>
          <Bar
            v-if="!loading"
            id="users-chart"
            :data="{
              labels: groupUsersByMonth(stats.newUsers).map(
                (stat) => stat.date,
              ),
              datasets: datasets,
            }"
            :chartOptions="{
              responsive: true,
            }"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
