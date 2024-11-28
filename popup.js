document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("search").value;

  if (!query) {
    alert("Please enter a bookmark title or URL.");
    return;
  }

  chrome.runtime.sendMessage({ type: "FIND_BOOKMARK_FOLDER", query }, (response) => {
    const output = document.getElementById("output");
    if (response.success) {
      output.innerHTML = `
        <p><strong>Bookmark Title:</strong> ${response.bookmarkTitle}</p>
        <p><strong>Folder Path:</strong> ${response.folderPath}</p>
        <p><strong>URL:</strong> <a href="${response.bookmarkUrl}" target="_blank">${response.bookmarkUrl}</a></p>
      `;
    } else {
      output.textContent = response.message;
    }
  });
});
