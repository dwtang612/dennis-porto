import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">
        Dennis Tang
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        Fullstack engineer building modern web apps with Next.js, TypeScript, and Postgres.
      </p>

      <div className="mt-10 flex gap-3">
        <a
          className="rounded-md bg-black px-4 py-2 text-white"
          href="/projects"
        >
          View Projects
        </a>
        <a
          className="rounded-md border px-4 py-2"
          href="/contact"
        >
          Contact
        </a>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-medium">Now building</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700">
          <li>Portfolio site with case studies</li>
          <li>Fullstack project with auth + database</li>
          <li>CI and deployment pipeline</li>
        </ul>
      </section>
    </main>
  );
}
