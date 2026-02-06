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
  <footer>
    <div class="buttongroup">
      <button class="button button--outline">Send to my email</button>
      <button class="button">Explore similar cases</button>
    </div>
  </footer>
</template>

<style scoped></style>
