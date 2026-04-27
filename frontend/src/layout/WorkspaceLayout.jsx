import WorkspaceSidebar from "../components/Workspace/WorkspaceSidebar";
import WorkspaceTopbar from "../components/Workspace/WorkspaceTopbar";
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { connectSocket, disconnectSocket } from "../services/socket";
import { getWorkspaceChannels } from "../services/chat";
import { getWorkspaceMembers, getWorkspace } from "../services/workspace";
import { setCurrentWorkspace } from "../../features/workspace/workspaceSlice.js";

export default function WorkspaceLayout() {
  const { id: workspaceId, channelId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(window.innerWidth > 768);
  const [activeItem, setActiveItem] = useState("chats");
  const [activeChannel, setActiveChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state from URL on mount/change
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/tasks")) {
      setActiveItem("tasks");
      setActiveChannel(null);
    } else if (path.includes("/docs")) {
      setActiveItem("docs");
      setActiveChannel(null);
    } else if (channelId) {
      setActiveItem("chats");
      setActiveChannel(channelId);
    } else {
      setActiveItem("chats");
      setActiveChannel(null);
    }
  }, [workspaceId, channelId]);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!workspaceId) return;
      try {
        setLoading(true);
        const [channelsData, membersData, workspaceData] = await Promise.all([
          getWorkspaceChannels(workspaceId),
          getWorkspaceMembers(workspaceId),
          getWorkspace(workspaceId)
        ]);
        
        setChannels(channelsData.channels || []);
        setMembers(membersData.members || []);
        dispatch(setCurrentWorkspace(workspaceData.workspace));

        // If at workspace root, auto-navigate to first channel
        const path = window.location.pathname;
        if (!channelId && !path.includes("/tasks") && !path.includes("/docs") && channelsData.channels?.length > 0) {
           navigate(`chat/${channelsData.channels[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error("Failed to fetch workspace data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId, dispatch]);

  // Handle manual navigation when activeItem changes
  useEffect(() => {
    const path = window.location.pathname;
    if (activeItem === "tasks" && !path.includes("/tasks")) {
      navigate("tasks");
      setActiveChannel(null);
    } else if (activeItem === "docs" && !path.includes("/docs")) {
      navigate("docs");
      setActiveChannel(null);
    } else if (activeItem === "chats" && !channelId && !path.includes("/chat") && channels.length > 0) {
      navigate(`chat/${channels[0].id}`);
      setActiveChannel(channels[0].id);
    }
  }, [activeItem, channels.length, channelId, navigate]);

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-poppins overflow-hidden">
      
      <WorkspaceSidebar 
        open={open} 
        setOpen={setOpen} 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        channels={channels}
        members={members}
        loading={loading}
      />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        
        <WorkspaceTopbar onMenuClick={() => setOpen(true)} />

        <div className="flex-1 overflow-hidden">
          <Outlet context={{ 
            activeItem, 
            setActiveItem, 
            activeChannel, 
            setActiveChannel,
            channels,
            setChannels,
            members,
            workspaceId
          }} />
        </div>

      </div>
    </div>
  );
}
