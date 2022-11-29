# Feldspar

![TypeScript](https://img.shields.io/badge/-TypeScript-blue) ![Docusaurus](https://img.shields.io/badge/-Docusaurus-green) ![Metalsmith](https://img.shields.io/badge/-Metalsmith-lightgrey) ![Obsidian](https://img.shields.io/badge/-Obsidian-grey)


Feldspar recursively reads Markdown files from the `docs` directory of a [Docusaurus](https://docusaurus.io/) project and renames them to a more [Obsidian](https://obsidian.md/)-friendly structure.

It probably won't be perfect, but hopefully it will get the document structure most of the way there.

## Usage

Feldspar can be used from the command line or as a [Metalsmith](https://metalsmith.io/) plugin.

### Command Line

```
npx feldspar /path/to/docusaurus/docs /path/for/new/obsidian/vault
```

### Metalsmith Plugin

```
import feldspar from "feldspar"

/* (You can now add .feldspar() to your plugin chain.) */

```
