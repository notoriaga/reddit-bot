const reddit = require('../reddit');
const lib = require('lib');

const KEYWORDS = ['marvin'];
const RESPONSES = [
  "Here I am, brain the size of a planet, and they tell me to respond to comments on Reddit. Call that job satisfaction? Cause I don't."
];
const SIGNATURE = `

^This ^bot ^was ^made ^with ^[StdLib](https://stdlib.com) ^^downvote ^^me ^^to ^^remove ^^this ^^comment`;

/**
* @acl
*   user__username steve allow 
* @param {string} subreddit
* @returns {any}
*/
module.exports = (subreddit = 'StdLibBots', context, callback) => {
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
              words: comment.body.toLowerCase().split(' ')
            };
          });

          let validComments = comments.filter(comment => {
            return comment.words.some(word => {
              return (
                KEYWORDS.includes(word) && !(comment.name in commentsRepliedTo)
              );
            });
          });

          let replyPromises = validComments.map(comment => {
            let response = RESPONSES.find((response, index) => {
              return comment.words.includes(KEYWORDS[index]);
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
