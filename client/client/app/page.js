
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  MapPin,
  Users,
  Sparkles,
  HandHeart,
  Leaf,
  GraduationCap,
  Gift,
  RefreshCw,
  Globe,
  Target,
  Lightbulb,
  CheckCircle2,
  Quote,
  HeartHandshake,
} from "lucide-react";

import { api } from "@/lib/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=85";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=85",
    alt: "Volunteers helping people in a community",
    title: "Helping Hands",
  },
  {
    src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1000&q=85",
    alt: "People working together",
    title: "Together We Grow",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85",
    alt: "Community members supporting one another",
    title: "Care and Share",
  },
];

const categories = [
  {
    name: "Community",
    icon: Users,
    color: "bg-blue-100 text-blue-700",
    description: "Bring people together",
  },
  {
    name: "Cleanup",
    icon: Leaf,
    color: "bg-green-100 text-green-700",
    description: "Protect our environment",
  },
  {
    name: "Education",
    icon: GraduationCap,
    color: "bg-purple-100 text-purple-700",
    description: "Share knowledge",
  },
  {
    name: "Donation",
    icon: Gift,
    color: "bg-rose-100 text-rose-700",
    description: "Give what you can",
  },
];

const impactItems = [
  {
    icon: Heart,
    number: "Small Acts",
    title: "Big Difference",
    description:
      "Even a small act of kindness can make someone's day brighter.",
  },
  {
    icon: Users,
    number: "One Community",
    title: "Stronger Together",
    description:
      "Connect with people who share your passion for positive change.",
  },
  {
    icon: Globe,
    number: "One Planet",
    title: "A Better Future",
    description:
      "Work together to create a more caring and sustainable world.",
  },
];

const steps = [
  {
    number: "01",
    icon: SearchIcon,
    title: "Discover Events",
    description:
      "Explore community events and find an opportunity that matches your interests.",
  },
  {
    number: "02",
    icon: HeartHandshake,
    title: "Join the Community",
    description:
      "Connect with people who care and become part of something meaningful.",
  },
  {
    number: "03",
    icon: Target,
    title: "Make an Impact",
    description:
      "Give your time, share your skills, and help make a positive difference.",
  },
];

function SearchIcon({ size = 28, className }) {
  return <Sparkles size={size} className={className} />;
}

