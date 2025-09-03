import { cpSync, existsSync } from "node:fs";
const pairs = [
  { src: "api/.env.example", dst: "api/.env" },
  { src: "web/.env.example", dst: "web/.env.local" },
];
for (const { src, dst } of pairs) {
  if (!existsSync(dst) && existsSync(src)) {
    cpSync(src, dst);
    console.log("Created", dst, "from", src);
  }
}
