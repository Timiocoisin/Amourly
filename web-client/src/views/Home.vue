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
                @mouseenter="hoveredMemberIndex = index"
                @mouseleave="hoveredMemberIndex = null"
              >
                <div class="member-avatar-wrapper">
                  <div class="member-avatar"></div>
                  <!-- 悬停信息卡片 -->
                  <transition name="hover-card">
                    <div 
                      v-if="hoveredMemberIndex === index"
                      class="member-hover-card"
                      @click.stop
                    >
                      <div class="hover-avatar">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <div class="hover-info">
                        <p class="hover-text">{{ getMemberInfo(member) }}</p>
                      </div>
                      <button class="hover-contact-btn" @click.stop="handleContact(member)">
                        联系TA
                      </button>
                    </div>
                  </transition>
                </div>
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

        <!-- 相亲活动和会员动态 -->
        <section class="activities-updates-section">
          <div class="activities-updates-container">
            <!-- 左侧：相亲活动 -->
            <div class="activities-section">
              <div class="section-header">
                <div class="section-title">
                  <div class="section-icons">
                    <svg class="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg class="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h2 class="section-title-text">相亲活动</h2>
                </div>
                <a href="#" class="more-link more-btn">更多</a>
              </div>
              <div class="activities-list">
                <div 
                  v-for="(activity, index) in activities" 
                  :key="index"
                  class="activity-card"
                >
                  <div class="activity-image">
                    <img :src="activity.image" :alt="activity.title" />
                    <div class="activity-status" :class="activity.statusClass">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>{{ activity.status }}</span>
                    </div>
                  </div>
                  <div class="activity-content">
                    <h3 class="activity-title">{{ activity.title }}</h3>
                    <div class="activity-info">
                      <div class="activity-info-item">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/>
                          <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        <span>{{ activity.location }}</span>
                      </div>
                      <div class="activity-info-item">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                          <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>{{ activity.time }}</span>
                      </div>
                      <div class="activity-info-item">
                        <span class="activity-registered">已报名{{ activity.registered }}人</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：会员动态 -->
            <div class="updates-section">
              <div class="section-header">
                <div class="section-title">
                  <div class="section-icons">
                    <svg class="section-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h2 class="section-title-text">会员动态</h2>
                </div>
                <a href="#" class="more-link more-btn">更多</a>
              </div>
              <div class="updates-list">
                <div 
                  v-for="(update, index) in memberUpdates" 
                  :key="index"
                  class="update-item"
                >
                  <div class="update-avatar">
                    <img v-if="update.avatar" :src="update.avatar" :alt="update.name" />
                    <span v-else class="avatar-text">{{ getAvatarText(update.name) }}</span>
                  </div>
                  <div class="update-content">
                    <p class="update-action">{{ update.action }}</p>
                    <p class="update-member-info">
                      {{ update.name }}, {{ update.gender }}, {{ update.age }}岁, {{ update.height }}, {{ update.education }} {{ update.location }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 婚恋学堂版块 -->
        <section class="academy-section">
          <div class="academy-container">
            <!-- 顶部导航栏 -->
            <div class="academy-nav">
              <div class="academy-nav-left">
                <div class="academy-logo">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="academy-logo-text">婚恋学堂</span>
                </div>
                <div class="academy-tabs">
                  <button 
                    v-for="tab in academyTabs" 
                    :key="tab.key"
                    :class="['academy-tab', { active: activeAcademyTab === tab.key }]"
                    @click="activeAcademyTab = tab.key"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </div>
              <a href="#" class="academy-more-link more-btn">更多</a>
            </div>

            <!-- 主要内容区域 -->
            <div class="academy-content">
              <!-- 左侧：三列文章卡片 -->
              <div class="academy-main">
                <div 
                  v-for="(article, index) in featuredArticles.slice(0, 3)" 
                  :key="index"
                  class="academy-column"
                >
                  <!-- 大卡片 -->
                  <div class="academy-card">
                    <div class="academy-card-image">
                      <img :src="article.image" :alt="article.title" />
                      <div class="academy-card-overlay"></div>
                    </div>
                    <h3 class="academy-card-title">{{ article.title }}</h3>
                  </div>
                  
                  <!-- 相关文章列表 -->
                  <div class="academy-article-list">
                    <div 
                      v-for="(item, itemIndex) in article.relatedArticles.slice(0, 4)" 
                      :key="itemIndex"
                      class="article-list-item"
                    >
                      <span class="article-bullet"></span>
                      <span class="article-text">{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右侧：人气排行榜 -->
              <div class="academy-ranking">
                <h3 class="ranking-title">人气排行榜</h3>
                <div class="ranking-list">
                  <div 
                    v-for="(item, index) in rankingList.slice(0, 8)" 
                    :key="index"
                    class="ranking-item"
                  >
                    <div class="ranking-number" :class="`rank-${index + 1}`">
                      {{ index + 1 }}
                    </div>
                    <div class="ranking-content">
                      <span class="ranking-text">{{ item.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 红娘顾问版块 -->
        <section class="matchmaker-section">
          <div class="matchmaker-container">
            <!-- 顶部标题栏 -->
            <div class="matchmaker-header">
              <div class="matchmaker-title">
                <div class="matchmaker-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 4c0-1.105.895-2 2-2s2 .895 2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
                    <path d="M8 4c0-1.105.895-2 2-2s2 .895 2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
                  </svg>
                </div>
                <span class="matchmaker-title-text">红娘顾问</span>
              </div>
              <a href="#" class="matchmaker-more-link more-btn">更多</a>
            </div>

            <!-- 主要内容区域 -->
            <div class="matchmaker-content">
              <div class="matchmaker-empty">
                <div class="matchmaker-empty-icon">😔</div>
                <div class="matchmaker-empty-text">暂无红娘</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧边栏 -->
      <div class="sidebar">
        <button class="sidebar-btn sidebar-btn-with-popover" data-tooltip="公众号版">
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
          <div class="sidebar-popover">
            <div class="sidebar-popover-inner">
              <div class="sidebar-qr-box" aria-hidden="true"></div>
              <div class="sidebar-popover-meta">
                <div class="sidebar-popover-title">公众号端</div>
                <div class="sidebar-popover-subtitle">扫描二维码访问公众号端</div>
              </div>
            </div>
          </div>
        </button>
        <button class="sidebar-btn sidebar-btn-with-popover" data-tooltip="手机/APP版">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="sidebar-popover">
            <div class="sidebar-popover-inner">
              <div class="sidebar-qr-box" aria-hidden="true"></div>
              <div class="sidebar-popover-meta">
                <div class="sidebar-popover-title">手机端</div>
                <div class="sidebar-popover-subtitle">扫描二维码访问手机端</div>
              </div>
            </div>
          </div>
        </button>
        <button class="sidebar-btn sidebar-btn-with-tooltip" data-tooltip="在线客服">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="sidebar-tooltip">在线客服</span>
        </button>
        <button 
          class="sidebar-btn back-to-top-btn" 
          v-show="showBackToTop"
          @click="scrollToTop"
          title="返回顶部"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15l-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="site-footer">
      <div class="footer-container">
        <!-- 上部分：主要内容 -->
        <div class="footer-main">
          <!-- 左侧：信息列 -->
          <div class="footer-links">
            <div class="footer-column">
              <h3 class="footer-column-title">关于我们</h3>
              <ul class="footer-link-list">
                <li><a href="#" class="footer-link">网站介绍</a></li>
                <li><a href="#" class="footer-link">线下人工服务</a></li>
                <li><a href="#" class="footer-link">联系我们</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h3 class="footer-column-title">婚恋学堂</h3>
              <ul class="footer-link-list">
                <li><a href="#" class="footer-link">爱情故事</a></li>
                <li><a href="#" class="footer-link">恋爱宝典</a></li>
                <li><a href="#" class="footer-link">新手上路</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h3 class="footer-column-title">注册登录</h3>
              <ul class="footer-link-list">
                <li><a href="#" class="footer-link">注册条款</a></li>
                <li><a href="#" class="footer-link">会员注册</a></li>
                <li><a href="#" class="footer-link">会员登录</a></li>
              </ul>
            </div>
          </div>

          <!-- 中间：二维码区域 -->
          <div class="footer-qrcodes">
            <div class="qrcode-item">
              <div class="qrcode-box">
                <div class="qrcode-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <rect x="7" y="7" width="10" height="10" fill="currentColor"/>
                    <circle cx="9" cy="9" r="1" fill="white"/>
                    <circle cx="15" cy="9" r="1" fill="white"/>
                    <circle cx="9" cy="15" r="1" fill="white"/>
                    <circle cx="15" cy="15" r="1" fill="white"/>
                  </svg>
                  <div class="qrcode-logo">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/>
                      <circle cx="9" cy="9" r="1.5" fill="white"/>
                      <circle cx="15" cy="9" r="1.5" fill="white"/>
                      <path d="M9 13.5c0 1.5 1.5 3 3 3s3-1.5 3-3" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p class="qrcode-label">手机版二维码</p>
            </div>
            <div class="qrcode-item">
              <div class="qrcode-box">
                <div class="qrcode-placeholder empty">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/>
                  </svg>
                </div>
              </div>
              <p class="qrcode-label">公众号二维码</p>
            </div>
          </div>

          <!-- 右侧：联系信息 -->
          <div class="footer-contact">
            <div class="contact-info">
              <div class="contact-phone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.3"/>
                </svg>
                <span class="phone-number">13193713338</span>
              </div>
              <p class="contact-desc">欢迎致电我们,开启幸福之旅</p>
            </div>
            <button class="contact-btn">
              <span>联系在线客服</span>
            </button>
          </div>
        </div>

        <!-- 下部分：版权信息 -->
        <div class="footer-bottom">
          <p class="copyright-text">高素质、高学历的实名相亲交友平台 版权所有©2026</p>
        </div>
      </div>
    </footer>
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
  window.addEventListener('scroll', handleScroll)
  handleScroll() // 初始化检查
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('close-search-panels', closeSearchPanels)
  window.removeEventListener('scroll', handleScroll)
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
  { name: 'yyy', age: 30, profession: '设计师', location: '', avatar: '', maritalStatus: '未婚', income: '5万以下' },
  { name: '沈培鑫', age: 37, profession: '', location: '', avatar: '', maritalStatus: '离异', income: '10-20万' },
  { name: 'd汝南公务员', age: 30, profession: '', location: '驻马店汝南县', avatar: '', maritalStatus: '未婚', income: '5-10万' },
  { name: '03年市区老师', age: 23, profession: '教师', location: '驻马店驿城区', avatar: '', maritalStatus: '未婚', income: '5万以下' },
  { name: 'd香菜-王冬冬', age: 30, profession: '', location: '驻马店驿城区', avatar: '', maritalStatus: '未婚', income: '5-10万' },
  { name: '刘盼胤', age: 33, profession: '', location: '', avatar: '', maritalStatus: '离异', income: '10-20万' },
  { name: 'd红娘陈陈-曹伟', age: 35, profession: '', location: '', avatar: '', maritalStatus: '丧偶', income: '20-50万' },
  { name: 'd02年在设计师女生', age: 24, profession: '', location: '驻马店', avatar: '', maritalStatus: '未婚', income: '5万以下' },
  { name: 'Avril', age: 24, profession: '', location: '', avatar: '', maritalStatus: '未婚', income: '5-10万' },
  { name: '臧升麟', age: 25, profession: '', location: '', avatar: '', maritalStatus: '未婚', income: '5万以下' }
])

// 悬停会员索引
const hoveredMemberIndex = ref<number | null>(null)

// 获取会员信息文本
const getMemberInfo = (member: any) => {
  const parts: string[] = []
  if (member.maritalStatus) parts.push(member.maritalStatus)
  if (member.income) parts.push(member.income)
  return parts.join(' ')
}

// 获取头像文字（取名字的前2个字符）
const getAvatarText = (name: string) => {
  if (!name) return '用'
  // 如果是中文，取前2个字符；如果是英文，取前2-4个字符
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.slice(0, 2)
  } else {
    return name.slice(0, 4).toUpperCase()
  }
}

const handleSearch = () => {
  console.log('搜索:', searchForm.value)
  // TODO: 实现搜索逻辑
}

const handleMemberClick = (member: any) => {
  console.log('点击会员:', member)
  // TODO: 跳转到会员详情页
}

const handleContact = (member: any) => {
  console.log('联系会员:', member)
  // TODO: 实现联系功能
}

// 相亲活动数据
const activities = ref([
  {
    title: '【2017年5月20日】"边走边爱"天河公园免费相亲活动',
    status: '已截止报名',
    statusClass: 'closed',
    location: '广东广州市天河区广州市天河区天河公园广场',
    time: '2017/05/20 13:00 - 2017/05/20 17:00',
    registered: 0,
    image: pic1
  },
  {
    title: '2017五月份广州越秀公园免费相亲活动',
    status: '已截止报名',
    statusClass: 'closed',
    location: '广东广州市天河区广州市越秀区越秀公园',
    time: '2017/05/13 10:00 - 2017/05/13 16:00',
    registered: 0,
    image: pic1
  }
])

// 会员动态数据
const memberUpdates = ref([
  {
    name: '月牙泉',
    gender: '男',
    age: 38,
    height: '176CM',
    education: '本科',
    location: '广州市',
    action: '上传了照片',
    avatar: ''
  },
  {
    name: '等待你',
    gender: '女',
    age: 36,
    height: '169CM',
    education: '大专',
    location: '广州市',
    action: '上传了照片',
    avatar: ''
  },
  {
    name: 'Att',
    gender: '女',
    age: 29,
    height: '164CM',
    education: '大专',
    location: '广州市',
    action: '摸鱼了是不是,测试一下 🤔',
    avatar: ''
  },
  {
    name: 'gogo',
    gender: '女',
    age: 32,
    height: '165CM',
    education: '本科',
    location: '广州市',
    action: '上传了照片',
    avatar: ''
  },
  {
    name: '小小',
    gender: '女',
    age: 36,
    height: '161CM',
    education: '本科',
    location: '广州市',
    action: '上传了照片',
    avatar: ''
  }
])

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

// 婚恋学堂数据
const academyTabs = ref([
  { key: 'hot', label: '热文推荐' },
  { key: 'story', label: '爱情故事' },
  { key: 'handbook', label: '恋爱宝典' },
  { key: 'newbie', label: '新手上路' },
  { key: 'law', label: '婚姻法规' }
])

const activeAcademyTab = ref('hot')

const featuredArticles = ref([
  {
    title: '感情真的跟缘分有关吗?就这样又过...',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=300&fit=crop',
    relatedArticles: [
      '感情真的跟缘分有关吗?就这样又...',
      '夫妻之间应该知道的事情',
      '没能力爱对方请别选择再婚',
      '让老公更爱你的必杀技'
    ]
  },
  {
    title: '爱是一种委曲求全的忍让,还是潇潇...',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop',
    relatedArticles: [
      '爱是一种委曲求全的忍让,还是潇...',
      '爱的方式是爱情中多些理解,多些...',
      '单身最大的好处是什么?',
      '爱与不爱都快乐'
    ]
  },
  {
    title: '爱,原来很容易,就是轻轻地把你爱...',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=300&fit=crop',
    relatedArticles: [
      '爱,原来很容易,就是轻轻地把你...',
      '一个女孩子从5岁到35岁的爱情感悟',
      '女人最惧怕的事情是什么',
      '没有物质的婚姻怎能付得起责任?'
    ]
  }
])

const rankingList = ref([
  { title: '感情真的跟缘分有关吗?就这样又过了一千年的光...' },
  { title: '爱是一种委曲求全的忍让,还是潇潇洒洒' },
  { title: '爱,原来很容易,就是轻轻地把你爱的人放在心里' },
  { title: '夫妻之间应该知道的事情' },
  { title: '爱的方式是爱情中多些理解,多些宽容' },
  { title: '一个女孩子从5岁到35岁的爱情感悟' },
  { title: '没能力爱对方请别选择再婚' },
  { title: '单身最大的好处是什么?' }
])

// 返回顶部功能
const showBackToTop = ref(false)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  showBackToTop.value = scrollTop > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-gray-50);
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
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
  z-index: 1300; // 高于右侧侧边栏及其气泡，保证注册弹窗不被遮挡
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
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
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
  overflow: visible;
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
  position: relative;
  overflow: visible;
  contain: layout;
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
  isolation: isolate;
  contain: layout style;
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
    transform: none;
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
      transform: none;
      box-shadow: 
        0 8px 24px -4px rgba(255, 107, 157, 0.3),
        0 4px 12px -2px rgba(255, 107, 157, 0.2);
    }

    .member-name {
      color: var(--color-romantic);
      transform: none;
    }

    .member-age {
      transform: none;
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

.member-avatar-wrapper {
  width: 100%;
  position: relative;
  margin-bottom: 16px;
}

.member-avatar {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 16px;
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

// 悬停信息卡片
.member-hover-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(20, 20, 30, 0.82) 50%,
    rgba(0, 0, 0, 0.78) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 10;
  box-shadow: 
    0 8px 32px -6px rgba(0, 0, 0, 0.4),
    0 4px 16px -4px rgba(0, 0, 0, 0.25),
    0 2px 8px -2px rgba(255, 107, 157, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: auto;
  box-sizing: border-box;
  margin: 0;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 107, 157, 0.08) 0%,
      transparent 70%
    );
    opacity: 0.6;
    animation: pulse 3s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 107, 157, 0.4) 50%,
      transparent 100%
    );
    opacity: 0.8;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.hover-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 157, 0.3) 0%,
    rgba(255, 143, 179, 0.25) 50%,
    rgba(255, 107, 157, 0.28) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 6px 20px -4px rgba(255, 107, 157, 0.4),
    0 3px 12px -2px rgba(255, 107, 157, 0.3),
    0 1px 4px rgba(255, 107, 157, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      0 8px 24px -4px rgba(255, 107, 157, 0.5),
      0 4px 16px -2px rgba(255, 107, 157, 0.35),
      0 2px 6px rgba(255, 107, 157, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }
  
  svg {
    width: 26px;
    height: 26px;
    color: rgba(255, 255, 255, 0.95);
    filter: drop-shadow(0 2px 6px rgba(255, 107, 157, 0.5));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.hover-info {
  width: 100%;
  text-align: center;
  min-height: 20px;
  position: relative;
  z-index: 1;
}

.hover-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.2px;
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 0 8px rgba(255, 107, 157, 0.2);
  padding: 0 2px;
}

.hover-contact-btn {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(
    135deg,
    var(--color-romantic) 0%,
    var(--color-romantic-light) 50%,
    var(--color-romantic) 100%
  );
  background-size: 200% 200%;
  color: var(--color-white);
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px -4px rgba(255, 107, 157, 0.5),
    0 2px 8px -2px rgba(255, 107, 157, 0.3),
    0 1px 4px rgba(255, 107, 157, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    background-position: 100% 0;
    box-shadow: 
      0 6px 24px -4px rgba(255, 107, 157, 0.6),
      0 4px 16px -2px rgba(255, 107, 157, 0.4),
      0 2px 8px rgba(255, 107, 157, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 8px -2px rgba(255, 107, 157, 0.5),
      0 1px 4px rgba(255, 107, 157, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

// 悬停卡片动画
.hover-card-enter-active,
.hover-card-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hover-card-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.hover-card-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hover-card-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hover-card-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

// 相亲活动和会员动态区域
.activities-updates-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.activities-updates-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 24px;
}

// 区域标题样式
.section-header {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-top: 0 !important;
  margin-bottom: -40px;
  padding-top: 0 !important;
  padding-right: 0 !important; // 确保按钮可以靠近右边缘
  padding-bottom: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0; // 防止flex子元素溢出
  height: auto;
  gap: 12px;
  position: relative;
  overflow: visible;
}

.section-title {
  display: inline-flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 8px;
  position: relative;
  flex: 0 1 auto !important;
  min-width: 0; // 防止内容溢出
  max-width: calc(100% - 90px); // 为按钮预留空间（按钮宽度约70px + gap 12px + 余量）
  justify-content: flex-start;
  vertical-align: middle;
  overflow: hidden;
  margin: 0;
  padding: 0;
  
  &::after {
    display: none !important;
    content: none !important;
  }
}

.section-icons {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 4px;
  flex-shrink: 0 !important;
  height: 24px;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-romantic);
  flex-shrink: 0;
  stroke-width: 2;
  display: block;
}

.section-title-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
  padding: 0;
  letter-spacing: 0.2px;
  line-height: 24px;
  display: inline !important;
  white-space: nowrap !important;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  height: auto;
  vertical-align: middle;
  flex-shrink: 1;
  max-width: 100%;
  
  &::after {
    display: none !important;
    content: none !important;
  }
}

.more-btn,
.more-link,
.academy-more-link,
.matchmaker-more-link {
  font-size: 13px;
  color: var(--color-romantic);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 6px 14px;
  border-radius: 12px;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;
  flex-basis: auto !important;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.08) 0%, rgba(255, 143, 179, 0.06) 100%);
  border: 1px solid rgba(255, 107, 157, 0.15);
  box-shadow: 
    0 2px 6px -2px rgba(255, 107, 157, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px;
  position: relative;
  overflow: hidden;
  height: 28px;
  line-height: 1;
  vertical-align: middle;
  box-sizing: border-box;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    color: var(--color-white);
    background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 100%);
    border-color: transparent;
    box-shadow: 
      0 4px 12px -2px rgba(255, 107, 157, 0.4),
      0 2px 6px rgba(255, 107, 157, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: none;
  }
}

