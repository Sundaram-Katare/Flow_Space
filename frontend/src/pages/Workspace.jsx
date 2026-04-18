import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentWorkspace, fetchMembersStart, fetchMembersSuccess, fetchMembersFailure } from '../../features/workspace/workspaceSlice';
import { getWorkspace, getWorkspaceMembers } from '../services/workspace';
import { Copy, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ChatUI from '../components/Workspace/ChatUI';

export default function Workspace() {
    const { id: workspaceId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { members, isLoading } = useSelector(state => state.workspace);
    const { token } = useSelector(state => state.auth);
    const [workspaceData, setWorkspaceData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/auth');
            return;
        }

        const fetchData = async () => {
            try {
                const wsData = await getWorkspace(workspaceId);
                if (wsData.workspace) {
                    setWorkspaceData(wsData.workspace);
                    dispatch(setCurrentWorkspace(wsData.workspace));
                }
                
                dispatch(fetchMembersStart());
                const membersData = await getWorkspaceMembers(workspaceId);
                dispatch(fetchMembersSuccess(membersData.members || []));
            } catch (err) {
                console.error('Error:', err);
                setError('Failed to load workspace');
                toast.error('Failed to load workspace');
                dispatch(fetchMembersFailure('Failed'));
            }
        };

        fetchData();
    }, [workspaceId, dispatch, navigate, token]);

    const handleCopy = () => {
        if (workspaceData?.workspace_code) {
            navigator.clipboard.writeText(workspaceData.workspace_code);
            toast.success('Code copied!');
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!workspaceData) {
        return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-4xl font-bold mb-2">{workspaceData.name}</h1>
                {workspaceData.description && <p className="text-teal-100 text-lg">{workspaceData.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Invite Team Members</h2>
                    <p className="text-gray-600 mb-6">Share this code with your team to invite them.</p>
                    
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border-2 border-gray-200">
                        <span className="text-3xl font-bold text-teal-600 tracking-widest">{workspaceData.workspace_code}</span>
                        <button onClick={handleCopy} className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg transition">
                            <Copy size={20} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click to copy the invite code</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Team Members ({members.length})</h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {isLoading ? (
                            <p className="text-gray-500">Loading members...</p>
                        ) : members.length > 0 ? (
                            members.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{member.user_id}</p>
                                        <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No members yet</p>
                        )}
                    </div>
                </div>

                <ChatUI />
            </div>
        </div>
    );
};
