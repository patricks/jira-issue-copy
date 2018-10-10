function copyToClipboard(message) {
    var textarea = document.createElement('textarea');
    textarea.textContent = message;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

function appendIcon(node, modifyFun, image) {
    var img = document.createElement('span');
    img.className = 'aui-icon aui-icon-small'
    img.style.backgroundImage = 'url(' + safari.extension.baseURI + image + ')';
    img.style.backgroundSize = 'contain';
    node.appendChild(img);

    node.addEventListener('click', function (event) {
        var message = '';

        var issueElement = document.getElementById('key-val') || document.getElementById('issuekey-val');
        if (issueElement) {
            var key = issueElement.innerText;
            var summary = document.getElementById('summary-val').innerText.trim();

            if (modifyFun) {
                message = modifyFun(key, summary);
            } else {
                message = key + '-' + summary;
            }
        }

        var issueRow = document.getElementsByClassName('issuerow focused')[0];
        if (issueRow) {
            var key = issueRow.getElementsByClassName('issuekey')[0].getElementsByTagName('a')[0].innerText;
            var summary = issueRow.getElementsByClassName('summary')[0].getElementsByTagName('a')[0].innerText;

            if (modifyFun) {
                message = modifyFun(key, summary);
            } else {
                message = key + '-' + summary;
            }
        }

        if (message) {
            if (document.queryCommandSupported('copy')) {
                copyToClipboard(message);
            } else {
                alert(message);
            }
        }

        event.preventDefault();
        return false;
    });
}

function appendTextButton(node) {
    appendIcon(node, (key, message) => key + ' ' + message, 'ic_assignment_black_24px.svg');
}

function appendBranchButton(node) {
    appendIcon(node, (key, message) => {
        return key + '-' + message.substring(0, 30)
            .replace('ä', 'ae')
            .replace('ö', 'oe')
            .replace('ü', 'ue')
            .replace('ß', 'sz')
            .replace('&', 'and')
            .replace(/[^\w-]/g, '_');
    }, 'ic_call_split_black_24px.svg');
}

function setIcons() {
    var elems = document.getElementsByClassName('jira-copy-comments');
    for (var i = elems.length - 1; i >= 0; i--) {
        elems[i].remove();
    };

    var boardTools = document.getElementById('ghx-modes-tools');
    if (boardTools) {
        var button = document.createElement('button');
        button.className = 'aui-button ghx-actions-tools jira-copy-comments';
        appendBranchButton(button);
        boardTools.insertBefore(button, boardTools.children[0]);

        var button = document.createElement('button');
        button.className = 'aui-button ghx-actions-tools jira-copy-comments';
        appendTextButton(button);
        boardTools.insertBefore(button, boardTools.children[0]);
    }

    var issueContent = document.getElementById('issue-content');
    var detailTools = (issueContent && issueContent.getElementsByClassName('toolbar-split-right')[0]);
    if (detailTools) {
        var list = document.createElement('ul')
        list.className = 'toolbar-group pluggable-ops jira-copy-comments'
        var item = document.createElement('li');
        item.className = 'toolbar-item';
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'toolbar-trigger';
        appendBranchButton(a);
        item.appendChild(a);
        list.appendChild(item);
        detailTools.insertBefore(list, detailTools.children[0]);

        var group = document.createElement('ul')
        group.className = 'toolbar-group pluggable-ops jira-copy-comments'
        var button = document.createElement('li');
        button.className = 'toolbar-item';
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'toolbar-trigger';
        appendTextButton(a);
        button.appendChild(a);
        group.appendChild(button);
        detailTools.insertBefore(group, detailTools.children[0]);
    }

    var content = document.getElementById('content');
    var listTools = (content && content.getElementsByClassName('operations')[0]);
    if (listTools) {
        var item = document.createElement('li');
        item.className = 'pluggable-ops  no-hover-focus-mark jira-copy-comments';
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'aui-button';
        appendBranchButton(a);
        item.appendChild(a);
        listTools.insertBefore(item, listTools.children[0]);

        var item = document.createElement('li');
        item.className = 'pluggable-ops  no-hover-focus-mark jira-copy-comments';
        var a = document.createElement('a');
        a.href = '#';
        a.className = 'aui-button';
        appendTextButton(a);
        item.appendChild(a);
        listTools.insertBefore(item, listTools.children[0]);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    setIcons();
});
