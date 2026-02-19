<template>
  <div class="quick-register-card">
    <div class="card-header">
      <h3 class="card-title">1分钟快速注册，幸福一辈子...</h3>
    </div>

    <form class="register-form" @submit.prevent="handleSubmit">
      <!-- 性别选择 -->
      <div class="form-group">
        <label class="form-label">性别</label>
        <div class="radio-group">
          <label class="radio-item" :class="{ active: formData.gender === 'male' }">
            <input
              type="radio"
              name="gender"
              value="male"
              v-model="formData.gender"
              class="radio-input"
            />
            <span class="radio-label">男</span>
          </label>
          <label class="radio-item" :class="{ active: formData.gender === 'female' }">
            <input
              type="radio"
              name="gender"
              value="female"
              v-model="formData.gender"
              class="radio-input"
            />
            <span class="radio-label">女</span>
          </label>
        </div>
      </div>

      <!-- 生日选择 -->
      <div class="form-group">
        <label class="form-label">生日</label>
        <div class="birth-select-wrapper" ref="birthWrapperRef">
          <button
            type="button"
            class="birth-display"
            :class="{ 'is-placeholder': !birthdayDisplayText }"
            @click.stop="toggleBirthPanel"
          >
            <span class="birth-display-text">
              {{ birthdayDisplayText || '请选择出生年月日' }}
            </span>
            <svg class="birth-display-arrow" viewBox="0 0 16 16" aria-hidden="true">
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
              v-if="birthPanelVisible"
              class="birth-dropdown"
              @click.stop
            >
              <div class="birth-tabs">
                <button
                  type="button"
                  class="birth-tab"
                  :class="{ active: birthActiveTab === 'year' }"
                  @click="birthActiveTab = 'year'"
                >
                  选择年
                </button>
                <button
                  type="button"
                  class="birth-tab"
                  :class="{ active: birthActiveTab === 'month' }"
                  @click="birthActiveTab = 'month'"
                >
                  选择月
                </button>
                <button
                  type="button"
                  class="birth-tab"
                  :class="{ active: birthActiveTab === 'day' }"
                  @click="birthActiveTab = 'day'"
                >
                  选择日
                </button>
              </div>

              <!-- 年份面板 -->
              <div v-if="birthActiveTab === 'year'" class="birth-year-list">
                <div
                  v-for="group in birthYearGroups"
                  :key="group.label"
                  class="birth-year-row"
                >
                  <span class="birth-year-label">{{ group.label }}</span>
                  <div class="birth-year-grid">
                    <button
                      v-for="year in group.years"
                      :key="year"
                      type="button"
                      class="birth-item"
                      :class="{ active: selectedYear === year }"
                      @click="selectYear(year)"
                    >
                      {{ year }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- 月份面板 -->
              <div v-else-if="birthActiveTab === 'month'" class="birth-grid birth-grid--month">
                <button
                  v-for="month in 12"
                  :key="month"
                  type="button"
                  class="birth-item"
                  :class="{ active: selectedMonth === month }"
                  @click="selectMonth(month)"
                >
                  {{ month }}月
                </button>
              </div>

              <!-- 日期面板 -->
              <div v-else class="birth-grid birth-grid--day">
                <button
                  v-for="day in birthDays"
                  :key="day"
                  type="button"
                  class="birth-item"
                  :class="{ active: selectedDay === day }"
                  @click="selectDay(day)"
                >
                  {{ day }}日
                </button>
              </div>

              <div class="birth-footer">
                <div class="birth-selected-text">
                  已选择：
                  <span v-if="birthdayDisplayText">
                    {{ birthdayDisplayText }}
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

      <!-- 地区选择 -->
      <div class="form-group">
        <label class="form-label">地区</label>
        <div class="qr-region-wrapper" ref="qrRegionWrapperRef">
          <button
            type="button"
            class="qr-region-display"
            :class="{ 'is-placeholder': !qrRegionDisplayText }"
            @click.stop="toggleQrRegionPanel"
          >
            <span class="qr-region-display-text">
              {{ qrRegionDisplayText || '请选择所在地区' }}
            </span>
            <svg class="qr-region-display-arrow" viewBox="0 0 16 16" aria-hidden="true">
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
              v-if="qrRegionPanelVisible"
              class="qr-region-dropdown"
              @click.stop
            >
              <div class="qr-region-tabs">
                <button
                  type="button"
                  class="qr-region-tab"
                  :class="{ active: qrRegionActiveTab === 'province' }"
                  @click="switchQrRegionTab('province')"
                >
                  选择省份
                </button>
                <button
                  type="button"
                  class="qr-region-tab"
                  :class="{ active: qrRegionActiveTab === 'city', disabled: !qrHasCity }"
                  @click="qrHasCity && switchQrRegionTab('city')"
                >
                  选择城市
                </button>
                <button
                  type="button"
                  class="qr-region-tab"
                  :class="{ active: qrRegionActiveTab === 'district', disabled: !qrHasDistrict }"
                  @click="qrHasDistrict && switchQrRegionTab('district')"
                >
                  选择地区
                </button>
              </div>

              <div class="qr-region-list qr-region-list--province" v-if="qrRegionActiveTab === 'province'">
                <button
                  v-for="province in qrRegionOptions"
                  :key="province.code"
                  type="button"
                  class="qr-region-item"
                  :class="{ active: qrSelectedProvince && qrSelectedProvince.code === province.code }"
                  @click="onSelectQrProvince(province)"
                >
                  {{ province.name }}
                </button>
              </div>

              <div class="qr-region-list qr-region-list--scroll" v-else-if="qrRegionActiveTab === 'city'">
                <div v-if="!qrSelectedProvince" class="qr-region-empty">
                  请先选择省份
                </div>
                <template v-else>
                  <button
                    v-for="city in qrSelectedProvince?.children || []"
                    :key="city.code"
                    type="button"
                    class="qr-region-item"
                    :class="{ active: qrSelectedCity && qrSelectedCity.code === city.code }"
                    @click="onSelectQrCity(city)"
                  >
                    {{ city.name }}
                  </button>
                  <div
                    v-if="!(qrSelectedProvince.children && qrSelectedProvince.children.length)"
                    class="qr-region-empty"
                  >
                    该省份的城市稍后补充
                  </div>
                </template>
              </div>

              <div class="qr-region-list qr-region-list--scroll" v-else>
                <div v-if="!qrSelectedCity || !qrHasDistrict" class="qr-region-empty">
                  该城市暂未配置区县，可直接使用城市作为筛选条件
                </div>
                <template v-else>
                  <button
                    v-for="district in qrSelectedCity?.children || []"
                    :key="district.code"
                    type="button"
                    class="qr-region-item"
                    :class="{ active: qrSelectedDistrict && qrSelectedDistrict.code === district.code }"
                    @click="onSelectQrDistrict(district)"
                  >
                    {{ district.name }}
                  </button>
                </template>
              </div>

              <div class="qr-region-footer">
                <div class="qr-region-selected-text">
                  已选择：
                  <span v-if="qrRegionDisplayText">
                    {{ qrRegionDisplayText }}
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

      <!-- 婚况选择 -->
      <div class="form-group">
        <label class="form-label">婚况</label>
        <div class="marital-select-wrapper" ref="maritalWrapperRef">
          <button
            type="button"
            class="marital-display"
            :class="{ 'is-placeholder': !maritalDisplayText }"
            @click.stop="toggleMaritalPanel"
          >
            <span class="marital-display-text">
              {{ maritalDisplayText || '请选择婚姻状况' }}
            </span>
            <svg class="marital-display-arrow" viewBox="0 0 16 16" aria-hidden="true">
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
              v-if="maritalPanelVisible"
              class="marital-dropdown"
              @click.stop
            >
              <div class="marital-list">
                <button
                  v-for="option in maritalOptions"
                  :key="option.value"
                  type="button"
                  class="marital-item"
                  :class="{ active: formData.maritalStatus === option.value }"
                  @click="selectMaritalStatus(option.value)"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button type="submit" class="submit-btn">
        <span>快速注册</span>
        <svg
          class="arrow-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { areaList } from '@vant/area-data'

const router = useRouter()

const formData = ref({
  gender: 'female',
  birthday: '',
  region: '',
  maritalStatus: ''
})

// 生日面板状态
type BirthTab = 'year' | 'month' | 'day'

const birthPanelVisible = ref(false)
const birthActiveTab = ref<BirthTab>('year')
const selectedYear = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)
const selectedDay = ref<number | null>(null)
const birthWrapperRef = ref<HTMLElement | null>(null)

