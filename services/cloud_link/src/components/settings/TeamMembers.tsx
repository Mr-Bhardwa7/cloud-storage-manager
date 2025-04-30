import { useState } from 'react';
import { TeamMember } from '@/types/settings';

interface TeamMembersProps {
  members: TeamMember[];
  setMembers: (members: TeamMember[]) => void;
}

export default function TeamMembers({ members, setMembers }: TeamMembersProps) {
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [memberFormData, setMemberFormData] = useState<TeamMember>({
    name: '',
    position: '',
    email: ''
  });

  const handleSubmit = () => {
    if (editingMemberIndex !== null) {
      const updatedMembers = [...members];
      updatedMembers[editingMemberIndex] = memberFormData;
      setMembers(updatedMembers);
    } else {
      setMembers([...members, memberFormData]);
    }
    setShowTeamForm(false);
    setEditingMemberIndex(null);
    setMemberFormData({ name: '', position: '', email: '' });
  };

  const handleDelete = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900">Team Members</h4>
        <button
          onClick={() => {
            setShowTeamForm(true);
            setEditingMemberIndex(null);
            setMemberFormData({ name: '', position: '', email: '' });
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setEditingMemberIndex(index);
                      setMemberFormData(member);
                      setShowTeamForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTeamForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingMemberIndex !== null ? 'Edit Member' : 'Add New Member'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={memberFormData.name}
                  onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={memberFormData.position}
                  onChange={(e) => setMemberFormData({ ...memberFormData, position: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={memberFormData.email}
                  onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowTeamForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {editingMemberIndex !== null ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}