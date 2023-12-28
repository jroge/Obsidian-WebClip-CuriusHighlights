javascript:(function() {
    Promise.all([
        import('https://unpkg.com/turndown@6.0.0?module'),
        import('https://unpkg.com/@tehshrike/readability@0.2.0'),
    ]).then(async ([{
        default: Turndown
    }, {
        default: Readability
    }]) => { 

        const vault = "";
        const folder = "Clippings/";
        let tags = "clippings";

        if (document.querySelector('meta[name="keywords" i]')) {
            var keywords = document.querySelector('meta[name="keywords" i]').getAttribute('content').split(',');

            keywords.forEach(function(keyword) {
                let tag = ' ' + keyword.split(' ').join('');
                tags += tag;
            });
        }

        function getSelectionHtml() {
            var html = "";
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }
            return html;
        }
        
        function getHighlightedText() {
            const highlights = document.querySelectorAll('.curius-highlight.curius-own-highlight');
            let highlightedTexts = [];
            highlights.forEach((highlight) => {
                const text = highlight.textContent.trim();
                console.log("Highlight Found:", text);
                highlightedTexts.push(`${text}`);
            });
            return highlightedTexts;
        }

        const selection = getSelectionHtml();
        const curiusHighlights = getHighlightedText();
        const {
            title,
            byline,
            content
        } = new Readability(document.cloneNode(true)).parse();

        function getFileName(fileName) {
            var userAgent = window.navigator.userAgent,
                platform = window.navigator.platform,
                windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        
            fileName = fileName.replace(/:/g, '').replace(/[/\\?%*|"<>]/g, '-');
        
            if (windowsPlatforms.indexOf(platform) !== -1) {
                fileName = fileName.replace(/\//g, '-').replace(/\\/g, '-');
            }
        
            return fileName;
        }
        const fileName = getFileName(title);

        var markdownify = selection ? selection : content;
        
        var parser = new DOMParser();
        markdownify = parser.parseFromString(markdownify, 'text/html');

        function highlightText(node, text) {
            var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
            var textNode;
            while (textNode = walker.nextNode()) {
                var value = textNode.nodeValue;
                if (value.includes(text)) {
                    var highlightedText = value.replace(text, `==${text}==`);
                    textNode.nodeValue = highlightedText;
                }
            }
        }

        curiusHighlights.forEach((text) => {
            highlightText(markdownify.body, text);
        });
        
        markdownify = markdownify.body.innerHTML;

        markdownify = markdownify.replace(/[%"?]/g, '');

        var vaultName = vault ? '&vault=' + encodeURIComponent(`${vault}`) : '';

        markdownify = markdownify.replace(/\\/g, '');

        const markdownBody = new Turndown({
            headingStyle: 'atx',
            hr: '---',
            bulletListMarker: '-',
            codeBlockStyle: 'fenced',
            emDelimiter: '*',
        }).turndown(markdownify);

        // console.log("one", markdownify);

       
        cleanedBody = markdownify.replace(/<\/?[^>]+(>|$)/g, "");
        // console.log("two", cleanedBody);

         slashlessBody = cleanedBody.replace(/\\/g, '');

        var date = new Date();

        function convertDate(date) {
            var yyyy = date.getFullYear().toString();
            var mm = (date.getMonth() + 1).toString();
            var dd = date.getDate().toString();
            var mmChars = mm.split('');
            var ddChars = dd.split('');
            return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
        }

        const today = convertDate(date);

        function getMetaContent(attr, value) {
            var element = document.querySelector(`meta[${attr}='${value}']`);
            return element ? element.getAttribute("content").trim() : "";
        }

        var author = byline || getMetaContent("name", "author") || getMetaContent("property", "author") || getMetaContent("property", "og:site_name");
        var authorBrackets = author ? `"[[${author}]]"` : "";

        var timeElement = document.querySelector("time");
        var publishedDate = timeElement ? timeElement.getAttribute("datetime") : "";
        var published = '';

        if (publishedDate && publishedDate.trim() !== "") {
            var date = new Date(publishedDate);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;

            published = year + '-' + month + '-' + day;
        }

        const fileContent = 
            '---\n' +
            'category: "[[Clippings]]"\n' +
            'author: ' + authorBrackets + '\n' +
            'title: "' + title + '"\n' +
            'source: ' + document.URL + '\n' +
            'clipped: ' + today + '\n' +
            'published: ' + published + '\n' +
            'topics: \n' +
            'tags: [' + tags + ']\n' +
            '---\n\n' +
            slashlessBody;

        document.location.href = "obsidian://new?"
            + "file=" + encodeURIComponent(folder + fileName)
            + "&content=" + encodeURIComponent(fileContent)
            + vaultName;

    }).catch(error => {
        console.error('Error loading modules:', error);
    });
})();