interface BirthYearGroup {
  label: string
  years: number[]
}

// 生成年份分组：动态计算18-60岁之间的年份，按年代分组
const birthYearGroups = computed<BirthYearGroup[]>(() => {
  const currentYear = new Date().getFullYear()
  const minAge = 18
  const maxAge = 60
  const startYear = currentYear - maxAge // 最大60岁
  const endYear = currentYear - minAge // 最小18岁

  // 动态创建分组，只包含有数据的年代
  const groupsMap = new Map<string, number[]>()
  
  for (let year = endYear; year >= startYear; year--) {
    let label = ''
    if (year >= 2000) {
      label = '00后'
    } else if (year >= 1990) {
      label = '90后'
    } else if (year >= 1980) {
      label = '80后'
    } else if (year >= 1970) {
      label = '70后'
    } else if (year >= 1960) {
      label = '60后'
    } else {
      label = '50后'
    }
    
    if (!groupsMap.has(label)) {
      groupsMap.set(label, [])
    }
    groupsMap.get(label)!.push(year)
  }

  // 转换为数组格式，保持顺序
  const groups: BirthYearGroup[] = []
  const order = ['00后', '90后', '80后', '70后', '60后', '50后']
  order.forEach(label => {
    if (groupsMap.has(label) && groupsMap.get(label)!.length > 0) {
      groups.push({
        label,
        years: groupsMap.get(label)!
      })
    }
  })

  return groups
})

