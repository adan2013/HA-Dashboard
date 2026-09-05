const userAgent = process.env.npm_config_user_agent || '';

if (!userAgent.startsWith('yarn/')) {
  console.error('This repository uses Yarn. Run `yarn install` instead.');
  process.exit(1);
}
