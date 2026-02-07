<template>
  <TransitionGroup 
    name="list" 
    tag="div" 
    class="flags-grid"
  >
    <div
      v-for="country in countries"
      :key="country.iso2 || country.name"
      class="hover-3d"
      @click="$emit('select', country)"
    >
      <!-- Flag Content -->
      <figure class="flag-figure">
        <img
          :src="country.flagUrl"
          :alt="country.name"
          class="flag-image"
          loading="lazy"
        />
        <figcaption
          class="flag-caption"
          :class="{
            'forced-visible': searchQuery && searchQuery.trim().length > 0
          }"
          v-html="highlight(country.name)"
        ></figcaption>
      </figure>
      <!-- 8 empty divs needed for the 3D effect -->
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { CountryData } from '~/models';

const props = defineProps<{
  countries: CountryData[];
  searchQuery: string;
}>();

defineEmits<{
  (e: 'select', country: CountryData): void;
}>();

function highlight(text: string) {
  if (!props.searchQuery) return text;
  const q = props.searchQuery;
  return text.replace(
    new RegExp(`(${q})`, 'gi'),
    '<span class="text-warning">$1</span>'
  );
}
</script>

<style scoped>
.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

@media (min-width: 640px) {
  .flags-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .flags-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1.5rem;
  }
}

/* 3D Hover Effect */
.hover-3d {
  display: grid;
  place-items: center;
  perspective: 1000px;
  cursor: pointer;
}

.hover-3d > *:first-child {
  grid-area: 1/1;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.hover-3d > div:empty {
  grid-area: 1/1;
}

.hover-3d > div:nth-child(2) { clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%); }
.hover-3d > div:nth-child(3) { clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%); }
.hover-3d > div:nth-child(4) { clip-path: polygon(0 50%, 50% 50%, 50% 100%, 0 100%); }
.hover-3d > div:nth-child(5) { clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%); }
.hover-3d > div:nth-child(6) { clip-path: polygon(0 0, 25% 0, 25% 100%, 0 100%); }
.hover-3d > div:nth-child(7) { clip-path: polygon(25% 0, 50% 0, 50% 100%, 25% 100%); }
.hover-3d > div:nth-child(8) { clip-path: polygon(50% 0, 75% 0, 75% 100%, 50% 100%); }
.hover-3d > div:nth-child(9) { clip-path: polygon(75% 0, 100% 0, 100% 100%, 75% 100%); }

.hover-3d > div:nth-child(2):hover ~ *:first-child { transform: rotateX(10deg) rotateY(-10deg); }
.hover-3d > div:nth-child(3):hover ~ *:first-child { transform: rotateX(10deg) rotateY(10deg); }
.hover-3d > div:nth-child(4):hover ~ *:first-child { transform: rotateX(-10deg) rotateY(-10deg); }
.hover-3d > div:nth-child(5):hover ~ *:first-child { transform: rotateX(-10deg) rotateY(10deg); }
.hover-3d > div:nth-child(6):hover ~ *:first-child { transform: rotateX(0deg) rotateY(-15deg); }
.hover-3d > div:nth-child(7):hover ~ *:first-child { transform: rotateX(0deg) rotateY(-5deg); }
.hover-3d > div:nth-child(8):hover ~ *:first-child { transform: rotateX(0deg) rotateY(5deg); }
.hover-3d > div:nth-child(9):hover ~ *:first-child { transform: rotateX(0deg) rotateY(15deg); }

/* Flag Figure */
.flag-figure {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 10px 20px -5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.hover-3d:hover .flag-figure {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.2),
    0 10px 10px -5px rgba(0, 0, 0, 0.1),
    0 25px 50px -12px rgba(0, 0, 0, 0.4);
}

.flag-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hover-3d:hover .flag-image {
  transform: scale(1.05);
}

.flag-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
}

.hover-3d:hover .flag-caption {
  opacity: 1;
  transform: translateY(0);
}

.flag-caption.forced-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (min-width: 640px) {
  .flag-caption {
    font-size: 0.75rem;
    padding: 0.75rem;
  }
}

/* List Transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
