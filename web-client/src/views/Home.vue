<template>
  <div class="home-page">
    <NavBar />
    <div class="hero-section">
      <Carousel :slides="carouselSlides" :autoplay="true" :interval="5000" />
      <div class="register-card-wrapper">
        <QuickRegister />
      </div>
    </div>
    <main class="home-content">
      <div class="container">
        <!-- 搜索栏区域 -->
        <section class="search-section">
          <div class="search-bar">
            <div class="search-left">
              <div class="search-input-group">
                <span class="search-label">我要找</span>
                <div class="gender-select-wrapper" ref="genderWrapperRef">
                  <button
                    type="button"
                    class="gender-display"
                    @click.stop="toggleGenderPanel"
                  >
                    <span class="gender-display-text">
                      {{ genderDisplayText }}
                    </span>
                    <svg class="gender-display-arrow" viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        d="M4 6l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <transition name="fade-dropdown">
                    <div
                      v-if="genderPanelVisible"
                      class="gender-dropdown"
                      @click.stop
                    >
                      <div class="gender-list">
                        <button
                          type="button"
                          class="gender-item"
                          :class="{ active: searchForm.gender === 'girlfriend' }"
                          @click="selectGender('girlfriend')"
                        >
                          女友
                        </button>
                        <button
                          type="button"
                          class="gender-item"
                          :class="{ active: searchForm.gender === 'boyfriend' }"
                          @click="selectGender('boyfriend')"
                        >
                          男友
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              <div class="age-range">
                <span class="age-label">年龄</span>
                <div class="age-select-wrapper" ref="ageWrapperRef">
                  <button
                    type="button"
                    class="age-display"
                    :class="{ 'is-placeholder': !ageDisplayText }"
                    @click.stop="toggleAgePanel"
                  >
                    <span class="age-display-text">
                      {{ ageDisplayText || '请选择年龄范围' }}
                    </span>
                    <svg class="age-display-arrow" viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        d="M4 6l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <transition name="fade-dropdown">
                    <div
                      v-if="agePanelVisible"
                      class="age-dropdown"
                      @click.stop
                    >
                      <div class="age-tabs">
                        <button
                          type="button"
                          class="age-tab"
                          :class="{ active: ageActiveTab === 'min' }"
                          @click="ageActiveTab = 'min'"
                        >
                          最小年龄
                        </button>
                        <button
                          type="button"
                          class="age-tab"
                          :class="{ active: ageActiveTab === 'max' }"
                          @click="ageActiveTab = 'max'"
                        >
                          最大年龄
                        </button>
                      </div>

                      <div class="age-list" v-if="ageActiveTab === 'min'">
                        <button
                          v-for="age in ageOptions"
                          :key="`min-${age}`"
                          type="button"
                          class="age-item"
                          :class="{ active: searchForm.ageMin === age }"
                          @click="selectAgeMin(age)"
                        >
                          {{ age }}岁
                        </button>
                      </div>

                      <div class="age-list" v-else>
                        <button
                          v-for="age in ageOptions"
                          :key="`max-${age}`"
                          type="button"
                          class="age-item"
                          :class="{ active: searchForm.ageMax === age }"
                          @click="selectAgeMax(age)"
                        >
                          {{ age }}岁
                        </button>
                      </div>

                      <div class="age-footer">
                        <div class="age-selected-text">
                          已选择：
                          <span v-if="ageDisplayText">
                            {{ ageDisplayText }}
                          </span>
                          <span v-else class="placeholder">
                            暂未选择
                          </span>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              <div class="region-group">
                <span class="region-label">地区</span>
                <div class="region-select-wrapper" ref="regionWrapperRef">
                  <button
                    type="button"
                    class="region-display"
                    :class="{ 'is-placeholder': !regionDisplayText }"
                    :aria-expanded="regionPanelVisible ? 'true' : 'false'"
                    @click.stop="toggleRegionPanel"
                  >
                    <span class="region-display-text">
                      {{ regionDisplayText || '请选择 所在地区' }}
                    </span>
                    <svg class="region-display-arrow" viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        d="M4 6l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <transition name="fade-dropdown">
                    <div
                      v-if="regionPanelVisible"
                      class="region-dropdown"
                      @click.stop
                    >
                      <div class="region-tabs">
                        <button
                          type="button"
                          class="region-tab"
                          :class="{ active: regionActiveTab === 'province' }"
                          @click="switchRegionTab('province')"
                        >
                          选择省份
                        </button>
                        <button
                          type="button"
                          class="region-tab"
                          :class="{ active: regionActiveTab === 'city', disabled: !hasCity }"
                          @click="hasCity && switchRegionTab('city')"
                        >
                          选择城市
                        </button>
                        <button
                          type="button"
                          class="region-tab"
                          :class="{ active: regionActiveTab === 'district', disabled: !hasDistrict }"
                          @click="hasDistrict && switchRegionTab('district')"
                        >
                          选择地区
                        </button>
                      </div>

                      <div class="region-list region-list--province" v-if="regionActiveTab === 'province'">
                        <button
                          v-for="province in regionOptions"
                          :key="province.code"
                          type="button"
                          class="region-item"
                          :class="{ active: selectedProvince && selectedProvince.code === province.code }"
                          @click="onSelectProvince(province)"
                        >
                          {{ province.name }}
                        </button>
                      </div>

                      <div class="region-list region-list--scroll" v-else-if="regionActiveTab === 'city'">
                        <div v-if="!selectedProvince" class="region-empty">
                          请先选择省份
                        </div>
                        <template v-else>
                          <button
                            v-for="city in selectedProvince?.children || []"
                            :key="city.code"
                            type="button"
                            class="region-item"
                            :class="{ active: selectedCity && selectedCity.code === city.code }"
                            @click="onSelectCity(city)"
                          >
                            {{ city.name }}
                          </button>
                          <div
                            v-if="!(selectedProvince.children && selectedProvince.children.length)"
                            class="region-empty"
                          >
                            该省份的城市稍后补充
                          </div>
                        </template>
                      </div>

                      <div class="region-list region-list--scroll" v-else>
                        <div v-if="!selectedCity || !hasDistrict" class="region-empty">
                          该城市暂未配置区县，可直接使用城市作为筛选条件
                        </div>
                        <template v-else>
                          <button
                            v-for="district in selectedCity?.children || []"
                            :key="district.code"
                            type="button"
                            class="region-item"
                            :class="{ active: selectedDistrict && selectedDistrict.code === district.code }"
                            @click="onSelectDistrict(district)"
                          >
                            {{ district.name }}
                          </button>
                        </template>
                      </div>

                      <div class="region-footer">
                        <div class="region-selected-text">
                          已选择：
                          <span v-if="regionDisplayText">
                            {{ regionDisplayText }}
                          </span>
                          <span v-else class="placeholder">
                            暂未选择
                          </span>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
              <label class="photo-checkbox">
                <input type="checkbox" v-model="searchForm.hasPhoto" />
                <span>有照片</span>
              </label>
              <button class="search-btn" @click="handleSearch">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>搜索</span>
              </button>
            </div>
            <div class="search-right">
              <span class="warning-text">警惕酒托/饭托/婚托借约会骗取消费</span>
              <button class="icon-btn" title="通知">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <!-- 会员卡片区域（包含标签栏和会员网格） -->
        <section class="members-card-wrapper">
          <div class="members-card">
            <!-- 导航标签栏 -->
            <div class="tabs-container">
              <div class="tabs-left">
                <template v-for="tab in tabs" :key="tab.key">
                  <!-- 推荐会员：纯文本 -->
                  <span 
                    v-if="tab.key === 'recommended'"
                    class="tab-text"
                    :class="{ active: activeTab === tab.key }"
                  >
                    {{ tab.label }}
                  </span>
                  <!-- 其他标签：可点击按钮 -->
                  <span 
                    v-else
                    class="tab-btn"
                    :class="{ active: activeTab === tab.key }"
                    @click="activeTab = tab.key"
                  >
                    {{ tab.label }}
                  </span>
                </template>
              </div>
              <button type="button" class="refresh-btn" @click="handleRefresh" :disabled="isRefreshing">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  :class="{ 'rotating': isRefreshing }"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 3v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 21v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ isRefreshing ? '刷新中...' : '刷新' }}</span>
              </button>
            </div>

            <!-- 用户卡片网格 -->
            <div class="members-grid">
              <div 
                v-for="(member, index) in members" 
                :key="index"
                class="member-card"
                @click="handleMemberClick(member)"
              >
                <div class="member-avatar"></div>
                <div class="member-info">
                  <h3 class="member-name">{{ member.name }}</h3>
                  <p class="member-details">
                    <span class="member-age">{{ member.age }}岁</span>
                    <span v-if="member.profession" class="member-profession">{{ member.profession }}</span>
                  </p>
                  <p v-if="member.location" class="member-location">{{ member.location }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧边栏 -->
      <div class="sidebar">
        <button class="sidebar-btn" title="二维码">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="5" height="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="16" y="3" width="5" height="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="16" width="5" height="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 16h-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 21v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 21v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 7v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 7h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="sidebar-btn" title="手机版">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="sidebar-btn" title="在线客服">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { areaList } from '@vant/area-data'
import NavBar from '@/components/NavBar.vue'
import Carousel from '@/components/Carousel.vue'
import QuickRegister from '@/components/QuickRegister.vue'
import pic1 from '@/assets/images/carousel/pic1.jpg'

const carouselSlides = ref([
  {
    image: pic1
  },
  {
    image: pic1
  },
  {
    image: pic1
  }
])

// 搜索表单
const searchForm = ref({
  lookingFor: '',
  gender: 'girlfriend',
  ageMin: 20,
  ageMax: 30,
  region: '',
  hasPhoto: true
})

// 地区联动数据结构
interface RegionNode {
  code: string
  name: string
  children?: RegionNode[]
}

// 使用 @vant/area-data 构建全国省市区树形数据
const buildRegionTree = (): RegionNode[] => {
  const { province_list, city_list, county_list } = areaList

  const districtMap = new Map<string, RegionNode[]>()

  Object.entries(county_list).forEach(([code, name]) => {
    const cityCode = `${code.slice(0, 4)}00`
    const list = districtMap.get(cityCode) || []
    list.push({ code, name })
    districtMap.set(cityCode, list)
  })

  const cityMap = new Map<string, RegionNode[]>()

  Object.entries(city_list).forEach(([code, name]) => {
    const provinceCode = `${code.slice(0, 2)}0000`
    const cities = cityMap.get(provinceCode) || []
    cities.push({
      code,
      name,
      children: districtMap.get(code) || []
    })
    cityMap.set(provinceCode, cities)
  })

  const provinces: RegionNode[] = []

  Object.entries(province_list).forEach(([code, name]) => {
    provinces.push({
      code,
      name,
      children: cityMap.get(code) || []
    })
  })

  return provinces
}

const regionOptions: RegionNode[] = buildRegionTree()

// 地区选择状态
const regionPanelVisible = ref(false)
const regionActiveTab = ref<'province' | 'city' | 'district'>('province')
const selectedProvince = ref<RegionNode | null>(null)
const selectedCity = ref<RegionNode | null>(null)
const selectedDistrict = ref<RegionNode | null>(null)
const regionWrapperRef = ref<HTMLElement | null>(null)

const hasCity = computed(() => !!(selectedProvince.value && selectedProvince.value.children && selectedProvince.value.children.length))
const hasDistrict = computed(() => !!(selectedCity.value && selectedCity.value.children && selectedCity.value.children.length))

const regionDisplayText = computed(() => {
  const parts: string[] = []
  if (selectedProvince.value) parts.push(selectedProvince.value.name)
  if (selectedCity.value) parts.push(selectedCity.value.name)
  if (selectedDistrict.value) parts.push(selectedDistrict.value.name)
  return parts.join(' / ')
})

const switchRegionTab = (tab: 'province' | 'city' | 'district') => {
  regionActiveTab.value = tab
}

const toggleRegionPanel = () => {
  const next = !regionPanelVisible.value
  if (next) {
    // 打开搜索栏的地区面板时，先关闭快速注册卡片的所有面板，再关闭本区域其它面板
    window.dispatchEvent(new Event('close-register-panels'))
    genderPanelVisible.value = false
    agePanelVisible.value = false
    regionActiveTab.value = 'province'
  }
  regionPanelVisible.value = next
}

const updateRegionValue = () => {
  searchForm.value.region = regionDisplayText.value
}

const onSelectProvince = (province: RegionNode) => {
  selectedProvince.value = province
  selectedCity.value = null
  selectedDistrict.value = null
  if (hasCity.value) {
    regionActiveTab.value = 'city'
  } else {
    // 如果没有城市，选完省份后自动确认
    updateRegionValue()
    regionPanelVisible.value = false
  }
}

const onSelectCity = (city: RegionNode) => {
  selectedCity.value = city
  selectedDistrict.value = null
  if (city.children && city.children.length) {
    regionActiveTab.value = 'district'
  } else {
    updateRegionValue()
    regionPanelVisible.value = false
  }
}

const onSelectDistrict = (district: RegionNode) => {
  selectedDistrict.value = district
  updateRegionValue()
  regionPanelVisible.value = false
}

const clearRegion = () => {
  selectedProvince.value = null
  selectedCity.value = null
  selectedDistrict.value = null
  searchForm.value.region = ''
}

const confirmRegion = () => {
  updateRegionValue()
  regionPanelVisible.value = false
}

// 性别选择面板
const genderPanelVisible = ref(false)
const genderWrapperRef = ref<HTMLElement | null>(null)

const genderDisplayText = computed(() => {
  return searchForm.value.gender === 'girlfriend' ? '女友' : '男友'
})

const toggleGenderPanel = () => {
  const next = !genderPanelVisible.value
  if (next) {
    window.dispatchEvent(new Event('close-register-panels'))
    regionPanelVisible.value = false
    agePanelVisible.value = false
  }
  genderPanelVisible.value = next
}

const selectGender = (value: 'girlfriend' | 'boyfriend') => {
  searchForm.value.gender = value
  genderPanelVisible.value = false
}

// 年龄选择面板
const agePanelVisible = ref(false)
const ageActiveTab = ref<'min' | 'max'>('min')
const ageWrapperRef = ref<HTMLElement | null>(null)

const ageOptions = computed(() => {
  const ages: number[] = []
  for (let i = 18; i <= 60; i++) {
    ages.push(i)
  }
  return ages
})

const ageDisplayText = computed(() => {
  if (!searchForm.value.ageMin && !searchForm.value.ageMax) return ''
  const min = searchForm.value.ageMin || 18
  const max = searchForm.value.ageMax || 60
  return `${min} ~ ${max}岁`
})

const toggleAgePanel = () => {
  const next = !agePanelVisible.value
  if (next) {
    window.dispatchEvent(new Event('close-register-panels'))
    regionPanelVisible.value = false
    genderPanelVisible.value = false
    ageActiveTab.value = 'min'
  }
  agePanelVisible.value = next
}

// 供快速注册卡片通知，关闭搜索栏所有面板
const closeSearchPanels = () => {
  regionPanelVisible.value = false
  genderPanelVisible.value = false
  agePanelVisible.value = false
}

const selectAgeMin = (age: number) => {
  searchForm.value.ageMin = age
  if (searchForm.value.ageMax && age > searchForm.value.ageMax) {
    searchForm.value.ageMax = age
  }
  ageActiveTab.value = 'max'
  validateAge()
}

const selectAgeMax = (age: number) => {
  searchForm.value.ageMax = age
  if (searchForm.value.ageMin && age < searchForm.value.ageMin) {
    searchForm.value.ageMin = age
  }
  validateAge()
  // 选完最大年龄后自动关闭面板
  if (searchForm.value.ageMin && searchForm.value.ageMax) {
    agePanelVisible.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node

  if (regionPanelVisible.value) {
    const wrapper = regionWrapperRef.value
    if (wrapper && !wrapper.contains(target)) {
      regionPanelVisible.value = false
    }
  }

  if (genderPanelVisible.value) {
    const wrapper = genderWrapperRef.value
    if (wrapper && !wrapper.contains(target)) {
      genderPanelVisible.value = false
    }
  }

  if (agePanelVisible.value) {
    const wrapper = ageWrapperRef.value
    if (wrapper && !wrapper.contains(target)) {
      agePanelVisible.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('close-search-panels', closeSearchPanels)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('close-search-panels', closeSearchPanels)
})

// 年龄验证错误
const ageError = ref({
  min: '',
  max: ''
})

// 验证年龄范围
const validateAge = () => {
  ageError.value.min = ''
  ageError.value.max = ''

  if (searchForm.value.ageMin !== null && searchForm.value.ageMin !== undefined) {
    if (searchForm.value.ageMin < 18) {
      ageError.value.min = '年龄不能小于18岁'
    } else if (searchForm.value.ageMin > 60) {
      ageError.value.min = '年龄不能大于60岁'
    }
  }

  if (searchForm.value.ageMax !== null && searchForm.value.ageMax !== undefined) {
    if (searchForm.value.ageMax < 18) {
      ageError.value.max = '年龄不能小于18岁'
    } else if (searchForm.value.ageMax > 60) {
      ageError.value.max = '年龄不能大于60岁'
    }
  }

  // 验证最小年龄不能大于最大年龄
  if (searchForm.value.ageMin && searchForm.value.ageMax && searchForm.value.ageMin > searchForm.value.ageMax) {
    if (!ageError.value.min) {
      ageError.value.min = '最小年龄不能大于最大年龄'
    }
  }
}

// 标签页
const tabs = ref([
  { key: 'recommended', label: '推荐会员' },
  { key: 'star', label: '今日之星' },
  { key: 'local', label: '同城会员' },
  { key: 'match', label: '匹配我的' },
  { key: 'vip', label: 'VIP会员' },
  { key: 'offline', label: '线下会员' },
  { key: 'more', label: '更多筛选' }
])

const activeTab = ref('star')

// 会员数据
const members = ref([
  { name: 'yyy', age: 30, profession: '设计师', location: '', avatar: '' },
  { name: '沈培鑫', age: 37, profession: '', location: '', avatar: '' },
  { name: 'd汝南公务员', age: 30, profession: '', location: '驻马店汝南县', avatar: '' },
  { name: '03年市区老师', age: 23, profession: '教师', location: '驻马店驿城区', avatar: '' },
  { name: 'd香菜-王冬冬', age: 30, profession: '', location: '驻马店驿城区', avatar: '' },
  { name: '刘盼胤', age: 33, profession: '', location: '', avatar: '' },
  { name: 'd红娘陈陈-曹伟', age: 35, profession: '', location: '', avatar: '' },
  { name: 'd02年在设计师女生', age: 24, profession: '', location: '驻马店', avatar: '' },
  { name: 'Avril', age: 24, profession: '', location: '', avatar: '' },
  { name: '臧升麟', age: 25, profession: '', location: '', avatar: '' }
])

const handleSearch = () => {
  console.log('搜索:', searchForm.value)
  // TODO: 实现搜索逻辑
}

const handleMemberClick = (member: any) => {
  console.log('点击会员:', member)
  // TODO: 跳转到会员详情页
}

// 刷新状态
const isRefreshing = ref(false)

const handleRefresh = () => {
  if (isRefreshing.value) return
  
  isRefreshing.value = true
  
  // 打乱会员列表顺序（模拟刷新）
  const shuffled = [...members.value].sort(() => Math.random() - 0.5)
  members.value = shuffled
  
  // 模拟网络请求延迟
  setTimeout(() => {
    isRefreshing.value = false
  }, 800)
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-gray-50);
}

.hero-section {
  position: relative;
  width: 100%;
  background: transparent;
}

.register-card-wrapper {
  position: absolute;
  bottom: 32px;
  right: calc((100% - 1400px) / 2 + 40px - 120px);
  z-index: 20;
  width: 400px;
  animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: visible;
  
  @media (max-width: 1400px) {
    right: calc(40px - 120px);
  }
}

.home-content {
  flex: 1;
  padding: 24px 0 40px;
  background: var(--color-gray-50);
  position: relative;
  min-height: calc(100vh - 560px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

// 搜索栏区域
.search-section {
  margin-bottom: 24px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-white);
  padding: 20px 28px;
  border-radius: var(--radius-xl);
  box-shadow: 
    0 4px 16px -4px rgba(255, 107, 157, 0.12),
    0 2px 8px -2px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 107, 157, 0.1);
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-romantic) 0%, var(--color-romantic-light) 50%, var(--color-romantic) 100%);
    opacity: 0.3;
  }
}

