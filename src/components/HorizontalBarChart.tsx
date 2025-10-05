interface PieChartProps {
  data: [string, number][];
}

export default function HorizontalBarChart({ data }: PieChartProps) {
  if (data.length === 0) {
    return <p className="text-blue-white text-sm">タグがありません</p>;
  }

  const maxCount = Math.max(...data.map(([, count]) => count));

  return (
    <div className="w-full">
      <div className="grid gap-2 items-center [grid-template-columns:auto_1fr_auto]">
        {data.map(([tag, count]) => (
          <>
            <a
              href={`/tags/${tag}`}
              className="text-blue-white hover:text-light-blue text-right text-xs underline underline-offset-4 transition-colors duration-500 ease-in-out sm:text-sm"
            >
              {tag}
            </a>
            <div className="relative h-4 self-center">
              <div
                className="bg-light-blue h-full rounded transition-all"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <div className="text-blue-white text-xs sm:text-sm">{count}</div>
          </>
        ))}
      </div>
    </div>
  );
}
