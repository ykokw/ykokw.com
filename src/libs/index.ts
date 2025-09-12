import fs from "fs";
import path from "path";

let fontBizUdpgothic: ArrayBuffer | null = null;

const URL_BIZ_UDPGOTHIC =
  "https://cdn.jsdelivr.net/fontsource/fonts/biz-udpgothic@latest/japanese-400-normal.ttf";

export const fetchFontBizUdpgothic = async () => {
  if (fontBizUdpgothic) {
    return fontBizUdpgothic;
  }
  const response = await fetch(URL_BIZ_UDPGOTHIC, {
    headers: {
      "Content-Type": "font/ttf",
    },
  });
  fontBizUdpgothic = await response.arrayBuffer();
  return fontBizUdpgothic;
};

let iconBase64: string;

export const getIconBase64 = async () => {
  if (iconBase64) {
    return iconBase64;
  }
  const iconPath = path.resolve(process.cwd(), "public/images/profile.jpg");
  const iconBuffer = fs.readFileSync(iconPath);
  iconBase64 = iconBuffer.toString("base64");
  return iconBase64;
};

const outdatedYear = 1
export const isOutdated = (post: any): boolean => {
  const now = new Date();
  const lastEditDate = post.data.lastEditedDate
    ? new Date(post.data.lastEditedDate)
    : new Date(post.data.publishedDate);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - outdatedYear);

  return lastEditDate < twoYearsAgo;
}
