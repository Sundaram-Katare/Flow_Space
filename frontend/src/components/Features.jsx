import { motion } from "framer-motion";

export default function Features() {
    const problems = [
        "Conversations lost in chats",
        "Tasks scattered across apps",
        "Docs disconnected from execution",
        "Constant context switching = productivity loss",
    ];

    const solutions = [
        "Conversations organized in one place",
        "All tasks centralized",
        "Docs connected with execution",
        "Focused workflow = maximum productivity",
    ];

    return (
        <div className="relative min-h-screen bg-white px-6 md:px-20 py-24 overflow-hidden">

            {/* subtle background accents */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 blur-3xl rounded-full"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                <motion.h2
                    className="text-4xl md:text-5xl font-semibold text-center text-gray-900 mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                >
                    From Chaos to Clarity
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* LEFT - PROBLEMS */}
                    <motion.div
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <div className="space-y-4 mb-8">
                            {problems.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-lg text-red-600 text-sm md:text-base"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                >
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    {item}
                                </motion.div>
                            ))}
                        </div>

                        <motion.img
                            src="https://static.vecteezy.com/system/resources/previews/030/936/637/non_2x/stressed-cartoon-character-png.png"
                            className="w-56 md:w-72 mx-auto"
                            initial={{ y: 10 }}
                            animate={{ y: [10, 0, 10] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </motion.div>

                    {/* RIGHT - SOLUTIONS */}
                    <motion.div
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <div className="space-y-4 mb-8">
                            {solutions.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-3 bg-green-50 border border-green-100 px-4 py-3 rounded-lg text-green-600 text-sm md:text-base"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                >
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    {item}
                                </motion.div>
                            ))}
                        </div>

                        <motion.img
                            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                            className="w-56 md:w-72 mx-auto"
                            initial={{ y: -10 }}
                            animate={{ y: [-10, 0, -10] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </motion.div>

                </div>
            </div>
        </div>
    );
}