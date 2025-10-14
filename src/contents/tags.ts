import type { WritingItem } from "./type";

export const countTagUsage = ({
  items,
  limit,
}: {
  items: WritingItem[];
  limit?: number;
}): Map<string, number> => {
  // itemsのtag出現数をカウントしてMapにまとめる
  const tagCountMap = items.reduce((map, item) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag) => {
        const encodedTag = encodeURI(tag);
        map.set(encodedTag, (map.get(encodedTag) || 0) + 1);
      });
    }
    return map;
  }, new Map<string, number>());

  // limitが指定されている場合、出現数の多い順にソートして制限を適用
  if (limit !== undefined) {
    return new Map(
      [...tagCountMap.entries()]
        .sort((a, b) => b[1] - a[1]) // 出現数の降順にソート
        .slice(0, limit), // 上位limit件を取得
    );
  }

  return tagCountMap;
};
