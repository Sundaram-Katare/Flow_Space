import Navbar from "../components/Navbar";
import { easeInOut, motion, propEffect } from 'framer-motion';

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

                    <div className="relative py-12">
                        <div className=" grid grid-cols-2 gap-16 px-4">
                            <div className="rounded-md">
                                <motion.img
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.1, 1] }}   // grows then shrinks
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}

                                    src="/featureImg1.png" alt="" className="rounded-md border border-4 border-4-white" />
                            </div>

                            <div className="rounded-md relative">
                                <motion.img
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1.1, 1, 1.1] }} // shrinks when other grows
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    src="/featureImg1.png" alt="" className="rounded-md border border-4 border-4-white" />

                                <img src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyaWNrMHRvb2RtazB4NjBjMjZxZHgxYmVzZmlwZTFpcHgzMG13dXdlNyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Lqo3UBlXeHwZDoebKX/source.gif"
                                    className="absolute inset-0 left-64 top-36 h-36"
                                    alt="" />
                            </div>

                            <div className="absolute inset-0 flex justify-center h-12">
                                <button className="text-white px-2 py-1 rounded-md bg-blue-600 text-3xl">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}