import {RotateCcw} from "lucide-react";


type ResetContextButtonProps = {
    onClick: () => void
}


const ResetContextButton = ({onClick}: ResetContextButtonProps) => {
    return(
        <button
            onClick={onClick}
            className="border-stone-300 border rounded-lg m-2 p-2 cursor-pointer flex gap-2 bg-white hover:bg-stone-100 h-9 shadow-sm"
        >
            <div className="flex items-center">
                <RotateCcw className="h-5 w-5"/>
            </div>

            <div className="flex items-center">
                Reset everything
            </div>
        </button>
    )
}

export default ResetContextButton;