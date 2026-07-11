import { useQuery } from '@tanstack/react-query';
import { Mail, Calendar } from 'lucide-react';
import { fetchContactMessages } from '../api/contact';

const AdminMessages = () => {

  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchContactMessages
  });

  if (isLoading) return <div className="text-gray-400">Loading messages...</div>;
  if (isError) return <div className="text-red-400">Error loading messages.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Contact Messages</h3>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {messages?.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No messages found.</div>
        ) : (
          <ul className="divide-y divide-gray-700">
            {messages.map((msg) => (
              <li key={msg._id} className="p-6 hover:bg-gray-750 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{msg.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {msg.email}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-gray-300 bg-gray-900 p-4 rounded-lg text-sm leading-relaxed border border-gray-700 whitespace-pre-wrap">
                  {msg.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;

