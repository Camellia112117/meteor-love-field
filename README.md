# Meteor Love Field

一个基于摄像头手势识别的流星、烟花、文字粒子和气球照片互动网页。

## 手势

- 张开手掌：恢复流星夜
- 食指和大拇指捏合：选中一颗流星变成照片
- 握拳：烟花绽放
- 数字 1：显示 `Chen Yun & Song Bingbing` 粒子文字
- 数字 2：显示 `happiness forever` 粒子文字
- 数字 3：气球带照片升空

## 本地运行

```powershell
node server.js
```

然后打开：

```text
http://127.0.0.1:5173
```

## 部署说明

部署到 GitHub Pages、Netlify 或 Vercel 后，需要使用 HTTPS 链接打开，摄像头权限才会正常工作。
