import React, { useCallback } from 'react';
import { Card, Text, Flex, Box, Button, Stack, Badge, Inline } from '@sanity/ui';
import { set, unset } from 'sanity';

export function ExhibitControl(props: any) {
  const { value, onChange } = props;

  // value is expected to be an object with { x, y, z, rotation, vitality, lifecycle }
  const x = value?.x || 0;
  const y = value?.y || 0;
  const z = value?.z || 0;
  const vitality = value?.vitality ?? 100;
  const lifecycle = value?.lifecycle || 'ACTIVE';

  const updateField = useCallback((field: string, val: any) => {
    onChange(set({ ...value, [field]: val }));
  }, [onChange, value]);

  const setLifecycle = useCallback((state: string) => {
    onChange(set({ ...value, lifecycle: state }));
  }, [onChange, value]);

  // Create vitality bars
  const blocks = 10;
  const filledBlocks = Math.round((vitality / 100) * blocks);
  const bar = '█'.repeat(filledBlocks) + '░'.repeat(blocks - filledBlocks);

  return (
    <Card padding={4} radius={2} shadow={1} tone="primary">
      <Flex direction="column" gap={4}>
        <Text size={2} weight="bold">EXHIBIT CONTROL</Text>
        
        <Box>
          <Text size={1} muted>Location</Text>
          <Flex gap={3} marginTop={2}>
            <Text size={2}>X: {x.toFixed(1)}</Text>
            <Text size={2}>Y: {y.toFixed(1)}</Text>
            <Text size={2}>Z: {z.toFixed(1)}</Text>
          </Flex>
        </Box>

        <Box>
          <Text size={1} muted>Vitality</Text>
          <Text size={3} style={{ fontFamily: 'monospace', marginTop: '4px' }}>
            {bar} {vitality}%
          </Text>
        </Box>

        <Box>
          <Text size={1} muted>Lifecycle</Text>
          <Flex align="center" gap={3} marginTop={2}>
            <Text size={1} style={{ border: '1px solid currentColor', padding: '2px 4px', borderRadius: '4px' }}>
              {lifecycle}
            </Text>
          </Flex>
        </Box>

        <Flex gap={2} wrap="wrap" marginTop={2}>
          <Button text="ACTIVE" mode="ghost" tone="positive" onClick={() => setLifecycle('ACTIVE')} />
          <Button text="REVIVE" mode="ghost" tone="primary" onClick={() => setLifecycle('REVIVED')} />
          <Button text="MOVE" mode="ghost" tone="default" onClick={() => updateField('x', x + 1.5)} />
          <Button text="ARCHIVE" mode="ghost" tone="critical" onClick={() => setLifecycle('ARCHIVED')} />
        </Flex>
      </Flex>
    </Card>
  );
}
