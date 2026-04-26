import Navbar from "../components/Navbar";
import { easeInOut, motion, useInView } from 'framer-motion';
import { ArrowRightIcon, MessageSquare, CheckSquare, BookOpen, Users, Zap, Shield, Globe, ChevronDown } from 'lucide-react';
import Features from "../components/Features";
import { useNavigate } from "react-router";
import { useRef } from "react";

const sentence = "Manage tasks, chat with your team, and track progress all in one place.";

const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    delay: 0.6
};

const featureCards = [
    {
        icon: <MessageSquare size={28} strokeWidth={1.5} />,
        title: "Real-Time Messaging",
        desc: "Instant team communication powered by WebSockets. Create channels, share files, and stay in sync — no refresh needed.",
        color: "from-blue-500/10 to-blue-600/5",
        border: "border-blue-200/40",
        iconColor: "text-blue-600",
    },
    {
        icon: <CheckSquare size={28} strokeWidth={1.5} />,
        title: "Task Management",
        desc: "Organize work with boards, lists, and cards. Assign tasks, set deadlines, and track progress effortlessly.",
        color: "from-indigo-500/10 to-indigo-600/5",
        border: "border-indigo-200/40",
        iconColor: "text-indigo-600",
    },
    {
        icon: <BookOpen size={28} strokeWidth={1.5} />,
        title: "Knowledge Base",
        desc: "Store docs, notes, and wikis in one searchable place. Your team's collective knowledge, always accessible.",
        color: "from-sky-500/10 to-sky-600/5",
        border: "border-sky-200/40",
        iconColor: "text-sky-600",
    },
    {
        icon: <Users size={28} strokeWidth={1.5} />,
        title: "Role-Based Access",
        desc: "Granular permissions for admins and members. Keep the right people in the loop with workspace-level control.",
        color: "from-violet-500/10 to-violet-600/5",
        border: "border-violet-200/40",
        iconColor: "text-violet-600",
    },
    {
        icon: <Zap size={28} strokeWidth={1.5} />,
        title: "Blazing Performance",
        desc: "Redis-powered caching and optimized backend architecture ensure sub-millisecond response times at scale.",
        color: "from-amber-500/10 to-amber-600/5",
        border: "border-amber-200/40",
        iconColor: "text-amber-600",
    },
    {
        icon: <Shield size={28} strokeWidth={1.5} />,
        title: "Enterprise Security",
        desc: "End-to-end encrypted channels, audit logs, and SSO-ready auth keep your team's data protected at every layer.",
        color: "from-emerald-500/10 to-emerald-600/5",
        border: "border-emerald-200/40",
        iconColor: "text-emerald-600",
    },
];

const steps = [
    { num: "01", title: "Create a Workspace", desc: "Set up your team's home base in seconds. Customize it with your brand and invite members right away." },
    { num: "02", title: "Build Your Channels", desc: "Organize conversations into channels — by project, department, or topic. Structure that actually makes sense." },
    { num: "03", title: "Collaborate in Real Time", desc: "Chat, assign tasks, share docs and track progress — all without ever switching tabs or tools." },
];

const stats = [
    { value: "10x", label: "Faster communication" },
    { value: "3-in-1", label: "Tools replaced" },
    { value: "99.9%", label: "Uptime guaranteed" },
    { value: "<1ms", label: "Message delivery" },
];

const testimonials = [
    {
        quote: "FlowSpace replaced three separate tools for us. Our team moved faster from day one.",
        name: "Priya Sharma",
        role: "Engineering Lead, Nexora",
        initials: "PS",
        color: "bg-blue-100 text-blue-700",
    },
    {
        quote: "The real-time collaboration is unmatched. It feels like everyone's in the same room.",
        name: "Arjun Mehta",
        role: "Product Manager, Stackly",
        initials: "AM",
        color: "bg-indigo-100 text-indigo-700",
    },
    {
        quote: "Finally a platform that handles tasks AND docs AND chat without feeling bloated.",
        name: "Sarah Liu",
        role: "Founder, BuildFast",
        initials: "SL",
        color: "bg-violet-100 text-violet-700",
    },
];

