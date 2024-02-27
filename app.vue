<script setup lang="ts">
import githubIcon from "assets/images/github.png"
</script>

<template>
  <v-sheet>
    <v-btn icon :href="'https://github.com/omrgms'" target="_blank">
      <img :src="githubIcon"/>
    </v-btn>
  </v-sheet>

  <nuxt-page/>
</template>

<style scoped lang="scss">
.v-sheet {
  display: flex;
  justify-content: flex-end;
  background-color: #F7F8FB;

  .v-btn {
    margin: 16px 16px 0 0;
  }
}
</style>