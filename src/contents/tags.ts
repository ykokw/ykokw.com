import type { WritingItem } from "./type";

const slugify = (text: string) => {
  return text
    .normalize("NFKD") // アクセント除去
    .replace(/[^\w\s-]/g, "") // 英数字・アンダースコア・ハイフン以外除去
    .trim()
    .replace(/\s+/g, "-") // 空白をハイフンに
    .toLowerCase();
};

type TagUsageMap = Map<string, { label: string; count: number }>;

export const countTagUsage = ({
  items,
  limit,
}: {
  items: WritingItem[];
  limit?: number;
}): TagUsageMap => {
  // itemsのtag出現数をカウントしてMapにまとめる
  const tagCountMap = items.reduce((map, item) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag) => {
        const slug = slugify(tag);
        const existing = map.get(slug);
        map.set(slug, { label: tag, count: (existing?.count || 0) + 1 });
      });
    }
    return map;
  }, new Map());

  // limitが指定されている場合、出現数の多い順にソートして制限を適用
  if (limit !== undefined) {
    return new Map(
      [...tagCountMap.entries()]
        .sort((a, b) => b[1].count - a[1].count) // 出現数の降順にソート
        .slice(0, limit), // 上位limit件を取得
    );
  }

  return tagCountMap;
};
