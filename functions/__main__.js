const reddit = require('../reddit');
const lib = require('lib');

const KEYWORDS = ['hey marvin']; //
const RESPONSES = [
  "Here I am, brain the size of a planet, and they tell me to respond to comments on Reddit. Call that job satisfaction? Cause I don't."
]; // response for the keyword with the same index
const SIGNATURE = `

^This ^bot ^was ^made ^with ^[StdLib](https://stdlib.com) ^^downvote ^^me ^^to ^^remove ^^this ^^comment`; // attached to the end of every comment

/**
* Reads newest comments from subreddit and responds if a keywork is found  
* @param {string} subreddit
* @returns {any}
*/
module.exports = (subreddit = 'StdLibBots', context, callback) => {
  if (
    context.service.environment !== 'local' &&
    context.user.username !== context.service.path[0]
  ) {
    return callback(new Error('You are not allowed to access this service'));
  }

  lib.utils.storage
    .get('commentsRepliedTo')
    .then(comments => {
      return comments || {};
    })
    .then(commentsRepliedTo => {
      reddit
        .getSubreddit(subreddit)
        .getNewComments()
        .then(listing => {
          let comments = listing.map(comment => {
            return {
              name: comment.name,
              body: comment.body.toLowerCase()
            };
          });

          let validComments = comments.filter(comment => {
            return KEYWORDS.some(keyword => {
              let keywordRegex = '\\b' + keyword.replace(' ', '\\b \\b') + '\\b';
              return (
                comment.body.match(keywordRegex) && !(comment.name in commentsRepliedTo)
              );
            });
          });

          let replyPromises = validComments.map(comment => {
            let response = RESPONSES.find((response, index) => {
              return comment.body.includes(KEYWORDS[index]);
            });

            return lib[`${context.service.identifier}.reply`](
              comment.name,
              response + SIGNATURE
            ).then(result => {
              return result;
            });
          });

          return Promise.all(replyPromises).then(results => {
            results.map(result => {
              commentsRepliedTo[result.parent_id] = true;
            });
            lib.utils.storage
              .set('commentsRepliedTo', commentsRepliedTo)
              .then(_results => {
                return callback(null, results);
              });
          });
        })
        .catch(error => {
          return callback(error);
        });
    });
};
