import { motion } from 'framer-motion';

export default function Workspace() {
    return (
        <>
            <div className="space-y-20 px-12 py-12">
                <div className='bg-gray-800 text-white font-semibold flex flex-col items-center rounded-2xl max-w-md pt-4 px-4'>
                    <h1 className='text-2xl'>Invite Mates</h1>
                    <div className='bg-gray-850/40 px-2 py-1 rounded-xl'>
                        123456
                    </div>

                    <img src="/invite.png" alt="" className='mb-0 h-40' />
                </div>
            </div>
        </>
    )
};
