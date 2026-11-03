"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Leaf, Menu } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted,setMounted]=useState(false);
  const [user,setUser]=useState(null);
  useEffect(()=>{setMounted(true); try{setUser(JSON.parse(localStorage.getItem("kindora_user")||"null"))}catch{}},[]);
  function logout(){localStorage.removeItem("kindora_token");localStorage.removeItem("kindora_user");setUser(null);location.href="/";}
  return <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800 glass">
    <nav className="container-x flex h-[76px] items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white"><Leaf size={21}/></span>kindora<span className="text-emerald-600">.</span></Link>
      <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <Link href="/events" className="hover:text-emerald-600">Upcoming Events</Link>
        <a href="/#about" className="hover:text-emerald-600">Our mission</a>
        <a href="/#gallery" className="hover:text-emerald-600">Community</a>
      </div>
      <div className="flex items-center gap-2">
        {mounted && <button aria-label="Toggle theme" onClick={()=>setTheme(theme==="dark"?"light":"dark")} className="rounded-full border p-2.5 dark:border-slate-700">{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>}
        {user ? <div className="group relative"><button className="flex items-center gap-2 rounded-full border p-1 pr-3 dark:border-slate-700"><img src={user.image||"https://i.pravatar.cc/80"} alt="" className="h-9 w-9 rounded-full object-cover"/><span className="hidden sm:inline text-sm font-semibold">{user.name}</span></button><div className="absolute right-0 hidden w-48 rounded-xl border bg-white p-2 shadow-xl group-hover:block dark:bg-slate-900"><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/create">Create Event</Link><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/manage">Manage Events</Link><Link className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="/joined">Joined Events</Link><button onClick={logout} className="w-full text-left rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50">Logout</button></div></div> : <Link href="/login" className="btn-primary !py-2.5">Login <span>↗</span></Link>}
        <span className="md:hidden"><Menu/></span>
      </div>
    </nav>
  </header>;
}
