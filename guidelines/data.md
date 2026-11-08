## Data rules

- The data files are the source of truth; the application only consumes them.
- Prefer official sources. Cite the URL of every relevant piece of information.
- Never invent data. When a field is not found, use `null` or an empty list and
  record the gap next to the source.
- Validate the data before committing, using the declared check command.
- Keep identifiers stable and unique, and keep file names consistent with the
  identifiers they contain.
- Record the last update date in the file that carries the data.
