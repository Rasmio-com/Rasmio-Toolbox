import type { ToolContent } from "../types";
import { content as network } from "./network";
import { content as encoding } from "./encoding";
import { content as crypto } from "./crypto";
import { content as browser } from "./browser";
import { content as text } from "./text";
import { content as regex } from "./regex";
import { content as data } from "./data";
import { content as code } from "./code";
import { content as api } from "./api";
import { content as url } from "./url";
import { content as seo } from "./seo";
import { content as a11y } from "./a11y";
import { content as datetime } from "./datetime";
import { content as units } from "./units";
import { content as finance } from "./finance";
import { content as color } from "./color";
import { content as media } from "./media";
import { content as file } from "./file";
import { content as table } from "./table";
import { content as diagram } from "./diagram";
import { content as generators } from "./generators";
import { content as validators } from "./validators";
import { content as logs } from "./logs";
import { content as geo } from "./geo";
import { content as reference } from "./reference";

const all: Record<string, ToolContent> = {
  ...network,
  ...encoding,
  ...crypto,
  ...browser,
  ...text,
  ...regex,
  ...data,
  ...code,
  ...api,
  ...url,
  ...seo,
  ...a11y,
  ...datetime,
  ...units,
  ...finance,
  ...color,
  ...media,
  ...file,
  ...table,
  ...diagram,
  ...generators,
  ...validators,
  ...logs,
  ...geo,
  ...reference,
};

export function getToolContent(id: string): ToolContent | undefined {
  return all[id];
}
