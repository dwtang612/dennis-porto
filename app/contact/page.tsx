import { redirect } from "next/navigation";

/**
 * /contact now lives as a section on the home page.
 * This route exists as a permanent redirect so any old links keep working
 * (Journey page CTA, footer in past commits, external bookmarks, etc.).
 */
export default function ContactRedirect() {
  redirect("/#contact");
}