function FadeInSection({ children, delay = 0, className = "" }) {
    const ref = useRef(null);
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: easeInOut, delay }}
        >
            {children}
        </motion.div>
    );
}

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            {/* Background blobs */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute top-[30%] right-[-8%] w-[400px] h-[400px] bg-indigo-200/25 rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] bg-sky-100/30 rounded-full blur-3xl" />
            </div>

            <div className="bg-transparent min-h-screen mx-64 font-poppins">
                <Navbar />

                {/* ── HERO SECTION (unchanged logic, kept as-is) ── */}
                <div className="flex flex-col items-center justify-center h-full py-32 space-y-12">
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

                        <motion.div className="flex-0 flex justify-center" >
                            <div className="flex items-center justify-center gap-4">
                                <motion.button
                                    className="flex px-4 py-2 text-2xl rounded-md text-white bg-blue-800"
                                    initial={{ opacity: 0, scale: 0.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate("/auth")}
                                >
                                    Create Your Workspace
                                    <div className="flex items-center justify-center rounded bg-white text-black px-1 ml-2">
                                        <ArrowRightIcon />
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    <motion.p
                        className="text-xl text-black text-center"
                        initial="hidden"
                        animate="visible"
                        transition={{ staggerChildren: 0.05, delay: 0.6 }}
                    >
                        {sentence.split("").map((char, index) => (
                            <motion.span key={index} variants={charVariants}>
                                {char}
                            </motion.span>
                        ))}
                    </motion.p>

                    {/* Floating images (unchanged) */}
                    <div className="relative py-12">
                        <div className="grid grid-cols-2 gap-16 px-4">
                            <div className="rounded-md">
                                <motion.img
                                    initial={{ opacity: 1, scale: 1 }}
                                    animate={{ rotate: [-20, -10, -20], opacity: 1, scale: 1 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    src="/featureImg1.png" alt="" className="shadow-xl rounded-md border border-4-white" />
                            </div>
                            <div className="rounded-md relative">
                                <motion.img
                                    initial={{ opacity: 1, scale: 1 }}
                                    animate={{ rotate: [20, 10, 20], opacity: 1, scale: 1 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    src="/featureImg1.png" alt="" className="shadow-xl rounded-md border border-4-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── TEAM SECTION (unchanged) ── */}
                <motion.div className="bg-gray-200/60 backdrop-blur-md border border-white/20 
                    rounded-xl shadow-lg flex flex-col items-center h-full py-32 space-y-12"
                    initial={{ opacity: 0, y: 200 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: easeInOut }}
                >
                    <div className="text-center">
                        <motion.h1 className="text-black font-poppins font-semibold text-4xl">
                            Empower Your
                        </motion.h1>
                        <motion.h1 className="text-black font-poppins mt-0 font-semibold text-4xl">
                            team, achieve more
                        </motion.h1>
                    </div>
                </motion.div>

                {/* ── STATS BAR ── */}
                <FadeInSection className="mt-24">
                    <div className="grid grid-cols-4 gap-6">
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col items-center justify-center py-10 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(59,130,246,0.10)" }}
                            >
                                <span className="font-poppins font-semibold text-4xl text-blue-800">{s.value}</span>
                                <span className="font-poppins text-sm text-gray-500 mt-2 text-center">{s.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </FadeInSection>

                {/* ── FEATURES GRID ── */}
                <FadeInSection className="mt-32">
                    <div className="text-center mb-16">
                        <p className="font-poppins text-sm font-medium text-blue-700 uppercase tracking-widest mb-3">Everything in one place</p>
                        <h2 className="font-poppins font-semibold text-5xl text-black leading-tight">
                            Built for the way<br />modern teams work
                        </h2>
                        <p className="font-poppins text-gray-500 text-lg mt-5 max-w-xl mx-auto">
                            FlowSpace brings together messaging, tasks, and knowledge — so your team spends less time switching and more time building.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {featureCards.map((card, i) => (
                            <motion.div
                                key={i}
                                className={`rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-sm p-7 flex flex-col gap-4`}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.55, delay: i * 0.08 }}
                                whileHover={{ y: -5, transition: { duration: 0.25 } }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm ${card.iconColor}`}>
                                    {card.icon}
                                </div>
                                <h3 className="font-poppins font-semibold text-xl text-gray-900">{card.title}</h3>
                                <p className="font-poppins text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </FadeInSection>

                {/* ── HOW IT WORKS ── */}
                <FadeInSection className="mt-40">
                    <div className="bg-gray-100/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-sm px-16 py-20">
                        <div className="text-center mb-16">
                            <p className="font-poppins text-sm font-medium text-blue-700 uppercase tracking-widest mb-3">Simple by design</p>
                            <h2 className="font-poppins font-semibold text-5xl text-black">How FlowSpace works</h2>
                        </div>

                        <div className="grid grid-cols-3 gap-10 relative">
                            {/* connector line */}
                            <div className="absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 hidden md:block" />

                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    className="flex flex-col items-start gap-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-blue-800 text-white flex items-center justify-center font-poppins font-semibold text-xl shadow-md shadow-blue-200 z-10">
                                        {step.num}
                                    </div>
                                    <h3 className="font-poppins font-semibold text-xl text-gray-900">{step.title}</h3>
                                    <p className="font-poppins text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </FadeInSection>

                {/* ── TESTIMONIALS ── */}
                <FadeInSection className="mt-40">
                    <div className="text-center mb-16">
                        <p className="font-poppins text-sm font-medium text-black uppercase tracking-widest mb-3">Loved by teams</p>
                        <h2 className="font-poppins font-semibold text-5xl text-black">Don't take our word for it</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl p-8 flex flex-col gap-6 shadow-sm"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: i * 0.1 }}
                                whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(59,130,246,0.08)" }}
                            >
                                {/* Stars */}
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="font-poppins text-gray-700 text-base leading-relaxed">"{t.quote}"</p>
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-poppins font-semibold text-sm`}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p className="font-poppins font-semibold text-sm text-gray-900">{t.name}</p>
                                        <p className="font-poppins text-xs text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </FadeInSection>

                {/* ── CTA BANNER ── */}


                {/* ── FOOTER ── */}
                <footer className="border-t mt-4 border-gray-200/60 py-12 flex items-center justify-between">
                    <div>
                        <span className="font-poppins font-semibold text-xl text-blue-800">FlowSpace</span>
                        <p className="font-poppins text-sm text-gray-900 mt-1">Work, together.</p>
                    </div>
                    <div className="flex gap-8 font-poppins text-sm text-gray-900">
                        <a href="#" className="hover:text-blue-800 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-800 transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-800 transition-colors">Contact</a>
                    </div>
                    <p className="font-poppins text-sm text-gray-900">© 2025 FlowSpace. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}