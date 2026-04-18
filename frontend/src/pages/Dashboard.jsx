import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WorkspaceSwitcher from "../components/WorkspaceSwitcher";
import CreateWorkspaceCard from "../components/CreateWorkspaceCard";
import JoinWorkspaceCard from "../components/JoinWorkspaceCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  useEffect(() => {
    // Redirect to login if no token
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  const handleWorkspaceClick = () => {
    if (currentWorkspace) {
      navigate(`/workspace/${currentWorkspace.id}`);
    }
  };

  return (
    <>
     <div className="space-y-20 px-12 py-12">
                <nav className="flex justify-end">
                    <h1 className="font-inter text-2xl font-semibold text-black">FlowSpace</h1>
                </nav>

                <div className="bg-[#36C7B5] h-60 rounded-2xl p-6 grid grid-cols-2 gap-20">

                    <div className="flex flex-col space-y-6">
                        <h1 className="text-white font-inter font-normal text-4xl">Stay in sync. Get things done.</h1>
                        <p className="text-white font-inter font-light text-md">Everything your team needs — chats, tasks, and knowledge in one place.</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 z-10 flex items-end justify-end">
                            <img src="/main1.png" alt="" className="h-80" />
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-2 justify-between gap-20">
                  {/* <CreateWorkspace /> */}
                  <CreateWorkspaceCard />
                  <JoinWorkspaceCard />
                </div>

            </div>
    </>
  );
}