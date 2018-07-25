# orbithelper

> Vue SPA concept for collaborative MV analysis on Youtube

![Demo GIF](https://thumbs.gfycat.com/EntireUnrealisticAfricanpiedkingfisher-size_restricted.gif)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Bring your own Backend

```
<orbit-helper
  :video-id="'youtubeVideoId'"
  :player-vars="{rel: 0}"
  :comments="[comment1, comment2, comment3, ...]"
  :commentNextPageBuffer="5" /* send commentFetchNext event when there are exactly 5 local comments left to be seen */
  :totalCommentCount="233" /* How many comments are there in total for this video? */

  @commentDelete="(videoId, commentText) => {}" /* Comment deleted. Send DELETE to your server, etc. */
  @commentEdit="(commentId) => {}" /* Comment edited by author. Send PATCH to your server, etc. */
  @commentFetchNext="(videoId, lastPageId) => {}" /* Fetch next X comments for videoId after comment with ID lastPageId */
  @commentPost="(commentId, commentTime, commentText) => {}" /* Comment deleted by author. Send POST to your server, etc. */
/>
```

You can check the expected format of the `comments` array in `src/demo/constants.js`.