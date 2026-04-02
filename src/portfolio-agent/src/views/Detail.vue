<script setup lang="ts">
import { computed, inject, nextTick, onMounted, provide, ref, useTemplateRef, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import Stage from '../components/EDS/Stage.vue';
import Section from '../components/EDS/Section.vue';
import TagList from '../components/TagList.vue';
import { useQRCode } from '@vueuse/integrations/useQRCode';

const route = useRoute();
const edsUrl = ref('');
const edsIsLoading = ref(false);
const edsDocument = ref<Document | null>(null);
const edsError = ref<any | null>(null);
const edsMetaData = ref<Map<string, string>>(new Map());
const pageTitle = computed(() => edsDocument.value?.querySelector('h1')?.innerText);
const edsStageNode = computed(() => edsDocument.value?.querySelector('body > main > div'));
const edsSectionNodes = computed(() => edsDocument.value?.querySelectorAll('body > main > div:not(:first-child)'));
const edsFoundTaglistKeys = ref();
const edsFirstSectionIntersectingIndex = ref(-1);
const edsActiveNavigationJumpLinkIndex = ref(-1);
const contentRef = useTemplateRef('content');
const intersectingSectionIndexes = ref<Array<number>>([]);

const currentLocation = ref<string>('');

const qrcode = useQRCode(
  currentLocation,
  {
    errorCorrectionLevel: 'H',
    margin: 3,
  }
);


const showShareButton = computed(() => navigator.share !== undefined);

export interface JumpLink {
  headline: string;
  headlineMobile: string;
  hasIntroScreen: boolean;
  startSectionIndex: number;
  endSectionIndex: number;
}

const edsNavigationJumpLinks = computed(() => {
  if (!edsSectionNodes.value) {
    return;
  }
  const links: JumpLink[] = Array.from(edsSectionNodes.value)
    .map((sec, index) => {
      const hasIntroScreen = index > 0 && edsSectionNodes.value?.item(index - 1).querySelector('div.introslide') ? true: false;
      const startSectionIndex = hasIntroScreen ? index - 1 : index;
      const headline = sec.querySelector('h2')?.innerText.trim() || '';
      const headlineMobileShortened = headline.replace(/^the /i, '');
      const headlineMobile = headlineMobileShortened ? headlineMobileShortened.substring(0, 1).toUpperCase() + headlineMobileShortened.substring(1) : '';
      return {
        headline,
        headlineMobile,
        hasIntroScreen,
        startSectionIndex,
        endSectionIndex: startSectionIndex,
      };
    })
    .filter(section => section.headline.length > 0);
  links.forEach((link, index, arr) => {
    if (!edsSectionNodes.value) {
      return;
    }
    if (index < arr.length - 1) {
      link.endSectionIndex = (arr[index + 1]?.startSectionIndex || 0) - 1;
    } else {
      link.endSectionIndex = edsSectionNodes.value.length - 1;
    }
  })
  return links;
});

provide('edsMetaData', edsMetaData);
provide('edsSectionNodes', edsSectionNodes);
provide('edsNavigationJumpLinks', edsNavigationJumpLinks);
provide('edsActiveNavigationJumpLinkIndex', edsActiveNavigationJumpLinkIndex);

watch(edsUrl, async () => {
  edsIsLoading.value = true;
  edsDocument.value = null;
  edsError.value = null;
  edsMetaData.value.clear();

  contentRef.value?.scrollTo({
    top: 0,
  });

  try {
    const response = await fetch(edsUrl.value);
    if (response.ok) {
      const responseSource = await response.text();
      const parser = new DOMParser();
      edsFoundTaglistKeys.value = [];
      const replaceTagsSource = responseSource.replace(/\[taglist(?:\:([^\]]+))?\]/g, (_, listKey) => {
        const key = listKey || '';
        if (!edsFoundTaglistKeys.value.includes(key)) {
          edsFoundTaglistKeys.value.push(key);
        }
        return `<my-taglist metaKey="${key}"></my-taglist>`;
      });
      edsDocument.value = parser.parseFromString(replaceTagsSource, 'text/html');
      intersectingSectionIndexes.value = [];
      updateActiveSection();
      
      edsReadMetadata();
      if (route.query?.autoScroll) {
        startAutoScroll();
      }
    }
  } catch (e) {
    edsError.value = e;
  }
  edsIsLoading.value = false;

  // wait for next tick and scroll to top of page.
  nextTick(() => {
    contentRef.value?.scrollTo({
      top: 0,
    });
    currentLocation.value = window.location.href.replace(/\?(.*)$/, '');
  })
}, {
  immediate: true,
});

watch(route, () => {
  edsUrl.value = `/portfolio-agent/${route.params.id}`;
});

onMounted(() => {
  edsUrl.value = `/portfolio-agent/${route.params.id}`;
});

const humanPresent = inject<Ref<boolean, boolean>>('humanPresent');
const kioskMode = inject<Ref<boolean, boolean>>('kioskMode');

if (humanPresent) {
  watch(humanPresent, () => {
    if (humanPresent.value) {
      stopAutoScroll();
    }
  })
}

let autoScrollInterval: number | undefined;
let autoScrollSection = 0;
const autoScrollTimeoutMs = import.meta.env.VITE_DEMO_MODE_SCROLL_TIMEOUT;
const showNextCase = inject<Function>('showNextCase');

