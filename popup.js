document.getElementById("search").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startSearch();
  }
});

document.getElementById("searchButton").addEventListener("click", () => {
  startSearch();
});

function startSearch() {
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
        <p><strong>URL:</strong> <a href="${response.bookmarkUrl}" target="_blank" title="${response.folderPath}">
          ${response.bookmarkUrl}
        </a></p>
      `;
    } else {
      output.textContent = response.message;
    }
  });
}
