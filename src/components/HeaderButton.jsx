

const HeaderButton = ({icon, text, selected}) =>{
    return (
        <div 
            className="flex flex-row gap-[5px] justify-center items-center cursor-pointer !pl-[10px] !pr-[10px] !pt-[5px] !pb-[5px]  rounded-md hover:bg-[#f1f5f9] text-[#68768d]" 
            style={selected ? {color: '#4982f7', backgroundColor: '#e4f0fd'} : {}}
        >
            {icon}
            <h3 className="font-[500]">{text}</h3>
        </div>
    )   
}

export default HeaderButton