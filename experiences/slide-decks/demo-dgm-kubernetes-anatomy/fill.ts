import { FILL_SCHEMA, type IsometricDeckFill } from '../deck-dgm-isometric/dgm-isometric-fill.js';

/**
 * "/demo/kubernetes-anatomy" — experience-composer run 4 (isometric tour).
 * Brief: onboard new joiners with a tour of Kubernetes anatomy — control
 * plane, nodes, pods, services — as walkable dioramas.
 * Composed via compose_slide_deck → dgm-isometric; validated by validate_fill.
 */
export const kubernetesAnatomyFill: IsometricDeckFill = FILL_SCHEMA.parse({
  deck: {
    code: 'DGM-K8S-01',
    world: 'THE STUDIO FLOOR',
    title: 'Kubernetes, piece by piece',
    standfirst:
      'Kubernetes is not magic; it is a small number of honest parts running one loop. This tour builds the cluster as dioramas — the control plane that decides, the nodes that do, and the reconcile loop that never stops.',
    notice: 'synthetic onboarding tour — demonstration only',
  },
  flow: {
    heading: 'What `apply` actually does',
    caption:
      'You never start a container; you declare that one should exist. The API server records the wish, the scheduler finds it a home, and a kubelet makes it true — the fit decision is the only fork.',
    title: 'From YAML to running pod',
    nodes: [
      { id: 'apply', label: 'kubectl apply', kind: 'start' },
      { id: 'api', label: 'API server validates', kind: 'process' },
      { id: 'etcd', label: 'etcd records desire', kind: 'data' },
      { id: 'sched', label: 'Any node fits?', kind: 'decision' },
      { id: 'pending', label: 'Pod stays Pending', kind: 'end' },
      { id: 'kubelet', label: 'Kubelet pulls + starts', kind: 'process' },
      { id: 'running', label: 'Pod Running', kind: 'end' },
    ],
    edges: [
      { from: 'apply', to: 'api', step: 1 },
      { from: 'api', to: 'etcd', step: 2 },
      { from: 'etcd', to: 'sched', step: 3 },
      { from: 'sched', to: 'pending', label: 'no', step: 4 },
      { from: 'sched', to: 'kubelet', label: 'yes', step: 5 },
      { from: 'kubelet', to: 'running', step: 6 },
    ],
  },
  sequence: {
    heading: 'Nobody commands, everybody watches',
    caption:
      'No component calls another directly — each one watches the API server and reacts. This watch-and-reconcile choreography is why a dead controller resumes exactly where it left off.',
    title: 'A rollout, as messages',
    actors: [
      { id: 'user2', label: 'You', kind: 'user' },
      { id: 'apiserver', label: 'API server', kind: 'service' },
      { id: 'ctrl', label: 'Controllers', kind: 'service' },
      { id: 'node', label: 'Kubelet', kind: 'store' },
    ],
    messages: [
      { from: 'user2', to: 'apiserver', label: 'apply Deployment v2' },
      { from: 'ctrl', to: 'apiserver', label: 'watch: Deployment changed', note: 'watches, never polled' },
      { from: 'ctrl', to: 'apiserver', label: 'create ReplicaSet v2, scale v1 down' },
      { from: 'node', to: 'apiserver', label: 'watch: pods assigned to me' },
      { from: 'node', to: 'apiserver', label: 'status: v2 pods Ready', reply: true },
      { from: 'apiserver', to: 'user2', label: 'rollout complete', reply: true },
    ],
  },
  layers: {
    heading: 'The cluster, floor by floor',
    caption:
      'Top floor decides, middle floors translate, ground floor runs. The control plane is accented because it is the only floor that holds truth — everything below is reconstruction from it.',
    title: 'Cluster anatomy',
    sideLabel: 'intent descends',
    layers: [
      { id: 'access', label: 'Access', detail: 'How intent enters', items: ['kubectl', 'CI/CD', 'operators'] },
      { id: 'control', label: 'Control plane', detail: 'The deciding floor', items: ['API server', 'scheduler', 'etcd'], tone: 'accent' },
      { id: 'nodesfloor', label: 'Nodes', detail: 'The doing floor', items: ['kubelet', 'runtime', 'kube-proxy'] },
      { id: 'workloads', label: 'Workloads', detail: 'What you actually ship', items: ['pods', 'volumes'] },
      { id: 'traffic', label: 'Traffic', detail: 'How requests find pods', items: ['services', 'ingress'] },
    ],
  },
  zones: {
    heading: 'The estate on the floor',
    caption:
      'Four districts: the control plane deciding, workers running, networking finding, storage remembering. Note that every wire touches the API server district — there are no back channels.',
    title: 'The cluster estate',
    zones: [
      { id: 'cp', label: 'Control plane', nodes: [{ id: 'api2', label: 'API server' }, { id: 'etcd2', label: 'etcd' }, { id: 'sched2', label: 'Scheduler' }] },
      { id: 'workers2', label: 'Worker nodes', nodes: [{ id: 'kubelet2', label: 'Kubelets ×N' }, { id: 'runtime', label: 'Container runtime' }] },
      { id: 'network', label: 'Networking', nodes: [{ id: 'svc2', label: 'Services' }, { id: 'ingress2', label: 'Ingress' }, { id: 'dns', label: 'Cluster DNS' }] },
      { id: 'storage2', label: 'Storage', nodes: [{ id: 'pv', label: 'Volumes' }, { id: 'csi', label: 'CSI drivers' }] },
    ],
    links: [
      { from: 'kubelet2', to: 'api2', label: 'watch + status' },
      { from: 'sched2', to: 'api2', label: 'bind pods' },
      { from: 'api2', to: 'etcd2', label: 'the only writer' },
      { from: 'ingress2', to: 'svc2', label: 'routes' },
      { from: 'svc2', to: 'kubelet2', label: 'endpoints' },
      { from: 'csi', to: 'pv', label: 'provisions' },
    ],
  },
  cycle: {
    heading: 'The loop that runs the world',
    caption:
      'Every controller — built-in or yours — runs this same wheel forever: observe what is, compare with what should be, act on the difference. Self-healing is just this loop refusing to stop.',
    title: 'The reconcile loop',
    hubLabel: 'desired state',
    stages: [
      { id: 'observe', label: 'Observe', detail: 'Watch the API' },
      { id: 'diff', label: 'Diff', detail: 'Actual vs declared' },
      { id: 'act', label: 'Act', detail: 'Create, delete, scale' },
      { id: 'report', label: 'Report', detail: 'Write status back' },
      { id: 'repeat', label: 'Repeat', detail: 'Forever, idempotently' },
    ],
  },
  compare: {
    heading: 'Three shapes of workload',
    caption:
      'The three controllers newcomers mix up, contrasted by what they promise. The rule of thumb on the verdict slab has survived every onboarding cohort so far.',
    title: 'Deployment vs StatefulSet vs DaemonSet',
    columns: [
      { id: 'deploy', label: 'Deployment', tone: 'accent' },
      { id: 'sts', label: 'StatefulSet' },
      { id: 'ds', label: 'DaemonSet' },
    ],
    rows: [
      { label: 'Identity', values: ['pods are cattle', 'stable names + storage', 'one per node'] },
      { label: 'Scaling', values: ['any order, fast', 'ordered, careful', 'follows the fleet'] },
      { label: 'Typical use', values: ['stateless services', 'databases, queues', 'agents, log shippers'] },
      { label: 'Rollouts', values: ['rolling by default', 'one pod at a time', 'node by node'] },
    ],
    verdict: 'Default to Deployment; earn a StatefulSet with a real state story; DaemonSets are for the platform team.',
  },
  cells: {
    heading: 'The showroom of named parts',
    caption:
      'Eight blocks every newcomer must be able to pick up and describe. Each label is the one-liner that unlocks the docs page behind it.',
    title: 'Kubernetes vocabulary',
    columnsHint: 4,
    cells: [
      { id: 'pod', label: 'Pod', detail: 'Containers that share a fate and an IP' },
      { id: 'service', label: 'Service', detail: 'A stable name for moving pods' },
      { id: 'ingressc', label: 'Ingress', detail: 'HTTP routing at the front door' },
      { id: 'ns', label: 'Namespace', detail: 'One cluster, many tenants' },
      { id: 'pvc', label: 'PVC', detail: 'A claim on storage that outlives pods' },
      { id: 'hpa', label: 'HPA', detail: 'Replicas that follow the load' },
      { id: 'taint', label: 'Taint', detail: 'A node saying: not unless invited' },
      { id: 'crd', label: 'CRD', detail: 'Teach the API a new noun' },
    ],
  },
  timeline: {
    heading: 'From one paper to the default',
    caption:
      'A decade from internal secret to industry substrate. The eras matter to a newcomer because the ecosystem’s vocabulary — operators, CRDs, GitOps — is stratified in exactly this order.',
    title: 'Kubernetes, era by era',
    nowIndex: 3,
    eras: [
      { id: 'borg', label: 'Borg heritage', marker: '2003', detail: 'Google runs the pattern inside' },
      { id: 'oss', label: 'Open sourced', marker: '2014', detail: 'v1 and the CNCF founding' },
      { id: 'operators', label: 'Operators + CRDs', marker: '2017', detail: 'The API becomes extensible' },
      { id: 'substrate', label: 'The substrate era', marker: 'now', detail: 'GitOps fleets, platform teams' },
    ],
  },
  close: {
    takeaways: [
      'You declare state; controllers make it true — nothing commands anything directly.',
      'The API server is the only door and etcd’s only writer; there are no back channels.',
      'The reconcile loop is the whole trick — self-healing is the loop refusing to stop.',
      'Default to Deployments; earn anything more stateful with a real story.',
    ],
    signoff:
      'Run one experiment this week: delete a pod your Deployment owns and watch it return. Then find which controller brought it back. That is the whole system, seen once with your own eyes.',
  },
});
