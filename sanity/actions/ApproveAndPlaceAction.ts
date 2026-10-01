import { DocumentActionComponent, useClient } from 'sanity';

export const ApproveAndPlaceAction: DocumentActionComponent = (props) => {
  const { type, published, draft, onComplete } = props;
  const client = useClient({ apiVersion: '2024-01-01' });
  
  if (type !== 'exhibit') return null;
  
  const doc = draft || published;
  if (!doc || doc.workflowState !== 'REVIEW') {
    return null;
  }

  return {
    label: 'Approve & Place (Agent Workflow)',
    onHandle: async () => {
      // Simulate Agent deciding the best room and location
      const agentLocation = {
        x: (Math.random() - 0.5) * 20,
        y: 0,
        z: (Math.random() - 0.5) * 20,
      };

      const patch = client.patch(props.id)
        .set({ workflowState: 'PLACED' })
        .set({ 
          'control.x': agentLocation.x,
          'control.y': agentLocation.y,
          'control.z': agentLocation.z,
        });

      await patch.commit();
      onComplete();
    }
  };
};
