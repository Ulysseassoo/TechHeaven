<script setup lang="tsx">
import { computed, onMounted, ref } from "vue";
import type { Stats } from "@/interfaces/StockHistory";
import { getStockHistoryStats } from "@/api/stockHistory";
import { Bar, Doughnut } from "vue-chartjs";
import {
  Chart,
  CategoryScale,
  BarElement,
  ArcElement,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(
  CategoryScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  Title
);

const loading = ref(true);
const stats = ref<Stats>({
  stockProductsEvolution: [],
  topSixProductsInStock: [],
});
const getStats = async () => {
  const response = await getStockHistoryStats();
  stats.value = response.data;
  loading.value = false;
};

const datasets = computed(() => [
  {
    label: "Stock du produit initial",
    backgroundColor: "#9AD0F5",
    data: stats.value.stockProductsEvolution.map((stat) => stat.startQuantity),
  },
  {
    label: "Stock du produit actuel",
    backgroundColor: "#FFB1C1",
    data: stats.value.stockProductsEvolution.map((stat) => stat.endQuantity),
  },
]);

const doughnutDataSet = computed(() => [
  {
    label: "Nombre vendus",
    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
    data: stats.value.topSixProductsInStock.map((stat) => stat.quantityDifference),
  },
]);

onMounted(() => getStats());
</script>

<template>
  <h2>Dashboard</h2>
  <v-row class="mt-8">
    <v-col cols="12" md="12" sm="12">
      <v-card class="py-4 px-4">
        <v-card-title>
          <span class="headline">Evolution du stock par produit</span>
        </v-card-title>
        <v-card-text>
          <Bar
            v-if="!loading"
            id="stock-chart"
            :data="{
              labels: stats.stockProductsEvolution.map((stock) => stock.product.name),
              datasets: datasets,
            }"
            :chartOptions="{
              responsive: true,
            }"
          />
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="12" sm="12">
      <v-card class="py-12 px-4">
        <v-card-title>
          <span class="headline mb-4">Top 6 des produits les plus vendus</span>
        </v-card-title>
        <v-card-text>
          <Doughnut
            v-if="!loading && stats.topSixProductsInStock && doughnutDataSet"
            id="pie-chart"
            :data="{
              labels: stats.topSixProductsInStock.map((stock) => stock.product.name),
              datasets: doughnutDataSet,
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
