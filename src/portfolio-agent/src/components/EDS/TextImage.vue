<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps(['node']);

const picture = ref<HTMLPictureElement | undefined>();
const content = ref<HTMLDivElement | undefined>();
const picturePosition = ref<string>('left');

const lDiv = props.node?.querySelector(':scope > div > div:first-child');
const rDiv = props.node?.querySelector(':scope > div > div:last-child');

const lPic = lDiv?.querySelector('picture')
if (lPic) {
  picturePosition.value = 'left';
  picture.value = lPic;
  content.value = rDiv;
} else {
  picturePosition.value = 'right';
  picture.value = rDiv?.querySelector('picture');
  content.value = lDiv;
}
</script>

<template>
    <div class="block textimage" :class="`textimage--picture-${picturePosition}`">
      <picture class="textimage__image" v-html="picture?.innerHTML"></picture>
      <div class="textimage__text" v-html="content?.innerHTML"></div>
    </div>
</template>

<style lang="scss">
.textimage {
  display: grid;
  gap: var(--sp-4);
  height: var(--section-height);
  margin-inline: calc(var(--section-padding-inline) * -1);
  margin-block: calc(var(--section-padding-block) * -1);
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "image text";

  &__text {
    grid-area: text;
    height: 100%;
    padding-block: var(--section-padding-block);
  }
  &__image {
    grid-area: image;
    height: 100%;
    width: 100%;
    overflow: hidden;

    img {
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }
  
  &--picture-left {
    margin-left: calc(var(--section-padding-inline) * -1);
  }
  
  &--picture-right {
    margin-right: calc(var(--section-padding-inline) * -1);
    grid-template-areas: "text image";
  }

  &--picture-left &__text {
    padding-right: var(--section-padding-inline);
  }

  &--picture-right &__text {
    padding-left: var(--section-padding-inline);
  }
}

// .textimage {
//   /* row */
//   > div {
//     display: flex;
//     flex-direction: row;
//     gap: var(--sp-1);
//   }

//   /* column */
//   > div > div {
//     flex: 0 1 48%;
//   }
// }
</style>