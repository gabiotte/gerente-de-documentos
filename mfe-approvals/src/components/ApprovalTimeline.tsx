import { CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'requested' | 'approved' | 'rejected' | 'signed';
  user: string;
  timestamp: string;
  description: string;
}

interface ApprovalTimelineProps {
  events: TimelineEvent[];
}

export function ApprovalTimeline({ events }: ApprovalTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'signed':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="p-2 bg-gray-50 rounded-full">{getIcon(event.type)}</div>
            {index < events.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-8">
            <p className="font-medium text-gray-900">{event.description}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <span>{event.user}</span>
              <span>•</span>
              <span>{new Date(event.timestamp).toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
