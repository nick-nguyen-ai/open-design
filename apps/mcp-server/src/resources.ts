// apps/mcp-server/src/resources.ts
/**
 * MCP resources - the ONLY channel that moves file content to clients.
 * Tools return `opendesign://` URIs (see reference-files.ts); these handlers
 * resolve them. Reads are traversal-safe; unknown ids throw, which the SDK
 * surfaces as a resources/read error.
 */
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { RegistryData } from './registry-data.js';
import { readExperienceFile } from './reference-files.js';

function textContents(uri: string, text: string) {
  return { contents: [{ uri, mimeType: 'text/plain', text }] };
}

export function registerReferenceResources(server: McpServer, registry: RegistryData): void {
  server.registerResource(
    'template-source',
    new ResourceTemplate('opendesign://templates/{templateId}/source/{+file}', { list: undefined }),
    {
      title: 'World-template source file',
      description: 'Source of a catalogue world-template, for strict-fidelity porting.',
    },
    async (uri, variables) => {
      const templateId = String(variables.templateId);
      const file = String(variables.file);
      const descriptor = registry.worldTemplateById.get(templateId);
      if (!descriptor) throw new Error(`Unknown world template '${templateId}'.`);
      const text = readExperienceFile(descriptor.experienceId, file);
      if (text === undefined) throw new Error(`No source file '${file}' in template '${templateId}'.`);
      return textContents(uri.href, text);
    },
  );

  server.registerResource(
    'part-source',
    new ResourceTemplate('opendesign://parts/{experienceId}/{+file}', { list: undefined }),
    {
      title: 'Experience part source file',
      description: 'Source of a live-world file referenced by get_part_reference.',
    },
    async (uri, variables) => {
      const experienceId = String(variables.experienceId);
      const file = String(variables.file);
      const text = readExperienceFile(experienceId, file);
      if (text === undefined) throw new Error(`No source file '${file}' in experience '${experienceId}'.`);
      return textContents(uri.href, text);
    },
  );
}
