import type { BlueprintDeckFill } from './dgm-blueprint-fill.js';

/**
 * SHIPPED_FILL for "The Drafting Board" — the blueprint tour deck's shipped
 * story: one customer order drawn through a warehouse fulfilment system as a
 * set of engineering sheets. Original content, synthetic by design.
 */
export const SHIPPED_FILL: BlueprintDeckFill = {
  deck: {
    code: 'DGM-BP-01',
    world: 'THE DRAFTING BOARD',
    title: 'One order, as built',
    standfirst:
      'A customer clicks Buy and a warehouse moves. These sheets draw the fulfilment system the way the team maintains it: exact wires, named stations, and the one decision — is it on the shelf? — the whole drawing bends around.',
    notice: 'SYNTHETIC SPECIFICATION — DEMONSTRATION ONLY',
  },
  flow: {
    heading: 'The order path has one gate',
    caption:
      'Everything before the stock check is reversible software; everything after it moves atoms. The reservation gate is where the system commits — a miss routes to backorder instead of failing the order.',
    title: 'Order intake to dispatch',
    nodes: [
      { id: 'placed', label: 'Order placed', kind: 'start' },
      { id: 'validate', label: 'Validate + price', kind: 'process' },
      { id: 'reserve', label: 'Stock on shelf?', kind: 'decision' },
      { id: 'inv', label: 'Inventory ledger', kind: 'data' },
      { id: 'pick', label: 'Pick task to floor', kind: 'process' },
      { id: 'pack', label: 'Pack + label', kind: 'process' },
      { id: 'backorder', label: 'Backorder queue', kind: 'data' },
      { id: 'dispatch', label: 'Carrier dispatch', kind: 'end' },
    ],
    edges: [
      { from: 'placed', to: 'validate', step: 1 },
      { from: 'validate', to: 'reserve', step: 2 },
      { from: 'reserve', to: 'inv', label: 'reserve', step: 3 },
      { from: 'reserve', to: 'backorder', label: 'miss', step: 4 },
      { from: 'inv', to: 'pick', step: 5 },
      { from: 'pick', to: 'pack', step: 6 },
      { from: 'pack', to: 'dispatch', step: 7 },
    ],
  },
  sequence: {
    heading: 'Reserve first, charge second',
    caption:
      'The ordering of these calls is the real contract: stock is reserved before payment captures, so money never changes hands for an item the floor cannot pick. Reversing those two steps is the classic outage.',
    title: 'The commit conversation',
    actors: [
      { id: 'store', label: 'Storefront', kind: 'user' },
      { id: 'orders', label: 'Order service', kind: 'service' },
      { id: 'invsvc', label: 'Inventory service', kind: 'store' },
      { id: 'pay', label: 'Payment gateway', kind: 'external' },
    ],
    messages: [
      { from: 'store', to: 'orders', label: 'POST /orders' },
      { from: 'orders', to: 'invsvc', label: 'reserve(sku, qty)', note: 'TTL 15 min' },
      { from: 'invsvc', to: 'orders', label: 'reservation id', reply: true },
      { from: 'orders', to: 'pay', label: 'capture(amount)' },
      { from: 'pay', to: 'orders', label: 'captured', reply: true },
      { from: 'orders', to: 'store', label: '201 order confirmed', reply: true },
    ],
  },
  layers: {
    heading: 'Five floors between click and floor',
    caption:
      'Each floor owns one verb: present, orchestrate, promise, move, ship. The inventory floor is accented because it is the only one that must never lie — every layer above trusts its answer about what exists.',
    title: 'The fulfilment stack',
    sideLabel: 'an order descends',
    layers: [
      { id: 'storefront', label: 'Storefront + API', detail: 'Catalogue, cart, checkout', items: ['web', 'mobile', 'partner API'] },
      { id: 'orch', label: 'Order orchestration', detail: 'State machine per order', items: ['sagas', 'retries'] },
      { id: 'inventory', label: 'Inventory + reservations', detail: 'The promise ledger', items: ['ATP', 'reservations'], tone: 'accent' },
      { id: 'wms', label: 'Warehouse management', detail: 'Waves, picks, packs', items: ['RF scanners', 'wave planner'] },
      { id: 'carrier', label: 'Carrier integration', detail: 'Labels, manifests, tracking', items: ['rates', 'labels'] },
    ],
  },
  zones: {
    heading: 'Software upstairs, conveyors downstairs',
    caption:
      'The estate splits at the warehouse door. Cloud services plan; the floor executes on RF scanners against the WMS; carriers are an external parcel of the drawing reached only through the label bureau.',
    title: 'The fulfilment estate',
    zones: [
      { id: 'cloud', label: 'Commerce cloud', nodes: [{ id: 'sf', label: 'Storefront' }, { id: 'osvc', label: 'Order service' }, { id: 'isvc', label: 'Inventory' }] },
      { id: 'floor', label: 'Warehouse floor', nodes: [{ id: 'wms', label: 'WMS' }, { id: 'rf', label: 'RF scanners' }, { id: 'sorter', label: 'Sorter PLC' }] },
      { id: 'carriers', label: 'Carrier networks', nodes: [{ id: 'label', label: 'Label bureau' }, { id: 'track', label: 'Tracking feeds' }] },
    ],
    links: [
      { from: 'sf', to: 'osvc', label: 'orders' },
      { from: 'osvc', to: 'isvc', label: 'reserve' },
      { from: 'osvc', to: 'wms', label: 'pick waves' },
      { from: 'wms', to: 'rf', label: 'tasks' },
      { from: 'wms', to: 'sorter', label: 'diverts' },
      { from: 'wms', to: 'label', label: 'manifests' },
      { from: 'track', to: 'osvc', label: 'status' },
    ],
  },
  cycle: {
    heading: 'Stock is a loop, not a number',
    caption:
      'The shelf quantity is only ever an estimate of this loop’s health. Forecast feeds reorder, receipts become putaway, picking drains the shelf, and the cycle count trues the ledger before drift becomes a lie.',
    title: 'The replenishment loop',
    hubLabel: 'the ledger',
    stages: [
      { id: 'forecast', label: 'Forecast', detail: 'Demand by SKU' },
      { id: 'reorder', label: 'Reorder', detail: 'POs to suppliers' },
      { id: 'receive', label: 'Receive', detail: 'ASN against dock' },
      { id: 'putaway', label: 'Putaway', detail: 'Bins assigned' },
      { id: 'pickdrain', label: 'Pick', detail: 'Orders drain stock' },
      { id: 'count', label: 'Cycle count', detail: 'True the ledger' },
    ],
  },
  compare: {
    heading: 'Three ways to walk the aisles',
    caption:
      'Pick strategy is a trade between walk time and sort time. The drawing favours zone picking for this floor plan — the conveyor already exists, and walk time, not sortation, is the bottleneck at current volume.',
    title: 'Pick strategies, contrasted',
    columns: [
      { id: 'single', label: 'Single order' },
      { id: 'batch', label: 'Batch' },
      { id: 'zone', label: 'Zone', tone: 'accent' },
    ],
    rows: [
      { label: 'Walk time', values: ['worst — full tour per order', 'good — shared tour', 'best — pickers stay put'] },
      { label: 'Sortation', values: ['none needed', 'downstream sort wall', 'conveyor merge'] },
      { label: 'Order latency', values: ['lowest, one at a time', 'waits for the batch', 'steady, wave-paced'] },
      { label: 'Best at', values: ['low volume, big items', 'many small orders', 'high volume, fixed lines'] },
    ],
    verdict: 'Zone picking wins this floor plan: the conveyor is sunk cost and walk time is the constraint.',
  },
  cells: {
    heading: 'The words on the drawing',
    caption:
      'Eight terms the sheets assume. Each is one line on purpose: if a term needs a paragraph on this floor, it usually means the process it names has drifted from the drawing.',
    title: 'Warehouse vocabulary, sheet one',
    columnsHint: 4,
    cells: [
      { id: 'sku', label: 'SKU', detail: 'One sellable thing, uniquely named' },
      { id: 'atp', label: 'ATP', detail: 'Available to promise — stock minus reservations' },
      { id: 'asn', label: 'ASN', detail: 'Advance notice of what a truck carries' },
      { id: 'wave', label: 'Wave', detail: 'A batch of picks released together' },
      { id: 'crossdock', label: 'Cross-dock', detail: 'Inbound straight to outbound, no shelf' },
      { id: 'safety', label: 'Safety stock', detail: 'Buffer against forecast error' },
      { id: 'cyclecount', label: 'Cycle count', detail: 'Rolling audit that trues the ledger' },
      { id: 'backorder2', label: 'Backorder', detail: 'A promise queued for the next receipt' },
    ],
  },
  timeline: {
    heading: 'From clipboards to robots',
    caption:
      'Every era removed one source of lag: paper removed by RF, spreadsheets by WMS suites, static slotting by robotics. The current era moves the warehouse itself closer to the customer.',
    title: 'Fulfilment, era by era',
    nowIndex: 4,
    eras: [
      { id: 'paper', label: 'Paper picking', marker: '1990s', detail: 'Clipboards and tribal knowledge' },
      { id: 'rf', label: 'Barcode + RF', marker: '2000s', detail: 'Scans replace paper' },
      { id: 'suites', label: 'WMS suites', marker: '2010', detail: 'Waves, slotting, labour plans' },
      { id: 'robots', label: 'Robotics', marker: '2018', detail: 'Goods-to-person AMRs' },
      { id: 'micro', label: 'Micro-fulfilment', marker: 'now', detail: 'Small sites near demand' },
    ],
  },
  close: {
    takeaways: [
      'Reserve before you charge — the order of the commit conversation is the contract.',
      'The inventory floor must never lie; every layer above only relays its answer.',
      'Pick strategy is walk time versus sort time — choose with the floor plan, not fashion.',
      'Shelf quantity is the health of a loop; cycle counts are how the ledger stays honest.',
    ],
    signoff:
      'Walk one real order through your own sheets: where does software hand off to atoms, and which single decision does your drawing bend around? Mark that gate on the master drawing and defend it in review.',
  },
};
