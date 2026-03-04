<script setup lang="ts">
import { computed, inject, onMounted, provide, ref, useTemplateRef, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Stage from '../components/EDS/Stage.vue';
import Section from '../components/EDS/Section.vue';
import TagList from '../components/TagList.vue';
// import Content from '../components/EDS/Content.vue';


const route = useRoute();
const router = useRouter();
const edsUrl = ref('');
const edsIsLoading = ref(false);
const edsDocument = ref<Document | null>(null);
const edsError = ref<any | null>(null);
const edsMetaData = ref<Map<string, string>>(new Map());
const edsStageNode = computed(() => edsDocument.value?.querySelector('body > main > div'));
const edsSectionNodes = computed(() => edsDocument.value?.querySelectorAll('body > main > div:not(:first-child)'));
const edsFoundTaglistKeys = ref();
const edsSectionsIntersecting = ref<Map<number, boolean>>(new Map());
const edsFirstSectionIntersectingIndex = ref(-1);
const edsActiveNavigationJumpLinkIndex = ref(-1);
const contentRef = useTemplateRef('content');

export interface JumpLink {
  headline: string;
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
      return {
        headline: sec.querySelector('h2')?.innerText.trim() || '',
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
provide('edsSectionsIntersecting', edsSectionsIntersecting);
provide('edsNavigationJumpLinks', edsNavigationJumpLinks);
provide('edsActiveNavigationJumpLinkIndex', edsActiveNavigationJumpLinkIndex);

watch(edsUrl, async () => {
  edsIsLoading.value = true;
  edsDocument.value = null;
  edsError.value = null;
  edsMetaData.value.clear();

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
      edsSectionsIntersecting.value.clear();
      edsFirstSectionIntersectingIndex.value = -1;
      edsActiveNavigationJumpLinkIndex.value = -1;
      
      edsReadMetadata();
      if (route.query?.autoScroll) {
        startAutoScroll();
      }
    }
  } catch (e) {
    edsError.value = e;
  }
  edsIsLoading.value = false;
});

watch(route, () => {
  edsUrl.value = `/portfolio-agent/${route.params.id}`;
});

onMounted(() => {
  edsUrl.value = `/portfolio-agent/${route.params.id}`;
});

const humanPresent = inject<Ref<boolean, boolean>>('humanPresent');

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
  edsFirstSectionIntersectingIndex.value = sectionIndex;
  edsActiveNavigationJumpLinkIndex.value = edsNavigationJumpLinks.value?.findIndex(link => link.startSectionIndex <= sectionIndex && link.endSectionIndex >= sectionIndex) || 0;
  edsSectionsIntersecting.value.set(sectionIndex, true);
}

function onSectionNotIntersecting(sectionIndex: number) {
  edsSectionsIntersecting.value.set(sectionIndex, false);
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
    <!-- <footer>
      <button class="button button--outline">Send to my email</button>
      <button class="button">Explore similar cases</button>
    </footer> -->
  </div>
</template>

<style>
.hidden {
  display: none;
}

.detail-content {
  position: fixed;
  inset: 0;
  overflow: auto;
  max-width: 100%;
  scroll-snap-type: y mandatory;
  scroll-padding-top: 60px;

  img {
    max-width: 100%;
    display: block;
    height: auto;
  }

  /* typography */
  h1 {
    font-size: 70px;
    line-height: 100%;
    letter-spacing: 0;
    vertical-align: middle;
  }

  h2 {
    font-size: 37.34px;
    line-height: 44.8px;
    letter-spacing: 0;
    margin-bottom: var(--sp-2);
  }
}

footer {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
  justify-content: center;
  padding-bottom: 110px;
  margin-top: 100px;
  scroll-snap-align: start;
}

html {
  --section-padding-block: 150px;
  --section-height: calc(100vh - 60px);
}

</style>