.more-link {
  margin: 0 !important;
  margin-top: -4px !important; // 向上移动 4px
  margin-right: -4px !important; // 向右移动 4px，但仍在卡片范围内
  margin-left: auto !important;
  max-width: calc(100% - 4px); // 确保不超过卡片范围
  align-self: flex-start !important; // 对齐到顶部
}

// 相亲活动区域
.activities-section {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 250, 252, 0.98) 50%,
    rgba(255, 255, 255, 1) 100%);
  border-radius: 20px;
  padding: 12px 20px 12px 20px; // 底部 padding 减小为 12px，让活动卡片占满底部
  box-shadow: 
    0 4px 20px -4px rgba(255, 107, 157, 0.12),
    0 2px 12px -2px rgba(255, 107, 157, 0.08),
    0 1px 6px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 107, 157, 0.1);
  box-sizing: border-box;
  overflow: hidden; // 防止内容超出卡片范围
  width: 100%;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.6) 0%, 
      rgba(255, 143, 179, 0.4) 50%,
      rgba(255, 107, 157, 0.6) 100%);
    border-radius: 20px 20px 0 0;
  }
  
  .section-header {
    max-width: 100%;
    box-sizing: border-box;
    margin-top: 0;
    padding-top: 0;
    flex-shrink: 0;
  }
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  justify-content: space-between;
}

