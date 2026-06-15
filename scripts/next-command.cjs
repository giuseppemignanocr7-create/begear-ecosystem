const path = require("node:path");

const shimPath = path.resolve(__dirname, "windows-readlink-shim.cjs");
const nodeOptionsShimPath = shimPath.replace(/\\/g, "/");
const existingNodeOptions = process.env.NODE_OPTIONS ?? "";
const shimOption = `--require=${nodeOptionsShimPath}`;

if (!existingNodeOptions.includes(shimPath)) {
  process.env.NODE_OPTIONS = existingNodeOptions
    ? `${existingNodeOptions} ${shimOption}`
    : shimOption;
}

require(shimPath);

process.argv = [process.argv[0], "next", ...process.argv.slice(2)];
require("../node_modules/next/dist/bin/next");
