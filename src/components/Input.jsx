

const Input = ({id, placeholder, value, handleOnChange}) =>{
    return (
        <input 
            id={id} 
            className="w-full h-[30px] !border-[1px] !border-[#e2e8f0] bg-[white] !p-[5px] rounded-md" 
            placeholder={placeholder} 
            value={value}
            onChange={e=>{handleOnChange(e.target.value)}}
        />
    )
}

export default Input