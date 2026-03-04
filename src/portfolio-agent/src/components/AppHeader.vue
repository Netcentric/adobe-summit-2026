<script setup lang="ts">
import { computed } from 'vue';
import CognizantLogo from '../../../common/CognizantLogo.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showHomeLink = computed(() => route.path.startsWith('/detail'));
</script>

<template>
  <header class="app-header">
    <div class="app-header__logo"><CognizantLogo /></div>
    <div
      class="app-header__actions"
      v-if="showHomeLink"
    >
      <RouterLink
        to="/"
        class="link bold"
        title="Home"
        ><span>⌂︎</span>&nbsp;Home
      </RouterLink>
    </div>
  </header>
</template>

<style lang="scss">
.app-header {
  max-width: 1224px;
  height: 60px;
  margin: 0 auto;
  z-index: 10;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-inline: var(--sp-1);

  .app-header__logo {
    width: 136px;
    height: auto;

    svg {
      width: 100%;
      display: block;
    }
  }

  .app-header__actions {
    margin-left: auto;
    line-height: 1;

    > .link {
      display: block;
      line-height: 1;
      margin-top: -8px;

      span {
        font-size: 24px; /* align with cognizant lettering in logo */
      }
    }
  }
}
</style>