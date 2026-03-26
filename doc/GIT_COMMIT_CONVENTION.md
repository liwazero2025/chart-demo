# Git 提交信息规范

本文档定义本项目的 Git 提交信息格式规范，便于后期查找、追溯和自动生成 Changelog。

---

## 提交信息格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

---

## 提交类型（Type）

| 类型 | 说明 | 示例 |
|-----|------|------|
| `feat` | 新功能 | `feat: 添加用户登录功能` |
| `fix` | 修复 Bug | `fix: 修复登录按钮无响应` |
| `docs` | 文档变更 | `docs: 更新 API 文档` |
| `style` | 代码格式（不影响逻辑） | `style: 格式化缩进` |
| `refactor` | 重构（既不修复也不添加功能） | `refactor: 优化查询逻辑` |
| `perf` | 性能优化 | `perf: 减少数据库查询次数` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建/工具/依赖 | `chore: 升级 React 版本` |
| `ci` | CI/CD 配置 | `ci: 修改 GitHub Actions` |
| `revert` | 回滚提交 | `revert: 撤销错误提交` |

---

## 范围（Scope）

可选，表示影响的模块/组件：

| 范围 | 说明 |
|-----|------|
| `api` | API 接口相关 |
| `ui` | UI 组件相关 |
| `chart` | 图表相关 |
| `route` | 路由相关 |
| `test` | 测试相关 |
| `config` | 配置相关 |
| `deps` | 依赖相关 |

示例：
```
feat(chart): add radar score visualization
fix(api): handle null response in user query
```

---

## 主题（Subject）

- 不超过 50 个字符
- 动词开头，**不要大写首字母**
- **不要以句号结尾**
- 使用**现在时/祈使语气**（"添加" 而非 "添加了"）

```bash
✅ feat: add user authentication
❌ feat: Added user authentication.
❌ feat: 添加了用户认证功能。
```

---

## 正文（Body）

可选，用于详细说明：

- 空一行后写
- 每行不超过 72 个字符
- 说明**为什么**和**是什么**，不是**怎么做**

```markdown
feat: add user authentication

Implement JWT-based authentication for API endpoints.
This allows stateless auth and reduces database queries.

Closes #123
```

---

## 脚注（Footer）

用于关联 Issue 或标记破坏性变更：

```
BREAKING CHANGE: 移除旧的 auth API
Closes #123
Relates #456
```

---

## 完整示例

```markdown
feat(chart): add score threshold highlighting

Highlight sectors when score exceeds 80 for better visibility.
Uses ECharts emphasis configuration for visual feedback.

Closes #15
```

---

## 提交信息搜索技巧

```bash
# 按类型搜索
git log --oneline --grep="^feat"

# 按范围搜索
git log --oneline --grep="(chart)"

# 按作者搜索
git log --oneline --author="spy"

# 按日期范围
git log --oneline --since="2024-01-01" --until="2024-12-31"

# 查看某文件的修改历史
git log --oneline -- src/charts/radarScoreOption.ts

# 图形化查看
git log --graph --oneline --all --decorate

# 生成 Changelog
git log --pretty=format:"- %s" --grep="^feat" v1.0.0..HEAD
```

---

## 提交模板配置

项目已配置提交模板 `.gitmessage`，使用：

```bash
git config commit.template .gitmessage
```

提交时会自动加载模板，引导填写规范信息。

---

## 好 vs 坏的提交信息

| 差的提交信息 | 好的提交信息 |
|-------------|-------------|
| `update` | `feat(auth): add OAuth2 login support` |
| `fix bug` | `fix(api): handle null response in user query` |
| `修改代码` | `refactor(chart): extract color palette to constants` |
| `2024-01-01 更新` | `docs(readme): add installation guide` |
| `WIP` | `feat(nav): implement responsive mobile menu` |

---

## 相关工具

- **commitlint**: 强制检查提交信息格式
- **husky**: Git hooks，提交前自动检查
- **standard-version**: 自动生成版本和 Changelog