.search-left {
  display: flex;
  align-items: center;
  column-gap: 22px;
  row-gap: 10px;
  flex: 1;
  flex-wrap: wrap;
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.search-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-800);
  white-space: nowrap;
  letter-spacing: 0.3px;
  position: relative;
  padding-left: 4px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 14px;
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    border-radius: 2px;
    opacity: 0.6;
  }
}

// 性别选择面板
.gender-select-wrapper {
  position: relative;
}

.gender-display {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 36px 11px 16px;
  min-width: 110px;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-gray-200);
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-50) 100%);
  color: var(--color-gray-800);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &:hover {
    background: var(--color-white);
    border-color: rgba(255, 107, 157, 0.3);
    box-shadow: 
      0 2px 6px -2px rgba(255, 107, 157, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
}

.gender-display-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.gender-display-arrow {
  width: 16px;
  height: 16px;
  color: #ff6b9d;
  flex-shrink: 0;
}

.gender-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 200px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 253, 0.98) 100%);
  border-radius: var(--radius-xl);
  box-shadow:
    0 14px 40px -16px rgba(0, 0, 0, 0.2),
    0 4px 16px -8px rgba(255, 107, 157, 0.35);
  border: 1px solid rgba(255, 107, 157, 0.25);
  padding: 12px 14px;
  z-index: 30;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(255, 182, 193, 0.25), transparent 55%),
                radial-gradient(circle at bottom right, rgba(255, 192, 203, 0.18), transparent 55%);
    opacity: 0.7;
    pointer-events: none;
  }
}

