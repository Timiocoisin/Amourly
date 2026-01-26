<template>
  <div class="page">
    <NavBar />
    <main class="page-content">
      <div class="container">
        <h1>登录</h1>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 48px 0;
}
</style>

