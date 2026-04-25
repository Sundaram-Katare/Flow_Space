import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChannels, addChannel, setCurrentChannel } from "../../../features/chat/chatSlice.js";
import { getWorkspaceChannels, createChannel } from "../../services/chat.js";
import { joinChannel, leaveChannel } from "../../services/socket.js";

export default function ChannelList({ workspaceId }) {
  const dispatch = useDispatch();
  const { channels, currentChannel } = useSelector((state) => state.chat);
  const [newChannelName, setNewChannelName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load channels
  useEffect(() => {
    const loadChannels = async () => {
      try {
        const data = await getWorkspaceChannels(workspaceId);
        dispatch(setChannels(data.channels));
        
        // Auto-select first channel
        if (data.channels.length > 0 && !currentChannel) {
          const firstChannel = data.channels[0];
          dispatch(setCurrentChannel(firstChannel));
          joinChannel(firstChannel.id);
        }
      } catch (err) {
        console.error("Failed to load channels:", err);
      }
    };

    loadChannels();
  }, [workspaceId, dispatch, currentChannel]);

  // Handle channel switch
  const handleSelectChannel = (channel) => {
    // Leave previous channel
    if (currentChannel) {
      leaveChannel(currentChannel.id);
    }

    // Join new channel
    dispatch(setCurrentChannel(channel));
    joinChannel(channel.id);
  };

  // Handle create channel
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    setLoading(true);
    try {
      const data = await createChannel(
        workspaceId,
        newChannelName,
        "",
        "public"
      );
      dispatch(addChannel(data.channel));
      setNewChannelName("");
      setShowCreateForm(false);
    } catch (err) {
      alert("Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-bold text-lg">Channels</h3>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto p-2">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleSelectChannel(channel)}
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition ${
              currentChannel?.id === channel.id
                ? "bg-blue-600 font-semibold"
                : "text-gray-300"
            }`}
          >
            # {channel.name}
          </button>
        ))}
      </div>

      {/* Create Channel Form */}
      <div className="p-4 border-t border-gray-700">
        {showCreateForm ? (
          <form onSubmit={handleCreateChannel} className="space-y-2">
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="Channel name"
              className="w-full px-2 py-1 rounded bg-gray-800 text-white text-sm focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !newChannelName.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm disabled:opacity-50"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-sm"
          >
            + Create Channel
          </button>
        )}
      </div>
    </div>
  );
}