.gender-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.gender-item {
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 107, 157, 0.08);
    border-color: rgba(255, 107, 157, 0.4);
    color: var(--color-romantic);
    box-shadow: 0 2px 6px -2px rgba(255, 107, 157, 0.35);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    color: #fff;
    border-color: transparent;
    box-shadow:
      0 3px 10px -3px rgba(255, 107, 157, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.7);
  }
}

.age-range {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

// 年龄选择面板
.age-select-wrapper {
  position: relative;
}

.age-display {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 36px 11px 16px;
  min-width: 180px;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-gray-200);
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-50) 100%);
  color: var(--color-gray-800);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &.is-placeholder {
    color: var(--color-gray-400);
  }

  &:hover {
    background: var(--color-white);
    border-color: rgba(255, 107, 157, 0.3);
    box-shadow: 
      0 2px 6px -2px rgba(255, 107, 157, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
}

.age-display-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.age-display-arrow {
  width: 16px;
  height: 16px;
  color: #ff6b9d;
  flex-shrink: 0;
}

.age-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 520px;
  min-width: 520px;
  max-width: calc(100vw - 40px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 253, 0.98) 100%);
  border-radius: var(--radius-xl);
  box-shadow:
    0 14px 40px -16px rgba(0, 0, 0, 0.2),
    0 4px 16px -8px rgba(255, 107, 157, 0.35);
  border: 1px solid rgba(255, 107, 157, 0.25);
  padding: 14px 22px 18px 18px;
  z-index: 30;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(255, 182, 193, 0.25), transparent 55%),
                radial-gradient(circle at bottom right, rgba(255, 192, 203, 0.18), transparent 55%);
    opacity: 0.7;
    pointer-events: none;
  }
  
  @media (max-width: 640px) {
    width: calc(100vw - 40px);
    min-width: auto;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 16px 14px;
  }
}

