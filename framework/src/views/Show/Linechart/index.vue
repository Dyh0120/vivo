<template>
  <div class="container">
    <div class="chart-container">
      <LineChart @node-click="handleNodeClick" />
    </div>
    <TextDisplay ref="textDisplay" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LineChart from './../../../components/LineChart.vue';
import TextDisplay from './../../../components/TextDisplay.vue';
const textDisplay = ref(null);

const handleNodeClick = ({ xIndex, yIndex }) => {
  if (textDisplay.value) {
    textDisplay.value.updateTexts(xIndex, yIndex);
  }
};
</script>