.activity-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 252, 254, 0.95) 100%);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 3px 16px -4px rgba(255, 107, 157, 0.15),
    0 2px 8px -2px rgba(255, 107, 157, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 107, 157, 0.12);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  position: relative;
  flex: 1;
  min-height: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 18px;
    padding: 1px;
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 0.2) 0%, 
      rgba(255, 143, 179, 0.1) 50%,
      transparent 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: none;
    box-shadow: 
      0 12px 32px -6px rgba(255, 107, 157, 0.2),
      0 6px 16px -3px rgba(255, 107, 157, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 1);
    border-color: rgba(255, 107, 157, 0.25);
    
    &::after {
      opacity: 1;
    }
  }
}

.activity-image {
  position: relative;
  width: 350px;
  min-width: 350px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(255, 107, 157, 0.08) 0%, 
    rgba(255, 143, 179, 0.05) 50%,
    rgba(255, 107, 157, 0.03) 100%);
  align-self: stretch;
  border-radius: 18px 0 0 18px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 0.1) 0%, 
      transparent 50%,
      transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
    pointer-events: none;
  }
  
  .activity-card:hover &::before {
    opacity: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
    filter: brightness(1) saturate(1);
  }
  
  .activity-card:hover & img {
    transform: none;
    filter: brightness(1.05) saturate(1.1);
  }
}

