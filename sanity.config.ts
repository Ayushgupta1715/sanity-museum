'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { apiVersion, dataset, projectId } from './sanity/env';
import { ApproveAndPlaceAction } from './sanity/actions/ApproveAndPlaceAction';

export default defineConfig({
  name: 'devguru-studio',
  title: 'DevGuru Knowledge Base',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'exhibit') {
        return [...prev, ApproveAndPlaceAction];
      }
      return prev;
    },
  },
});
