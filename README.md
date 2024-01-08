
# Lorindex

A structureless wiki.

Content is viewed and edited by typing a topic as the title of the document.
Relevant items are collected for the body of the document and are editable
in-place.

## Todo

This is in prototype phase, but future features could include:

- Image items and other multimedia
- Links to relevant topics as an item type
- Tags, and automatic tagging
- Automatic topic discovery
- Table-of-contents generation
- Chat interface in addition to document interface

## Notes

- Will create and configure a local sqlite db on first launch
- Using `vss-sqlite` with `better-sqlite3`
- Requires your `OPENAI_API_KEY` in `.env`
- Embeddings are memoized

