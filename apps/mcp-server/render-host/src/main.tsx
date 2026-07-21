import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import config from '../generated/render-config.json';
import fill from '../generated/fill.json';
import { TEMPLATES } from './templates.js';
import './index.css';

const entry = TEMPLATES[config.templateId];
if (!entry) throw new Error(`render-host: unknown templateId '${config.templateId}'`);
if (entry.theme) document.documentElement.setAttribute('data-theme', entry.theme);

const container = document.getElementById('root');
if (!container) throw new Error('render-host: root container #root not found');

const { default: Template } = await entry.load();
// Seven of the twelve templates render the gallery "back" affordance with a
// react-router <Link>, so they need a router in context or they throw on mount.
// MemoryRouter keeps the bundle standalone: no history/base assumptions, works
// from file:// or any sub-path a client serves it from.
createRoot(container).render(
  <StrictMode>
    <MemoryRouter>
      <Template fill={fill as never} />
    </MemoryRouter>
  </StrictMode>,
);
