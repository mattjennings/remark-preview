import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";
import textFormatter from "./text-formatter.js";
import htmlFormatter from "./text-formatter.js";

export { default as textFormatter } from "./text-formatter.js";
export { default as htmlFormatter } from "./html-formatter.js";

/**
 * Adds a trimmed preview of the markdown document to the frontmatter
 *
 * @param {Object} formatter - How the preview text is truncated and parsed
 * @param {function} formatter.parse
 * @param {function} formatter.truncate
 */
export default function preview(
  formatter,
  {
    /**
     * The frontmatter attribute to use
     *
     * @type {String}
     * @default "preview"
     */
    attribute = "preview",
  } = {}
) {
  return function () {
    return function (tree, file) {
      const result = formatter.parse(tree, file);

      let preview = formatter.truncate ? formatter.truncate(result) : result;

      file.data.fm = {
        ...file.data.fm,
        [attribute]: preview,
      };
    };
  };
}
