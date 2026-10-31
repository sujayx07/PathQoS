import { ArchitectureModule, ScenarioId, WorkloadConfig } from '../types';

export const SCENARIO_DEFINITIONS: Record<
  ScenarioId,
  {
    id: ScenarioId;
    title: string;
    subtitle: string;
    defaultWanMbps: number;
    description: string;
    targetChallenge: string;
    recommendedWorkloads: Record<string, boolean>;
  }
> = {
  'iso-download-call': {
    id: 'iso-download-call',
    title: 'ISO Download + Work Call',
    subtitle: 'Saturating TCP bulk download concurrent with low-latency WebRTC audio/video call',
    defaultWanMbps: 100,
    description:
      'A 4 GB operating system image download opens multiple parallel TCP streams that saturate the uplink buffer, threatening the 20ms packet pacing required for an executive Zoom/Meet call.',
    targetChallenge:
      'Prevent bufferbloat packet queueing without starving the ISO transfer to zero.',
    recommendedWorkloads: {
      'work-call': true,
      'gaming': false,
      'streaming': false,
      'bulk-download': true,
    },
  },
  'wan-drop': {
    id: 'wan-drop',
    title: 'Dynamic WAN Drop (100 → 20 Mbps)',
    subtitle: 'Sudden cellular/DOCSIS line degradation under active mixed traffic',
    defaultWanMbps: 20,
    description:
      'External line degradation cuts ISP capacity from 100 Mbps to 20 Mbps in under 1 second. Static shapers continue transmitting at 100 Mbps, building a 300ms queue in the modem.',
    targetChallenge:
      'Detect the throughput cliff passively and shrink the CAKE shaper envelope before user sessions disconnect.',
    recommendedWorkloads: {
      'work-call': true,
      'gaming': true,
      'streaming': true,
      'bulk-download': true,
    },
  },
  'three-tvs-gaming': {
    id: 'three-tvs-gaming',
    title: 'Three 4K TVs + Competitive Gaming',
    subtitle: 'High aggregate bandwidth burst (75 Mbps) alongside strict 128 Hz UDP tick deadlines',
    defaultWanMbps: 100,
    description:
      'Three concurrent 4K streams request high-bitrate video chunks intermittently. Burst chunk arrivals cause micro-jitter that causes competitive game packet loss and tick lag.',
    targetChallenge:
      'Preserve sub-15ms packet deadlines for UDP game ticks while keeping 4K video playback buffer full.',
    recommendedWorkloads: {
      'work-call': false,
      'gaming': true,
      'streaming': true,
      'bulk-download': false,
    },
  },
};

export const WORKLOAD_CATALOG: WorkloadConfig[] = [
  {
    id: 'work-call',
    name: 'Work Call (WebRTC)',
    category: 'Interactive Audio/Video',
    protocol: 'WebRTC',
    offeredBandwidthMbps: 2.4,
    burstiness: 'steady',
    deadlineSensitivity: 'strict',
    targetLatencyMs: 20,
    description: 'Bi-directional audio/video frames sent every 20ms. Jitter > 10ms causes noticeable robotic audio stutter.',
  },
  {
    id: 'gaming',
    name: 'Competitive Gaming',
    category: 'Real-time UDP',
    protocol: 'UDP',
    offeredBandwidthMbps: 0.8,
    burstiness: 'bursty',
    deadlineSensitivity: 'strict',
    targetLatencyMs: 15,
    description: '128-tick client-server physics updates. Dropped packets cause rubber-banding and desynchronization.',
  },
  {
    id: 'streaming',
    name: 'Streaming Video (4K ABR)',
    category: 'Chunked Multimedia',
    protocol: 'TCP',
    offeredBandwidthMbps: 25.0,
    burstiness: 'bursty',
    deadlineSensitivity: 'moderate',
    targetLatencyMs: 80,
    description: 'Segmented HTTP Live Streaming chunks. Tolerates steady buffering delay if throughput remains stable.',
  },
  {
    id: 'bulk-download',
    name: 'Bulk ISO Download',
    category: 'Saturating TCP Bulk',
    protocol: 'TCP',
    offeredBandwidthMbps: 90.0,
    burstiness: 'saturating',
    deadlineSensitivity: 'relaxed',
    targetLatencyMs: 250,
    description: 'Aggressive TCP Cubic/BBR streams that greedily inflate send window until packet loss or queue full occurs.',
  },
];

