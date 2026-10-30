# HanKO 柯承翰 · Portfolio

柯承翰（Cheng-Han Ko）的個人作品集網站，支援繁體中文、English、Italiano 三種語言（右上角切換）。
純靜態網站：一個 `index.html` 加上 `img/` 圖片資料夾，不需要安裝或建置。

網址：https://hankko60405-ship-it.github.io/hanko-portfolio/

## 頁面

| 頁面 | 網址 |
|---|---|
| Portfolio 作品列表 | `/` |
| 經歷 | `/#experience` |
| 個人資訊 | `/#info` |
| 各專案內頁 | `/#daxi`、`/#shennong`、`/#tangyuan`、`/#alive`、`/#bottle`、`/#afterglow`、`/#kokoland`、`/#apple` |

## 在自己電腦上預覽

```bash
python3 -m http.server 8000
```

再打開 http://localhost:8000

## 修改內容

所有文字都在 `index.html` 的 `<script>` 裡：專案在 `P`，專案的類型／客戶／團隊在 `FX`，經歷在 `CV`，個人資訊在 `INFO`。
改完後 commit 並 push 到 `main`，GitHub Pages 會在一兩分鐘內自動更新。
