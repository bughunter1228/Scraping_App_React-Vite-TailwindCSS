


const RedButton = ({text, icon, handleOnClick, isLoading}) =>{
    return (
        <button 
            className="bg-[red] text-[white] !p-[5px] cursor-pointer text-[13px] w-full rounded-md flex flex-row justify-center items-center gap-[10px]"
            onClick={handleOnClick}
        >
            {
                isLoading ? 
                <span class="loader"></span> : 
                <>
                    <h3 className="font-bold">{text}</h3>
                    {icon}
                </> 
            }
        </button>
    )
}

export default RedButton