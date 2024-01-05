

# Notes

select items.*, vss_items.embedding from items
join vss_items on items.rowid = vss_items.rowid
