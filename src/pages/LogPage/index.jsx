import { useState } from "react";
import { IoIosLink } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";

import Layout from "../../layouts"

const LogPage = () => {

    const logs = useState([]);

    return (
        <Layout>
            <div className="w-full h-[80%] flex justify-center">
                <div className="w-[90%] max-w-[700px] h-full overflow-auto !pt-[20px]">
                    <table className="w-full">
                        <tr>
                            <th> <div className="flex justify-center items-center gap-[10px]">URL <IoIosLink /></div> </th>
                            <th> <div className="flex justify-center items-center gap-[10px]">Success <FaCheck color="green" /></div> </th>
                            <th> <div className="flex justify-center items-center gap-[10px]">Duplicated <IoClose color="red" /></div> </th>
                            <th> <div className="flex justify-center items-center gap-[10px]">Time <MdAccessTime color="blue" /></div> </th>
                        </tr>
                        {
                            logs.map((log, index) => <tr id={index}>
                                <td>{log.url}</td>
                                <td>{log.success}</td>
                                <td>{log.fail}</td>
                                <td>{log.time}</td>
                            </tr>)
                        }
                    </table>
                </div>
            </div>
        </Layout>
    )
}

export default LogPage