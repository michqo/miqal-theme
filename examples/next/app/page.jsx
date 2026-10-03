import { readFileSync } from "node:fs";
import { join } from "node:path";
export const dynamic = "force-static";
export default function Page() {
  const gallery = readFileSync(join(process.cwd(), "gallery.fragment.html"), "utf8");
  return <div dangerouslySetInnerHTML={{ __html: gallery }} />;
}
