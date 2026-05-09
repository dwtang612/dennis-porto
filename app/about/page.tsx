import { redirect } from "next/navigation";

/**
 * /about now lives at /journey as a longer-form biography page.
 * This route exists as a permanent redirect so any old links keep working.
 */
export default function AboutRedirect() {
  redirect("/journey");
}