.activity-status {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.75);
  color: var(--color-white);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2;
  
  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
  
  &.closed {
    background: rgba(100, 100, 100, 0.85);
  }
}

.activity-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 252, 254, 0.9) 100%);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, 
      transparent 0%, 
      rgba(255, 107, 157, 0.15) 50%,
      transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  .activity-card:hover &::after {
    opacity: 1;
  }
}

.activity-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.2px;
  background: linear-gradient(135deg, 
    var(--color-gray-900) 0%, 
    rgba(0, 0, 0, 0.85) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  
  .activity-card:hover & {
    background: linear-gradient(135deg, 
      var(--color-romantic) 0%, 
      rgba(255, 107, 157, 0.8) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: var(--color-gray-700);
  line-height: 1.6;
  padding: 4px 0;
  transition: all 0.3s ease;
  
  svg {
    width: 17px;
    height: 17px;
    color: var(--color-romantic);
    flex-shrink: 0;
    opacity: 0.85;
    transition: all 0.3s ease;
    filter: drop-shadow(0 1px 2px rgba(255, 107, 157, 0.2));
  }
  
  .activity-card:hover & svg {
    opacity: 1;
    transform: scale(1.1);
    filter: drop-shadow(0 2px 4px rgba(255, 107, 157, 0.3));
  }
  
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: color 0.3s ease;
  }
  
  .activity-card:hover & span {
    color: var(--color-gray-800);
  }
}

.activity-registered {
  color: var(--color-romantic);
  font-weight: 600;
  font-size: 13px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.12) 0%, rgba(255, 143, 179, 0.08) 100%);
  border: 1px solid rgba(255, 107, 157, 0.2);
  box-shadow: 
    0 2px 6px -2px rgba(255, 107, 157, 0.25),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.4;
  white-space: nowrap;
  
  &:hover {
    background: linear-gradient(135deg, rgba(255, 107, 157, 0.18) 0%, rgba(255, 143, 179, 0.12) 100%);
    border-color: rgba(255, 107, 157, 0.3);
    box-shadow: 
      0 3px 8px -2px rgba(255, 107, 157, 0.35),
      inset 0 1px 2px rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }
}

// 会员动态区域
.updates-section {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 250, 252, 0.98) 50%,
    rgba(255, 255, 255, 1) 100%);
  border-radius: 20px;
  padding: 12px 20px 20px 20px; // 顶部 padding 减小为 12px，使按钮贴近顶部
  box-shadow: 
    0 4px 20px -4px rgba(255, 107, 157, 0.12),
    0 2px 12px -2px rgba(255, 107, 157, 0.08),
    0 1px 6px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 107, 157, 0.1);
  box-sizing: border-box;
  overflow: hidden; // 防止内容超出卡片范围
  width: 100%;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.6) 0%, 
      rgba(255, 143, 179, 0.4) 50%,
      rgba(255, 107, 157, 0.6) 100%);
    border-radius: 20px 20px 0 0;
  }
  
  .section-header {
    max-width: 100%;
    box-sizing: border-box;
    margin-top: 0;
    padding-top: 0;
  }
}

.updates-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.update-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.6) 0%, 
    rgba(255, 250, 252, 0.4) 100%);
  border: 1px solid rgba(255, 107, 157, 0.08);
  box-shadow: 
    0 2px 8px -2px rgba(255, 107, 157, 0.08),
    0 1px 4px -1px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, 
      rgba(255, 107, 157, 0.4) 0%, 
      rgba(255, 143, 179, 0.2) 100%);
    border-radius: 14px 0 0 14px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.9) 0%, 
      rgba(255, 250, 252, 0.6) 100%);
    transform: none;
    box-shadow: 
      0 4px 16px -3px rgba(255, 107, 157, 0.15),
      0 2px 8px -1px rgba(255, 107, 157, 0.1),
      0 1px 4px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 107, 157, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
}

.update-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, 
    rgba(255, 107, 157, 0.25) 0%, 
    rgba(255, 143, 179, 0.2) 50%,
    rgba(255, 107, 157, 0.15) 100%);
  border: 2.5px solid rgba(255, 107, 157, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px -2px rgba(255, 107, 157, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 0.4) 0%, 
      rgba(255, 143, 179, 0.3) 100%);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .update-item:hover & {
    transform: none;
    border-color: rgba(255, 107, 157, 0.35);
    box-shadow: 
      0 4px 12px -2px rgba(255, 107, 157, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.5);
    
    &::after {
      opacity: 1;
    }
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .update-item:hover & img {
    transform: none;
  }
  
  .avatar-text {
    font-size: 15px;
    font-weight: 700;
    color: rgba(255, 107, 157, 0.95);
    line-height: 1;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  }
}

.update-content {
  flex: 1;
  min-width: 0;
}

