import { useAppSelector } from "../app/hooks";
import { useMemo, useState } from "react";

export default function Planner() {
  const items = useAppSelector(s => s.recipes.items);
  const [days, setDays] = useState(5);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(60);

  const pool = useMemo(() => items.filter(r => r.time >= minTime && r.time <= maxTime), [items,minTime,maxTime]);
  const plan = useMemo(() => {
    const arr = [...pool];
    const selected = [];
    for (let i=0;i<days && arr.length;i++){
      const idx = Math.floor(Math.random()*arr.length);
      selected.push(arr.splice(idx,1)[0]);
    }
    return selected;
  }, [pool, days]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Planner</h1>
      <div className="flex gap-3 flex-wrap items-center">
        <label className="flex items-center gap-2">Days
          <input type="number" min={1} max={7} className="input input-bordered w-20" value={days} onChange={e=>setDays(parseInt(e.target.value||"1"))} />
        </label>
        <label className="flex items-center gap-2">Min
          <input type="number" className="input input-bordered w-24" value={minTime} onChange={e=>setMinTime(parseInt(e.target.value||"0"))} /> min
        </label>
        <label className="flex items-center gap-2">Max
          <input type="number" className="input input-bordered w-24" value={maxTime} onChange={e=>setMaxTime(parseInt(e.target.value||"0"))} /> min
        </label>
        <span className="opacity-70">สุ่มเมนูตามช่วงเวลาเตรียม</span>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {plan.map(r => (
          <div key={r.id} className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">{r.title} <div className="badge badge-secondary">{r.time} min</div></h3>
              <p className="opacity-80">{r.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
