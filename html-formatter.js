import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import { sanitize } from "hast-util-sanitize";
import truncateHtml from "truncate-html";

/**
 * @typedef {Object} HtmlFormatterOptions
 * @prop {number} length - Total character length to limit
 * @prop {number} maxBlocks - Max number of block elements to include
 */

/**
 * Formats the preview as HTML
 *
 * @param {HtmlFormatterOptions & Partial<import('truncate-html').IFullOptions>} options
 */
export default function htmlFormatter({
  length,
  maxBlocks,
  allowDangerousHtml = false,
  ...truncateOptions
} = {}) {
  return {
    truncate: (text) => {
      return truncateHtml(text, length, truncateOptions);
    },
    parse(tree, file) {
      const node = {
        ...tree,
        children: maxBlocks
          ? tree.children
              // remove frontmatter, script blocks
              .filter((c) => {
                const isFrontmatter = c.type === "yaml";
                const isScriptBlock =
                  c.type === "html" && c.value.startsWith("<script");

                return !isFrontmatter && !isScriptBlock;
              })
              .slice(0, maxBlocks)
          : tree.children,
      };
      let hast = sanitize(toHast(node));

      const result = toHtml(hast);

      return result;
    },
  };
}
