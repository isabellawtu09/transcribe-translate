import { Waveform } from 'ldrs/react'
import 'ldrs/react/Waveform.css'

// Default values shown

export default function Progress(){
return(
    <div className = "pt-4">
    <p className = "text-lg font-[Gabarito]"> Loading model (only done once) </p>
    <Waveform size="40" stroke="3.5" speed="1" color="black" />
    </div>
);

}