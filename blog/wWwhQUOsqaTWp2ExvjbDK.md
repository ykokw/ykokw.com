---
title: "サイトの開発環境としてDev Containersを用意してClaude Codeを動作させる"
tags: ["Claude Code", "Dev Containers", "Astro"]
publishedDate: "2025-09-11"
lastEditedDate: "2025-12-12"
published: true
---

## 2つあるDev ContainersへのClaude Code導入方法

- [開発コンテナ - Anthropic](https://docs.anthropic.com/ja/docs/claude-code/devcontainer) を参照
  - リポジトリからdevcontainer.jsonとDockerfile、init-firewall.shをコピーしてくる
- [anthropics/devcontainer-features](https://github.com/anthropics/devcontainer-features) を使う
  - node.jsがセットアップされたdevcontainer.jsonにfeatureとして追加するだけ

使い分けをClaudeに聞いたら以下の通りだった。

> devcontainer-featuresを選ぶべき場合：
>
> すでにプロジェクトでdevcontainerを使っている
> シンプルにClaude Code CLIツールだけ追加したい
> 既存の開発環境を大きく変更したくない
>
> claude-code/.devcontainerを選ぶべき場合：
>
> 新規プロジェクトでClaude Codeを中心に開発したい
> ネットワーク設定など細かい制御が必要
> Claude Codeのベストプラクティス設定をそのまま使いたい

## このサイトの開発環境用に変えたところ

- Zennから記事を取ってくるので、 `init-firewall.sh` で `zenn.dev` にアクセスできるよう許可ドメインとして追加
- devcontainer.json編集
  - AstroのVS Code拡張を追加
    - 他にも普段利用している拡張をdevcontainer.jsonに含めそうだったが避けた
      - プロジェクト関係なく入れている拡張はユーザー設定でデフォルトとして設定できる
      - 参考: [devcontainerでインストールしたい拡張を共通化する #VSCode - Qiita](https://qiita.com/fussy113/items/1ce6875660be9c9a5dc4)
  - ポートフォワーディングの設定を追加

## Astroの開発サーバーを開くときは--hostをつける

コンテナ内で起動した開発サーバーにアクセスしたいので--hostオプションが必要だった。
オプションをつけて起動したうえで、ブラウザではlocalhostにアクセスする。

## Claude Codeのログインを完了できない

Dev Containers環境でClaudeをスタートしたときの認証で、
Web UI経由で認証しようとしたら、アプリ（Claude Code）の承認をしても処理が完了しなかった。

承認後ローディングのままのURLをよく見たらlocalhostのランダムポートにリダイレクトしようとしていて、
コンテナがそのポートをフォワーディングしていないのでアクセスできるはずがなかった。

自動で開くURLではなく、Claude Codeに表示される `Browser didn't open? Use the url below to sign in:` のURLの方を開くと
承認後にコードをClaude Codeに貼り付けてログイン完了とするフローになる。

これに気づかないで時間を無駄にしてしまった...