.age-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid rgba(248, 113, 113, 0.16);
  padding-bottom: 6px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.age-tab {
  position: relative;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gray-500);
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    color: var(--color-romantic);
    background: rgba(255, 107, 157, 0.08);

    &::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: -7px;
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
      box-shadow: 0 0 6px rgba(255, 107, 157, 0.4);
    }
  }
}

.age-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px 12px;
  padding: 4px 2px 10px;
  position: relative;
  z-index: 1;
}

.age-item {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 107, 157, 0.08);
    border-color: rgba(255, 107, 157, 0.4);
    color: var(--color-romantic);
    box-shadow: 0 2px 6px -2px rgba(255, 107, 157, 0.35);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    color: #fff;
    border-color: transparent;
    box-shadow:
      0 3px 10px -3px rgba(255, 107, 157, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.7);
  }
}

.age-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(248, 113, 113, 0.25);
  position: relative;
  z-index: 1;
}

.age-selected-text {
  font-size: 12px;
  color: var(--color-gray-600);

  .placeholder {
    color: var(--color-gray-400);
  }
}

.age-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-800);
  white-space: nowrap;
  letter-spacing: 0.3px;
  position: relative;
  padding-left: 4px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 14px;
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    border-radius: 2px;
    opacity: 0.6;
  }
}

