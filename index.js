const core = require('@actions/core');
const github = require('@actions/github');

try {
  const token = core.getInput('token', { required: true });
  const databaseId = core.getInput('database-id', { required: true });

  console.log('Token', token);
  console.log('Database ID', databaseId);

  const context = github.context;

  console.log('GitHub context', JSON.stringify(context, null, 2));
} catch (error) {
  core.setFailed(error.message);
}
