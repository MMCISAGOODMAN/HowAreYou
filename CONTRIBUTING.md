# 怎么把你的状态放进来

如果你是第一次给开源项目提 PR，欢迎。这里的步骤按「从没做过」来写。卡住了不是你的问题，是我们没写清楚——在 PR 或 Issue 里喊一声就好。

有两种方式，选一个舒服的就行。

```
想写下状态
├── 方式一：自己发 Pull Request（推荐，也是一次很轻的开源练习）
└── 方式二：开 Issue，维护者帮你放进仓库（完全不会 Git 也可以）
```

---

## 方式一：用 Pull Request

仓库：https://github.com/MMCISAGOODMAN/HowAreYou

### 1. Fork 这份仓库

打开上面的地址，点右上角 **Fork**，把它复制到你自己的账号下。等几秒，页面会跳到 `你的用户名/HowAreYou`。

### 2. 进入 `profiles/` 文件夹

在你 Fork 出来的仓库里，点开 `profiles/` 目录。

### 3. 新建文件

点 **Add file → Create new file**。

文件名请写成：

```
@你的GitHubID.md
```

例如你的 GitHub 用户名是 `linus`，文件就是 `@linus.md`。注意前面有一个 `@`，后缀是 `.md`。一个人对应一份档案，请不要用别人的 ID。

### 4. 把模板贴进去，换成你的话

打开 [TEMPLATE.md](TEMPLATE.md)，整份复制到新文件里。把方括号提示删掉，按问题写自己的答案。

写得随便一点完全没问题。拼写、标点、要不要留示例句，都不构成「不合格」。

### 5. 提交这个文件

滚到页面底部：

- Commit message 可以写：`Add profile @你的GitHubID`
- 点 **Commit new file**

### 6. 打开 Pull Request

回到你的仓库页面，通常会看到 **Contribute → Open pull request**。没有的话：点 **Pull requests → New pull request**，确认比较的是：

- 左边（base）：`MMCISAGOODMAN/HowAreYou` 的 `master`
- 右边（head）：你的 Fork 和刚提交的分支

标题可以沿用 commit 那句。描述随便写一句「这是我此刻的状态」就够了。然后点 **Create pull request**。

### 7. 等一等，或喊一声

维护者会看一眼文件名和基本格式，然后合并。  
如果 GitHub 提示有冲突、按钮是灰色、或者你不确定点没点对——**直接在 PR 下面留言**。我们一起弄，不需要你去学 rebase。

合并之后，你的文件会出现在 `profiles/` 里。你已经把真实的自己，写进这本编年史了。

---

## 方式二：用 Issue（不会 Git 也行）

1. 打开 [TEMPLATE.md](TEMPLATE.md)，在本地记事本或任何地方填好。
2. 到仓库开一个新 Issue：https://github.com/MMCISAGOODMAN/HowAreYou/issues/new
3. 标题写：`[profile] @你的GitHubID`
4. 正文把填好的内容整段贴进去。
5. 提交 Issue。

维护者会帮你创建 `profiles/@你的GitHubID.md`。你仍然算完整的参与者——开源从来不是只有会敲 Git 的人才配留下痕迹。

---

## 以后想更新怎么办

人会变，状态也会变。再走一遍方式一，**改你自己的那份文件**即可，不要新开第二份。Issue 渠道同样可以：「我想把困惑那一段换成……」

---

## 一点点放心的话

- 第一次参与开源，紧张是正常的。这份仓库就是为这种紧张准备的。
- 没有「写得不够好」这回事。卡 CORS 的下午、害怕被开除的早晨，都是合格内容。
- 规则很短，在 [README.md](README.md) 里：真实、尊重、不为了炫技。
- 你不欠任何人一份漂亮的自我介绍。你只是来回答一句：最近，你还好吗？

谢谢你愿意被看见。
