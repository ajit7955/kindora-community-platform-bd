"use client";
import { useEffect,useState } from "react";
import { api } from "@/lib/api";
import { EventCard } from "@/components/event-card";
export default function EventsPage(){const [events,setEvents]=useState([]),[loading,setLoading]=useState(true),[query,setQuery]=useState("");
useEffect(()=>{api("/events").then(setEvents).catch(()=>setEvents([])).finally(()=>setLoading(false))},[]);
const filtered=events.filter(e=>`${e.title} ${e.location} ${e.category}`.toLowerCase().includes(query.toLowerCase()));
return <section className="container-x py-14"><div className="max-w-2xl"><p className="font-bold uppercase tracking-widest text-emerald-600">Find your next good deed</p><h1 className="mt-3 text-5xl font-black">Upcoming events</h1><p className="mt-4 text-slate-500">Local opportunities to create real change, one gathering at a time.</p></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search event, location, or category..." className="mt-8 w-full max-w-lg rounded-full border bg-white px-5 py-3 outline-none focus:border-emerald-500 dark:bg-slate-900"/><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{loading?Array.from({length:6},(_,i)=><div key={i} className="h-[420px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"/>):filtered.map(e=><EventCard key={e.id} event={e}/>)}</div>{!loading&&!filtered.length&&<p className="mt-12 text-center text-slate-500">No matching events found.</p>}</section>}
