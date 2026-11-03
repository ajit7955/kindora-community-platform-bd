
import Link from "next/link";
import { EventCard } from "@/components/event-card";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

async function getEvents() {
  try {
    const response = await fetch(`${API}/events?limit=6`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Events loading failed:", error);
    return [];
  }
}

// Decorative nature illustration - no external images
function NatureIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute inset-5 rounded-full bg-emerald-200/60 blur-3xl" />

      <div className="relative overflow-hidden rounded-[40px] border border-emerald-100 bg-gradient-to-br from-[#E4F4E5] via-[#F5FAEF] to-[#CBE8D0] p-5 shadow-2xl md:p-8">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-emerald-800">
            🌿 KINDORA COMMUNITY
          </span>
          <span className="text-2xl">☀️</span>
        </div>

        <div className="relative mt-8 flex min-h-[290px] items-center justify-center">
          <div className="absolute bottom-5 h-36 w-full rounded-[50%] bg-[#B9DBB6]" />
          <div className="absolute bottom-5 left-4 text-6xl">🌳</div>
          <div className="absolute bottom-5 right-4 text-6xl">🌳</div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-end gap-1 text-6xl md:text-7xl">
              <span>🧑🏻</span>
              <span>👩🏽</span>
              <span>🧑🏾</span>
            </div>
            <div className="mt-2 rounded-full bg-white/90 px-5 py-3 text-center shadow-lg">
              <p className="font-black text-emerald-800">
                Growing Together
              </p>
              <p className="text-xs text-emerald-700">
                One good deed at a time
              </p>
            </div>
            <div className="mt-4 text-4xl">🌱 🌼 🌿</div>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-2">
          {[
            ["🌱", "Plant"],
            ["💚", "Care"],
            ["🤝", "Share"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/80 bg-white/75 p-3 text-center"
            >
              <div className="text-2xl">{icon}</div>
              <p className="mt-1 text-sm font-bold text-emerald-800">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute right-4 top-20 rounded-2xl bg-white p-3 shadow-lg">
          <div className="text-2xl">💚</div>
          <p className="text-xs font-bold text-emerald-800">
            Spread Kindness
          </p>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    number: "01",
    icon: "🌱",
    title: "Find Your Cause",
    description:
      "Discover local cleanups, donation drives, and community initiatives.",
  },
  {
    number: "02",
    icon: "🤝",
    title: "Meet Your Community",
    description:
      "Connect with neighbors who share your passion for positive change.",
  },
  {
    number: "03",
    icon: "💚",
    title: "Make It Meaningful",
    description:
      "Join or create events and turn your effort into real impact.",
  },
];

const moments = [
  {
    icon: "🌳",
    title: "A Greener Earth",
    description: "Plant today for a better tomorrow.",
    background: "bg-[#E1F0DE]",
  },
  {
    icon: "🤲",
    title: "Helping Hands",
    description: "Small acts of kindness matter.",
    background: "bg-[#E9F1E4]",
  },
  {
    icon: "🌻",
    title: "Growing Together",
    description: "Stronger communities start with us.",
    background: "bg-[#F3EFD9]",
  },
];

export default async function Home() {
  const events = await getEvents();

  return (
    <main className="overflow-hidden bg-white dark:bg-[#0b1710]">

      {/* HERO SECTION */}
      <section className="relative bg-[#F0F8EF] dark:bg-[#10251A]">
        <div className="container-x grid min-h-[650px] items-center gap-14 py-16 md:grid-cols-2 md:py-20">

          <div>
            <span className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              🌿 Make good happen, together
            </span>

            <h1 className="mt-7 text-5xl font-black leading-[1.08] tracking-tight text-[#174B31] dark:text-white md:text-7xl">
              A little kindness.
              <br />
              <span className="text-emerald-600">
                A lasting impact.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
              Find meaningful community events, meet people who care,
              and turn your free time into something beautiful.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/events" className="btn-primary">
                Explore events ↗
              </Link>

              <Link href="/create" className="btn-secondary">
                Start an initiative
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["🧑🏻", "👩🏽", "🧑🏾", "👩🏻"].map((person, index) => (
                  <div
                    key={index}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-xl"
                  >
                    {person}
                  </div>
                ))}
              </div>

              <div>
                <p className="font-bold text-slate-800 dark:text-white">
                  People-powered change
                </p>
                <p className="text-sm text-slate-500">
                  One neighborhood at a time
                </p>
              </div>
            </div>
          </div>

          <NatureIllustration />

        </div>
      </section>

      {/* WHY KINDORA */}
      <section id="about" className="container-x py-20 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-bold uppercase tracking-[.18em] text-emerald-600">
            Why Kindora
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#174B31] dark:text-white">
            Good things grow
            <span className="text-emerald-600">
              {" "}when we grow together.
            </span>
          </h2>

          <p className="mt-4 text-slate-500 dark:text-slate-400">
            We make it easy to find your people and do something that matters.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="rounded-3xl border border-emerald-100 bg-[#FAFCF9] p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-emerald-600">
                  {feature.number} /
                </span>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#205B3B] dark:text-white">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="bg-[#F4F8F2] py-20 dark:bg-slate-900/40">
        <div className="container-x">

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-bold uppercase tracking-[.18em] text-emerald-600">
                Coming up
              </p>

              <h2 className="mt-2 text-4xl font-black text-[#174B31] dark:text-white">
                Events near your heart
              </h2>

              <p className="mt-3 text-slate-500">
                Join a cause. Bring a friend. Be the difference.
              </p>
            </div>

            <Link href="/events" className="btn-secondary">
              See all events ↗
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-dashed border-emerald-300 bg-white p-12 text-center dark:bg-slate-900">
                <div className="text-5xl">🌱</div>

                <h3 className="mt-4 text-xl font-bold text-[#205B3B] dark:text-white">
                  Your community’s next chapter starts here.
                </h3>

                <p className="mt-2 text-slate-500">
                  No upcoming events yet. Be the first to create one!
                </p>

                <Link className="btn-primary mt-5" href="/create">
                  Create an event
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COMMUNITY MOMENTS */}
      <section id="gallery" className="container-x py-20 md:py-24">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[.18em] text-emerald-600">
            Moments that matter
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#174B31] dark:text-white">
            A gallery of good
          </h2>

          <p className="mt-3 text-slate-500">
            Every little action creates a beautiful story.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {moments.map((moment) => (
            <div
              key={moment.title}
              className={`${moment.background} group flex min-h-[260px] flex-col items-center justify-center rounded-[32px] p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-7xl transition duration-300 group-hover:scale-110">
                {moment.icon}
              </div>

              <h3 className="mt-6 text-xl font-black text-[#205B3B]">
                {moment.title}
              </h3>

              <p className="mt-2 text-sm text-[#54715A]">
                {moment.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x pb-20">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#205B3B] to-[#13834C] px-8 py-14 text-white md:px-14">
          <div className="absolute -right-10 -top-10 text-[180px] opacity-10">
            🌿
          </div>

          <div className="relative z-10 md:flex md:items-center md:justify-between">
            <div>
              <p className="font-bold uppercase tracking-widest text-emerald-200">
                Be the change
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                A kinder world starts with you.
              </h2>

              <p className="mt-3 max-w-xl text-emerald-100">
                Create an event and invite your community to join.
                Every good action matters.
              </p>
            </div>

            <Link
              href="/create"
              className="mt-7 inline-flex rounded-full bg-white px-7 py-4 font-bold text-emerald-800 transition hover:bg-emerald-50 md:mt-0"
            >
              Create your first event ↗
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