// 当前月份的天数列表
const birthDays = computed<number[]>(() => {
  const y = selectedYear.value || 1990
  const m = selectedMonth.value || 1
  const total = new Date(y, m, 0).getDate()
  const days: number[] = []
  for (let d = 1; d <= total; d++) {
    days.push(d)
  }
  return days
})

const birthdayDisplayText = computed(() => {
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${selectedYear.value}年${pad(selectedMonth.value)}月${pad(selectedDay.value)}日`
})

const toggleBirthPanel = () => {
  const next = !birthPanelVisible.value
  // 如果要打开本面板，先关闭搜索栏的所有面板，并关闭本卡片内其它面板
  if (next) {
    window.dispatchEvent(new Event('close-search-panels'))
    qrRegionPanelVisible.value = false
    maritalPanelVisible.value = false
    birthActiveTab.value = 'year'
  }
  birthPanelVisible.value = next
}

const selectYear = (year: number) => {
  selectedYear.value = year
  if (!selectedMonth.value) {
    birthActiveTab.value = 'month'
  }
}

const selectMonth = (month: number) => {
  selectedMonth.value = month
  if (!selectedYear.value) {
    // 如果还没选年份，默认选一个中间值，方便用户
    const midGroup = birthYearGroups.value[2]
    selectedYear.value = midGroup?.years?.[Math.floor(midGroup.years.length / 2)] || 1990
  }
  birthActiveTab.value = 'day'
}

const selectDay = (day: number) => {
  selectedDay.value = day
  // 选完日期后自动确认
  if (selectedYear.value && selectedMonth.value && selectedDay.value) {
    confirmBirthday()
  }
}

const confirmBirthday = () => {
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) return
  const pad = (n: number) => n.toString().padStart(2, '0')
  formData.value.birthday = `${selectedYear.value}-${pad(selectedMonth.value)}-${pad(selectedDay.value)}`
  birthPanelVisible.value = false
}

// 快速注册地区面板（省市区三级联动）
interface QrRegionNode {
  code: string
  name: string
  children?: QrRegionNode[]
}

// 使用 @vant/area-data 构建全国省市区树形数据
const buildQrRegionTree = (): QrRegionNode[] => {
  const { province_list, city_list, county_list } = areaList

  const districtMap = new Map<string, QrRegionNode[]>()

  Object.entries(county_list).forEach(([code, name]) => {
    const cityCode = `${code.slice(0, 4)}00`
    const list = districtMap.get(cityCode) || []
    list.push({ code, name })
    districtMap.set(cityCode, list)
  })

  const cityMap = new Map<string, QrRegionNode[]>()

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

  const provinces: QrRegionNode[] = []

  Object.entries(province_list).forEach(([code, name]) => {
    provinces.push({
      code,
      name,
      children: cityMap.get(code) || []
    })
  })

  return provinces
}

const qrRegionOptions: QrRegionNode[] = buildQrRegionTree()

// 地区选择状态
const qrRegionPanelVisible = ref(false)
const qrRegionActiveTab = ref<'province' | 'city' | 'district'>('province')
const qrSelectedProvince = ref<QrRegionNode | null>(null)
const qrSelectedCity = ref<QrRegionNode | null>(null)
const qrSelectedDistrict = ref<QrRegionNode | null>(null)
const qrRegionWrapperRef = ref<HTMLElement | null>(null)

const qrHasCity = computed(() => !!(qrSelectedProvince.value && qrSelectedProvince.value.children && qrSelectedProvince.value.children.length))
const qrHasDistrict = computed(() => !!(qrSelectedCity.value && qrSelectedCity.value.children && qrSelectedCity.value.children.length))

const qrRegionDisplayText = computed(() => {
  const parts: string[] = []
  if (qrSelectedProvince.value) parts.push(qrSelectedProvince.value.name)
  if (qrSelectedCity.value) parts.push(qrSelectedCity.value.name)
  if (qrSelectedDistrict.value) parts.push(qrSelectedDistrict.value.name)
  return parts.join(' / ')
})

const switchQrRegionTab = (tab: 'province' | 'city' | 'district') => {
  qrRegionActiveTab.value = tab
}

const toggleQrRegionPanel = () => {
  const next = !qrRegionPanelVisible.value
  if (next) {
    window.dispatchEvent(new Event('close-search-panels'))
    birthPanelVisible.value = false
    maritalPanelVisible.value = false
    qrRegionActiveTab.value = 'province'
  }
  qrRegionPanelVisible.value = next
}

const updateQrRegionValue = () => {
  formData.value.region = qrRegionDisplayText.value
}

const onSelectQrProvince = (province: QrRegionNode) => {
  qrSelectedProvince.value = province
  qrSelectedCity.value = null
  qrSelectedDistrict.value = null
  if (qrHasCity.value) {
    qrRegionActiveTab.value = 'city'
  } else {
    // 如果没有城市，选完省份后自动确认
    updateQrRegionValue()
    qrRegionPanelVisible.value = false
  }
}

const onSelectQrCity = (city: QrRegionNode) => {
  qrSelectedCity.value = city
  qrSelectedDistrict.value = null
  if (city.children && city.children.length) {
    qrRegionActiveTab.value = 'district'
  } else {
    updateQrRegionValue()
    qrRegionPanelVisible.value = false
  }
}

const onSelectQrDistrict = (district: QrRegionNode) => {
  qrSelectedDistrict.value = district
  updateQrRegionValue()
  qrRegionPanelVisible.value = false
}

const clearQrRegion = () => {
  qrSelectedProvince.value = null
  qrSelectedCity.value = null
  qrSelectedDistrict.value = null
  formData.value.region = ''
}

const confirmQrRegion = () => {
  updateQrRegionValue()
  qrRegionPanelVisible.value = false
}

// 婚况选择面板
interface MaritalOption {
  value: string
  label: string
}

const maritalOptions: MaritalOption[] = [
  { value: 'single', label: '未婚' },
  { value: 'divorced', label: '离异' },
  { value: 'widowed', label: '丧偶' }
]

const maritalPanelVisible = ref(false)
const maritalWrapperRef = ref<HTMLElement | null>(null)

const maritalDisplayText = computed(() => {
  const option = maritalOptions.find(opt => opt.value === formData.value.maritalStatus)
  return option ? option.label : ''
})

const toggleMaritalPanel = () => {
  const next = !maritalPanelVisible.value
  if (next) {
    window.dispatchEvent(new Event('close-search-panels'))
    birthPanelVisible.value = false
    qrRegionPanelVisible.value = false
  }
  maritalPanelVisible.value = next
}

// 供外部（如首页搜索栏）关闭快速注册所有面板
const closeRegisterPanels = () => {
  birthPanelVisible.value = false
  qrRegionPanelVisible.value = false
  maritalPanelVisible.value = false
}

const selectMaritalStatus = (value: string) => {
  formData.value.maritalStatus = value
  maritalPanelVisible.value = false
}

// 点击面板外关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node

  if (birthPanelVisible.value) {
    const birthWrapper = birthWrapperRef.value
    if (birthWrapper && !birthWrapper.contains(target)) {
      birthPanelVisible.value = false
    }
  }

  if (qrRegionPanelVisible.value) {
    const regionWrapper = qrRegionWrapperRef.value
    if (regionWrapper && !regionWrapper.contains(target)) {
      qrRegionPanelVisible.value = false
    }
  }

  if (maritalPanelVisible.value) {
    const maritalWrapper = maritalWrapperRef.value
    if (maritalWrapper && !maritalWrapper.contains(target)) {
      maritalPanelVisible.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('close-register-panels', closeRegisterPanels)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('close-register-panels', closeRegisterPanels)
})

const handleSubmit = () => {
  // 这里可以添加表单验证和提交逻辑
  console.log('注册数据:', formData.value)
  // 可以跳转到注册页面或调用API
  router.push('/register')
}
</script>

<style scoped lang="scss">
.quick-register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px) saturate(180%);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 
    0 24px 64px -12px rgba(255, 107, 157, 0.2),
    0 8px 32px -8px rgba(255, 107, 157, 0.15),
    0 2px 12px rgba(255, 107, 157, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      #ff6b9d 0%,
      #ff8fb3 50%,
      #ffb3d1 100%
    );
    border-radius: 24px 24px 0 0;
    z-index: 1;
    overflow: hidden;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(
      circle,
      rgba(255, 107, 157, 0.06) 0%,
      transparent 70%
    );
    pointer-events: none;
    border-radius: 50%;
    z-index: 0;
    overflow: hidden;
  }
}

@keyframes shimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.card-header {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 107, 157, 0.1);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b9d;
  line-height: 1.5;
  margin: 0;
  letter-spacing: 0.2px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #a8556f;
  margin-bottom: 0;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

// 单选按钮组
.radio-group {
  display: flex;
  gap: 12px;
}

.radio-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border: 1.5px solid #fce7f3;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 1px 3px rgba(255, 107, 157, 0.06);

  .radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .radio-label {
    font-size: 15px;
    font-weight: 500;
    color: #a8556f;
    transition: all 0.3s ease;
  }

  &:hover {
    border-color: #ffb3d1;
    background: rgba(255, 179, 209, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px -2px rgba(255, 107, 157, 0.15);
  }

  &.active {
    border-color: #ff6b9d;
    background: linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%);
    box-shadow: 
      0 6px 20px -4px rgba(255, 107, 157, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);

    .radio-label {
      color: #ffffff;
      font-weight: 600;
    }
  }
}

// 下拉选择框
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #fce7f3;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  color: #a8556f;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath fill='%23ff6b9d' d='M7 10L2 5h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  box-shadow: 0 1px 3px rgba(255, 107, 157, 0.06);

  &:hover {
    border-color: #ffb3d1;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px -2px rgba(255, 107, 157, 0.15);
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    border-color: #ff6b9d;
    box-shadow: 
      0 0 0 3px rgba(255, 107, 157, 0.1),
      0 4px 12px -2px rgba(255, 107, 157, 0.2);
    transform: translateY(-2px);
  }

  &:disabled {
    color: var(--color-gray-400);
    background-color: var(--color-gray-50);
    cursor: not-allowed;
    box-shadow: none;
  }
}

// 生日下拉与地区下拉通用动画
.fade-dropdown-enter-active,
.fade-dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-dropdown-enter-from,
.fade-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// 生日选择面板
.birth-select-wrapper {
  position: relative;
}

.birth-display {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #fce7f3;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  color: #a8556f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(255, 107, 157, 0.06);

  &.is-placeholder {
    color: #c4a4b5;
  }

  &:hover {
    border-color: #ffb3d1;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px -2px rgba(255, 107, 157, 0.15);
    transform: translateY(-2px);
  }
}

.birth-display-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.birth-display-arrow {
  width: 16px;
  height: 16px;
  color: #ff6b9d;
  flex-shrink: 0;
}

.birth-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 580px;
  min-width: 580px;
  max-width: calc(100vw - 40px);
  background: linear-gradient(135deg, #ffffff 0%, #fff5fa 100%);
  border-radius: 16px;
  box-shadow:
    0 18px 40px -16px rgba(255, 107, 157, 0.35),
    0 6px 20px -10px rgba(148, 27, 89, 0.35);
  border: 1px solid rgba(255, 172, 203, 0.7);
  padding: 18px 22px 16px;
  z-index: 2000; // 高于右侧侧边栏及其气泡
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  
  @media (max-width: 640px) {
    width: calc(100vw - 40px);
    min-width: auto;
    left: 50%;
    transform: translateX(-50%);
    padding: 16px 18px 14px;
  }
}

.birth-tabs {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid rgba(248, 113, 113, 0.16);
  padding-bottom: 8px;
  margin-bottom: 14px;
}

.birth-tab {
  position: relative;
  padding: 4px 14px;
  font-size: 14px;
  font-weight: 600;
  color: #9f8a96;
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;

  &.active {
    color: #ff6b9d;
    background: rgba(255, 107, 157, 0.08);

    &::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: -7px;
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, #ff6b9d 0%, #ff8fb3 100%);
      box-shadow: 0 0 6px rgba(255, 107, 157, 0.5);
    }
  }
}

.birth-year-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 4px 0 2px;
  max-height: 420px;
  overflow-y: auto;
  
  // 隐藏滚动条但保留滚动功能
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.birth-year-row {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.birth-year-label {
  width: 50px;
  text-align: right;
  font-size: 13px;
  color: #d1b9c4;
  font-weight: 500;
  padding-top: 4px;
  flex-shrink: 0;
  letter-spacing: 0.3px;
}

.birth-year-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px 16px;
}

.birth-grid {
  display: grid;
  gap: 10px 14px;
  margin-top: 6px;
}

.birth-grid--month {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.birth-grid--day {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.birth-item {
  padding: 7px 6px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #6b4b5a;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
  min-width: 48px;

  &:hover {
    background: rgba(255, 107, 157, 0.08);
    border-color: rgba(255, 107, 157, 0.4);
    color: #ff4f8b;
    box-shadow: 0 2px 6px -2px rgba(255, 107, 157, 0.35);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%);
    color: #fff;
    border-color: transparent;
    box-shadow:
      0 3px 10px -3px rgba(255, 107, 157, 0.7),
      0 0 0 1px rgba(255, 255, 255, 0.7);
  }
}

.birth-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed rgba(248, 113, 113, 0.25);
}

.birth-selected-text {
  font-size: 13px;
  color: #9f8a96;
  font-weight: 500;

  .placeholder {
    color: #c4a4b5;
  }
}

.birth-confirm {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%);
  color: #fff;
  box-shadow:
    0 3px 10px -3px rgba(255, 107, 157, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      0 5px 16px -6px rgba(255, 107, 157, 0.85),
      0 0 0 1px rgba(255, 255, 255, 0.8);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
    box-shadow: none;
  }
}

// 快速注册地区选择面板（省份）
.qr-region-wrapper {
  position: relative;
}

.qr-region-display {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #fce7f3;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  color: #a8556f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(255, 107, 157, 0.06);

  &.is-placeholder {
    color: #c4a4b5;
  }

  &:hover {
    border-color: #ffb3d1;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px -2px rgba(255, 107, 157, 0.15);
    transform: translateY(-2px);
  }
}

.qr-region-display-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.qr-region-display-arrow {
  width: 16px;
  height: 16px;
  color: #ff6b9d;
  flex-shrink: 0;
}

.qr-region-dropdown {
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
  z-index: 2000; // 高于右侧侧边栏及其气泡
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

.qr-region-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid rgba(248, 113, 113, 0.16);
  padding-bottom: 6px;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.qr-region-tab {
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

.qr-region-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 6px 12px;
  padding: 4px 2px 10px;
  position: relative;
  z-index: 1;
}

.qr-region-list--province {
  /* 省份列表全部展开显示，不滚动 */
}

.qr-region-list--scroll {
  max-height: none;
  overflow: visible;
}

.qr-region-item {
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

.qr-region-empty {
  grid-column: 1 / -1;
  padding: 10px 8px 4px;
  font-size: 12px;
  color: var(--color-gray-500);
}

.qr-region-footer {
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

.qr-region-selected-text {
  font-size: 12px;
  color: var(--color-gray-600);

  .placeholder {
    color: var(--color-gray-400);
  }
}

.qr-region-footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qr-region-clear,
.qr-region-confirm {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qr-region-clear {
  background: rgba(249, 250, 251, 0.95);
  color: var(--color-gray-500);
  border: 1px solid rgba(148, 163, 184, 0.35);

  &:hover {
    background: #fff;
    color: var(--color-gray-700);
    box-shadow: 0 2px 6px -2px rgba(148, 163, 184, 0.4);
  }
}

.qr-region-confirm {
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

// 婚况选择面板
.marital-select-wrapper {
  position: relative;
}

.marital-display {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #fce7f3;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  color: #a8556f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(255, 107, 157, 0.06);

  &.is-placeholder {
    color: #c4a4b5;
  }

  &:hover {
    border-color: #ffb3d1;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px -2px rgba(255, 107, 157, 0.15);
    transform: translateY(-2px);
  }
}

.marital-display-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.marital-display-arrow {
  width: 16px;
  height: 16px;
  color: #ff6b9d;
  flex-shrink: 0;
}

.marital-dropdown {
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
  z-index: 2000; // 高于右侧侧边栏及其气泡
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

.marital-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px 14px;
  position: relative;
  z-index: 1;
}

.marital-item {
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

// 提交按钮
.submit-btn {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%);
  border: none;
  border-radius: 10px;
  color: var(--color-white);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 24px -6px rgba(255, 107, 157, 0.35),
    0 2px 8px rgba(255, 107, 157, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  margin-top: 2px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 12px 32px -8px rgba(255, 107, 157, 0.4),
      0 4px 12px rgba(255, 107, 157, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    background: linear-gradient(135deg, #ff8fb3 0%, #ff6b9d 100%);

    &::before {
      opacity: 1;
    }

    .arrow-icon {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 
      0 6px 20px -4px rgba(255, 107, 157, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  .arrow-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .quick-register-card {
    padding: 24px;
    border-radius: var(--radius-lg);
  }

  .card-title {
    font-size: 18px;
  }

  .register-form {
    gap: 16px;
  }

  .radio-item {
    padding: 10px 16px;
  }

  .form-select {
    padding: 10px 16px;
    padding-right: 36px;
  }

  .submit-btn {
    padding: 12px 20px;
    font-size: 15px;
  }
}
</style>

