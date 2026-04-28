import React, { useState } from 'react';

interface Participant {
    id: number;
    name: string;
    email: string;
    phone: string;
    event: string;
    team: string;
    regDate: string;
    status: string;
}

const ParticipantsManagement: React.FC = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newParticipant, setNewParticipant] = useState({ name: '', email: '', phone: '', event: 'Hackathon', team: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEvent, setFilterEvent] = useState('All Events');
    const [filterStatus, setFilterStatus] = useState('All Statuses');

    // Action Handlers
    const handleApprove = (id: number) => {
        setParticipants(participants.map(p => p.id === id ? { ...p, status: 'Verified' } : p));
    };

    const handleReject = (id: number) => {
        setParticipants(participants.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    };

    const handleAddParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: Participant = {
            id: Date.now(),
            name: newParticipant.name,
            email: newParticipant.email,
            phone: newParticipant.phone,
            event: newParticipant.event,
            team: newParticipant.team || 'None',
            regDate: new Date().toISOString().split('T')[0],
            status: 'Registered'
        };
        setParticipants([...participants, newEntry]);
        setShowAddForm(false);
        setNewParticipant({ name: '', email: '', phone: '', event: 'Hackathon', team: '' });
    };

    // Filtering logic
    const filteredParticipants = participants.filter(p => {
        const matchEvent = filterEvent === 'All Events' || p.event === filterEvent;
        const matchStatus = filterStatus === 'All Statuses' || p.status === filterStatus;
        const searchLower = searchTerm.toLowerCase();
        const matchSearch = p.name.toLowerCase().includes(searchLower) || p.email.toLowerCase().includes(searchLower);
        return matchEvent && matchStatus && matchSearch;
    });

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Verified': return 'bg-green-100 text-green-800 border border-green-200';
            case 'Registered': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border border-red-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex pt-0">
            {/* Sidebar placeholder - assumes it's handled externally or replace this with actual Sidebar if needed */}
            {/* <Sidebar /> */}
            
            <div className="flex-1 flex flex-col min-h-screen">
                <main className="p-8 pt-10 flex-1">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Participants Management</h1>
                            <p className="text-gray-500 mt-2">Manage, filter, and review event participants.</p>
                        </div>
                        <button 
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            {showAddForm ? 'Cancel' : 'Add Participant'}
                        </button>
                    </div>

                    {/* Add Participant Form */}
                    {showAddForm && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Participant</h2>
                            <form onSubmit={handleAddParticipant} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required type="text" placeholder="Name" value={newParticipant.name} onChange={e => setNewParticipant({...newParticipant, name: e.target.value})} className="px-4 py-2 border rounded-lg" />
                                <input required type="email" placeholder="Email" value={newParticipant.email} onChange={e => setNewParticipant({...newParticipant, email: e.target.value})} className="px-4 py-2 border rounded-lg" />
                                <input required type="tel" placeholder="Phone" value={newParticipant.phone} onChange={e => setNewParticipant({...newParticipant, phone: e.target.value})} className="px-4 py-2 border rounded-lg" />
                                <select value={newParticipant.event} onChange={e => setNewParticipant({...newParticipant, event: e.target.value})} className="px-4 py-2 border rounded-lg bg-white">
                                    <option value="Hackathon">Hackathon</option>
                                    <option value="AI Challenge">AI Challenge</option>
                                </select>
                                <input type="text" placeholder="Team (Optional)" value={newParticipant.team} onChange={e => setNewParticipant({...newParticipant, team: e.target.value})} className="px-4 py-2 border rounded-lg" />
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors md:col-span-2">Submit</button>
                            </form>
                        </div>
                    )}

                    {/* Filters and Search Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Event Filter */}
                            <select 
                                value={filterEvent}
                                onChange={(e) => setFilterEvent(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-white"
                            >
                                <option value="All Events">All Events</option>
                                <option value="Hackathon">Hackathon</option>
                                <option value="AI Challenge">AI Challenge</option>
                            </select>

                            {/* Status Filter */}
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-white"
                            >
                                <option value="All Statuses">All Statuses</option>
                                <option value="Registered">Registered</option>
                                <option value="Verified">Verified</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-96 relative">
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Participants Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Team</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration Date</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredParticipants.length > 0 ? (
                                        filteredParticipants.map((participant) => (
                                            <tr key={participant.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{participant.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.phone}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.event}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.team}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.regDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(participant.status)}`}>
                                                        {participant.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            onClick={() => handleApprove(participant.id)}
                                                            disabled={participant.status === 'Verified'}
                                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                                participant.status === 'Verified' 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                                            }`}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(participant.id)}
                                                            disabled={participant.status === 'Rejected'}
                                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                                participant.status === 'Rejected' 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                            }`}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                                                No participants found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParticipantsManagement;
