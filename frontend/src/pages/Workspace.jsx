import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Plus, MessageCircle, Info } from 'lucide-react';
import ChatUI from '../components/Workspace/ChatUI';
import CreateChannel from '../components/Workspace/CreateChannel';
import TaskBoard from '../components/Workspace/TaskBoard';

export default function Workspace() {
    const { activeItem, setActiveItem, activeChannel, setActiveChannel, channels, setChannels, workspaceId } = useOutletContext();
    const { token } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/auth');
        }
    }, [token, navigate]);

    const currentChannelData = channels.find(c => c.id === activeChannel);

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden">
            <AnimatePresence mode="wait">
                {activeChannel ? (
                    <motion.div 
                        key="chat-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 overflow-hidden"
                    >
                        <ChatUI channel={currentChannelData} />
                    </motion.div>
                ) : activeItem === 'tasks' ? (
                    <motion.div 
                        key="tasks-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex-1 overflow-hidden"
                    >
                        <TaskBoard workspaceId={workspaceId} />
                    </motion.div>
                ) : (
                    <motion.div 
                        key="create-channel-view-default"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex items-center justify-center p-6"
                    >
                        <CreateChannel 
                          workspaceId={workspaceId} 
                          onSuccess={(newChannel) => {
                            setChannels([...channels, newChannel]);
                            setActiveChannel(newChannel.id);
                          }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}