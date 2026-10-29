import assert from "node:assert/strict";
import { serviceZones, simulateServices, summarizeServices, aggregateByPeriod } from "../src/data/syntheticService.js";

const baseline = simulateServices();
assert.equal(baseline.length, 6);
assert.deepEqual(simulateServices(), baseline, "Scenario generation must be deterministic");
assert.deepEqual(baseline.map(zone => zone.id), serviceZones.map(zone => zone.id));

for (const demandShift of [-20, 0, 30]) {
  for (const capacityShift of [-25, 0, 35]) {
    const zones = simulateServices({ demandShift, capacityShift });
    for (const zone of zones) {
      assert.equal(zone.series.length, 12);
      zone.series.forEach((period, i) => {
        assert.equal(period.opening + period.incoming - period.resolved, period.closing, "Stock-flow identity must hold at each period");
        assert.ok(period.opening >= 0 && period.incoming >= 0 && period.resolved >= 0 && period.closing >= 0);
        assert.ok(period.timely >= 0 && period.timely <= period.resolved);
        if (i > 0) assert.equal(period.opening, zone.series[i - 1].closing, "Closing stock must carry into the next period");
      });
    }
    for (const windowSize of [3, 6, 12]) {
      const total = summarizeServices(zones, windowSize);
      assert.equal(total.startingBacklog + total.incoming - total.resolved, total.backlog, "Window stock-flow identity must hold");
      assert.equal(total.change, total.backlog - total.startingBacklog);
      assert.ok(total.onTime >= 0 && total.onTime <= 1);
      const byPeriod = aggregateByPeriod(zones, windowSize);
      assert.equal(byPeriod.length, windowSize);
      assert.equal(byPeriod.reduce((sum, row) => sum + row.incoming, 0), total.incoming);
      assert.equal(byPeriod.reduce((sum, row) => sum + row.resolved, 0), total.resolved);
      assert.equal(byPeriod.at(-1).backlog, total.backlog);
      const individual = zones.map(zone => summarizeServices([zone], windowSize));
      assert.equal(individual.reduce((sum, item) => sum + item.backlog, 0), total.backlog);
      assert.equal(individual.reduce((sum, item) => sum + item.incoming, 0), total.incoming);
    }
  }
}
assert.ok(summarizeServices(simulateServices({ capacityShift: 35 }), 12).backlog < summarizeServices(baseline, 12).backlog);
assert.ok(summarizeServices(simulateServices({ demandShift: 30 }), 12).backlog > summarizeServices(baseline, 12).backlog);
console.log("PASS: Determinism, 9 stress scenarios, 12-period queue conservation, 3 reporting windows, district aggregation and intervention direction.");
