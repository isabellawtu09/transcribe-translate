

import {pipeline, env} from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;

// class declaring the translation model
class MyTranslationPipeline {
    // task for model
    static task = 'translation';
    // the model being used
    static model = 'Xenova/nllb-200-distilled-600M';
    // no instance of the model yet
    static instance = null;


    // does an instance of the model already exist ?
    static async getInstance(progress_callback = null) {
        // no instance exists? then create one
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        // else return the existing instance ( singleton pattern) in order to
        // only have one single instance due to loading pipeline being an expensive operation
        return this.instance;
    }

}


// listen for messages from main thread
self.addEventListener('message' , async(event) => {
// retrieve the instance from the translation model
    let translator = await MyTranslationPipeline.getInstance( x => { self.postMessage(x) });

// translate from source to target lang
    let output = await translator(event.data.text , {
    tgt_lang: event.data.tgt_lang,
    src_lang: event.data.src_lang,

        callback_function: x => {
            self.postMessage({
                status : 'update',
                output: translator.tokenizer.decode(x[0].output_token_ids, {skip_special_tokens: true})
            });
        }


    });

    // translation is complete
    self.postMessage({
            status: 'complete',
            output: output,
        });


});

