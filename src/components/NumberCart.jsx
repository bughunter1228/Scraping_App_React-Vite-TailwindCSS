

const NumberCart = ({title, icon, number, description}) =>{
    return (
        <div className="flex flex-col !p-[20px] bg-[white] !border-[1px] !border-[#e2e8f0] rounded-md w-[24%] gap-[5px]">
            <div className="w-full flex flex-row justify-between items-center">
                <p>{title}</p>
                {icon}
            </div>
            <h2 className="font-bold text-[20px]">{number}</h2>
            <p className="text-[13px] text-[#64748b]">{description}</p>
        </div>
    )
}

export default NumberCart