.update-action {
  font-size: 14px;
  color: var(--color-gray-900);
  margin: 0 0 6px 0;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: 0.1px;
  transition: color 0.3s ease;
  
  .update-item:hover & {
    color: rgba(255, 107, 157, 0.9);
  }
}

.update-member-info {
  font-size: 12.5px;
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.5;
  transition: color 0.3s ease;
  letter-spacing: 0.05px;
  
  .update-item:hover & {
    color: var(--color-gray-700);
  }
}

// 婚恋学堂版块
.academy-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.academy-container {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 250, 252, 0.98) 50%,
    rgba(255, 255, 255, 1) 100%);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 4px 20px -4px rgba(255, 107, 157, 0.12),
    0 2px 12px -2px rgba(255, 107, 157, 0.08),
    0 1px 6px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 107, 157, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.6) 0%, 
      rgba(255, 143, 179, 0.4) 50%,
      rgba(255, 107, 157, 0.6) 100%);
    border-radius: 20px 20px 0 0;
  }
}

.academy-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 107, 157, 0.1);
}

.academy-nav-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.academy-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 24px;
    height: 24px;
    color: var(--color-romantic);
    flex-shrink: 0;
  }
  
  .academy-logo-text {
    font-size: 18px;
    font-weight: 700;
    color: var(--color-gray-900);
    letter-spacing: 0.5px;
  }
}

.academy-tabs {
  display: flex;
  gap: 8px;
}

.academy-tab {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gray-700);
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.8) 0%, 
      rgba(255, 107, 157, 0.6) 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: var(--color-romantic);
    background: rgba(255, 107, 157, 0.08);
  }
  
  &.active {
    color: var(--color-romantic);
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 0.12) 0%, 
      rgba(255, 107, 157, 0.08) 100%);
    font-weight: 600;
    
    &::after {
      width: 80%;
    }
  }
}

.academy-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 28px;
  align-items: stretch;
}

.academy-main {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.academy-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
}

.academy-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(255, 250, 252, 0.96) 100%);
  border-radius: 22px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px -8px rgba(255, 107, 157, 0.14),
    0 4px 16px -4px rgba(255, 107, 157, 0.1),
    0 2px 8px -2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 107, 157, 0.08);
  border: 1px solid rgba(255, 107, 157, 0.15);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.4) 0%, 
      rgba(255, 182, 193, 0.5) 50%,
      rgba(255, 107, 157, 0.4) 100%);
    border-radius: 22px 22px 0 0;
    z-index: 1;
    transition: height 0.3s ease;
  }
  
  &:hover {
    transform: none;
    box-shadow: 
      0 16px 48px -10px rgba(255, 107, 157, 0.22),
      0 8px 24px -6px rgba(255, 107, 157, 0.16),
      0 4px 12px -2px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 1),
      inset 0 -1px 0 rgba(255, 107, 157, 0.12);
    border-color: rgba(255, 107, 157, 0.25);
    
    &::before {
      height: 4px;
      background: linear-gradient(90deg, 
        rgba(255, 107, 157, 0.6) 0%, 
        rgba(255, 182, 193, 0.7) 50%,
        rgba(255, 107, 157, 0.6) 100%);
    }
    
    .academy-card-image {
      &::after {
        opacity: 0.3;
      }
      
      img {
        transform: none;
      }
    }
    
    .academy-card-title {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.98) 0%, 
        rgba(255, 250, 252, 0.98) 100%);
      color: var(--color-romantic);
      padding-left: 24px;
      font-weight: 700;
    }
  }
}

.academy-card-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(255, 107, 157, 0.1) 0%, 
    rgba(255, 182, 193, 0.12) 100%);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, 
      rgba(255, 107, 157, 0.15) 0%,
      rgba(255, 182, 193, 0.1) 50%,
      transparent 100%);
    pointer-events: none;
    opacity: 0.2;
    transition: opacity 0.4s ease;
    z-index: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(1) saturate(1);
  }
  
  .academy-card:hover & {
    img {
      filter: brightness(1.05) saturate(1.1);
    }
  }
}

.academy-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, 
    rgba(255, 255, 255, 0.05) 0%,
    transparent 30%,
    rgba(255, 107, 157, 0.03) 100%);
  pointer-events: none;
  z-index: 2;
}

.academy-card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-800);
  margin: 0;
  padding: 18px 20px;
  line-height: 1.65;
  letter-spacing: 0.25px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 250, 252, 0.95) 100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(180deg, 
      rgba(255, 107, 157, 0.2) 0%, 
      rgba(255, 182, 193, 0.15) 100%);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 4px 4px 0;
  }
  
  .academy-card:hover & {
    color: var(--color-romantic);
    padding-left: 24px;
    font-weight: 700;
    letter-spacing: 0.3px;
    
    &::before {
      width: 3px;
    }
  }
}

.academy-article-list {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(255, 250, 252, 0.96) 100%);
  border-radius: 20px;
  padding: 22px 20px;
  box-shadow: 
    0 6px 24px -6px rgba(255, 107, 157, 0.12),
    0 3px 12px -3px rgba(255, 107, 157, 0.08),
    0 1px 6px -1px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 107, 157, 0.06);
  border: 1px solid rgba(255, 107, 157, 0.12);
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.3) 0%, 
      rgba(255, 182, 193, 0.4) 50%,
      rgba(255, 107, 157, 0.3) 100%);
    border-radius: 20px 20px 0 0;
  }
}

.article-list-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 11px 10px;
  margin: 0 -10px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 12px;
  position: relative;
  background: transparent;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: linear-gradient(180deg, 
      var(--color-romantic) 0%, 
      rgba(255, 182, 193, 0.8) 100%);
    border-radius: 0 3px 3px 0;
    transition: height 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.08) 0%, 
      rgba(255, 250, 252, 0.5) 100%);
    transform: translateX(8px);
    padding-left: 14px;
    box-shadow: 
      0 2px 12px -4px rgba(255, 107, 157, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
    
    &::before {
      height: 60%;
    }
    
    .article-text {
      color: var(--color-romantic);
      font-weight: 600;
      letter-spacing: 0.15px;
    }
    
    .article-bullet {
      background: linear-gradient(135deg, 
        var(--color-romantic) 0%, 
        rgba(255, 182, 193, 0.9) 100%);
      transform: scale(1.4);
      box-shadow: 
        0 3px 10px -2px rgba(255, 107, 157, 0.5),
        0 1px 4px rgba(255, 107, 157, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.4);
    }
  }
}

.article-bullet {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(255, 107, 157, 0.7) 0%, 
    rgba(255, 182, 193, 0.6) 100%);
  margin-top: 8px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 6px -2px rgba(255, 107, 157, 0.4),
    0 1px 3px rgba(255, 107, 157, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 3px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .article-list-item:hover &::before {
    opacity: 1;
  }
}

.article-text {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-gray-800);
  line-height: 1.7;
  letter-spacing: 0.12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  position: relative;
}

.academy-ranking {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(255, 250, 252, 0.95) 100%);
  border-radius: 22px;
  padding: 20px;
  box-shadow: 
    0 8px 32px -8px rgba(255, 107, 157, 0.12),
    0 4px 16px -4px rgba(255, 107, 157, 0.08),
    0 2px 8px -2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 107, 157, 0.05);
  border: 1px solid rgba(255, 107, 157, 0.12);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.4) 0%, 
      rgba(255, 182, 193, 0.5) 50%,
      rgba(255, 107, 157, 0.4) 100%);
    border-radius: 22px 22px 0 0;
  }
}

