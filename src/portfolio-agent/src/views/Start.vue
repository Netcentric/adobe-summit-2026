<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import QuickAnswerList from '../components/QuickAnswerList.vue';
import usePortfolio from '../usePortfolio.ts';

const { industryOptions } = usePortfolio();

// const placeholder = computed(() =>
//   searchSuggestions.value?.map((item) => item.suggestion)
// );
</script>

<template>
  <AppHeader/>
  <div class="start__background">
  </div>
  <main class="start__layout">
    <h1 class="start__jumboH1">Discover our customer success stories</h1>
    <h2 class="start__h1">What are you interested in?</h2>

    <div class="start__actions">
      <!--      <Input :placeholder="placeholder" />-->
      <QuickAnswerList
        :tags="
          industryOptions.map((item: string) => ({
            label: item,
            filter: item,
          }))
        "
      />
    </div>

    <RouterLink
      class="start__browseAllLink"
      to="/overview"
      >Browse all cases</RouterLink
    >
  </main>
</template>

<style lang="scss">
@property --background-rotation {
  syntax: '<angle>';
  initial-value: 120deg;
  inherits: false;
}
@keyframes startBackgroundRotation {
  0% {
    --background-rotation: 120deg;
  }

  50% {
    --background-rotation: 240deg;
  }

  100% {
    --background-rotation: 120deg;
  }
}

.start {
  &__background {
    position: fixed;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
    z-index: 0;
    background: linear-gradient(var(--background-rotation, 225deg), #35CACF 0.54%, #3D54CE 35.45%, #000 100%), #000048;
    animation: startBackgroundRotation 12s linear infinite;
  }

  &__layout {
    padding: 24px;
  }

  &__jumboH1,
  &__h1 {
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    text-align: center;
    vertical-align: middle;
    color: var(--white-100);
  }
  
  &__jumboH1 {
    font-size: 40px;

    @include bp-min($bp-tablet) {
      font-size: 100px;
    }
  }

  &__h1 {
    font-size: 20px;

    @include bp-min($bp-tablet) {
      font-size: 38px;
    }
  }

  &__actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 84px;

    @include bp-min($bp-tablet) {
      max-width: 75vw;
    }
  }

  &__browseAllLink {
    color: var(--white-100)
  }
}

main {
  z-index: 10;
  position: relative;
}

</style>
