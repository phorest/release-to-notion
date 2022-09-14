const core = require('@actions/core');
const github = require('@actions/github');
const { Client } = require('@notionhq/client');
const { markdownToBlocks } = require('@tryfabric/martian');

(async () => {
  try {
    const token = core.getInput('token', { required: true });
    const databaseId = core.getInput('database-id', { required: true });

    const nameFieldId = core.getInput('name-id', { required: true });
    const versionFieldId = core.getInput('version-id', { required: true });
    const dateFieldId = core.getInput('date-id', { required: true });
    const baseDownloadUrl = core.getInput('base-download-url');
    const macFieldId = core.getInput('mac-download-id');
    const winFieldId = core.getInput('win-download-id');
    let macFilePath = core.getInput('mac-file-path');
    let winFilePath = core.getInput('win-file-path');

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

    const pageProperties = {
      [nameFieldId]: {
        title: [
          {
            type: 'text',
            text: {
              content: releaseName,
            },
          },
        ],
      },
      [versionFieldId]: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: releaseVersion,
            },
          },
        ],
      },
      [dateFieldId]: {
        type: 'date',
        date: {
          start: releaseDate.split('T')[0],
        },
      },
    };

    if (baseDownloadUrl) {
      const appVersion = releaseVersion.replace(/^v/, '');
      if (macFieldId && macFilePath) {
        macFilePath = macFilePath.replaceAll('{{version}}', appVersion);
        pageProperties[macFieldId] = {
          url: `${baseDownloadUrl}/${macFilePath}`,
        };
      }
      if (winFieldId && winFilePath) {
        winFilePath = winFilePath.replaceAll('{{version}}', appVersion);
        pageProperties[winFieldId] = {
          url: `${baseDownloadUrl}/${winFilePath}`,
        };
      }
    }

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: pageProperties,
      children: releaseNotesBlocks,
    });

    console.log('Notion response', response);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