.ranking-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-gray-800);
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(255, 107, 157, 0.1);
  letter-spacing: 0.4px;
  position: relative;
  flex-shrink: 0;
  background: linear-gradient(135deg, 
    var(--color-gray-800) 0%, 
    rgba(0, 0, 0, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, 
      var(--color-romantic) 0%, 
      rgba(255, 182, 193, 0.8) 50%,
      var(--color-romantic) 100%);
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
  }
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  justify-content: flex-start;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 12px;
  margin: 0 -12px;
  border-radius: 14px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 107, 157, 0.08);
  flex-shrink: 0;
  position: relative;
  background: transparent;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: linear-gradient(180deg, 
      var(--color-romantic) 0%, 
      rgba(255, 182, 193, 0.8) 100%);
    border-radius: 0 3px 3px 0;
    transition: height 0.3s ease;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    transform: translateX(8px);
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.06) 0%, 
      rgba(255, 250, 252, 0.4) 100%);
    padding-left: 16px;
    box-shadow: 
      0 2px 12px -4px rgba(255, 107, 157, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    
    &::before {
      height: 60%;
    }
    
    .ranking-text {
      color: var(--color-romantic);
      font-weight: 600;
    }
    
    .ranking-number {
      transform: scale(1.2) translateY(-2px);
      box-shadow: 
        0 6px 16px -3px rgba(255, 107, 157, 0.4),
        0 2px 8px -2px rgba(0, 0, 0, 0.15),
        inset 0 1px 3px rgba(255, 255, 255, 0.5);
    }
  }
}

.ranking-number {
  width: 28px;
  height: 28px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: var(--color-white);
  flex-shrink: 0;
  box-shadow: 
    0 4px 12px -3px rgba(0, 0, 0, 0.3),
    0 2px 6px -2px rgba(0, 0, 0, 0.2),
    inset 0 1px 3px rgba(255, 255, 255, 0.4),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
    transition: left 0.5s ease;
  }
  
  &.rank-1 {
    background: linear-gradient(135deg, 
      #FFD700 0%, 
      #FFC107 50%,
      #FFA500 100%);
    box-shadow: 
      0 4px 14px -3px rgba(255, 193, 7, 0.4),
      0 2px 8px -2px rgba(255, 152, 0, 0.3),
      inset 0 1px 3px rgba(255, 255, 255, 0.5),
      inset 0 -1px 2px rgba(255, 152, 0, 0.2);
  }
  
  &.rank-2 {
    background: linear-gradient(135deg, 
      #E0E0E0 0%, 
      #BDBDBD 50%,
      #9E9E9E 100%);
    box-shadow: 
      0 4px 14px -3px rgba(158, 158, 158, 0.4),
      0 2px 8px -2px rgba(117, 117, 117, 0.3),
      inset 0 1px 3px rgba(255, 255, 255, 0.5),
      inset 0 -1px 2px rgba(97, 97, 97, 0.2);
  }
  
  &.rank-3 {
    background: linear-gradient(135deg, 
      #D7CCC8 0%, 
      #BCAAA4 50%,
      #A1887F 100%);
    box-shadow: 
      0 4px 14px -3px rgba(161, 136, 127, 0.4),
      0 2px 8px -2px rgba(141, 110, 99, 0.3),
      inset 0 1px 3px rgba(255, 255, 255, 0.5),
      inset 0 -1px 2px rgba(93, 64, 55, 0.2);
  }
  
  &:not(.rank-1):not(.rank-2):not(.rank-3) {
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 0.85) 0%, 
      rgba(255, 107, 157, 0.7) 50%,
      rgba(255, 107, 157, 0.6) 100%);
    box-shadow: 
      0 4px 14px -3px rgba(255, 107, 157, 0.35),
      0 2px 8px -2px rgba(255, 107, 157, 0.25),
      inset 0 1px 3px rgba(255, 255, 255, 0.4),
      inset 0 -1px 2px rgba(255, 107, 157, 0.2);
  }
  
  .ranking-item:hover &::before {
    left: 100%;
  }
}

.ranking-content {
  flex: 1;
  min-width: 0;
}

.ranking-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gray-800);
  line-height: 1.65;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.1px;
  position: relative;
}

// 红娘顾问版块
.matchmaker-section {
  margin-top: 40px;
  margin-bottom: 20px;
}

.matchmaker-container {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 250, 252, 0.98) 50%,
    rgba(255, 255, 255, 1) 100%);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 4px 20px -4px rgba(255, 107, 157, 0.12),
    0 2px 12px -2px rgba(255, 107, 157, 0.08),
    0 1px 6px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 107, 157, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.6) 0%, 
      rgba(255, 143, 179, 0.4) 50%,
      rgba(255, 107, 157, 0.6) 100%);
    border-radius: 20px 20px 0 0;
  }
}

.matchmaker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 107, 157, 0.1);
}

.matchmaker-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.matchmaker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 107, 157, 0.9);
  flex-shrink: 0;
  
  svg {
    width: 24px;
    height: 24px;
  }
}

.matchmaker-title-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-gray-900);
  letter-spacing: 0.5px;
}

.matchmaker-content {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.matchmaker-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
}

.matchmaker-empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
  filter: grayscale(0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.matchmaker-empty-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-gray-600);
  letter-spacing: 0.3px;
}

// 页脚
.site-footer {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 250, 252, 0.98) 50%,
    rgba(255, 255, 255, 1) 100%);
  border-top: 1px solid rgba(255, 107, 157, 0.1);
  margin-top: 20px;
  padding: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.5) 0%, 
      rgba(255, 182, 193, 0.6) 50%,
      rgba(255, 107, 157, 0.5) 100%);
  }
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 32px 28px;
  width: 100%;
  box-sizing: border-box;
}

.footer-main {
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 56px;
  align-items: start;
  margin-bottom: 36px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 107, 157, 0.12);
  width: 100%;
  box-sizing: border-box;
}

.footer-links {
  display: flex;
  gap: 56px;
}

.footer-column {
  min-width: 140px;
}

.footer-column-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 18px 0;
  letter-spacing: 0.4px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 32px;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.6) 0%, 
      rgba(255, 182, 193, 0.4) 100%);
    border-radius: 2px;
  }
}

.footer-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-gray-600);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  position: relative;
  padding-left: 0;
  
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 107, 157, 0.3);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      var(--color-romantic) 0%, 
      rgba(255, 182, 193, 0.8) 100%);
    border-radius: 1px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    color: var(--color-romantic);
    transform: translateX(6px);
    padding-left: 12px;
    
    &::before {
      opacity: 1;
      left: 0;
    }
    
    &::after {
      width: 100%;
    }
  }
}

.footer-qrcodes {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.qrcode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.qrcode-box {
  width: 130px;
  height: 130px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(255, 250, 252, 0.96) 100%);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 
    0 6px 24px -6px rgba(255, 107, 157, 0.14),
    0 3px 12px -3px rgba(255, 107, 157, 0.1),
    0 1px 6px -1px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 107, 157, 0.08);
  border: 1px solid rgba(255, 107, 157, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(255, 107, 157, 0.4) 0%, 
      rgba(255, 182, 193, 0.5) 50%,
      rgba(255, 107, 157, 0.4) 100%);
    border-radius: 18px 18px 0 0;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 
      0 10px 32px -8px rgba(255, 107, 157, 0.2),
      0 5px 16px -4px rgba(255, 107, 157, 0.15),
      0 2px 8px -1px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 1),
      inset 0 -1px 0 rgba(255, 107, 157, 0.12);
    border-color: rgba(255, 107, 157, 0.2);
  }
}

