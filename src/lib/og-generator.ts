import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFile, readFile, stat } from "fs/promises";
import { join } from "path";
import { ReactElement } from "react";

const fontPath = "fonts";
const interPath = join(
  process.cwd(),
  fontPath,
  "Inter/static/Inter-Regular.ttf"
);

type ImageOptions = {
  width: number;
  height: number;
};

type GenerateImageArguments = {
  template: ReactElement;
  slug: string;
  options: ImageOptions;
};

export async function generateImage({
  template,
  slug,
  options,
}: GenerateImageArguments) {
  const publicPath = "public";

  const relativePath = `/assets/blog/og-images/${slug.replace(/-/g, "_")}.png`;
  const pngPath = join(process.cwd(), publicPath, relativePath);

  try {
    if (await stat(pngPath)) {
      return relativePath;
    }
  } catch (err) {}

  const interFont = await readFile(interPath);
  const svg = await satori(template, {
    width: options.width,
    height: options.height,
    fonts: [
      {
        name: "Inter-Regular",
        data: interFont,
        weight: 400,
        style: "normal",
      },
    ],
  });
  const resvg = new Resvg(svg);
  const pngBuffer = resvg.render().asPng();

  await writeFile(pngPath, pngBuffer);

  return relativePath;
}