.age-input-wrapper {
  position: relative;
  display: inline-block;
}

.age-input {
  width: 60px;
  padding: 11px 8px;
  border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-50) 100%);
  color: var(--color-gray-800);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &:focus {
    border-color: var(--color-romantic);
    background: var(--color-white);
    box-shadow: 
      0 0 0 4px rgba(255, 107, 157, 0.12),
      0 4px 12px -2px rgba(255, 107, 157, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  &:hover:not(.error) {
    background: var(--color-white);
    border-color: rgba(255, 107, 157, 0.3);
    box-shadow: 
      0 2px 6px -2px rgba(255, 107, 157, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  &.error {
    border-color: #f87171;
    background: linear-gradient(135deg, rgba(248, 113, 113, 0.06) 0%, rgba(248, 113, 113, 0.03) 100%);
    box-shadow: 
      0 0 0 3px rgba(248, 113, 113, 0.08),
      0 2px 6px -2px rgba(248, 113, 113, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.85);

    &:focus {
      border-color: #f87171;
      box-shadow: 
        0 0 0 3px rgba(248, 113, 113, 0.12),
        0 3px 10px -2px rgba(248, 113, 113, 0.18),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
  }
}

.age-error-tip {
  font-size: 11px;
  color: #f87171;
  font-weight: 500;
  white-space: nowrap;
  padding: 5px 10px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-radius: var(--radius-md);
  box-shadow: 
    0 2px 8px -2px rgba(248, 113, 113, 0.2),
    0 1px 4px rgba(248, 113, 113, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.4;
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  max-width: 180px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid rgba(248, 113, 113, 0.25);
  }

  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid rgba(255, 255, 255, 0.98);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.age-separator {
  color: var(--color-gray-500);
  font-weight: 600;
  font-size: 18px;
  padding: 0 2px;
  opacity: 0.7;
  margin-top: 11px; // 与输入框的padding-top对齐
  line-height: 1;
}

.region-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.region-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-800);
  white-space: nowrap;
  letter-spacing: 0.3px;
  position: relative;
  padding-left: 4px;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 14px;
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    border-radius: 2px;
    opacity: 0.6;
  }
}

.region-select-wrapper {
  position: relative;
}

.region-display {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px 10px 16px;
  min-width: 190px;
  max-width: 260px;
  border-radius: var(--radius-lg);
  border: 1.5px solid var(--color-gray-200);
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-50) 100%);
  color: var(--color-gray-800);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  &:hover {
    border-color: rgba(255, 107, 157, 0.4);
    box-shadow: 
      0 2px 8px -2px rgba(255, 107, 157, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }

  &.is-placeholder {
    color: var(--color-gray-400);
  }
}

.region-display-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.region-display-arrow {
  width: 16px;
  height: 16px;
  color: #ff6b9d;
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.region-select-wrapper .region-display[aria-expanded='true'] .region-display-arrow {
  transform: rotate(180deg);
}

.region-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 520px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 253, 0.98) 100%);
  border-radius: var(--radius-xl);
  box-shadow:
    0 14px 40px -16px rgba(0, 0, 0, 0.2),
    0 4px 16px -8px rgba(255, 107, 157, 0.35);
  border: 1px solid rgba(255, 107, 157, 0.25);
  padding: 14px 22px 18px 18px;
  z-index: 30;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at top left, rgba(255, 182, 193, 0.25), transparent 55%),
                radial-gradient(circle at bottom right, rgba(255, 192, 203, 0.18), transparent 55%);
    opacity: 0.7;
    pointer-events: none;
  }
}

