<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo区域 -->
      <div class="navbar-logo" @click="goHome">
        <img src="@/assets/images/logo/logo.svg" class="logo-icon" />
      </div>

      <!-- 导航菜单 -->
      <ul class="navbar-menu">
        <li
          v-for="item in menuItems"
          :key="item.path"
          class="navbar-item"
          :class="{ active: isActive(item.path) }"
        >
          <router-link :to="item.path" class="navbar-link">
            {{ item.label }}
          </router-link>
        </li>
      </ul>

      <!-- 登录/注册按钮 -->
      <div class="navbar-actions">
        <button class="auth-button" @click="handleAuth">
          <svg
            class="auth-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="12"
              cy="7"
              r="4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>登录 | 注册</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

interface MenuItem {
  path: string
  label: string
}

const menuItems = ref<MenuItem[]>([
  { path: '/', label: '首页' },
  { path: '/my', label: '我的' },
  { path: '/match', label: '找缘分' },
  { path: '/dating', label: '约会' },
  { path: '/activities', label: '活动' },
  { path: '/matchmaker', label: '红娘' },
  { path: '/updates', label: '动态' },
  { path: '/academy', label: '学堂' }
])

const isActive = (path: string): boolean => {
  if (path === '/') {
    return route.path === '/'
  }
  // 精确匹配：路径必须完全匹配，或者后面跟着 /
  return route.path === path || route.path.startsWith(path + '/')
}

const goHome = () => {
  router.push('/')
}

const handleAuth = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
.navbar {
  background: linear-gradient(135deg, var(--color-romantic) 0%, var(--color-romantic-light) 45%, var(--color-romantic-dark) 100%);
  box-shadow: 
    0 10px 30px -12px rgba(255, 107, 157, 0.5),
    0 4px 16px -10px rgba(148, 27, 89, 0.45);
  position: relative;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
}

// Logo区域
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all var(--transition-base);
  flex-shrink: 0;
  padding: 8px;
  border-radius: var(--radius-lg);
  margin-left: -8px;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.05);
  }

  &:active {
    transform: translateY(0);
  }

  .logo-icon {
    width: 44px;
    height: 44px;
    display: block;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    transition: transform var(--transition-fast);
  }

  &:hover .logo-icon {
    transform: scale(1.05);
  }
}

// 导航菜单
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-shrink: 0;
}

.navbar-item {
  position: relative;

  &.active {
    .navbar-link {
      background: rgba(255, 255, 255, 0.18);
      color: var(--color-white);
      box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 3px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: var(--radius-full);
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
    }
  }
}

.navbar-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.2px;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  position: relative;
  white-space: nowrap;
  min-height: 44px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: rgba(255, 255, 255, 0);
    transition: background var(--transition-base);
  }

  &:hover {
    color: var(--color-white);
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15);
    
    &::before {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.1);
  }
}

// 登录/注册按钮
.navbar-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 12px;
}

.auth-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-xl);
  color: var(--color-white);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.28);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px -4px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.15);
  }

  .auth-icon {
    width: 18px;
    height: 18px;
    color: currentColor;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    transition: transform var(--transition-fast);
  }

  &:hover .auth-icon {
    transform: scale(1.1);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .navbar-container {
    padding: 0 32px;
    gap: 32px;
    height: 72px;
  }

  .navbar-menu {
    gap: 2px;
  }

  .navbar-link {
    padding: 10px 16px;
    font-size: 14px;
    min-height: 40px;
  }

  .auth-button {
    padding: 10px 24px;
    font-size: 14px;
  }
}

@media (max-width: 992px) {
  .navbar-container {
    padding: 0 24px;
    gap: 24px;
  }

  .navbar-link {
    padding: 10px 14px;
    font-size: 14px;
  }

  .auth-button {
    padding: 10px 20px;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 20px;
    height: 68px;
    gap: 16px;
  }

  .navbar-logo {
    .logo-icon {
      width: 40px;
      height: 40px;
    }
  }

  .navbar-menu {
    display: none; // 移动端可隐藏或改为汉堡菜单
  }

  .auth-button {
    padding: 10px 18px;
    font-size: 13px;

    span {
      display: none;
    }

    .auth-icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>

