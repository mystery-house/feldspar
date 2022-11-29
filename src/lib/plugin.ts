import path, { basename, dirname, join } from "node:path";
import mime from "mime-types";
import Metalsmith, { Files } from "metalsmith";

/**
 * These strings will be stripped from source files.
 */
const OMIT_STRINGS = [
  "import TOCInline from '@theme/TOCInline';",
  "<TOCInline toc={toc} />",
];

function isMarkdown(filePath: string) {
  const filename = path.basename(filePath);
  const markdownTypes = ["text/mdx", "text/markdown", "text/x-markdown"];
  let contentType = mime.contentType(filename);
  if (typeof contentType === "string") {
    contentType = contentType.split(";")[0];
    return markdownTypes.indexOf(contentType) != -1;
  }
  return false;
}

function initFeldspar() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function feldspar(files: Files, metalsmith: Metalsmith, done: any) {
    setImmediate(done);

    // eslint-disable-next-line prefer-const
    let renamedFiles: { [key: string]: string } = {};
    let categoryTitle = "";
    Object.keys(files).forEach((file) => {
      if (basename(file) === "__category__.json") {
        const category = JSON.parse(files[file].contents.toString());
        categoryTitle = category.label;
        delete files[file];
        return;
      }

      if (isMarkdown(file)) {
        const data = files[file];
        const dir = dirname(file);

        // Rename files per frontmatter title, or __category__.json label if index
        let newFilename = data.title + ".md";

        if (
          "." != dir &&
          categoryTitle !== "" &&
          (basename(file) === "index.md" || basename(file) === "index.mdx")
        ) {
          newFilename = categoryTitle + ".md";
        }

        // Strip Docusaurus TOC plugin tags etc
        let contentStr = data.contents.toString();
        OMIT_STRINGS.forEach((omit) => {
          const escaped = omit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const re = new RegExp(`\\n*?\\s*${escaped}\\s*\\n*?`, "g");
          contentStr = contentStr.replace(re, "");
        });
        data.contents = Buffer.from(contentStr);

        let newPath = newFilename;

        // Capitalize directory names
        const newDir = dir
          .split("/")
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join("/");

        if ("." != dir) newPath = join(newDir, newFilename);

        console.debug(`Renaming file ${file} => ${newPath}`);
        delete files[file];
        files[newPath] = data;

        // TODO loop through files and replace all instances of old filename with new filename
        renamedFiles[file] = newPath;
      } else {
        // TODO leave image/movie files alone
        delete files[file];
      }
    });
    return;
  };
}

export default initFeldspar;