function formatDate(date) {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SafeImage({
  src,
  alt,
  className,
  fallback = FALLBACK_IMAGE,
  loading = "lazy",
}) {
  return (
    <img
      src={src || fallback}
      alt={alt}
      loading={loading}
      className={className}
      onError={(e) => {
        const image = e.currentTarget;

        if (image.dataset.fallback !== "used") {
          image.dataset.fallback = "used";
          image.src = fallback;
        }
      }}
    />
  );
}

function EventCard({ event }) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <SafeImage
          src={event.image}
          alt={event.title || "Community event"}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-emerald-700 shadow">
          {event.category || "Community"}
        </span>
      </div>

      <div className="p-7">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <CalendarDays size={17} className="text-emerald-600" />
          {formatDate(event.eventDate)}
        </div>

        <h3 className="mt-4 line-clamp-2 text-2xl font-black text-slate-900 dark:text-white">
          {event.title || "Community Event"}
        </h3>

        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-7 text-slate-500 dark:text-slate-400">
          {event.description || "Join this community event and make a difference."}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <span className="flex min-w-0 items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPin size={17} className="shrink-0 text-emerald-600" />
            <span className="truncate">
              {event.location || "Location not specified"}
            </span>
          </span>

          <Link
            href={`/events/${event.id}`}
            className="shrink-0 font-bold text-emerald-600 transition hover:text-emerald-800"
          >
            Explore <ArrowRight size={16} className="inline" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const result = await api("/events?limit=6");

      setEvents(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Events loading error:", err);
      setError(err.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main className="kindora-home overflow-hidden bg-white text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* HERO SECTION */}
      <section className="container-x relative py-24 md:py-32 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
              <Sparkles size={17} />
              Make a difference, together
            </div>

            <h1 className="mt-9 text-6xl font-black leading-[1.05] tracking-tight md:text-7xl xl:text-[88px]">
              A Little
              <br />
              Kindness.
              <span className="mt-2 block bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
                A Lasting Impact.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-slate-600 dark:text-slate-300 md:text-xl">
              Kindora connects people who care. Discover meaningful
              community events, meet people who share your passion,
              and turn your free time into something beautiful.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/events"
                className="btn-primary inline-flex items-center gap-3 rounded-full px-8 py-4 text-base"
              >
                Explore Events <ArrowRight size={19} />
              </Link>

              <Link
                href="/create"
                className="inline-flex items-center gap-3 rounded-full border border-slate-300 px-8 py-4 font-bold transition hover:border-emerald-600 hover:text-emerald-600 dark:border-slate-700"
              >
                Start an Initiative
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-5 border-t border-slate-200 pt-8 dark:border-slate-800">
              <div>
                <div className="text-2xl font-black text-emerald-600 md:text-3xl">
                  Together
                </div>
                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  We are stronger
                </p>
              </div>

              <div>
                <div className="text-2xl font-black text-emerald-600 md:text-3xl">
                  Locally
                </div>
                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  Change starts here
                </p>
              </div>

              <div>
                <div className="text-2xl font-black text-emerald-600 md:text-3xl">
                  Always
                </div>
                <p className="mt-2 text-xs text-slate-500 md:text-sm">
                  Kindness matters
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-6 rounded-[50px] bg-emerald-300/30 blur-3xl dark:bg-emerald-900/30" />

            <div className="relative overflow-hidden rounded-[36px] bg-slate-100 shadow-2xl dark:bg-slate-900">
              <SafeImage
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=90"
                alt="Volunteers working together"
                className="h-[480px] w-full object-cover sm:h-[560px] lg:h-[650px]"
                loading="eager"
              />
            </div>

            <div className="absolute -bottom-7 -left-3 rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:-left-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Heart size={29} fill="currentColor" />
                </div>

                <div>
                  <div className="text-2xl font-black text-emerald-600">
                    +1 good deed
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    Can change a whole day
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 -top-5 rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900 sm:-right-5">
              <HandHeart size={34} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="bg-emerald-950 py-24 text-white md:py-32">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-bold uppercase tracking-[.2em] text-emerald-400">
              Why kindness matters
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              Small Actions.
              <span className="block text-emerald-400">
                Extraordinary Impact.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-emerald-100/80">
              A better community does not happen overnight.
              It begins when ordinary people decide to do something good.
            </p>
          </div>

          <div className="mt-16 grid gap-7 md:grid-cols-3">
            {impactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[30px] border border-white/10 bg-white/5 p-9 transition duration-300 hover:-translate-y-2 hover:bg-white/10"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <Icon size={32} />
                  </div>

                  <p className="mt-8 text-3xl font-black text-emerald-400">
                    {item.number}
                  </p>

                  <h3 className="mt-3 text-2xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-emerald-100/70">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="border-b border-slate-100 bg-slate-50 py-24 dark:border-slate-800 dark:bg-slate-900/40 md:py-32">
        <div className="container-x">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[.2em] text-emerald-600">
              Find your purpose
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Explore by Category
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500 dark:text-slate-400">
              Discover opportunities, share your skills, and find
              the cause that matters to you.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  href="/events"
                  key={category.name}
                  className="group rounded-[28px] border border-slate-200 bg-white p-8 text-center transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 md:p-10"
                >
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${category.color}`}
                  >
                    <Icon size={30} />
                  </div>

                  <h3 className="mt-6 text-xl font-black group-hover:text-emerald-600">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {category.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-x py-24 md:py-32">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[.2em] text-emerald-600">
            Simple steps
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            How Kindora Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500 dark:text-slate-400">
            Making a difference is easier than you think.
            Start with three simple steps.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-[30px] border border-slate-200 bg-white p-9 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="absolute right-8 top-7 text-5xl font-black text-emerald-100 dark:text-emerald-950">
                  {step.number}
                </span>

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Icon size={30} />
                </div>

                <h3 className="mt-8 text-2xl font-black">
                  {step.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section
        id="events"
        className="bg-slate-50 py-24 dark:bg-slate-900/40 md:py-32"
      >
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-bold uppercase tracking-[.2em] text-emerald-600">
                Get involved
              </p>

              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                Upcoming Events
              </h2>

              <p className="mt-5 leading-8 text-slate-500 dark:text-slate-400">
                Find an event and become part of something meaningful.
              </p>
            </div>

            <Link
              href="/events"
              className="font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All Events <ArrowRight size={17} className="inline" />
            </Link>
          </div>

          {loading ? (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-3xl border bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-60 bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-4 p-7">
                    <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mt-12 rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center dark:border-rose-900 dark:bg-rose-950/30">
              <p className="font-semibold text-rose-700 dark:text-rose-400">
                {error}
              </p>

              <button
                onClick={loadEvents}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
              >
                <RefreshCw size={17} /> Try Again
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 p-14 text-center dark:border-slate-700">
              <CalendarDays
                size={45}
                className="mx-auto text-emerald-600"
              />

              <h3 className="mt-5 text-2xl font-bold">
                No Upcoming Events Yet
              </h3>

              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Be the first to create an event and bring people together.
              </p>

              <Link href="/create" className="btn-primary mt-7 inline-flex">
                Create an Event
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* COMMUNITY STORIES */}
      <section className="container-x py-24 md:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-5 rounded-[40px] bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />

            <SafeImage
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85"
              alt="People volunteering for their community"
              className="relative h-[420px] w-full rounded-[32px] object-cover shadow-2xl md:h-[560px]"
            />
          </div>

          <div>
            <p className="font-bold uppercase tracking-[.2em] text-emerald-600">
              Stories of kindness
            </p>

            <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              Every Good Deed Has a Story.
            </h2>

            <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <Quote size={30} />
            </div>

            <p className="mt-7 text-xl leading-9 text-slate-600 dark:text-slate-300">
              "You do not have to change the whole world.
              Sometimes, changing one person's day is enough
              to make the world a better place."
            </p>

            <div className="mt-9 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Heart size={23} fill="currentColor" />
              </div>

              <div>
                <p className="font-black">The Kindora Community</p>
                <p className="text-sm text-slate-500">
                  Together for a better tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="bg-slate-50 py-24 dark:bg-slate-900/40 md:py-32"
      >
        <div className="container-x">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[.2em] text-emerald-600">
              Moments that matter
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              A Gallery of Good
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-500 dark:text-slate-400">
              Every helping hand, every shared smile, and every small action
              makes our community stronger.
            </p>
          </div>

          <div className="mt-16 grid gap-7 md:grid-cols-3">
            {galleryImages.map((image, index) => (
              <div
                key={image.src}
                className={`group relative h-[340px] overflow-hidden rounded-[30px] bg-slate-200 shadow-lg dark:bg-slate-800 md:h-[420px] ${
                  index === 1 ? "md:mt-12" : ""
                }`}
              >
                <SafeImage
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                <div className="absolute bottom-7 left-7">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                    <Heart size={17} fill="currentColor" />
                    Kindness in action
                  </div>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    {image.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x py-24 md:py-32">
        <div className="relative overflow-hidden rounded-[36px] bg-emerald-700 px-7 py-20 text-center text-white shadow-2xl md:px-16 md:py-28">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-2xl" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15">
              <HandHeart size={42} />
            </div>

            <h2 className="mt-9 text-4xl font-black leading-tight md:text-6xl">
              Be the Reason Someone Smiles.
            </h2>

            <p className="mt-7 text-lg leading-9 text-emerald-50">
              Join Kindora and discover how your time, kindness,
              and effort can create a better world for everyone.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-emerald-700 transition hover:-translate-y-1 hover:bg-emerald-50"
              >
                Find an Event <ArrowRight size={19} />
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-3 rounded-full border border-white/60 px-8 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Join Kindora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM MESSAGE */}
      <section className="border-t border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-950">
        <div className="container-x">
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <Heart size={19} fill="currentColor" />
            <span className="font-black tracking-wide">KINDORA</span>
          </div>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Together, we can make the world a kinder place.
          </p>

          <Link
            href="#top"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            Back to top <ArrowRight size={15} className="-rotate-90" />
          </Link>
        </div>
      </section>
    </main>
  );
}
