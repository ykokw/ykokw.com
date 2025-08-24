#!/usr/bin/env node

import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

// 現在の日付をYYYY-MM-DD形式で取得
const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// nanoidでファイル名を生成
const fileId = nanoid();
const currentDate = getCurrentDate();

// フロントマターテンプレート
const frontmatter = `---
title: ""
tags: []
publishedDate: "${currentDate}"
lastEditedDate: "${currentDate}"
published: false
---

`;

// ファイルパス
const blogDir = path.join(process.cwd(), "blog");
const filePath = path.join(blogDir, `${fileId}.md`);

// blogディレクトリが存在しない場合は作成
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// ファイルを作成
fs.writeFileSync(filePath, frontmatter);

console.log(`New blog post created: ${filePath}`);
console.log(`File ID: ${fileId}`);
