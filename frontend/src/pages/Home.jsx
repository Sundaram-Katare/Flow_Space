import Navbar from "../components/Navbar";

export default function Home() {
    return (
        <>
            <div className="bg-transparent min-h-screen mx-64">
                <Navbar />

                <div className="flex flex-col items-center justify-center h-full py-32 space-y-12">
                    <div className="text-center text-black text-7xl font-bold">
                        Collaborate and Organize work effortlessly
                    </div>

                    <p className="text-xl text-black text-center">
                        Manage tasks, chat with your team, and track progress all in one place.
                    </p>
                </div>
            </div>
        </>
    )
}