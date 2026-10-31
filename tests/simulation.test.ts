import test from 'node:test';
import assert from 'node:assert/strict';
import { runSimulation, calculateJainIndex } from '../lib/simulation/model';
import { SCENARIO_DEFINITIONS } from '../lib/simulation/constants';

test("Jain's fairness index computes properly", () => {
  // Equal shares = 1.0
  assert.equal(calculateJainIndex([10, 10, 10, 10]), 1.0);
  // Extremely skewed shares < 0.6
  const skewed = calculateJainIndex([90, 1, 1, 1]);
  assert.ok(skewed < 0.6, `Expected skewed index < 0.6, got ${skewed}`);
  // Single active flow = 1.0
  assert.equal(calculateJainIndex([50, 0, 0]), 1.0);
});

test('Simulation produces deterministic output for identical inputs', () => {
  const inputs = {
    scenarioId: 'iso-download-call' as const,
    enabledWorkloads: {
      'work-call': true,
      gaming: false,
      streaming: false,
      'bulk-download': true,
    },
    wanCapacityMbps: 100,
    mode: 'pathqos' as const,
  };

  const run1 = runSimulation(inputs);
  const run2 = runSimulation(inputs);

  assert.deepEqual(run1.metrics, run2.metrics);
  assert.equal(run1.metrics.p95LatencyMs, run2.metrics.p95LatencyMs);
  assert.equal(run1.allocations.length, run2.allocations.length);
  assert.equal(run1.explanation.summary, run2.explanation.summary);
});

test('Mode comparison produces distinct, physically plausible outcomes', () => {
  const common = {
    scenarioId: 'iso-download-call' as const,
    enabledWorkloads: {
      'work-call': true,
      gaming: false,
      streaming: false,
      'bulk-download': true,
    },
    wanCapacityMbps: 100,
  };

  const unmanaged = runSimulation({ ...common, mode: 'unmanaged' });
  const deterministic = runSimulation({ ...common, mode: 'deterministic' });
  const pathqos = runSimulation({ ...common, mode: 'pathqos' });

  // Unmanaged under bulk saturation must experience severe bufferbloat queue delay
  assert.ok(
    unmanaged.metrics.queueDelayMs > deterministic.metrics.queueDelayMs,
    `Unmanaged queue delay (${unmanaged.metrics.queueDelayMs}) should exceed deterministic (${deterministic.metrics.queueDelayMs})`
  );
  assert.ok(
    unmanaged.metrics.p95LatencyMs > 100,
    `Unmanaged p95 latency (${unmanaged.metrics.p95LatencyMs}) should exceed 100ms under saturating load`
  );

  // PathQoS achieves lowest p95 latency with active prioritization
  assert.ok(
    pathqos.metrics.p95LatencyMs <= deterministic.metrics.p95LatencyMs,
    `PathQoS p95 latency (${pathqos.metrics.p95LatencyMs}) should be <= deterministic baseline (${deterministic.metrics.p95LatencyMs})`
  );
  assert.ok(
    pathqos.metrics.p95LatencyMs < 25,
    `PathQoS should maintain sub-25ms p95 latency`
  );
});

test('WAN capacity drop (100 -> 20 Mbps) breaks static baseline while PathQoS adapts', () => {
  const lowCapacityInputs = {
    scenarioId: 'wan-drop' as const,
    enabledWorkloads: {
      'work-call': true,
      gaming: true,
      streaming: true,
      'bulk-download': true,
    },
    wanCapacityMbps: 20,
  };

  const deterministic = runSimulation({ ...lowCapacityInputs, mode: 'deterministic' });
  const pathqos = runSimulation({ ...lowCapacityInputs, mode: 'pathqos' });

  // In deterministic mode with fixed 95M setting on a 20M link, queue delay blows up
  assert.ok(
    deterministic.metrics.queueDelayMs > 80,
    `Static baseline queue delay should blow up on 20M link, got ${deterministic.metrics.queueDelayMs}`
  );

  // In PathQoS mode, dynamic adaptation clamps CAKE rate to match the 20M line
  assert.ok(
    pathqos.metrics.queueDelayMs < 20,
    `PathQoS should clamp queue delay below 20ms, got ${pathqos.metrics.queueDelayMs}`
  );
  assert.ok(
    pathqos.adaptationTriggered,
    'PathQoS should flag adaptationTriggered on capacity drop'
  );
});

test('Rollback rule fires when forced fault is present', () => {
  const normal = runSimulation({
    scenarioId: 'iso-download-call',
    enabledWorkloads: { 'work-call': true, gaming: false, streaming: false, 'bulk-download': true },
    wanCapacityMbps: 100,
    mode: 'pathqos',
    forceRollbackFault: false,
  });

  const faulty = runSimulation({
    scenarioId: 'iso-download-call',
    enabledWorkloads: { 'work-call': true, gaming: false, streaming: false, 'bulk-download': true },
    wanCapacityMbps: 100,
    mode: 'pathqos',
    forceRollbackFault: true,
  });

  const lastNormalEvent = normal.verificationEvents[normal.verificationEvents.length - 1];
  const lastFaultyEvent = faulty.verificationEvents[faulty.verificationEvents.length - 1];

  assert.equal(lastNormalEvent.stage, 'commit');
  assert.equal(lastNormalEvent.outcome, 'success');

  assert.equal(lastFaultyEvent.stage, 'rollback');
  assert.equal(lastFaultyEvent.outcome, 'rollback');
});
