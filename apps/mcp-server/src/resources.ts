// apps/mcp-server/src/resources.ts
/**
 * MCP resources - the ONLY channel that moves file content to clients.
 * Tools return `opendesign://` URIs (see reference-files.ts); these handlers
 * resolve them. Reads are traversal-safe; unknown ids throw, which the SDK
 * surfaces as a resources/read error.
 */
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RegistryData } from './registry-data.js';
import { experienceDir, readExperienceFile } from './reference-files.js';
import { readRenderFile } from './render-store.js';

function textContents(uri: string, text: string) {
  return { contents: [{ uri, mimeType: 'text/plain', text }] };
}

// Exported so tests can assert the RFC 6570 reserved-expansion ({+file})
// nested-path matching behaviour directly against the real templates, rather
// than a copy that could silently drift from what the server registers.
export const TEMPLATE_SOURCE_URI_TEMPLATE = 'opendesign://templates/{templateId}/source/{+file}';
export const PART_SOURCE_URI_TEMPLATE = 'opendesign://parts/{experienceId}/{+file}';
export const RENDER_FILE_URI_TEMPLATE = 'opendesign://renders/{renderId}/{+file}';

/** Extensions served as `text`; anything else (fonts, images) goes back as a base64 blob. */
const TEXT_MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

export function registerReferenceResources(server: McpServer, registry: RegistryData): void {
  server.registerResource(
    'template-source',
    new ResourceTemplate(TEMPLATE_SOURCE_URI_TEMPLATE, { list: undefined }),
    {
      title: 'World-template source file',
      description: 'Source of a catalogue world-template, for strict-fidelity porting.',
    },
    async (uri, variables) => {
      const templateId = String(variables.templateId);
      const file = String(variables.file);
      // Strict: `templates/` accepts only the canonical world-template id, never
      // the experienceId. `worldTemplateById` is keyed by both (for tools like
      // validate_fill, which legitimately accept either), so it is NOT used
      // here - an experienceId in this slot must be rejected as unknown.
      const descriptor = registry.worldTemplates.find((template) => template.id === templateId);
      if (!descriptor) throw new Error(`Unknown world template '${templateId}'.`);
      const text = readExperienceFile(descriptor.experienceId, file);
      if (text === undefined) throw new Error(`No source file '${file}' in template '${templateId}'.`);
      return textContents(uri.href, text);
    },
  );

  server.registerResource(
    'part-source',
    new ResourceTemplate(PART_SOURCE_URI_TEMPLATE, { list: undefined }),
    {
      title: 'Experience part source file',
      description: 'Source of a live-world file referenced by get_part_reference.',
    },
    async (uri, variables) => {
      const experienceId = String(variables.experienceId);
      const file = String(variables.file);
      if (!experienceDir(experienceId)) throw new Error(`Unknown experience '${experienceId}'.`);
      const text = readExperienceFile(experienceId, file);
      if (text === undefined) throw new Error(`No source file '${file}' in experience '${experienceId}'.`);
      return textContents(uri.href, text);
    },
  );

  server.registerResource(
    'render-bundle',
    new ResourceTemplate(RENDER_FILE_URI_TEMPLATE, { list: undefined }),
    {
      title: 'Rendered experience bundle file',
      description: 'A file from a render_experience build (5 most recent kept).',
    },
    async (uri, variables) => {
      const renderId = String(variables.renderId);
      const file = String(variables.file);
      const data = readRenderFile(renderId, file);
      if (!data) {
        throw new Error(
          `No render file '${file}' for '${renderId}' - evicted or never built; re-run render_experience.`,
        );
      }
      const mime = TEXT_MIME_TYPES[file.slice(file.lastIndexOf('.'))];
      return mime
        ? { contents: [{ uri: uri.href, mimeType: mime, text: data.toString('utf8') }] }
        : { contents: [{ uri: uri.href, mimeType: 'application/octet-stream', blob: data.toString('base64') }] };
    },
  );
}
