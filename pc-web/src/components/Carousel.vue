<template>
  <div 
    class="carousel-container"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
  >
    <div class="carousel-wrapper" ref="carouselRef">
      <div
        class="carousel-slide"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: currentIndex === index }"
        :style="{ backgroundImage: `url(${slide.image})` }"
      ></div>
    </div>

    <!-- 指示器 -->
    <div class="carousel-indicators" v-if="slides.length > 1">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="indicator"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
        :aria-label="`切换到第 ${index + 1} 张`"
      ></button>
    </div>

    <!-- 左右箭头 -->
    <button
      v-if="slides.length > 1"
      class="carousel-btn carousel-btn-prev"
      @click="prevSlide"
      aria-label="上一张"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <button
      v-if="slides.length > 1"
      class="carousel-btn carousel-btn-next"
      @click="nextSlide"
      aria-label="下一张"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Slide {
  image: string
}

const props = withDefaults(
  defineProps<{
    slides?: Slide[]
    autoplay?: boolean
    interval?: number
  }>(),
  {
    slides: () => [
      {
        image: '/placeholder-carousel-1.jpg'
      }
    ],
    autoplay: true,
    interval: 5000
  }
)

const carouselRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
let autoplayTimer: number | null = null
const isPaused = ref(false)

// 预加载所有图片
const preloadImages = () => {
  props.slides.forEach((slide) => {
    const img = new Image()
    img.src = slide.image
  })
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  if (!isPaused.value) {
    resetAutoplay()
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
  if (!isPaused.value) {
    resetAutoplay()
  }
}

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.slides.length) % props.slides.length
  if (!isPaused.value) {
    resetAutoplay()
  }
}

const startAutoplay = () => {
  if (props.autoplay && !isPaused.value && props.slides.length > 1) {
    autoplayTimer = window.setInterval(() => {
      nextSlide()
    }, props.interval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

const pauseAutoplay = () => {
  isPaused.value = true
  stopAutoplay()
}

const resumeAutoplay = () => {
  isPaused.value = false
  startAutoplay()
}

onMounted(() => {
  preloadImages()
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped lang="scss">
.carousel-container {
  position: relative;
  width: 100%;
  height: 560px;
  overflow: hidden;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);

  &.active {
    opacity: 1;
    z-index: 2;
  }

  // 确保非活动状态的图片在活动图片下方
  &:not(.active) {
    z-index: 1;
    opacity: 0;
    pointer-events: none;
  }
}

// 指示器
.carousel-indicators {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-base);
  padding: 0;

  &:hover {
    border-color: rgba(255, 255, 255, 0.8);
    transform: scale(1.2);
  }

  &.active {
    width: 32px;
    background: var(--color-white);
    border-color: var(--color-white);
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.4);
  }
}

// 左右箭头
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--color-white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  z-index: 10;
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15);

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px -4px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &.carousel-btn-prev {
    left: 24px;
  }

  &.carousel-btn-next {
    right: 24px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
    border-radius: 0;
  }

  .carousel-slide {
  }

  .carousel-btn {
    width: 40px;
    height: 40px;

    &.carousel-btn-prev {
      left: 16px;
    }

    &.carousel-btn-next {
      right: 16px;
    }
  }

  .carousel-indicators {
    bottom: 16px;
  }
}
</style>

