import remark from "remark";
import preview, { htmlFormatter, textFormatter } from "./index.js";
import fs from "fs";
import html from "remark-html";
import truncateHtml from "truncate-html";
import rehype from "remark-rehype";
import { visitParents } from "unist-util-visit-parents";

import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import { sanitize } from "hast-util-sanitize";

remark()
  .use(
    preview(
      htmlFormatter({
        // length: 70,
        maxBlocks: 1,
      })
      // textFormatter({
      //   length: 70,
      // })
    )
  )
  .process(fs.readFileSync("./test.md", "utf-8"), function (err, file) {
    if (err) {
      console.error(err);
    }
    console.log(file.data.fm.preview);
  });
