import type { Metadata } from "next";
import { Docs } from "./docs";

export const metadata: Metadata = {
  title: "Components",
  description: "Every IT-2023 component with live previews, usage, props and do/don’t.",
};

export default function Page() {
  return <Docs />;
}
