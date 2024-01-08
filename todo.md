
# TODOs

## Features

🔴 Image Items
  🔴 Add image items

🔴 Usage stats
  🔴 Track in/out tokens when using AI endpoints
  🔴 Associate

🔴 Tags
  🔴 Auto-tagging
  🔴 Use tags somehow to improve recall accuracy
  🔴 Tags editing

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
