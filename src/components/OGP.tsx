import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { fetchFontBizUdpgothic, getIconBase64 } from "../libs";

type Props = {
  title: string;
  iconBase64: string;
};
const ThumbnailOGP = ({ title, iconBase64 }: Props) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0a192f;",
      color: "#e6f1ff",
      padding: 32,
    }}
  >
    <div
      style={{
        fontSize: 48,
        textAlign: "center",
      }}
    >
      {title}
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        marginTop: 32,
      }}
    >
      <img
        src={`data:image/jpeg;base64,${iconBase64}`}
        style={{
          width: 64,
          borderRadius: "50%",
        }}
      />
      <span
        style={{
          fontSize: 28,
          textAlign: "center",
        }}
      >
        Yuki Okawa (@ykokw)
      </span>
    </div>
  </div>
);

const OGP_WIDTH = 1200;
const OGP_HEIGHT = 675;

export const generateOgpImage = async (title: string): Promise<Buffer> => {
  const font = await fetchFontBizUdpgothic();
  const icon = await getIconBase64();
  const svg = await satori(<ThumbnailOGP title={title} iconBase64={icon} />, {
    width: OGP_WIDTH,
    height: OGP_HEIGHT,
    fonts: [
      {
        name: "biz-udpgothic",
        data: font,
        style: "normal",
        weight: 400,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: OGP_WIDTH,
    },
  });
  const image = resvg.render();

  return image.asPng();
};
