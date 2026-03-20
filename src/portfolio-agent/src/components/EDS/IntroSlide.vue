<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(['node']);

const picture = ref<HTMLPictureElement | undefined>();
const content = ref<HTMLDivElement | undefined>();

const lDiv = props.node?.querySelector(':scope > div > div:first-child');
const rDiv = props.node?.querySelector(':scope > div > div:last-child');

const lPic = lDiv?.querySelector('picture')
if (lPic) {
  picture.value = lPic;
  content.value = rDiv;
} else {
  picture.value = rDiv?.querySelector('picture');
  content.value = lDiv;
}
</script>

<template>
  <div class="block introslide">
    <picture class="introslide__image" v-html="picture?.innerHTML"></picture>
    <div class="introslide__text" v-html="content?.innerHTML"></div>
  </div>
</template>

<style lang="scss">
.introslide {
  position: relative;
  margin-inline: -24px;
  min-height: calc(100vw * 0.5625);
  align-content: center;

  @include bp-min($bp-tablet) {
    height: var(--section-height);
    margin-inline: calc(var(--section-padding-inline) * -1);
    margin-block: calc(var(--section-padding-block) * -1);
  }

  &__image {
    position: absolute;
    inset: 0;
    overflow: hidden;

    @include bp-max($bp-tablet) {
      z-index: -1;
    }

    img {
      width: 100%;
      height: 100% !important;
      object-fit: cover;
      object-position: center;
    }
  }


  &__text {
    font-size: 84px;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: 0;
    vertical-align: middle;
    text-align: center;
    padding: 24px;
    color: #ffffff;

    @include bp-min($bp-tablet) {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    b, strong {
      color: #26EFE9;
    }
  }
}
</style>