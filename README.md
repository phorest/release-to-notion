# release-to-notion

GitHub Action that publishes release information in a Notion database.

## Usage

Configure this action in your workflows providing the inputs described below.

### Inputs

`token`
: **Required** Notion integration token. Needs access to the database (see below).

`database-id`
: ID of the Notion database that the information should be published to. (**Required**)

`name-id`
: ID of the name column. (**required**)

`version-id`
: ID of the name column. (**required**)

`date-id`
: ID of the name column. (**required**)

`mac-download-id`
: ID of the macOS download URL column (_optional_)

`win-download-id`
: ID of the Windows download URL column (_optional_)

`base-download-url`
: Download URL that the filepaths will be prefixed with. (_optional_)

`mac-file-path`
: Filename of the macOS package. `{{version}}` will be replaced with the app's version (_optional_)

`win-file-path`
: Filename of the Windows package. `{{version}}` will be replaced with the app's version (_optional_)