.region-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid rgba(248, 113, 113, 0.16);
  padding-bottom: 6px;
  margin-bottom: 10px;
}

.region-tab {
  position: relative;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gray-500);
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    color: var(--color-romantic);
    background: rgba(255, 107, 157, 0.08);

    &::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: -7px;
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
      box-shadow: 0 0 6px rgba(255, 107, 157, 0.4);
    }
  }

  &.disabled {
    cursor: default;
    opacity: 0.45;
  }
}

.region-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 6px 12px;
  padding: 4px 2px 10px;
}

.region-list--province {
  /* 省份列表全部展开显示，不滚动 */
}

.region-list--scroll {
  max-height: none;
  overflow: visible;
}

.region-item {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13px;
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 107, 157, 0.08);
    border-color: rgba(255, 107, 157, 0.4);
    color: var(--color-romantic);
    box-shadow: 0 2px 6px -2px rgba(255, 107, 157, 0.35);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    color: #fff;
    border-color: transparent;
    box-shadow:
      0 3px 10px -3px rgba(255, 107, 157, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.7);
  }
}

.region-empty {
  grid-column: 1 / -1;
  padding: 10px 8px 4px;
  font-size: 12px;
  color: var(--color-gray-500);
}

.region-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(248, 113, 113, 0.25);
}

.region-selected-text {
  font-size: 12px;
  color: var(--color-gray-600);

  .placeholder {
    color: var(--color-gray-400);
  }
}

.region-footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.region-clear,
.region-confirm {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.region-clear {
  background: rgba(249, 250, 251, 0.95);
  color: var(--color-gray-500);
  border: 1px solid rgba(148, 163, 184, 0.35);

  &:hover {
    background: #fff;
    color: var(--color-gray-700);
    box-shadow: 0 2px 6px -2px rgba(148, 163, 184, 0.4);
  }
}

.region-confirm {
  background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
  color: #fff;
  box-shadow:
    0 3px 10px -3px rgba(255, 107, 157, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.7);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      0 5px 18px -6px rgba(255, 107, 157, 0.85),
      0 0 0 1px rgba(255, 255, 255, 0.8);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    box-shadow: none;
  }
}

.fade-dropdown-enter-active,
.fade-dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-dropdown-enter-from,
.fade-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.photo-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-gray-800);
  user-select: none;
  padding: 10px 16px;
  border-radius: var(--radius-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.03) 0%, rgba(255, 107, 157, 0.08) 100%);
  border: 1.5px solid rgba(255, 107, 157, 0.15);

  &:hover {
    background: linear-gradient(135deg, rgba(255, 107, 157, 0.08) 0%, rgba(255, 107, 157, 0.12) 100%);
    border-color: rgba(255, 107, 157, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px -2px rgba(255, 107, 157, 0.2);
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: var(--color-romantic);
    border-radius: var(--radius-sm);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:checked {
      box-shadow: 
        0 2px 8px rgba(255, 107, 157, 0.4),
        0 0 0 3px rgba(255, 107, 157, 0.1);
      transform: scale(1.05);
    }
  }
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 32px;
  background: linear-gradient(135deg, var(--color-romantic) 0%, #ff8bb3 50%, var(--color-romantic-light) 100%);
  border: none;
  border-radius: var(--radius-lg);
  color: var(--color-white);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px -4px rgba(255, 107, 157, 0.5),
    0 2px 10px rgba(255, 107, 157, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  svg {
    width: 19px;
    height: 19px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
    position: relative;
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 28px -6px rgba(255, 107, 157, 0.6),
      0 4px 14px rgba(255, 107, 157, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.35),
      inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    background: linear-gradient(135deg, var(--color-romantic-light) 0%, #ff8bb3 50%, var(--color-romantic) 100%);

    &::before {
      opacity: 1;
    }

    &::after {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 
      0 3px 12px -3px rgba(255, 107, 157, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
}

.search-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.warning-text {
  font-size: 13px;
  color: #dc2626;
  white-space: nowrap;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.08) 100%);
  border-radius: var(--radius-lg);
  border: 1.5px solid rgba(239, 68, 68, 0.2);
  font-weight: 600;
  letter-spacing: 0.2px;
  box-shadow: 
    0 2px 6px -2px rgba(239, 68, 68, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
    border-radius: 2px 0 0 2px;
  }
}

.icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-50) 100%);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 6px -2px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 107, 157, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  svg {
    width: 20px;
    height: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }

  &:hover {
    border-color: var(--color-romantic);
    color: var(--color-romantic);
    background: linear-gradient(135deg, rgba(255, 107, 157, 0.12) 0%, rgba(255, 107, 157, 0.08) 100%);
    box-shadow: 
      0 4px 14px -3px rgba(255, 107, 157, 0.3),
      0 2px 8px rgba(255, 107, 157, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);

    &::before {
      opacity: 1;
    }

    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 
      0 2px 8px -2px rgba(255, 107, 157, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
}

// 会员卡片区域（包含标签栏和会员网格）
.members-card-wrapper {
  margin-bottom: 40px;
}

.members-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  padding: 0;
  overflow: hidden;
}

.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 107, 157, 0.1);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 250, 253, 0.3) 100%);
}

.tabs-left {
  display: flex;
  gap: 12px;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
}

