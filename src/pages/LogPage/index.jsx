import { useState, useEffect } from "react";
import { IoIosLink } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";

import Layout from "../../layouts"
import { db } from "../../lib/firebase";
import { doc, setDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

const LogPage = () => {

    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const colRef = collection(db, "logs");
            const q = query(colRef, orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLogs(list);
            setIsLoading(false);
        }

        fetchData();
    }, [])

    return (
        <Layout>
            <div className="w-full h-[calc(100%-114px)] flex justify-center items-center">
                {!isLoading ? <div className="w-[90%] max-w-[900px] h-full !mt-[20px]">
                    <h1 className="font-bold text-[20px]">Scraping History</h1>
                    <p className="text-[#64748b]">A log of your recent scraping activities.</p>
                    <div className="w-full h-[85%] overflow-auto !mt-[20px]">
                        <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
                                <tr>
                                    <th className="px-4 py-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            URL <IoIosLink />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            Success <FaCheck className="text-green-500" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            Duplicated <IoClose className="text-red-500" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            Time <MdAccessTime className="text-blue-500" />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, index) => (
                                    <tr
                                        key={index}
                                        className="even:bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                                    >
                                        <td className="px-4 py-2 text-xs break-all text-blue-700 underline">
                                            {log.url}
                                        </td>
                                        <td className="px-4 py-2 text-center text-sm">
                                            {log.success}
                                        </td>
                                        <td className="px-4 py-2 text-center text-sm">
                                            {log.fail}
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-600">{log.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div> : <span className="loader !w-[150px] !h-[150px] bg-[#6293f7]" ></span>
                }
            </div>
        </Layout>
    )
}

export default LogPage