function startAutoScroll() {
  autoScrollSection = 0;
  autoScrollInterval = setInterval(autoScrollNextSection, autoScrollTimeoutMs);
}

function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
}

function autoScrollNextSection() {
  const sections = contentRef.value?.querySelectorAll('section');
  if (!sections) {
    return;
  }
  autoScrollSection++;
  if (autoScrollSection >= sections?.length) {
    stopAutoScroll();
    // router.push({
    //   name: 'start'
    // });
    if (showNextCase) {
      showNextCase();
    }
    return;
  }
  const target = sections[autoScrollSection];
  target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
  })
}

function getTagsByKey(metaKey?: string): Array<string> {
  if (!metaKey) {
    return [
      ...getTagsByKey('industries'),
      ...getTagsByKey('field-of-interest'),
    ]
  }
  return edsMetaData.value.get(metaKey)
      ?.split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0) || [];
}

function edsReadMetadata() {
  edsMetaData.value.clear();
  edsDocument.value?.documentElement.querySelectorAll('head > meta').forEach((metaNode) => {
    if (
      !metaNode.hasAttribute('name')
      || !metaNode.hasAttribute('content')
      || !metaNode.getAttribute('name')?.trim().length
    ) {
      return;
    }

    edsMetaData.value?.set(
      metaNode.getAttribute('name') || '',
      metaNode.getAttribute('content') || ''
    );
  });
}

function onSectionIntersecting(sectionIndex: number) {
  intersectingSectionIndexes.value.push(sectionIndex);
  updateActiveSection();
}

function onSectionNotIntersecting(sectionIndex: number) {
  intersectingSectionIndexes.value = intersectingSectionIndexes.value.filter(sI => sI != sectionIndex);
  updateActiveSection();
}

function updateActiveSection() {
  if (intersectingSectionIndexes.value.length < 1) {
    edsFirstSectionIntersectingIndex.value = -1;
    edsActiveNavigationJumpLinkIndex.value = -1;
    return;
  }
  edsFirstSectionIntersectingIndex.value = Math.max(...intersectingSectionIndexes.value);
  edsActiveNavigationJumpLinkIndex.value = edsNavigationJumpLinks.value?.findIndex(link => link.startSectionIndex <= edsFirstSectionIntersectingIndex.value && link.endSectionIndex >= edsFirstSectionIntersectingIndex.value) || 0;
}

function onShare() {
  if (navigator.share === undefined) {
    return;
  }
  navigator.share({
    title: pageTitle.value,
    url: window.location.href
  });
}
</script>

<template>
  <div class="detail-content" ref="content">
    <div class="hidden">
      <div data-taglist :data-taglist-key="taglistKey" v-for="taglistKey in edsFoundTaglistKeys">
        <TagList :tags="getTagsByKey(taglistKey)" variant="outline"/>
      </div>
    </div>
    <Stage v-if="edsStageNode" :node="edsStageNode" :tags="getTagsByKey()"></Stage>
    <Section
      :node="sectionNode"
      :index="sectionIndex"
      @intersecting="onSectionIntersecting(sectionIndex)"
      @not-intersecting="onSectionNotIntersecting(sectionIndex)"
      v-for="(sectionNode, sectionIndex) in edsSectionNodes"
      :key="sectionIndex"/>
    <footer v-if="showShareButton">
      <div v-if="kioskMode && qrcode" class="detail__qrcode">
        Scan to open on mobile:<br/>
        <img class="share_qrCode" :src="qrcode" alt="QR Code">
      </div>
      <button v-else-if="!kioskMode && showShareButton" @click="onShare" class="button button--outline">Share this case</button>
      <!-- <button class="button">Explore similar cases</button> -->
    </footer>
  </div>
</template>

<style lang="scss">
.hidden {
  display: none;
}

.detail-content {
  position: fixed;
  inset: 0;
  overflow: auto;
  max-width: 100%;
  // scroll-snap-type: y mandatory;
  scroll-padding-top: 60px;

  img {
    max-width: 100%;
    display: block;
    height: auto;
  }

  /* typography */
  h1 {
    font-size: 36px;
    line-height: 40px;
    letter-spacing: 0;
    vertical-align: middle;

    @include bp-min ($bp-tablet) {
      font-size: 70px;
      line-height: 100%;
    }
  }

  h2 {
    font-size: 36px;
    line-height: 44.8px;
    letter-spacing: 0;
    margin-bottom: var(--sp-1);

    @include bp-min ($bp-tablet) {
      margin-bottom: var(--sp-2);
    }
  }
}

.share_qrCode {
  height: 200px;
  width: auto;
}

footer {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
  justify-content: center;
  padding-bottom: 110px;
  scroll-snap-align: start;
  padding-top: 14px;

  @include bp-min($bp-tablet) {
    padding-top: 0;
  }
}

html {
  --section-padding-block: 100px;
  --section-height: calc(100vh - 60px);
}

.detail__qrcode {
  color: #000048;

  /* Paragraph */
  font-family: Gellix;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px; /* 135% */
  text-align: center;

  img {
    margin-block-start: 10px;
    display: inline-block;
  }
}

</style>