export const ARCHITECTURE_MODULES: ArchitectureModule[] = [
  {
    id: 'm1',
    number: '01',
    name: 'Metadata Flow Capture',
    shortName: 'M1: Capture',
    role: 'Zero-payload traffic inspection extracting 5-tuple, packet size entropy, inter-arrival variance, and TCP window scaling.',
    plane: 'data',
    inputs: [
      'Linux eBPF / tc ingress hook on eth0 (WAN)',
      'IFB (Intermediate Functional Block) virtual device',
      'Kernel socket buffer (sk_buff) headers only',
    ],
    outputs: [
      'Flow metadata records (IP tuple, packet count, inter-arrival jitter, byte counters)',
      'Zero payload data retained or copied (GDPR/privacy-first invariant)',
    ],
    internalState: [
      'Circular ring-buffer flow table (LRU eviction at 8192 active flows)',
      'Burstiness sliding window (last 64 packet intervals per flow)',
    ],
    failureBehavior:
      'If ring buffer fills under packet flood, drops inspection silently; raw packets continue flowing via unmanaged bypass with zero drops to traffic.',
    testCoverage: '100% unit-tested against pcap headers; verified zero payload inspection in tests/pcap_leak_test.rs',
    kernelMechanism: 'eBPF / XDP metadata probe',
    hardwareDependency: 'Standard Linux kernel 5.15+; runs on standard OpenWrt/MIPS/ARM routers without proprietary hardware.',
  },
  {
    id: 'm2',
    number: '02',
    name: 'Statistical Classifier & Confidence',
    shortName: 'M2: Classifier',
    role: 'Evaluates packet sizing and pacing distributions to map flows into DiffServ / CAKE priority tins with a strict confidence score.',
    plane: 'control',
    inputs: [
      'Flow metadata records from M1',
      'Port heuristic tables (WebRTC UDP ranges, TLS SNI outer client hello)',
      'Active Intent Leases from M4',
    ],
    outputs: [
      'Classification decision: Class ID (Interactive, Low-Latency, Streaming, Bulk)',
      'Confidence score C ∈ [0.0, 1.0]',
    ],
    internalState: [
      'Bayesian flow classifier weights',
      'Confidence degradation timer (decays if flow characteristics shift)',
    ],
    failureBehavior:
      'If confidence C < 0.75 or flow characteristics contradict profile, immediately falls back to deterministic Best Effort tin (no speculative deprioritization).',
    testCoverage: 'Evaluated against 100k synthetic trace flows; baseline fallback tested in tests/classifier_fallback_test.rs',
    kernelMechanism: 'User-space daemon (Rust) communicating via netlink',
    hardwareDependency: 'CPU footprint < 2% of a single ARM Cortex-A53 core @ 1.2 GHz.',
  },
  {
    id: 'm3',
    number: '03',
    name: 'Live Capacity Estimator',
    shortName: 'M3: Capacity',
    role: 'Continuously measures real ISP bottleneck line rate without active bandwidth speed-test flooding.',
    plane: 'control',
    inputs: [
      'Passive TCP RTT round-trip dispersion across outbound flows',
      'WAN interface packet drop counters and queue backlog signals',
      'Optional router upstream sync telemetry (DSL/Cable modem interface)',
    ],
    outputs: [
      'Estimated WAN upload and download capacity (Mbps)',
      'Capacity trend flag: Stable | Degrading | Expanding',
      'Safety headroom ratio (nominally 95% of estimated line rate)',
    ],
    internalState: [
      'Kalman filter on minimum RTT envelopes',
      'Congestion inflection tracker (detects queue buildup at ISP CMTS)',
    ],
    failureBehavior:
      'Under ambiguous signals, defaults conservatively to nominal subscribed profile minus 10% safety margin.',
    testCoverage: 'Simulated 100→20 Mbps step-function drop test; converges within 320ms in automated integration suite.',
    kernelMechanism: 'Passive TCP socket info stats / netlink sock_diag',
    hardwareDependency: 'Hardware agnostic; works across Fiber, Cable DOCSIS 3.1, DSL and 5G cellular modems.',
  },
  {
    id: 'm4',
    number: '04',
    name: 'Policy Engine & Lease Arbiter',
    shortName: 'M4: Policy Engine',
    role: 'Synthesizes capacity limits, classified flows, and temporary user intent leases into bounded, mathematically fair qdisc parameters.',
    plane: 'control',
    inputs: [
      'Live link capacity from M3',
      'Classified flows and confidence scores from M2',
      'Active User Intent Leases (e.g., Work Call priority for 30 min)',
      'Fairness invariant configuration (Jain index floor ≥ 0.70)',
    ],
    outputs: [
      'Candidate tc CAKE qdisc config (bandwidth limit, tin weights, flow isolation mode)',
      'DSCP remarking rules (CS0, CS1, EF, AF41)',
      'Policy explanation structure and expected impact metrics',
    ],
    internalState: [
      'Active Intent Lease table with expiry timestamps',
      'Bandwidth reservation ledger (prevents oversubscription)',
      'Previous known-good policy snapshot (for instant rollback)',
    ],
    failureBehavior:
      'If conflicting or impossible leases are requested, rejects or curtails low-priority reservations with explicit rationale; never over-provisions past estimated capacity.',
    testCoverage: 'Exhaustive lease permutation unit test suite in tests/lease_arbiter_test.rs',
    kernelMechanism: 'Deterministic optimization solver in user space',
    hardwareDependency: 'No specific hardware required.',
  },
  {
    id: 'm5',
    number: '05',
    name: 'Enforcement Agent',
    shortName: 'M5: Enforcement',
    role: 'Applies Linux tc queueing disciplines, CAKE tin thresholds, and DSCP packet markings onto network interfaces.',
    plane: 'data',
    inputs: [
      'Target policy instructions from M4',
      'Network interface device handles (eth0, ifb0, wlan0)',
    ],
    outputs: [
      'Linux tc netlink syscall execution (tc qdisc replace ... cake)',
      'iptables / nftables DSCP classification mangles',
      'Applied confirmation ack and system error codes',
    ],
    internalState: [
      'Atomic transaction state machine (Staging → Applying → Active)',
      'Pre-change kernel queue dump for instantaneous revert',
    ],
    failureBehavior:
      'If netlink call fails or returns error, immediately re-applies previous snapshot and raises telemetry warning to M6 watchdog.',
    testCoverage: 'Kernel mock test harness in tests/tc_netlink_mock_test.rs',
    kernelMechanism: 'Linux tc-cake (RFC 8290), IFB driver, iptables/nftables',
    hardwareDependency: 'Linux kernel with CONFIG_NET_SCH_CAKE enabled (standard in Linux 4.19+ and OpenWrt 19.07+).',
  },
  {
    id: 'm6',
    number: '06',
    name: 'Verifier & Rollback Watchdog',
    shortName: 'M6: Verifier',
    role: 'Verifies real network impact of applied policy; automatically rolls back if latency invariants or critical flows degrade.',
    plane: 'control',
    inputs: [
      'High-frequency micro-probes (ICMP / UDP echo to local ISP gateway)',
      'Post-apply flow latency samples and drop counters from M1',
      'Verification rules (p95 latency improvement check, max loss threshold)',
    ],
    outputs: [
      'Verification decision: COMMIT (policy retained) or ROLLBACK (revert to previous)',
      'Verification event log with policy diff and measured delta',
      'Audit log for explainability UI',
    ],
    internalState: [
      'Pre-apply snapshot metric buffer',
      'Watchdog countdown timer (5000ms evaluation window)',
      'Rollback retry cooldown limiter',
    ],
    failureBehavior:
      'If latency worsens by > 15% or packet loss on critical classes increases by > 1%, immediately issues atomic netlink rollback to previous snapshot.',
    testCoverage: 'Automated fault-injection suite with forced bad policies in tests/watchdog_rollback_test.rs',
    kernelMechanism: 'Lightweight user-space watchdog probe thread',
    hardwareDependency: 'Requires access to raw ICMP/UDP sockets.',
  },
];
