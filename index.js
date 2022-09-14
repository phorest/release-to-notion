const core = require('@actions/core');
const github = require('@actions/github');
const { Client } = require('@notionhq/client');
const { markdownToBlocks } = require('@tryfabric/martian');

(async () => {
  try {
    const token = core.getInput('token', { required: true });
    const databaseId = core.getInput('database-id', { required: true });

    const notion = new Client({ auth: token });

    const context = github.context;
    console.log('GitHub context', JSON.stringify(context, null, 2));

    const {
      name: releaseName,
      body: releaseNotes,
      tag_name: releaseVersion,
      created_at: releaseDate,
    } = github.context.payload.release;

    const releaseNotesBlocks = markdownToBlocks(releaseNotes);

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              type: 'text',
              text: {
                content: releaseName,
              },
            },
          ],
        },
        Version: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: releaseVersion,
              },
            },
          ],
        },
        Date: {
          type: 'date',
          date: {
            start: releaseDate.split('T')[0],
          },
        },
      },
      children: releaseNotesBlocks,
    });

    console.log('Notion response', response);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
