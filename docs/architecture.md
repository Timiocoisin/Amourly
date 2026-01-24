# 项目架构规划（婚恋平台）

## 总体说明
- 技术栈：后端 `FastAPI`（Python），前端 `Vue 3`（Vite），数据库 `MySQL`。
- 暂不引入 `Redis`，缓存与队列后续按需再加。
- 采用单仓库多应用结构：后台管理、PC 端、H5 端、后端服务分离。

## 目录结构（建议）
```
Amourly/
  backend/                # 后端 FastAPI
  admin-web/              # 后台管理系统（Vue3）
  pc-web/                 # PC 端网页（Vue3）
  h5-web/                 # 移动端 H5（Vue3）
  docs/                   # 项目文档
```

## 后端（FastAPI）目录规划
```
backend/
  app/
    main.py               # 应用入口
    core/                 # 配置、日志、异常、中间件
    api/                  # API 路由层
      v1/
        routes/           # 按模块拆分路由
    models/               # ORM 模型（SQLAlchemy）
    schemas/              # Pydantic 数据模型
    services/             # 业务逻辑层
    repositories/         # 数据访问层
    deps/                 # 依赖注入与安全鉴权
    utils/                # 通用工具
  migrations/             # Alembic 迁移
  tests/                  # 后端测试
  requirements.txt
```

## 前端（Vue3）通用目录规划
```
*/ (admin-web | pc-web | h5-web)
  src/
    api/                  # 接口封装
    assets/               # 静态资源
    components/           # 通用组件
    views/                # 页面
    router/               # 路由
    store/                # 状态管理（Pinia）
    utils/                # 工具函数
    types/                # TS 类型
    styles/               # 全局样式
  public/
  vite.config.ts
  package.json
```

## 模块划分（建议）
- 用户体系：注册登录、实名认证、资料管理
- 婚恋功能：匹配推荐、搜索筛选、喜欢/收藏、黑名单
- 互动功能：私信、动态（可选）、举报
- 支付体系：会员、增值服务、订单
- 运营后台：用户管理、审核、内容管理、订单管理、统计报表

## 环境与配置
- 后端：使用 `.env` 管理数据库连接与密钥。
- 前端：使用多环境 `env` 文件，区分开发/测试/生产。

## 说明
本规划为初始版本，后续可根据功能复杂度逐步引入缓存、搜索、消息队列等基础设施。

