


export default function Transcription( {text}){


 const downloadFile = () => {
    const file = new Blob([text], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "transcription.txt";
    link.click();
    URL.revokeObjectURL(link.href);
};



    return(
       <div className="font-[Gabarito]">
            <div className="flex items-center justify-center pt-5">
                <h1 className="text-3xl text-center mr-4">
                    Your <span className="text-slate-600">Transcription</span>
                </h1>
                <button onClick = {downloadFile}className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white hover:bg-slate-900">
                    Export to TXT
                </button>
            </div>
            <p className = "pt-3 text-lg">{text}</p>
        </div>
    );
}