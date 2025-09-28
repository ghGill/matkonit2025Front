import './CustomButton.css'

export default function CustomButton( { btnData }:any ) {
    return (
        <div className={
            `
                custom-button-wrapper 
                ${btnData.noHover ? 'no-hover' : null}
            `}>
            <button 
                name = { btnData.name }
                type= { btnData.type || "submit" }
                className={`${btnData.disabled ? 'disabled' : null}`}
                style = { btnData.style || null }
                value = { btnData.value || null }
                onClick = { btnData.onClick || null }
            >
                {btnData.text}
            </button>

            {
                btnData.errMsg &&
                <div className='error-msg'>{btnData.errMsg}</div>
            }
        </div>
    )
}

