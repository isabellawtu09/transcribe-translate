
import React, {useState , useRef, useEffect, use} from 'react';
import Language from './components/Language.jsx'
import Progress from './components/Progress.jsx'


// has to take in the text that is passed into transcription function as a prop



export default function Translation({text}){



    const [ready, setReady] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [progressItems, setProgressItems] = useState([]);
    // input will be set to transcription text
    const [input,setInput] = useState(text);
    const [output, setOutput] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
    const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
    const [showTranslation, setShowTranslation] = useState(false);

    const worker = useRef(null);

    const downloadFile = () => {
    const file = new Blob([text], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "translation.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    };

    // as soon as the translation component is mounted the worker is setup
    useEffect(() => {
    if (!worker.current) {
      // create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./Translationworker.js', import.meta.url), {
        type: 'module'
      });
    }

    // create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          setOutput(e.data.output);
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const translate = () => {
    setDisabled(true);
    worker.current.postMessage({
      text,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  }

    return(
        <div className="font-[Gabarito]">
            <div className="flex items-center justify-center pt-5">
                <h1 className="text-3xl text-center mr-4">
                    Your <span className="text-slate-600">Translation</span>
                </h1>
                <button onClick = {downloadFile} className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white hover:bg-slate-900">
                    Export to TXT
                </button>
            </div>
            <Language type={"Source"} defaultLanguage={"eng_Latn"} onChange={x => setSourceLanguage(x.target.value)} />
            <Language type={"Target"} defaultLanguage={"fra_Latn"} onChange={x => setTargetLanguage(x.target.value)} />

            <div className="pl-1 pt-4">
          <button
            
            onClick={() => { setShowTranslation(true); translate(); }}
            className="rounded-md bg-slate-800 text-lg py-2 px-4 border border-transparent text-center text-sm text-white hover:bg-slate-900"
          >
          Translate
          </button>
          
        </div>
        <div className = "pt-4 text-lg">
            {showTranslation && (disabled ? <Progress /> : <p>{output}</p>)}
        </div>
        </div>
    );
}