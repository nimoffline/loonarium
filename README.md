# loonarium

> Vue SPA concept for collaborative MV analysis on Youtube, demo site designed for the group LOOΠΔ.

![Demo GIF](https://thumbs.gfycat.com/LastMajorIcefish-size_restricted.gif)

## Build Setup

``` bash
# install dependencies
npm install  # or yarn

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Bring your own Backend

```
<video-comment-player
  :video-id="'youtubeVideoId'"
  :player-vars="{rel: 0}"
  :comments="[comment1, comment2, comment3, ...]"
  :commentNextPageBuffer="5" /* send commentFetchNext event when there are exactly 5 local comments left to be seen */   
  :currentUserId="currentUserId" /* ID of authenticated user, for editing/deleting own comments */
  :totalCommentCount="233" /* How many comments are there in total for this video? */

  @commentDelete="(commentId) => {}" /* Comment deleted. Send DELETE to your server, etc. */
  @commentEdit="({ comment, onSuccess }) => {}" /* Comment edited by author. Send PATCH to your server, etc. */
  @commentFetchNext="() => {}" /* Fetch next X comments for videoId after comment with ID lastPageId */
  @commentPost="({ time, text, clearTextAreaFn }) => {}" /* Comment created. Send POST to your server, etc. */
/>
```

You can review the expected format of request data in `src/demo/constants.js`.