.qrcode-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-400);
  
  svg {
    width: 90px;
    height: 90px;
  }
  
  &.empty {
    svg {
      width: 70px;
      height: 70px;
    }
  }
}

.qrcode-logo {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, 
    rgba(255, 107, 157, 0.95) 0%, 
    rgba(255, 182, 193, 0.9) 100%);
  border-radius: 8px;
  color: var(--color-white);
  box-shadow: 
    0 2px 8px -2px rgba(255, 107, 157, 0.35),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  
  svg {
    width: 20px;
    height: 20px;
  }
}

.qrcode-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-gray-600);
  margin: 0;
  text-align: center;
  letter-spacing: 0.2px;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-phone {
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    width: 24px;
    height: 24px;
    color: rgba(255, 107, 157, 0.95);
    flex-shrink: 0;
    filter: drop-shadow(0 2px 4px rgba(255, 107, 157, 0.25));
  }
}

.phone-number {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 107, 157, 0.95);
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(255, 107, 157, 0.15);
}

.contact-desc {
  font-size: 14px;
  font-weight: 400;
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.6;
  letter-spacing: 0.2px;
}

.contact-btn {
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-white);
  background: linear-gradient(135deg, 
    rgba(255, 107, 157, 0.95) 0%, 
    rgba(255, 182, 193, 0.9) 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 6px 16px -4px rgba(255, 107, 157, 0.35),
    0 3px 8px -2px rgba(255, 107, 157, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.3) 50%,
      transparent 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 8px 20px -5px rgba(255, 107, 157, 0.45),
      0 4px 10px -3px rgba(255, 107, 157, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 1) 0%, 
      rgba(255, 182, 193, 0.95) 100%);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
}

.footer-bottom {
  text-align: center;
  padding-top: 28px;
}

.copyright-text {
  font-size: 13px;
  font-weight: 400;
  color: var(--color-gray-600);
  margin: 0;
  line-height: 1.7;
  letter-spacing: 0.3px;
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
  padding: 10px 8px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 107, 157, 0.12);
  box-shadow:
    0 10px 28px -14px rgba(255, 107, 157, 0.22),
    0 6px 16px -10px rgba(0, 0, 0, 0.14);
  backdrop-filter: blur(10px);
}

.sidebar-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 250, 252, 0.92) 100%);
  border: 1px solid rgba(255, 107, 157, 0.16);
  border-radius: 16px;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow:
    0 10px 22px -14px rgba(255, 107, 157, 0.22),
    0 6px 14px -12px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    border-color: rgba(255, 107, 157, 0.32);
    color: var(--color-romantic);
    background: linear-gradient(135deg,
      rgba(255, 107, 157, 0.08) 0%,
      rgba(255, 182, 193, 0.16) 100%);
    transform: translateY(-3px);
    box-shadow:
      0 16px 34px -18px rgba(255, 107, 157, 0.34),
      0 10px 18px -14px rgba(0, 0, 0, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }

  &:active {
    transform: translateY(-1px);
  }
}

// 带提示气泡的按钮
.sidebar-btn-with-tooltip {
  &:hover {
    .sidebar-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
    }
  }
}

// 带二维码弹层的按钮（公众号/手机版）
.sidebar-btn-with-popover {
  &:hover {
    .sidebar-popover {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
    }
  }
}

// 提示气泡
.sidebar-tooltip {
  position: absolute;
  right: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 107, 157, 0.16);
  border-radius: 12px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.85);
  box-shadow: 
    0 12px 28px -18px rgba(255, 107, 157, 0.28),
    0 10px 18px -16px rgba(0, 0, 0, 0.18);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  letter-spacing: 0.2px;
  
  // 箭头指向按钮（外层边框）
  &::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 0 6px 8px;
    border-color: transparent transparent transparent rgba(255, 107, 157, 0.16);
  }
  
  // 箭头指向按钮（内层白色）
  &::before {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 0 5px 7px;
    border-color: transparent transparent transparent rgba(255, 255, 255, 0.98);
    margin-left: -1px;
  }
}

// 二维码弹层（如截图：气泡包裹二维码 + 文案）
.sidebar-popover {
  position: absolute;
  right: calc(100% + 14px);
  top: 50%;
  transform: translateY(-50%) translateX(-10px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 1200;
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-popover-inner {
  width: 240px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 250, 252, 0.96) 55%,
    rgba(255, 255, 255, 0.98) 100%);
  border: 1px solid rgba(255, 107, 157, 0.14);
  border-radius: 16px;
  box-shadow:
    0 18px 42px -28px rgba(255, 107, 157, 0.38),
    0 14px 24px -20px rgba(0, 0, 0, 0.22);
  padding: 12px 12px 10px;
  position: relative;
}

.sidebar-popover-inner::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 9px 0 9px 11px;
  border-color: transparent transparent transparent rgba(255, 107, 157, 0.14);
}

.sidebar-popover-inner::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 0 8px 10px;
  border-color: transparent transparent transparent rgba(255, 255, 255, 0.98);
  margin-left: -1px;
}

.sidebar-qr-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  background:
    radial-gradient(circle at 20% 15%, rgba(255, 107, 157, 0.12), transparent 55%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.035) 0%, rgba(0, 0, 0, 0.015) 100%),
    repeating-linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.06) 0,
      rgba(0, 0, 0, 0.06) 10px,
      rgba(0, 0, 0, 0.02) 10px,
      rgba(0, 0, 0, 0.02) 20px
    );
  border: 1px solid rgba(255, 107, 157, 0.14);
  box-shadow:
    0 14px 26px -20px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.sidebar-popover-meta {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.sidebar-popover-title {
  font-size: 14px;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.88);
  letter-spacing: 0.2px;
  line-height: 1.2;
}

.sidebar-popover-subtitle {
  font-size: 12px;
  font-weight: 400;
  color: rgba(71, 85, 105, 0.85);
  letter-spacing: 0.2px;
  line-height: 1.2;
}

// 返回顶部按钮
.back-to-top-btn {
  animation: sidebarFadeInUp 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: linear-gradient(135deg, 
      rgba(255, 107, 157, 0.1) 0%, 
      rgba(255, 182, 193, 0.15) 100%);
    border-color: var(--color-romantic);
    color: var(--color-romantic);
  }
}

@keyframes sidebarFadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
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

