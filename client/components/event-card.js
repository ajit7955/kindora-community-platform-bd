import Link from "next/link";
import { MapPin, CalendarDays, ArrowUpRight } from "lucide-react";
export function EventCard({event}) {
 const date = new Date(event.eventDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
 return <article className="card group flex h-full flex-col transition hover:-translate-y-1 hover:shadow-soft">
  <div className="relative h-52 overflow-hidden"><img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700">{event.category}</span></div>
  <div className="flex flex-1 flex-col p-5"><h3 className="text-xl font-bold leading-snug">{event.title}</h3><p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{event.description}</p><div className="mt-4 grid gap-2 text-sm text-slate-500"><span className="flex items-center gap-2"><CalendarDays size={16} className="text-emerald-600"/>{date}</span><span className="flex items-center gap-2"><MapPin size={16} className="text-emerald-600"/>{event.location}</span></div><Link href={`/events/${event.id}`} className="mt-5 inline-flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">View event <ArrowUpRight size={18}/></Link></div>
 </article>;
}
