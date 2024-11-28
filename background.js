// Helper function to get the full path of a bookmark
function getBookmarkPath(nodeId, callback, path = []) {
  chrome.bookmarks.get(nodeId, (nodes) => {
    if (nodes.length > 0) {
      const node = nodes[0];
      path.unshift(node.title || "Bookmarks Bar"); // Add current folder to the path

      if (node.parentId) {
        // If the node has a parent, continue up the tree
        getBookmarkPath(node.parentId, callback, path);
      } else {
        // We've reached the root, return the full path
        callback(path.join(" > "));
      }
    }
  });
}

// Listen for search requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FIND_BOOKMARK_FOLDER") {
    const searchQuery = message.query;

    chrome.bookmarks.search(searchQuery, (results) => {
      if (results.length > 0) {
        const bookmark = results[0]; // Assuming the first match is the target
        getBookmarkPath(bookmark.parentId, (fullPath) => {
          sendResponse({
            success: true,
            folderPath: fullPath,
            bookmarkTitle: bookmark.title,
            bookmarkUrl: bookmark.url,
          });
        });
      } else {
        sendResponse({ success: false, message: "Bookmark not found" });
      }
    });

    // Return true to indicate async response
    return true;
  }
});
