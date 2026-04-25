import WorkspaceSidebar from "../components/Workspace/WorkspaceSidebar";
import WorkspaceTopbar from "../components/Workspace/WorkspaceTopbar";
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { connectSocket, disconnectSocket } from "../services/socket";
import { getWorkspaceChannels } from "../services/chat";
import { getWorkspaceMembers } from "../services/workspace";

export default function WorkspaceLayout() {
  const { id: workspaceId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(window.innerWidth > 768);
  const [activeItem, setActiveItem] = useState("chats");
  const [activeChannel, setActiveChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const [channelsData, membersData] = await Promise.all([
          getWorkspaceChannels(workspaceId),
          getWorkspaceMembers(workspaceId)
        ]);
        setChannels(channelsData.channels || []);
        setMembers(membersData.members || []);
      } catch (err) {
        console.error("Failed to fetch workspace data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId]);

    useEffect(() => {
    if (activeItem === "tasks") {
      navigate("tasks");
    } else if (activeItem === "docs") {
      navigate("docs");
    } else if (activeItem === "chats" && channels.length > 0) {
      navigate(`chat/${channels[0].id}`);
    }
  }, [activeItem, channels, navigate]);

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