.tab-text {
  color: var(--color-gray-900);
  font-size: 22px;
  font-weight: 700;
  white-space: nowrap;
  position: relative;
  padding: 8px 16px;
  margin-right: 24px;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.08) 0%, rgba(255, 143, 179, 0.05) 100%);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-romantic);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px -2px rgba(255, 107, 157, 0.15);

  &::before {
    content: '⭐';
    font-size: 18px;
    line-height: 1;
  }

  &.active {
    /* 推荐会员是标题，这里不需要额外状态样式 */
  }
}

.tab-btn {
  color: var(--color-gray-700);
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  background: rgba(255, 107, 157, 0.05);
  border-radius: var(--radius-lg);
  letter-spacing: 0.2px;
  box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.05);

  &:hover {
    color: var(--color-romantic);
    background: rgba(255, 107, 157, 0.12);
    border-color: rgba(255, 107, 157, 0.2);
    transform: translateY(-2px);
    box-shadow: 
      0 2px 8px -2px rgba(255, 107, 157, 0.25),
      0 1px 4px rgba(255, 107, 157, 0.1);
  }

  &.active {
    color: var(--color-white);
    font-weight: 600;
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    border-color: transparent;
    box-shadow: 
      0 3px 12px -3px rgba(255, 107, 157, 0.5),
      0 1px 6px rgba(255, 107, 157, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
    
    &::after {
      display: none;
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 
    0 2px 8px -2px rgba(255, 107, 157, 0.4),
    0 1px 4px rgba(255, 107, 157, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.rotating {
      animation: rotate 1s linear infinite;
    }
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--color-romantic-dark) 0%, var(--color-romantic) 100%);
    box-shadow: 
      0 4px 14px -3px rgba(255, 107, 157, 0.5),
      0 2px 8px rgba(255, 107, 157, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 
      0 2px 6px -2px rgba(255, 107, 157, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 会员卡片网格
.members-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  padding: 32px;
}

.member-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 250, 253, 0.95) 100%);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 12px -4px rgba(0, 0, 0, 0.08),
    0 4px 20px -8px rgba(255, 107, 157, 0.12),
    0 0 0 1px rgba(255, 107, 157, 0.04);
  border: 1px solid rgba(255, 107, 157, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-romantic) 0%, var(--color-romantic-light) 50%, var(--color-romantic) 100%);
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 107, 157, 0.06) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 8px 24px -6px rgba(0, 0, 0, 0.12),
      0 12px 40px -10px rgba(255, 107, 157, 0.2),
      0 0 0 1px rgba(255, 107, 157, 0.12);
    border-color: rgba(255, 107, 157, 0.15);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 1;
    }

    .member-avatar {
      transform: scale(1.05);
      box-shadow: 
        0 8px 24px -4px rgba(255, 107, 157, 0.3),
        0 4px 12px -2px rgba(255, 107, 157, 0.2);
    }

    .member-name {
      color: var(--color-romantic);
      transform: translateY(-1px);
    }

    .member-age {
      transform: translateY(-1px);
      box-shadow: 
        0 4px 12px -3px rgba(255, 107, 157, 0.5),
        0 2px 6px rgba(255, 107, 157, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
    }

    .member-profession {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.03) 100%);
      box-shadow: 
        0 2px 6px -2px rgba(0, 0, 0, 0.12),
        0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    .member-location {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.035) 0%, rgba(0, 0, 0, 0.025) 100%);
      box-shadow: 
        0 2px 5px -1px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(0, 0, 0, 0.04);
    }
  }
}

.member-avatar {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 16px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.08) 0%, rgba(255, 143, 179, 0.05) 100%);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px -4px rgba(255, 107, 157, 0.15),
    0 2px 8px -2px rgba(255, 107, 157, 0.1);
  border: 1px solid rgba(255, 107, 157, 0.08);
}

.member-info {
  width: 100%;
  position: relative;
  z-index: 1;
}

.member-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  line-height: 1.4;
}

.member-details {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.member-age {
  color: var(--color-white);
  font-weight: 600;
  font-size: 14px;
  padding: 6px 14px;
  background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
  border-radius: 16px;
  display: inline-block;
  box-shadow: 
    0 2px 8px -2px rgba(255, 107, 157, 0.4),
    0 1px 4px rgba(255, 107, 157, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.member-profession {
  color: var(--color-gray-700);
  font-weight: 500;
  font-size: 13px;
  padding: 5px 12px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.02) 100%);
  border-radius: 14px;
  display: inline-block;
  box-shadow: 
    0 1px 4px -1px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.member-location {
  font-size: 12px;
  color: var(--color-gray-600);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 8px;
  padding: 5px 12px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.025) 0%, rgba(0, 0, 0, 0.015) 100%);
  border-radius: 12px;
  display: inline-block;
  box-shadow: 
    0 1px 3px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 100%;
}

// 右侧边栏
.sidebar {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 100;
}

.sidebar-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-white);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    border-color: var(--color-romantic);
    color: var(--color-romantic);
    background: rgba(255, 107, 157, 0.05);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .container {
    padding: 0 32px;
  }

  .members-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 28px;
  }
}

@media (max-width: 1200px) {
  .register-card-wrapper {
    right: calc(32px - 100px);
    width: 380px;
    bottom: 28px;
  }

  .container {
    padding: 0 24px;
  }

  .search-left {
    flex-wrap: wrap;
    gap: 12px;
  }

  .members-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 24px;
  }

  .member-avatar {
    margin-bottom: 14px;
  }

  .member-name {
    font-size: 16px;
  }

  .tabs-left {
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tab-text {
    font-size: 18px;
    padding: 6px 12px;
    margin-right: 16px;
    
    &::before {
      font-size: 16px;
    }
  }

  .tab-btn {
    font-size: 14px;
    padding: 8px 16px;
  }
}

