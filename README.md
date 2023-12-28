# Obsidian-WebClip-CuriusHighlights
This is a bookmarklet that clips websites and includes curius highlights. Based on Steph Ango's OG one.
Step 1. Configure On Obsidian: 
-Set your Vault, Folder, Path, etc. Anything specific to your workflow

Step 2. Encode: Once Configured Use a URL encoder to encode the inside of the url do not encode the javascript function part or outside brackets (javascript:(function() { })();)

Step 3a. To Use on Chrome: 
- Save the the encoded javascript function as a bookmark and click when you want to save an article to Obsidian

Step 3b. To use on Arc: 
- Download powerlet on the chrome extension store and add your bookmarklet to it. Arc doesn't use bookmarks in the same way as chrome.

Optional Styling: This uses default highlight syntax for curius highlights "=={text}==". I prefer a different color than the default yellow ans I found it easier to change the color of the default higlighter than to integrate the highlightr plugin or css tags. Save the highlighter css files to your obsidian css snippets. Appearance -> CSS Snippets. The file may be invisible since it is a .obsidian file. Use cmd+shift+. on mac to toggle on its visibility.

Small Bug: I make an array of strings of distinct curius highlights and iterate through the blog post to find matches. If you highlight are it will highlight every instance of this. I find this more charming than an issue. If you read this and don't like this feel free to make a branch

Bug 1: Some html formatting/nesting leads to highlights not being highlighted in fringe cases