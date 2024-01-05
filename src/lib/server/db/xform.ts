
//
// Data Xforms
//

// Database row to Item

export function xformItemRowToItem (row:ItemRow, distance = 1):Item {
  return {
    id:       row .id,
    time:     row .last_update,
    type:     row .type,
    hash:     row .hash,
    desc:     row .desc,
    content:  row .content,
    distance: distance
    //tags: row.tags,
  }
}
