import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


const ScrapItem = ({id, url, isSuccess}) =>{
    return (
        <div className="w-full !p-[5px] flex flex-row justify-around items-center !border-[#e2e8f0] !border-b-[1px]">
            <p>{id}</p>
            <p className="text-[10px]">{url}</p>
            {
                isSuccess ? <FaCheck color="green" /> : <IoClose color="red" />
            }
        </div>
    )
}

export default ScrapItem