<script setup lang="ts">
import {
  inject,
  nextTick,
  onMounted,
  type Ref,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';
import type { CaseItem } from '../types.ts';
import BackButton from '../components/BackButton.vue';

const route = useRoute();
const cases = inject<Ref<CaseItem[]>>('portfolioData', ref([]));

const metadata = ref<null | any>(null);
const html = ref<null | string>(null);

const content = useTemplateRef('content');
const taglist = useTemplateRef('taglist');
const backButton = useTemplateRef('backButton');

const scrollToSection = (id: string) => {
  const target = document.getElementById(id)?.parentElement;

  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

const amendHtml = async () => {
  await nextTick();

  console.log(backButton.value);

  if (!content.value || !taglist.value || !backButton.value) return;

  // setup stage html
  // Find the first section (div) as "stage" in the content
  const stage = content.value.querySelector('div');

  if (stage && !stage.contains(taglist.value)) {
    stage.classList.add('stage');

    const stageContent = stage.children;

    const stageHeader = document.createElement('div');
    stageHeader.classList.add('stage__header');
    stageHeader.appendChild(backButton.value);
    Array.from(stageContent).forEach((item) => {
      stageHeader.appendChild(item);
    });
    stageHeader.appendChild(taglist.value);
    stage.appendChild(stageHeader);

    // setup jump links
    const jumpLinkTargets = Array.from(
      content.value.querySelectorAll('h2')
    ).map((item) => ({
      id: item.id,
      textContent: item.textContent,
    }));
    const stageNavigation = document.createElement('ul');
    await stageNavigation.classList.add('stage__navigation');

    jumpLinkTargets.forEach((item) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + item.id;
      link.textContent = item.textContent;
      link.addEventListener('click', (event) => {
        event.preventDefault();

        scrollToSection(item.id);
        document.querySelector('li.active')?.classList.remove('active');
        link.classList.add('active');
      });

      listItem.appendChild(link);
      stageNavigation.appendChild(listItem);
    });
    stage.appendChild(stageNavigation);
  }

  // add "inline" taglist
  const inlineTagListTarget = Array.from(
    content.value.querySelectorAll('p')
  ).find((item) => item.textContent === '[taglist]');
  if (inlineTagListTarget) {
    inlineTagListTarget.innerHTML = '';
    inlineTagListTarget.appendChild(taglist.value.cloneNode(true));
  }
};

onMounted(async () => {
  try {
    const response = await fetch(
      `/portfolio-agent/${route.params.id}.plain.html`
    );
    if (response.ok) {
      html.value = await response.text();
      metadata.value = cases.value?.find(({ path }) =>
        path.includes(route.params.id as string)
      );
    }
  } catch (error) {
    console.error('Failed to fetch portfolio detail:', error);
  }
});

watch(html, async () => {
  if (html.value) {
    await amendHtml();
  }
});
</script>

<template>
  <div
    ref="backButton"
    class="back-button"
  >
    <BackButton
      to="/overview"
      variant="white"
    />
  </div>

  <ul
    class="taglist taglist--outline"
    ref="taglist"
  >
    <li
      class="taglist__item"
      v-for="item in metadata?.industries"
    >
      {{ item }}
    </li>
  </ul>

  <main>
    <div
      class="detail-content"
      ref="content"
      v-html="html"
    />
  </main>
  <footer>
    <button class="button button--outline">Send to my email</button>
    <button class="button">Explore similar cases</button>
  </footer>
</template>

<style>
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
  > div:not(.stage) + div {
    padding-top: var(--sp-4);
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
  padding-bottom: 3px;

  .stage__header {
    position: relative;

    h1 {
      position: absolute;
      top: 55%;
      left: var(--sp-2);
      z-index: 10;
      color: var(--white-100);
    }

    .taglist {
      position: absolute;
      top: 70%;
      left: var(--sp-2);
      z-index: 10;
      color: var(--white-100);
    }

    .back-button {
      position: absolute;
      top: 50px;
      left: 50px;
      z-index: 10;
    }
  }

  .stage__navigation {
    list-style: none;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 60px;

    > li {
      border-bottom: 3px solid transparent;
      padding: var(--sp-1);
      transition: border-bottom-color 0.36s ease-in-out;

      &:hover {
        border-bottom-color: var(--brand-primary);
      }
    }
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
    flex: 0 1 48%;
  }
}

.captionimage {
  /* layout */
  > div {
    display: flex;
    flex-direction: column;
    gap: var(--sp-1);
  }

  /* caption */
  > div > div:last-child {
    /* paragraph small */
    font-weight: 400;
    font-style: normal;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0;
    vertical-align: middle;
  }
}

.textimage + .captionimage {
  margin-top: var(--sp-2);
}

.cards {
  display: grid;
  gap: var(--sp-1);
  grid-template-columns: 1fr 1fr;

  /* card item */
  > div {
    border-left: 3px solid var(--brand-primary);
    padding: var(--sp-1) var(--sp-2);
    background-color: var(--grey-15);
  }

  /* card title */
  > div > div:first-child {
    font-weight: 600;
    font-size: 20px;
    line-height: 120%;
    letter-spacing: 0;
    margin-bottom: var(--sp-1);
  }
}

footer {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
  justify-content: center;
  padding-block: var(--sp-2);
}
</style>
