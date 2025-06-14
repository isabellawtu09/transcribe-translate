// display audio recorded or uploaded
// if audio was recorded, audio name
// also a button to allow for name change 

// then have transcribe translate section below audio 


import React, {useState, useRef} from 'react';
import Transcription from '../Transcription.jsx'
import Translation from '../Translation.jsx';


// toggle transcription / translation depending on which tab is selected
// pass in the transcript so it can be displayed or translated depending
// on the task as well as the cliplable and url for download above the tabs

function FileDisplay( { transcript, clipLabel, recordedUrl}) {

   const [tab, setTab] = useState('transcription')


    return (
        <div className = "flex flex-col items-center min-h-screen pt-16 px-8 font-[Gabarito]">
        <h1 className="mt-10 pb-7 text-6xl text-slate-600"><span className = "text-black">Your</span> Audio</h1>
      

        <h2 className = "text-lg">{clipLabel}</h2>
        <audio controls src = {recordedUrl}/>

        <div className = "pt-8">
        
            <div className = 'grid grid-cols-2 flex mx-auto bg-white border-2 border-solid border-slate-400 shadow rounded-full items-center overflow-hidden'> 
            <button onClick = {() => setTab('transcription')} className = {'px-4 py-1 duration-200 font-medium text-blue-400' + (tab === 'transcription' ? ' bg-slate-600  text-white': 'text-blue-400 hover:text-blue-600') }>Transcription</button>
            <button onClick = {() => setTab('translation')} className = {'px-4 py-1 duration-200 font-medium text-blue-400' + (tab === 'translation' ? ' bg-slate-600  text-white': 'text-blue-400 hover:text-blue-600') }>Translation</button>
            </div>
            
            {tab === "transcription" ?
                (<Transcription text = {transcript}/> ) :
                ( <Translation text = {transcript}/>)

            }
        </div>

        </div>
    );


}

export default FileDisplay;