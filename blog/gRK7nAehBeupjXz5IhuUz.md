---
title: "Dev Containersの雑記"
tags: ["pnpm", "Dev Containers", "Claude Code"]
publishedDate: "2025-12-12"
lastEditedDate: "2025-12-12"
published: true
---

## 概要

- Dev Containersを用意しようと考えた
  - Claude Code用のドキュメントをみかけて気になった
    - 参考: [Development containers](https://code.claude.com/docs/en/Dev Containers)
  - サプライチェーン攻撃の影響を小さくするのにDev Containersが有効そうと思った
    - 参考: [サプライチェーン攻撃への防御策](https://blog.jxck.io/entries/2025-09-20/mitigate-risk-of-oss-dependencies.html)
- 設定で紆余曲折した
  - Claude Codeのお手本は利用せずにdevcontainer.jsonを用意した
  - いったんは普段使いせずにGithub Codespacesを利用する場合などに利用しようと考えた

## Claude Code用のDev Containers

- Claude Codeのお手本では、コンテナ内でファイアウォールを設定し通信を許可したいドメインのリストをベースにIPアドレスを設定している
- YOLOモードをローカル環境でやらない限りはDev Containers不要と考えた
  - 権限設定、サンドボックスとClaude Code on the Webでセキュリティリスクを減らせると考えてDev Containersの優先度は下がった

### Claude Codeの設定ファイル

- `--dangerously-skip-permissions` を防ぐ
- 許可コマンド、拒否コマンドの設定
  - 気になるissueを見かけたのでBashのいろんなコマンドを防ぐことにした
  - https://github.com/anthropics/claude-code/issues/5892
  - 権限スキップとはいえ、間違えてコマンド実行を承認しちゃうこともありうる（承認疲れというらしい）
  - （防ぎたいコマンドを網羅できているわけではないので、あくまで気休めであるのは否めない...）
- サンドボックス有効化
  - [サンドボックス](https://code.claude.com/docs/en/sandboxing)
  - Dev Containers環境でsandboxを有効化しようとすると追加のケイパビリティが必要そうだったので、余計な権限付与を避けたかった
  - `autoAllowBashIfSandboxed: false` で明示的な承認を必須に
  - `excludedCommands: ["pnpm install"]` でpnpm installだけサンドボックス外で実行
    - サンドボックス実行するとエラーになる

### サンドボックス設定のenableWeakerNestedSandboxの詳細を見た

- enableWeakerNestedSandboxがコンテナ環境用として設定可能になっている
  - プロセス分離をコンテナに委譲してBubblewrap（Linuxでサンドボックス環境を設定するツール..?）の--procオプション指定が省かれそうだった
  - [該当コード](https://github.com/anthropic-experimental/sandbox-runtime/blob/826ed320b411816feea11659594568585cca58fe/src/sandbox/linux-sandbox-utils.ts#L787)

## Dev Containersの構成

### 基本機能のインストール

- `mcr.microsoft.com/devcontainers/base:bookworm` をベースイメージに
- `ghcr.io/devcontainers/features/node` featureでNode.jsとpnpmをインストール

### リソース制限とセキュリティ

Dev Containersに以下の制限を設定:

```json
"runArgs": [
  "--security-opt=no-new-privileges:true",
  "--cpus=2",
  "--memory=4g",
  "--pids-limit=100",
  "--tmpfs=/tmp:rw,noexec,nosuid"
]
```

- `--security-opt=no-new-privileges:true`: 権限昇格を防止
- `--cpus=2`, `--memory=4g`: ホストマシンのリソースを保護
- `--pids-limit=100`: プロセス数制限でフォーク爆弾を防ぐ
- `--tmpfs=/tmp:rw,noexec,nosuid`: 一時ファイル領域をセキュア化

## npm → pnpm への移行

- pnpmを選んだ理由
  - ディスク容量の節約（ハードリンクベース）
  - インストール速度の向上
    - git worktreeを追加したあとpnpm installしてもダウンロードがされないetc...
  - 厳密な依存関係管理（phantom dependencies回避）
  - minimumReleaseAge設定などでのサプライチェーン攻撃の影響を小さくできる
    - 参考: [Mitigating supply chain attacks](https://pnpm.io/supply-chain-security)

### pnpmのDev Containersが難しい

- storeに依存関係が集約され、node_modulesからはハードリンクが作成される
- ほかのプロジェクトでもpnpm storeを再利用できるようにvolumeとしてマウントすると、違うディスク扱いになりハードリンクが作成されない
  - https://pnpm.io/ja/docker
  - store のパスを固定化（ボリュームのパスを指定）するとファイルコピーになってしまいpnpmのメリットがなくなってしまう
    - https://pnpm.io/ja/faq#does-pnpm-work-across-different-subvolumes-in-one-btrfs-partition
- node_modulesをボリュームマウントしてディスクパフォーマンスを改善しようとしたときも、モジュールがコピーされてしまう
  - https://code.visualstudio.com/remote/advancedcontainers/improve-performance#_use-a-targeted-named-volume
- 現状の最善策はReopen in containerの代わりにClone Repository in volumeしてもらうことになりそう
  - https://stackoverflow.com/questions/77099690/how-do-i-make-pnpm-work-as-intended-in-a-vscode-dev-container?utm_source=chatgpt.com
  - （CursorのDev Containers拡張ではClone Repositoryに対応してなさそうだった）
  - https://forum.cursor.com/t/anysphere-dev-container-clone-repository-in-container-volume/133532
