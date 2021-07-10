# remark-preview

Extracts a preview of the markdown and adds it to the frontmatter

## Usage

```js
import preview, { textFormatter } from "remark-preview";

const md = `
# Welcome to my blog

In this post, I will talk about dogs, cats, squirrels, llamas and polar bears.
`;

remark()
  .use(
    preview(
      textFormatter({
        length: 50,
      })
    )
  )
  .process(md, function (err, file) {
    console.log(file.data.fm.preview);
    // Welcome to my blog\n\nIn this post, I will talk about dogs, cats...
  });
```

You can also format it as HTML:

```js
import remark from "remark";
import preview, { htmlFormatter } from "remark-preview";

const md = `
# Welcome to my blog

Here is a very cool [website](example.com) I found on dogs, cats, squirrels, llamas and polar bears.
`;

remark()
  .use(
    preview(
      htmlFormatter({
        length: 70,
      })
    )
  )
  .process(md, function (err, file) {
    console.log(file.data.fm.preview);
    // <h1>Welcome to my blog</h1> <p>Here is a very cool <a href="example.com">website</a> I found on dogs, cats, ...</p>
  });
```

## Formatters

### textFormatter

```js
preview(textFormatter(options));
```

| Option            | Type    | Default | Description                                |
| ----------------- | ------- | ------- | ------------------------------------------ |
| options.length    | number  | 300     | Max number of characters before truncating |
| options.ellipsis  | boolean | true    | Adds an ellipsis when truncating           |
| options.headings  | boolean | true    | Includes headings in the preview content   |
| options.maxBlocks | number  |         | Max number of block elements to include    |

### htmlFormatter

```js
preview(htmlFormatter(options));
```

| Option            | Type   | Default | Description                                |
| ----------------- | ------ | ------- | ------------------------------------------ |
| options.length    | number | 300     | Max number of characters before truncating |
| options.maxBlocks | number |         | Max number of block elements to include    |

It uses [truncate-html](https://www.npmjs.com/package/truncate-html) for truncation, so it can receive all of its options as well

### custom formatter

If you wish, you can make your own formatter as well:

```js
import remark from "remark";
import { visit } from "unist-util-visit";

remark().use(
  preview({
    truncate(text) {
      return text.slice(0, 100);
    },
    parse(tree) {
      // see https://github.com/syntax-tree/unist to learn how to parse a remark node tree
      let text = "";

      visit(tree, "text", (node) => {
        text += node.value;
      });

      return text;
    },
  })
);
```

## API

### `preview`

```js
preview(formatter, options);
```

| Option            | Type   | Default   | Description                                                     |
| ----------------- | ------ | --------- | --------------------------------------------------------------- |
| formatter         | object |           | The formatter to use to parse and truncate the preview contents |
| options.attribute | string | "preview" | The frontmatter attribute to store the preview under            |
