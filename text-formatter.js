import { visit } from "unist-util-visit";
import { visitParents } from "unist-util-visit-parents";

/**
 * Formats the preview as plain text
 *
 * @param {object} [options]
 * @param {number} [options.length] - Max number of characters before truncating
 * @param {boolean} [options.ellipsis] - Adds an ellipsis to the end of the preview if necessasry.
 * @param {number} options.maxBlocks - Max number of block elements to include
 * @param {boolean} [options.headings] - Whether or not to include headings
 */
export default function textFormatter({
  length = 300,
  maxBlocks,
  ellipsis = true,
  headings = true,
} = {}) {
  return {
    truncate(str) {
      const text = maxBlocks
        ? str.split("\n\n").slice(0, maxBlocks).join("\n\n")
        : str;

      if (text.length < length) {
        return text;
      }

      let truncated = text.trim().substr(0, length);
      let truncateIndex = Math.min(length, truncated.lastIndexOf(" "));

      // if we truncated mid-word, truncate the rest of it
      truncated = truncated.substr(0, truncateIndex);

      const isEndOfSentence = !!truncated
        .charAt(truncateIndex - 1)
        .match(/[.!?]/);

      const endsWithPunctuation = !!truncated
        .charAt(truncateIndex - 1)
        .match(/[,':;`]/);

      if (ellipsis && !isEndOfSentence) {
        truncated = truncated.slice(
          0,
          truncateIndex + (endsWithPunctuation ? -1 : 0)
        );

        return `${truncated}...`;
      }

      return truncated;
    },
    parse(tree) {
      const blocks = tree.children;
      let text = "";

      blocks.forEach((block) => {
        if (text) {
          text += "\n\n";
        }

        visitParents(block, null, (node, parents) => {
          if (!headings && parents.some((p) => p.type === "heading")) {
            return;
          }

          const isList = parents.some((p) => p.type === "list");
          const isListItem = parents.some((p) => p.type === "listItem");

          if (isList) {
            if (isListItem) return;

            visit(node, "text", (node) => {
              text += "- " + node.value + "\n";
            });
          }

          if (node.type === "text") {
            text += node.value;
          }
        });
      });

      return text;
    },
  };
}
