
# TODOs

## Features

🟡 Image Items
  🟢 Add image items
  🔴 Semantic analysis of images
    🔴 Find a good image analysis model
      🔴 Huggingface API?
    🔴 Store descriptions in the 'content' field not used by text
    🔴 Update embedding call to include content field
    🟢 Embed generated anaylsis in OpenAI embedding space
  🔴 Seems to be ok with mimetime-agnostic b64 encoding (data:,base64;...) but
     might need some kind of metadata field for this kind of thing

🔴 Usage stats
  🔴 Track in/out tokens when using AI endpoints
  🔴 Associate per-token prices with relevant APIs

🟡 Tags
  🟢 Add tags
  🟢 AI Auto-tagging
  🔴 Use tags somehow to improve recall accuracy
  🔴 Manual tag editing
  🔴 Housework: identify and remove unused tags

🔴 Portability
  🔴 Create DB table for library metadata features, such as
    🔴 title, authors, blurb,
    🔴 Settings
    🔴 Custom styles
    🔴 ???

🔴 Settings panel
  🔴 Add toggle-able setting panel
  🔴 Auto-hide on smaller screens
  🔴 Collect constants into one file
    🔴 Make configurable
  🔴 Assign unique ID to browser seesion
  🔴 Inject OpenAI key via settings panel
  🔴 Keep settings in localStorage

🟡 Index generator
  🟢 Automatically show content page when topic is empty string
  🟢 Use the content table to identify and hyperlink words in displayed items
  🟢 Topic discovery
    🟢 LLM version
    🔴 HBDSCAN version

🔴 Assistant mode
  🔴 Command prefixes
    🔴 !image
      🔴 Should pop a drop target or upload box (on enter)
    🔴 !file <description>
      🔴 Should pop a drop target or upload box (on enter)
      🔴 Remind the user a description is required if one wasn't provided on prev line
    🔴 ? Ask the assistant a question
    🔴 Function-calling?


## Improvements

🔴 Unify url scheme
  - /                   Topic index
  - /<topic>            Show topic results
  - /#tags              Any items with matching tags
  - /<topic>#tags       Filter topic items by tags
  - /<topic>!type       Filter topic items by type
  - /?question          Results of an assistant question
  - /<topic>?question   Topic items, plus results of question           

🔴 DB transations for simultaneous requests
🔴 Attempting to save an item with zero content should delete it
🔴 Generic file uploads
  🔴 Should provide a description box since a model can't detect it
🔴 Better layout strategy than using absolute on item panels
🔴 Move topic and other state to svelte store/context?
🟢 Hook up similarity controls
🟢 Automatically create description text
🟢 Update 001 migration
  🟢 Use hash as primary key
  🟢 Detect collisions
🔴 Better reveal animations
🔴 Dynamically change items from currently loaded set as threshold slider is moved
  🔴 Submit new topic request only when slider is released
🟡 Cache summaries
  🟢 Move embedding cache to db
  🟢 Protect test db using in-memory clone
  🔴 Generalise `summary_cache` to `llm_cache` and store other completions
🔴 Cancel inflight requests when topic changes
🟢 Use `vss_distance_l2` for `db/distance`
🔴 Move env values to localStorage
🔴 Experiment:
  1. Split item text into sentences
  2. Embed sentances directly
  3. Embed whole text
  4. Find average position of sentance embedding vectors
  5. Compare distance to whole-text embedding
🔴 Assistant
  - Ability to ask the assistant a question about the content with `?`
    - Assistant will be fed current document view for context
    - Asking the assistant a question inline in the document produces an assistant-type
      block, which is not an item and won't be persisted
    - Assistant blocks should be visually distinct
  - Functions available to the assistant
    - Inject other blocks into the view
      - Make the UI not remove injected blocks when the search settings change
      - Injected blocks will be forgotten when topic changes
        - Or not??
    - Retag stuff
    - Delete stuff
    - Check for contradictions with other items


## Assistant examples


## Eloryn

🟢 Port longbridge data


## Reference

- Image analysis
  - https://github.com/vikhyat/moondream
  - https://platform.openai.com/docs/guides/vision
- Good local instruction-taking performance
  - Mistral Instruct 0.2

