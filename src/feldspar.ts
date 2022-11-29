#!/usr/bin/env node
import { program } from "commander";
import Metalsmith from "metalsmith";
import feldspar from "./lib/plugin";

// TODO warn on non-empty output directory

program
  .argument("<docusaurus_dir>", "The directory of a docusaurus project")
  .argument(
    "<output_dir>",
    "The directory where converted files will be written"
  )
  .action((docusaurusDir, outputDir) => {
    Metalsmith(__dirname)
      .source(docusaurusDir)
      .destination(outputDir)
      .use(feldspar())
      .build(function (err: any) {
        if (err) throw err;
      });
  })
  .parse(process.argv);

export default feldspar;
