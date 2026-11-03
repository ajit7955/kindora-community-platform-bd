"use client";
import { useEffect,useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import Link from "next/link";
import { MapPin,CalendarDays,ArrowLeft } from "lucide-react";
export default function EventDetail(){const {id}=useParams();const [event,setEvent]=useState(null),[loading,setLoading]=useState(true);
useEffect(()=>{api(`/events/${id}`).then(setEvent).catch(e=>toast.error(e.message)).finally(()=>setLoading(false))},[id]);
async function join(){try{await api(`/events/${id}/join`,{method:"POST"});toast.success("You joined this event!");}catch(e){toast.error(e.message)}}
if(loading)return <div className="container-x py-20"><div className="h-96 animate-pulse rounded-3xl bg-slate-200"/></div>;
if(!event)return <div className="container-x py-20">Event not found. <Link href="/events">Back to events</Link></div>;
return <div className="container-x py-12"><Link href="/events" className="inline-flex items-center gap-2 text-emerald-600"><ArrowLeft size={18}/> All events</Link><div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_.7fr]"><div><img src={event.image} alt={event.title} className="h-[420px] w-full rounded-3xl object-cover"/><span className="mt-6 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-700">{event.category}</span><h1 className="mt-4 text-4xl font-black">{event.title}</h1><p className="mt-5 whitespace-pre-wrap leading-8 text-slate-600 dark:text-slate-300">{event.description}</p></div><aside className="h-fit rounded-3xl border p-7 dark:border-slate-800"><h2 className="text-2xl font-bold">Be part of it</h2><div className="mt-5 grid gap-4 text-slate-500"><p className="flex gap-3"><CalendarDays className="text-emerald-600"/>{new Date(event.eventDate).toLocaleString()}</p><p className="flex gap-3"><MapPin className="text-emerald-600"/>{event.location}</p><p>Organized by <strong>{event.creatorName}</strong></p></div><button onClick={join} className="btn-primary mt-7 w-full">Join this event ↗</button><p className="mt-3 text-center text-xs text-slate-500">Sign in is required to join.</p></aside></div></div>}
