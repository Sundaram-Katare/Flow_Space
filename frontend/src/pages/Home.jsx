import Navbar from "../components/Navbar";
import { delay, eachAxis, easeInOut, motion, propEffect, scale } from 'framer-motion';
import { ArrowRight, ArrowRightIcon } from 'lucide-react';
import Features from "../components/Features";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const sentence = "Manage tasks, chat with your team, and track progress all in one place.";

const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    delay: 0.6
};


export default function Home() {
    const navigate = useNavigate();
    
    return (
        <>
            <div className="bg-transparent min-h-screen mx-64 font-poppins ">
                <Navbar />

                <div className="flex flex-col items-center justify-center h-full py-32 space-y-12">
                    {/* <div className="text-center text-black text-7xl font-semibold font-poppins">
                        Collaborate and Organize work effortlessly
                    </div> */}

                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex">
                                <motion.h1 className="font-poppins text-6xl font-semibold"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: -5 }}
                                    transition={{ duration: 0.8, ease: easeInOut }}
                                >
                                    All Your
                                </motion.h1>

                                <motion.h1 className="font-poppins text-6xl font-semibold"
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: -0 }}
                                    transition={{ duration: 0.8, ease: easeInOut, delay: 0.6, stiffness: 200 }}>
                                    Work
                                </motion.h1>
                            </div>

                            <div className="flex">
                                <motion.h1 className="font-poppins text-6xl font-semibold"
                                    initial={{ opacity: 0, x: 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, ease: easeInOut, delay: 0.6 }}
                                >
                                    Finally
                                </motion.h1>

                                <motion.h1 className="font-poppins text-6xl font-semibold"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 5 }}
                                    transition={{ duration: 0.8, ease: easeInOut }}>
                                    in Sync
                                </motion.h1>
                            </div>
                        </div>

                        <motion.div className="flex-0 flex justify-center" delay="2.6" >
                            <div className="flex items-center justify-center">
                                <div>
                                    <motion.button
                                        className="flex px-2 py-2 text-2xl rounded-md text-white bg-blue-800"
                                        initial={{ opacity: 0, scale: 0.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.6, delay: 0.8 }}
                                        onClick={() => navigate("/auth")}
                                    >
                                        Create Your Workspace

                                        <div className="flex items-center justify-center rounded bg-white text-black px-1 ml-1">
                                            <ArrowRightIcon />
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.p
                        className="text-xl text-black text-center"
                        initial="hidden"
                        animate="visible"
                        transition={{ staggerChildren: 0.05, delay: 0.6 }} // controls speed
                    >
                        {sentence.split("").map((char, index) => (
                            <motion.span key={index} variants={charVariants}>
                                {char}
                            </motion.span>
                        ))}
                    </motion.p>


                    <div className="relative py-12">
                        <div className=" grid grid-cols-2 gap-16 px-4">
                            <div className="rounded-md">
                                <motion.img
                                    initial={{ opacity: 1,  scale: 1,  }}
                                    animate={{ rotate: [-20, -10, -20], opacity: 1, scale: 1 }} 
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}

                                    src="/featureImg1.png" alt="" className="shadow-xl shaodow-black rounded-md border border- border-4-white" />
                            </div>

                            <div className="rounded-md relative">
                                <motion.img
                                    initial={{ opacity: 1,  scale: 1,  }}
                                    animate={{ rotate: [20, 10, 20], opacity: 1, scale: 1 }} 
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}

                                    src="/featureImg1.png" alt="" className="shadow-xl shaodow-black rounded-md border border- border-4-white" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
                        <Features />
        </>
    )
}