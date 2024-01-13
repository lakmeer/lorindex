
# TODOs

## Features

🔴 Image Items
  🔴 Add image items
  🔴 Semantic analysis of images
  🔴 Embed generated anaylsis in OpenAI embedding space

🔴 Usage stats
  🔴 Track in/out tokens when using AI endpoints
  🔴 Associate

🟡 Tags
  🟢 Add tags
  🟢 AI Auto-tagging
  🔴 Use tags somehow to improve recall accuracy
  🔴 Tags editing
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

🔴 Index generator
  🔴 Automatically show content page when topic is empty string
  🔴 Use the content table to identify and hyperlink words in displayed items


## Improvements

🔴 Attempting to save an item with zero content should delete it
🔴 Better layout strategy than using absolute on item panels
🔴 Move topic and other state to svelte store/context?
🟢 Hook up similarity controls
🟢 Automatically create description text
🟢 Update 001 migration
  🟢 Use hash as primary key
  🟢 Detect collisions
🔴 Better reveal animations
  🔴 Dynamically change shown items as threshold slider is moved; submit new topic
     request only when slider is released
🟢 Cache summaries
🟢 Move embedding cache to db
  🟢 Protect test db using in-memory clone
🔴 Cancel inflight requests when topic changes
🟢 Use `vss_distance_l2` for `db/distance`


## Eloryn

🟢 Port longbridge data
🔴 Return to lorum terminology?


## Reference

- Image analysis
  - https://github.com/vikhyat/moondream
  - https://platform.openai.com/docs/guides/vision

