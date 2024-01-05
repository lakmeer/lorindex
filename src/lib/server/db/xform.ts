
//
// Data Xforms
//

// Database row to Item

export function xformItemRowToItem (row:ItemRow):Item {
  return {
    id:       row.id,
    time:     row.last_update,
    type:     row.type,
    hash:     row.hash,
    desc:     row.desc,
    content:  row.content,
    distance: row.distance || 1
    //tags: row.tags,
  }
}
