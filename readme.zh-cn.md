```markdown
[![Build Status](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml/badge.svg)](https://github.com/DavidKk/vercel-openapi/actions/workflows/coverage.workflow.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 计算器套件

一个轻量级的 Next.js 应用，提供多种计算器功能，适用于不同场景的计算需求。

## 主要特性

- **API 缓存代理**：为公共 API 提供缓存层，减少直接调用并提升响应速度
- **物价计算服务**：内置用于定价与商品相关数据的计算工具，支持商品查询、推荐价与价格历史管理
  - 商品管理功能，支持单位转换和公式计算
  - 不同商品和品牌间的价格对比
  - 价格历史记录跟踪与分析
  - 用于与外部系统集成的 RESTful API
- **燃油优惠计算器**：基于充值金额和赠送金额计算燃油优惠价格，支持省份定价和折扣等级显示
  - 各省份燃油价格数据
  - 基于充值金额和赠送金额的实时折扣计算
  - 可视化折扣等级显示（超级划算、价格合理、可以接受等）
  - 支持全屏模式的响应式用户界面
- **MCP（机器控制协议）支持**：为与 AI agent 及自动化系统集成提供标准化工具接口
- **开发者友好**：清晰的 RESTful 风格 API 设计，支持 JWT 身份认证与 2FA（可选）
  你可以将此应用部署到 Vercel，或在本地运行以进行开发。

## 安全注意事项

- 所有 API 请求都需要 JWT 身份认证 - 请确保密钥安全
- 2FA 验证是可选的，但强烈建议在生产环境中使用
- 定期轮换 JWT_SECRET 和 2FA_SECRET 以提高安全性

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
