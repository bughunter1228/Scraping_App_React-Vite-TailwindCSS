


const BlueButton = ({text, icon, handleOnClick, isLoading, classlist}) =>{
    return (
        <button 
            className={`bg-[#417df6] text-[white] !p-[5px] cursor-pointer w-full rounded-md flex flex-row justify-center items-center gap-[10px] ${classlist}`}
            onClick={handleOnClick}
        >
            {
                isLoading ? 
                <span class="loader" style={{height:'100%'}}></span> : 
                <>
                    <h3 className="font-bold">{text}</h3>
                    {icon}
                </> 
            }
        </button>
    )
}

export default BlueButton