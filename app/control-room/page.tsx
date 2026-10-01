import ControlRoomClient from './ControlRoomClient';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic'; // Ensures it's rendered on the server per request if needed

export default async function ControlRoomPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <ControlRoomClient />
    </div>
  );
}
