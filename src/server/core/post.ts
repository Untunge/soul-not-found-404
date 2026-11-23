import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'Error 404: Soul Not Found — sort today’s souls (daily game)',
  });
};