@media (max-width: 1200px) {
  .activities-updates-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .home-content {
    padding: 16px 0 32px;
  }

  .container {
    padding: 0 16px;
  }
  
  .activities-updates-section {
    margin-top: 32px;
    margin-bottom: 32px;
  }
  
  .activities-updates-container {
    gap: 16px;
  }
  
  .activities-section,
  .updates-section {
    padding: 12px 20px 20px 20px; // 顶部 padding 减小为 12px
    border-radius: 16px;
  }
  
  .section-header {
    margin-top: 0 !important;
    margin-bottom: 16px;
    padding-top: 0 !important;
    padding-bottom: 10px;
  }
  
  .academy-section {
    margin-top: 32px;
    margin-bottom: 32px;
  }
  
  .academy-container {
    padding: 20px;
  }
  
  .matchmaker-section {
    margin-top: 32px;
    margin-bottom: 16px;
  }
  
  .matchmaker-container {
    padding: 20px;
  }
  
  .matchmaker-empty {
    padding: 50px 30px;
  }
  
  .matchmaker-empty-icon {
    font-size: 56px;
    margin-bottom: 18px;
  }
  
  .matchmaker-empty-text {
    font-size: 15px;
  }
  
  .site-footer {
    margin-top: 16px;
  }
  
  .footer-container {
    padding: 36px 24px 24px;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  
  .footer-links {
    gap: 40px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .footer-qrcodes {
    justify-content: center;
  }
  
  .footer-contact {
    align-items: center;
    text-align: center;
  }
  
  .academy-content {
    gap: 20px;
  }
  
  .academy-main {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  .academy-card-image {
    height: 200px;
  }
  
  .academy-card-title {
    font-size: 14px;
    padding: 14px 16px;
  }
  
  .academy-article-list {
    padding: 20px 18px;
    gap: 10px;
  }
  
  .academy-ranking {
    padding: 18px;
  }
  
  .section-title-text {
    font-size: 16px;
  }
  
  .activity-card {
    flex-direction: column;
  }
  
  .activity-image {
    width: 100%;
    min-width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
  }
  
  .activity-content {
    padding: 16px;
  }
  
  .activity-title {
    font-size: 15px;
    margin-bottom: 12px;
  }
  
  .update-item {
    padding: 10px;
    gap: 10px;
  }
  
  .update-avatar {
    width: 44px;
    height: 44px;
  }
  
  .update-action {
    font-size: 13px;
  }
  
  .update-member-info {
    font-size: 12px;
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

  .activities-updates-container {
    grid-template-columns: 1fr;
    gap: 16px;
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

  .activities-updates-section {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .activities-updates-container {
    gap: 14px;
  }

  .activities-section,
  .updates-section {
    padding: 10px 14px 14px 14px; // 顶部 padding 减小为 10px
    border-radius: 12px;
  }

  .section-header {
    margin-top: 0 !important;
    margin-bottom: 12px;
    padding-top: 0 !important;
    padding-bottom: 10px;
  }

  .section-title-text {
    font-size: 16px;
  }

  .section-icon {
    width: 18px;
    height: 18px;
  }

  .more-btn,
  .more-link,
  .academy-more-link,
  .matchmaker-more-link {
    font-size: 12px;
    padding: 4px 8px;
  }

  .activities-list {
    gap: 12px;
  }

  .activity-card {
    flex-direction: column;
    border-radius: 12px;
  }
  
  .activity-image {
    width: 100%;
    min-width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
  }

  .activity-content {
    padding: 12px;
  }

  .activity-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .activity-info {
    gap: 5px;
  }

  .activity-info-item {
    font-size: 11px;
    gap: 6px;

    svg {
      width: 12px;
      height: 12px;
    }
  }

  .updates-list {
    gap: 8px;
  }

  .update-item {
    padding: 8px 10px;
    gap: 8px;
  }

  .update-avatar {
    width: 36px;
    height: 36px;

    .avatar-text {
      font-size: 12px;
    }
  }

  .update-action {
    font-size: 12px;
    margin-bottom: 4px;
  }

  .update-member-info {
    font-size: 11px;
  }
  
  .academy-section {
    margin-top: 24px;
    margin-bottom: 24px;
  }
  
  .academy-container {
    padding: 16px;
    border-radius: 16px;
  }
  
  .academy-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .academy-nav-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
  }
  
  .academy-tabs {
    flex-wrap: wrap;
    gap: 6px;
    width: 100%;
  }
  
  .academy-tab {
    font-size: 13px;
    padding: 6px 12px;
  }
  
  .academy-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .academy-main {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .academy-card-image {
    height: 200px;
  }
  
  .academy-card-title {
    font-size: 14px;
    padding: 14px 16px;
  }
  
  .academy-article-list {
    padding: 18px 16px;
    gap: 10px;
  }
  
  .academy-ranking {
    padding: 18px;
    position: static;
    height: auto;
  }
  
  .article-text {
    font-size: 13px;
  }
  
  .ranking-title {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .ranking-item {
    padding: 10px 0;
    gap: 12px;
  }
  
  .ranking-number {
    width: 26px;
    height: 26px;
    font-size: 13px;
  }
  
  .ranking-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .academy-main {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .academy-card-image {
    height: 180px;
  }
  
  .academy-card-title {
    font-size: 13px;
    padding: 12px 14px;
  }
  
  .academy-article-list {
    padding: 16px 14px;
    gap: 8px;
  }
  
  .academy-ranking {
    padding: 16px;
    height: auto;
  }
  
  .article-text {
    font-size: 12px;
  }
  
  .article-list-item {
    padding: 6px 0;
    gap: 8px;
  }
  
  .ranking-title {
    font-size: 15px;
    margin-bottom: 14px;
  }
  
  .ranking-item {
    padding: 8px 0;
    gap: 10px;
  }
  
  .ranking-number {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  .ranking-text {
    font-size: 12px;
  }
  
  .matchmaker-section {
    margin-top: 24px;
    margin-bottom: 12px;
  }
  
  .matchmaker-container {
    padding: 16px;
    border-radius: 16px;
  }
  
  .matchmaker-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .matchmaker-title-text {
    font-size: 16px;
  }
  
  .matchmaker-icon {
    width: 24px;
    height: 24px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .matchmaker-more-link {
    font-size: 13px;
    padding: 5px 12px;
    align-self: flex-end;
  }
  
  .matchmaker-empty {
    padding: 40px 20px;
  }
  
  .matchmaker-empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .matchmaker-empty-text {
    font-size: 14px;
  }
  
  .site-footer {
    margin-top: 12px;
  }
  
  .footer-container {
    padding: 28px 16px 20px;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 28px;
    margin-bottom: 28px;
    padding-bottom: 28px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 28px;
  }
  
  .footer-column {
    min-width: auto;
    text-align: center;
  }
  
  .footer-column-title {
    font-size: 16px;
    margin-bottom: 14px;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  
  .footer-link {
    font-size: 13px;
  }
  
  .footer-qrcodes {
    gap: 24px;
    justify-content: center;
  }
  
  .qrcode-box {
    width: 110px;
    height: 110px;
    padding: 12px;
  }
  
  .qrcode-placeholder {
    svg {
      width: 75px;
      height: 75px;
    }
    
    &.empty svg {
      width: 60px;
      height: 60px;
    }
  }
  
  .qrcode-logo {
    width: 28px;
    height: 28px;
    margin-top: 6px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  .qrcode-label {
    font-size: 12px;
  }
  
  .contact-phone {
    justify-content: center;
  }
  
  .phone-number {
    font-size: 18px;
  }
  
  .contact-desc {
    font-size: 13px;
    text-align: center;
  }
  
  .contact-btn {
    padding: 12px 24px;
    font-size: 14px;
    width: 100%;
    max-width: 220px;
  }
  
  .copyright-text {
    font-size: 12px;
    line-height: 1.6;
  }
}
</style>

