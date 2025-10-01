```markdown
[![Build Status](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml/badge.svg)](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 计算器套件

一个轻量级的 Next.js 应用，提供计算器功能。本仓库当前包含物价计算器模块，提供商品管理、单价计算与价格历史功能。

## 主要特性

- **API 缓存代理**：为公共 API 提供缓存层，减少直接调用并提升响应速度
- **物价计算服务**：内置用于定价与商品相关数据的计算工具，支持商品查询、推荐价与价格历史管理
- **MCP（机器控制协议）支持**：为与 AI agent 及自动化系统集成提供标准化工具接口
- **开发者友好**：清晰的 RESTful 风格 API 设计，支持 JWT 身份认证与 2FA（可选）
  你可以将此应用部署到 Vercel，或在本地运行以进行开发。

### 环境变量

参考仓库根目录下的 `.env.example` 以配置所需环境变量。常见变量：

- `JWT_SECRET`：JWT 签名密钥
- `JWT_EXPIRES_IN`：JWT 过期时间
- `ACCESS_2FA_SECRET`：2FA 秘钥（可选）
- `ACCESS_USERNAME`：管理员用户名
- `ACCESS_PASSWORD`：管理员密码

## 说明

- 项目使用 GitHub Gist 持久化商品与历史数据（参见 `app/actions/prices/*`），如需持久化请确保配置 `GIST_ID` 与 `GIST_TOKEN`。
- 本 README 聚焦应用使用；之前模板中的 MCP/工具化细节已根据需要调整或移除。
```
