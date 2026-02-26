<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Stage from '../components/EDS/Stage.vue';
import Section from '../components/EDS/Section.vue';
import TagList from '../components/TagList.vue';
// import Content from '../components/EDS/Content.vue';


const route = useRoute();
const edsUrl = ref('');
const edsIsLoading = ref(false);
const edsDocument = ref<Document | null>(null);
const edsError = ref<any | null>(null);
const edsMetaData = ref<Map<string, string>>(new Map());
const edsStageNode = computed(() => edsDocument.value?.querySelector('body > main > div'));
const edsSectionNodes = computed(() => edsDocument.value?.querySelectorAll('body > main > div:not(:first-child)'));
const edsFoundTaglistKeys = ref();
const edsSectionsIntersecting = ref<Map<number, boolean>>(new Map());

provide('edsMetaData', edsMetaData);
provide('edsSectionNodes', edsSectionNodes);
provide('edsSectionsIntersecting', edsSectionsIntersecting);

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
      // edsFoundTaglistKeys.value = Array.from(responseSource.matchAll(/\[taglist(?:\:([^\]]+))?\]/g) || []).map(m => m[1] || '');
      
      edsReadMetadata();
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

function getTagsByKey(metaKey: string): Array<string> {
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
  edsSectionsIntersecting.value.set(sectionIndex, true);
}

function onSectionNotIntersecting(sectionIndex: number) {
  edsSectionsIntersecting.value.set(sectionIndex, false);
}
</script>

<template>
  <div class="detail-content">
    <div class="hidden">
      <div data-taglist :data-taglist-key="taglistKey" v-for="taglistKey in edsFoundTaglistKeys">
        <TagList :tags="getTagsByKey(taglistKey)" variant="outline"/>
      </div>
    </div>
    <Stage v-if="edsStageNode" :node="edsStageNode"></Stage>
    <Section
      :node="sectionNode"
      :index="sectionIndex"
      @intersecting="onSectionIntersecting(sectionIndex)"
      @not-intersecting="onSectionNotIntersecting(sectionIndex)"
      v-for="(sectionNode, sectionIndex) in edsSectionNodes"
      :key="sectionIndex"/>
  </div>
  <footer>
    <button class="button button--outline">Send to my email</button>
    <button class="button">Explore similar cases</button>
  </footer>
</template>

<style>
.hidden {
  display: none;
}

.detail-content {
  max-width: 100%;

  img {
    max-width: 100%;
    display: block;
    height: auto;
  }

  /* standard section wrapper layout and spacing */
  > div:not(.stage) {
    margin-inline: auto;
    padding-inline: var(--sp-1);

    @media screen and (min-width: 1200px) {
      max-width: 1100px;
      margin-inline: auto;
      padding-inline: unset;
    }
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

/* DA blocks */
/* Stage
 TODO consider creating the markup for the stage
  via javascript
 */
.stage {
  width: 100%;
  max-width: unset;
  padding-bottom: 60px;
  position: relative;

  .stage__header {
    position: relative;

    h1 {
      anchor-name: --stage-header-h1;
      position: absolute;
      top: 55%;
      left: var(--sp-2);
      z-index: 10;
      color: var(--white-100);
    }

    .tag-list-ref {
      position-anchor: --stage-header-h1;
      position: absolute;
      top: calc(anchor(bottom) + 40px);
      left: var(--sp-2);
      z-index: 10;
      color: var(--white-100);
    }

    h1, .tag-list-ref, .back-button-ref {
      left: 50%;
      width: 100%;
      max-width: 1100px;
      transform: translateX(-50%);
    }

    .back-button-ref {
      position: absolute;
      top: 50px;
      z-index: 10;
    }

    .back-button-ref a {
      display: inline-block;
    }

    .tag-list {
      margin-top: 0;
    }

    .tag-list__item {
      border-width: 0;
    }
  }

  .stage__navigation {
    position: absolute;
    bottom: 0;
    list-style: none;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 60px;
    gap: 67px;

    > li {
      border-bottom: 6px solid transparent;
      padding: var(--sp-1) calc(var(--sp-1) / 2) calc(var(--sp-1) - 6px);
      transition: border-bottom-color 0.36s ease-in-out;

      &:hover {
        anchor-name: --stagenav-hover;
        border-bottom-color: var(--brand-primary);
      }
    }
  }
  .stage__navigation--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
}

.textimage {
  /* row */
  > div {
    display: flex;
    flex-direction: row;
    gap: var(--sp-1);
  }

  /* column */
  > div > div {
    flex: 1;
  }
}


.detail-content > div + div,
.textimage + .captionimage,
.captionimage + .textimage {
  margin-top: var(--sp-blocks);
}

footer {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
  justify-content: center;
  padding-bottom: 110px;
}

.intersecting {
  background-color: green;
}

.not-intersecting {
  background-color: red;
}

html {
  scroll-padding-top: 100px;
}

</style>