@media (max-width: 992px) {
  .register-card-wrapper {
    position: static;
    transform: none;
    width: 100%;
    max-width: 500px;
    margin: -80px auto 0;
    padding: 0 24px;
    right: auto;
  }

  .home-content {
    padding: 20px 0 40px;
  }

  .search-bar {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .search-right {
    width: 100%;
    justify-content: space-between;
  }

  .members-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 20px;
  }

  .member-card {
    padding: 18px;
  }

  .member-avatar {
    margin-bottom: 12px;
  }

  .member-name {
    font-size: 15px;
  }

  .sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .home-content {
    padding: 16px 0 32px;
  }

  .container {
    padding: 0 16px;
  }

  .search-bar {
    padding: 16px;
    border-radius: var(--radius-lg);
  }

  .search-left {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 16px;
  }

  .search-input-group {
    width: 100%;
    flex-wrap: wrap;
  }

  .search-select {
    flex: 1;
    min-width: 120px;
  }

  .age-range {
    width: 100%;
    justify-content: space-between;
  }

  .age-input-wrapper {
    flex: 1;
    max-width: 80px;
  }

  .age-input {
    width: 100%;
  }

  .age-separator {
    margin-top: 11px;
  }

  .region-group {
    width: 100%;
    flex-wrap: wrap;
  }

  .region-select {
    flex: 1;
    min-width: 120px;
  }

  .photo-checkbox {
    width: 100%;
    justify-content: center;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
    padding: 14px 28px;
  }

  .search-right {
    width: 100%;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .warning-text {
    text-align: center;
    width: 100%;
  }

  .icon-btn {
    width: 100%;
    justify-content: center;
  }

  .tabs-container {
    padding: 0 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .tabs-left {
    width: 100%;
    gap: 8px;
    overflow-x: auto;
  }

  .refresh-btn {
    width: 100%;
    justify-content: center;
  }

  .members-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .member-card {
    padding: 24px 20px;
  }

  .member-avatar {
    margin-bottom: 16px;
    max-width: 280px;
    margin-left: auto;
    margin-right: auto;
  }

  .member-name {
    font-size: 16px;
  }
}

// 特色服务区域
.features-section {
  margin-bottom: 100px;
  animation: fadeInUp 0.8s ease-out;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 60px;
  color: var(--color-gray-900);
  position: relative;
  display: inline-block;
  width: 100%;

  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    border-radius: var(--radius-full);
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 60px;
}

.feature-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  text-align: center;
  transition: all var(--transition-base);
  box-shadow: 
    0 4px 16px -4px rgba(255, 107, 157, 0.08),
    0 2px 8px rgba(255, 107, 157, 0.04);
  border: 1px solid rgba(255, 107, 157, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 12px 32px -8px rgba(255, 107, 157, 0.15),
      0 4px 16px rgba(255, 107, 157, 0.08);
    border-color: rgba(255, 107, 157, 0.2);

    &::before {
      opacity: 1;
    }

    .feature-icon {
      transform: scale(1.1) rotate(5deg);
      background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
      color: var(--color-white);
    }
  }
}

.feature-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 143, 179, 0.1) 100%);
  border-radius: var(--radius-xl);
  color: var(--color-romantic);
  transition: all var(--transition-base);
  box-shadow: 0 4px 12px -2px rgba(255, 107, 157, 0.1);

  svg {
    width: 36px;
    height: 36px;
  }
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-gray-900);
}

.feature-desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-gray-600);
}

// 成功案例区域
.success-section {
  margin-bottom: 80px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.success-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 60px;
}

.success-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: 32px;
  display: flex;
  gap: 20px;
  transition: all var(--transition-base);
  box-shadow: 
    0 4px 16px -4px rgba(255, 107, 157, 0.08),
    0 2px 8px rgba(255, 107, 157, 0.04);
  border: 1px solid rgba(255, 107, 157, 0.08);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255, 107, 157, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 12px 32px -8px rgba(255, 107, 157, 0.15),
      0 4px 16px rgba(255, 107, 157, 0.08);
    border-color: rgba(255, 107, 157, 0.2);
  }
}

.success-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-size: 24px;
  font-weight: 600;
  box-shadow: 0 4px 12px -2px rgba(255, 107, 157, 0.3);
}

.success-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.success-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-gray-900);
}

.success-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-gray-600);
  margin-bottom: 12px;
}

.success-tag {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(255, 143, 179, 0.1) 100%);
  border-radius: var(--radius-full);
  font-size: 12px;
  color: var(--color-romantic);
  font-weight: 500;
  border: 1px solid rgba(255, 107, 157, 0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .register-card-wrapper {
    right: calc(32px - 100px);
    width: 380px;
    bottom: 28px;
  }

  .container {
    padding: 0 32px;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 24px;
  }

  .success-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 992px) {
  .register-card-wrapper {
    position: static;
    transform: none;
    width: 100%;
    max-width: 500px;
    margin: -80px auto 0;
    padding: 0 24px;
    right: auto;
  }

  .home-content {
    padding: 60px 0;
  }

  .section-title {
    font-size: 32px;
    margin-bottom: 48px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .success-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .home-content {
    padding: 40px 0;
  }

  .register-card-wrapper {
    margin: -60px auto 0;
    padding: 0 16px;
  }

  .container {
    padding: 0 24px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 40px;
  }

  .features-section,
  .success-section {
    margin-bottom: 60px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 40px;
  }

  .success-grid {
    margin-top: 40px;
  }

  .feature-card {
    padding: 28px 20px;
  }

  .feature-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;

    svg {
      width: 32px;
      height: 32px;
    }
  }

  .success-card {
    padding: 24px;
    flex-direction: column;
    text-align: center;
  }

  .avatar-placeholder {
    margin: 0 auto;
  }
}
</style>

