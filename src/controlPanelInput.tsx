import {type ChangeEvent} from "react";

type ControlPanelInputProps = {
    title: string,
    type: "number" | "text"
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    min?: number,
    max?: number,
}



const ControlPanelInput = ({title, type, placeholder, onChange, min, max}: ControlPanelInputProps) => {
    return(
        <div className="flex flex-col gap-1">
            <label className="text-sm">{title}</label>
            <input
                className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                min={min}
                max={max}
            />
        </div>
    )
}

export default ControlPanelInput;