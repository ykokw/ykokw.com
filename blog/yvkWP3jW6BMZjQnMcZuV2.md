---
title: "アイコンをSVGファイルで運用していくことにした"
tags: ["Icon", "SVG", "Material Symbols", "Web Performance"]
publishedDate: "2025-10-04"
lastEditedDate: "2025-10-04"
published: true
---

## はじめに

このブログでは以前からMaterial Symbolsのアイコンフォントを使用していました。[フォント設定を最適化した際](/l3mZcG_34Zk4N8m0rL_CM)に、必要なアイコンだけを選択的に読み込むよう改善していましたが、さらなるパフォーマンス向上を目指してSVGファイルでの運用に切り替えることにしました。

## 変更のきっかけ

FontsourceのMaterial Symbolsパッケージを検討している際に、気になるIssueを発見しました。

https://github.com/fontsource/fontsource/issues/497#issuecomment-1705761024

このIssueで議論されている内容を踏まえ、自分のブログの使用状況を振り返ってみました：

- 使用しているアイコンは数個程度
- フォント全体を読み込むにはオーバーヘッドが大きい
- SVGでの運用により、バンドルサイズとページ初期表示を改善できる可能性

これらの理由から、SVGファイルでの運用に切り替えることを決めました。

## 実装の変更点

### Before: Material Symbolsフォント

```css
/* フォントファミリーの読み込み */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}
```

```html
<!-- アイコンの使用 -->
<span class="material-symbols-outlined">open_in_new</span>
```

### After: SVGファイル

各アイコンを個別のSVGファイルとして保存し、必要な箇所でインポートして使用するように変更しました。

```tsx
// アイコンコンポーネントとして実装
import OpenInNewIcon from '../assets/icons/open-in-new.svg';

<OpenInNewIcon className="w-4 h-4" />
```

## パフォーマンスの改善効果

### 初期表示の改善

最も体感できる改善点は、初期表示時のアイコン表示タイミングです。

**以前（フォント使用時）：**
- ページ読み込み後、フォントファイルのダウンロードを待つ
- フォント読み込み完了までアイコンが表示されない、または代替文字が表示される
- アイコンが遅れて表示され、レイアウトシフトが発生する可能性

**現在（SVG使用時）：**
- HTMLと同時にアイコンが表示される
- フォント読み込み待機時間の排除
- レイアウトシフトの解消

### バンドルサイズの最適化

フォント全体ではなく、使用する個別のSVGファイルのみがバンドルに含まれるため、不要なデータの読み込みを削減できました。

## 課題と今後の改善点

### 測定の不備

今回の変更では、バンドルサイズやCore Web Vitalsの詳細な測定を事前・事後で行うことを忘れてしまいました。今後同様の最適化を行う際は、以下を測定する必要があります：

- バンドルサイズの変化
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

### アイコン管理の複雑化

SVGファイル個別管理により、以下の課題が生じる可能性があります：

- アイコンファイルの個別管理が必要
- 新しいアイコン追加時の手順が増加
- 一貫性のあるスタイリングの維持

## まとめ

少数のアイコンしか使用しない場合、SVGファイルでの運用はフォントアイコンよりも効率的であることが分かりました。特に初期表示パフォーマンスの改善は体感できるレベルでした。

ただし、次回同様の最適化を行う際は、定量的な測定も忘れずに行い、改善効果をより明確に把握したいと思います。

### 使い分けの指針

- **SVGが適している場合：** 使用アイコン数が少ない、パフォーマンスを重視する
- **フォントアイコンが適している場合：** 多数のアイコンを使用、動的にアイコンを変更する必要がある
