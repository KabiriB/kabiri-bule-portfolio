// Synthetic scenario engine. No real municipal records or observations are used.
// Every output is deterministic, derived from the user-adjusted model assumptions.
export const serviceZones = [
  { id: "north", name: "North", code: "S01", demand: 1120, capacity: 1015, opening: 280, service: .07 },
  { id: "central", name: "Central", code: "S02", demand: 1530, capacity: 1420, opening: 410, service: .03 },
  { id: "west", name: "West", code: "S03", demand: 940, capacity: 980, opening: 210, service: .10 },
  { id: "east", name: "East", code: "S04", demand: 1290, capacity: 1190, opening: 320, service: .04 },
  { id: "river", name: "River", code: "S05", demand: 790, capacity: 740, opening: 190, service: .08 },
  { id: "south", name: "South", code: "S06", demand: 1360, capacity: 1350, opening: 270, service: .06 }
];

export const periods = Array.from({ length: 12 }, (_, i) => "P" + String(i + 1).padStart(2, "0"));
export const clamp = (x, low, high) => Math.max(low, Math.min(high, x));
export const pct = (v, digits = 0) => Number.isFinite(v) ? (v * 100).toFixed(digits) + "%" : "—";
export const fmt = (v) => Math.round(v).toLocaleString("en-ZA");

export function simulateServices({ demandShift = 0, capacityShift = 0 } = {}) {
  return serviceZones.map((zone, i) => {
    let backlog = zone.opening;
    const series = periods.map((period, t) => {
      const start = backlog;
      const seasonal = 1 + .065 * Math.sin(t * 1.2 + i * .65) + .023 * Math.cos(t * .7 - i);
      const incoming = Math.round(zone.demand * seasonal * (1 + demandShift / 100));
      const available = start + incoming;
      const nominalCapacity = Math.round(zone.capacity * (1 + capacityShift / 100) * (1 + .03 * Math.cos(t + i * .3)));
      const resolved = Math.min(available, Math.max(0, nominalCapacity));
      backlog = available - resolved;
      const timelyShare = clamp(.88 + zone.service - (start / (zone.demand * 3)) * .39 - (incoming > 0 ? (incoming - zone.capacity) / zone.demand * .1 : 0), .27, .97);
      const timely = Math.round(resolved * timelyShare);
      return { period, incoming, resolved, timely, closing: backlog, opening: start };
    });
    return { ...zone, series };
  });
}
export function summarizeServices(zones, windowSize = 12) {
  const selected = zones.flatMap(zone => zone.series.slice(-windowSize));
  const total = key => selected.reduce((sum, row) => sum + row[key], 0);
  const incoming = total("incoming"), resolved = total("resolved"), timely = total("timely");
  const backlog = zones.reduce((sum, zone) => sum + zone.series.at(-1).closing, 0);
  const startingBacklog = zones.reduce((sum, zone) => sum + zone.series.at(-windowSize).opening, 0);
  return { incoming, resolved, timely, backlog, startingBacklog, onTime: resolved ? timely / resolved : 0, clearance: incoming ? resolved / incoming : 0, change: backlog - startingBacklog };
}
export function aggregateByPeriod(zones, windowSize) {
  return periods.slice(-windowSize).map((period, offset) => {
    const month = zones.flatMap(z => z.series.filter(s => s.period === period));
    const sum = key => month.reduce((acc, value) => acc + value[key], 0);
    const resolved = sum("resolved");
    return { period, incoming: sum("incoming"), resolved, timely: sum("timely"), onTime: resolved ? sum("timely") / resolved : 0, backlog: sum("closing"), index: offset };
  });
}
