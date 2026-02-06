<script setup lang="ts"></script>

<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/overview">Overview</RouterLink>
      </li>
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
    </ul>
  </nav>
  <main>
    <h2>Detail {{ $route.params.id }}</h2>
  </main>
</template>

<style scoped></style>
