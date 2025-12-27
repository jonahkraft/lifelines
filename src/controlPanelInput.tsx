import {type ChangeEvent} from "react";
import {Info} from "lucide-react";


type ControlPanelInputProps = {
    title: string,
    type: "number" | "text",
    value: string | number,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    min?: number,
    max?: number,
    tooltipText?: string,
}

const ControlPanelInput = ({title, type, value, placeholder, onChange, min, max, tooltipText}: ControlPanelInputProps) => {
    return(
        <div className="flex flex-col gap-1">

            {
                tooltipText !== undefined
                    ?
                    <>
                        <div className="relative group inline-block">
                            <label className="text-sm flex gap-2">
                                {title}
                                <div className="flex items-center">
                                    <Info className="h-4 w-4"/>
                                </div>
                            </label>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-xs p-2 m-2 bg-white text-stone-800 text-sm border border-stone-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {tooltipText}
                            </div>
                        </div>
                    </>
                    : <label className="text-sm">{title}</label>
            }

            <input
                className="bg-white border-stone-300 border rounded-md p-1 focus:outline-none focus:ring focus:ring-amber-400 h-9 w-1/2"
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                min={min}
                max={max}
            />
        </div>
    )
}

export default ControlPanelInput;