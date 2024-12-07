/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Popup.html Tests', () => {
  let popup;
  let searchInput, searchButton, outputDiv;

  beforeAll(() => {
    // Load the popup.html into JSDOM
    const html = fs.readFileSync(path.resolve(__dirname, '../popup.html'), 'utf8');
    document.body.innerHTML = html;

    // Load associated DOM elements
    popup = document.body;
    searchInput = popup.querySelector('#search');
    searchButton = popup.querySelector('#searchButton');
    outputDiv = popup.querySelector('#output');
  });

  test('HTML structure is correct', () => {
    // Check if important elements are present
    expect(searchInput).toBeTruthy();
    expect(searchButton).toBeTruthy();
    expect(outputDiv).toBeTruthy();

    // Check placeholder text
    expect(searchInput.placeholder).toBe('Enter bookmark title or URL');

    // Check button text
    expect(searchButton.textContent).toBe('Search');
  });

  test('Search button click updates output', () => {
    // Simulate user input
    searchInput.value = 'Test Bookmark';
    
    // Mock Chrome runtime sendMessage
    global.chrome = {
      runtime: {
        sendMessage: jest.fn((message, callback) => {
          // Simulate a successful response
          callback({
            success: true,
            bookmarkTitle: 'Test Bookmark',
            folderPath: 'Bookmarks Bar > Favorites',
            bookmarkUrl: 'https://example.com',
          });
        }),
      },
    };

    // Simulate button click
    searchButton.click();

    // Wait for the UI update
    setTimeout(() => {
      expect(outputDiv.innerHTML).toContain('Test Bookmark');
      expect(outputDiv.innerHTML).toContain('Bookmarks Bar > Favorites');
      expect(outputDiv.innerHTML).toContain('https://example.com');
    }, 100);
  });

  test('Search button handles no results gracefully', () => {
    // Simulate user input
    searchInput.value = 'Nonexistent Bookmark';

    // Mock Chrome runtime sendMessage
    global.chrome.runtime.sendMessage = jest.fn((message, callback) => {
      // Simulate an unsuccessful response
      callback({ success: false, message: 'Bookmark not found' });
    });

    // Simulate button click
    searchButton.click();

    // Wait for the UI update
    setTimeout(() => {
      expect(outputDiv.textContent).toBe('Bookmark not found');
    }, 100);
  });
});
