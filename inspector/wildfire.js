WebInspector.WildfirePanel = function() {
    WebInspector.Panel.call(this);
    
    this.viewsContainerElement = document.createElement("div");
    this.viewsContainerElement.id = "wildfire-views";
    this.element.appendChild(this.viewsContainerElement);
    
    this._view = new WebInspector.WildfireView(this.viewsContainerElement);
};

WebInspector.WildfirePanel.prototype = {
    toolbarItemClass: 'scripts',
    wildfireHeaders: [],
    
    get toolbarItemLabel() {
        return 'Wildfire';
    },
    
    show: function() {
        WebInspector.Panel.prototype.show.call(this);
        
        var resource = {};
        
        for (var i in WebInspector.resources) {
            if (WebInspector.resources[i]._type == 0) {
                resource = WebInspector.resources[i];
            }
        }
        var merges = [];
        var offset = -1;

        for (var header in resource._responseHeaders) {
            var wildfireRegex = /X-Wf(?:-(\d+)){4}/;
            var matches = wildfireRegex.exec(header);

            if (matches !== null && matches[1] !== null) {
                // Store for later use. The actual header name isn't really that important.
                segments = resource._responseHeaders[header].split('|');
                this.wildfireHeaders[matches[1] - 1] = segments[1];

                if (segments[2] == "\\") {
                    merges.push(matches[1] - 1);
                }
            }
        }
        merges.sort();

        for (var i = merges.length - 1; i >= 0; i--) {
            offset = merges[i] + 1;
            part = this.wildfireHeaders.splice(offset, 1);
            this.wildfireHeaders[offset - 1] += part;
        }

        for (var i = 0; i < this.wildfireHeaders.length; i++) {
            this.wildfireHeaders[i] = eval('(' + this.wildfireHeaders[i] + ')');
        }
        console.log(this.wildfireHeaders);

        if (this.wildfireHeaders.length !== 0)
            this._view.displayElements(this._view.parseData(this.wildfireHeaders));
        
    },
    
    // Not implemented yet.
    refresh: function()
    {
            this.refreshTitles();
            this._view.refresh();
    }
    
};

WebInspector.WildfirePanel.prototype.__proto__ = WebInspector.Panel.prototype;

WebInspector.WildfireView = function(viewContainerElement) {
    WebInspector.View.call(this);
    
    this.viewContainerElement = viewContainerElement;
};

WebInspector.WildfireView.prototype = {
    _createLog: function(message, level) {
        if (level === null || level === undefined) {
            level = 'info'
        }
        
        var container = document.createElement('div');
        container.className = 'console-message console-js-source console-'+ level + '-level';
        
        var messageStyleContainer = document.createElement('span');
        messageStyleContainer.className = 'console-message-text source-code';
        
        var messageContainer = document.createElement('span');
        messageContainer.innerHTML = message;
        
        container.appendChild(messageStyleContainer);
        messageStyleContainer.appendChild(messageContainer);
        
        return container;
        
        // <div class="console-message console-js-source console-log-level"><span class="console-message-text source-code"><span>hai</span></span></div>
    },
    
    _createInfo: function(message) {
        this._createLog(message, 'info');
    },
    
    _createWarn: function(message) {
        this._createLog(message, 'warning');
    },
    
    _createTrace: function() {
        
    },
    
    _createException: function() {
        
    },
    
    _createTable: function(data) {
        var table = document.createElement('table');
        table.className = 'data-grid';
        
        var tableHead = document.createElement('thead');
        var tableHeadRow = document.createElement('tr');
        var tableBody = document.createElement('tbody');
        
        for (var header in data['headings']) {
            if (typeof data['headings'][header] === 'string') {
                var heading = document.createElement('th');
                heading.innerHTML = data['headings'][header];
            }
            
            tableHeadRow.appendChild(heading);
        }
        
        for (var row in data['rows']) {
            var tableRow = document.createElement('tr');
            tableRow.className = 'revealed';
            
            for (var dataItem in data['rows'][row]) {
                if (typeof data['rows'][row][dataItem] === 'string') {
                    var tableDataItem = document.createElement('td');
                    tableDataItem.innerHTML = data['rows'][row][dataItem];
                
                    tableRow.appendChild(tableDataItem);
                }
            }
            
            tableBody.appendChild(tableRow);
        }
        
        table.appendChild(tableHead);
        tableHead.appendChild(tableHeadRow);
        table.appendChild(tableBody);
        
        return table;
    },
    
    _createGroup: function(name, contents) {
        var blockContainer = document.createElement('div');
        blockContainer.className = 'pane expanded';
        
        var blockHeader = document.createElement('div');
        blockHeader.className = 'title';
        blockHeader.innerHTML = name;
                
        blockContainer.appendChild(blockHeader);
        
        var contentsContainer = document.createElement('div');
        contentsContainer.className = 'body';
        
        if (typeof contents === 'object' && contents.constructor.name === 'Array') {
            // A mixed array of strings and html elements, yay!
            // a for (... in ...) style loop produces "odd" keys.
            for (var i = 0; i < contents.length; i++) {
                contentsContainer.appendChild(contents[i]);
            }
        } else if (typeof contents === 'string') {
            contentsContainer.innerHTML = contents;
        } else {
            // it has to be a HTML object, right? ...right?
            contentsContainer.appendChild(contents);
        }
        
        blockContainer.appendChild(contentsContainer);
        
        return blockContainer;
    },
    
    _createItem: function(name, contents) {
        var blockContainer = document.createElement('div');
        blockContainer.className = 'section expanded';
        
        var blockHeader = document.createElement('div');
        blockHeader.className = 'header';
        
        var title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = name;
                
        blockContainer.appendChild(blockHeader);
        blockHeader.appendChild(title);
        
        var contentsContainer = document.createElement('ol');
        contentsContainer.className = 'properties';
        
        if (typeof contents == 'array') {
            for (var item in contents) {
                var item = document.createElement('li');
            }
        } else if (typeof contents === 'string' || typeof contents === 'object') {
            var item = document.createElement('li');
            
            contentsContainer.appendChild(item);
            item.appendChild(contents)
        }
        
        if (typeof contents === 'object' && contents.constructor.name === 'Array') {
            // A mixed array of strings and html elements, yay!
            // a for (... in ...) style loop produces "odd" keys.
            for (var i = 0; i < contents.length; i++) {;
                var contentsItem = document.createElement('li');
                
                contentsContainer.appendChild(contentsItem);
                contentsItem.appendChild(contents[i]);
            }
        } else if (typeof contents === 'string') {
            var contentsItem = document.createElement('li');
            
            contentsContainer.appendChild(contentsItem);
            contentsItem.innerHTML = contents;
        } else {
            // it has to be a HTML object, right? ...right?
            var contentsItem = document.createElement('li');
            
            contentsContainer.appendChild(contentsItem);
            contentsItem.appendChild(contents);
        }
        
        blockContainer.appendChild(contentsContainer);
        
        return blockContainer;
    },
    
    parseData: function(headers, groupDepth) {
        var elements = [];
        
        if (groupDepth == undefined) {
            groupDepth = 0;
        }
        
        for (var item = 0; item < headers.length; item++) {
            console.log(item);
            
            var currentItem = headers[item];
            
            if (currentItem[0].Type === 'TABLE') {
                // We need to format the data to our needs
                tableData = { 'headings': [], 'rows': [] };
                
                for (var i = 0; i < currentItem[1][0].length; i++) {
                    tableData['headings'][i] = currentItem[1][0][i];
                }
                
                for (var i = 1; i < currentItem[1].length; i++) {
                    tableData['rows'][i - 1] = [];
                    
                    for (var j = 0; j < currentItem[1][i].length; j++) {
                        tableData['rows'][i - 1][j] = currentItem[1][i][j];
                    }
                }
                
                elements.push(this._createItem(currentItem[0].Label, this._createTable(tableData)));
            } else if (currentItem[0].Type === 'LOG' || currentItem[0].Type === 'INFO' || currentItem[0].Type === 'WARN' || currentItem[0].Type === 'ERROR') {
                elements.push(this._createLog(currentItem[1]));
            } else if (currentItem[0].Type === 'GROUP_START') {
                groupDepth++; 
                
                // var foo = document.createElement('h1');
                // foo.innerHTML = 'foo';
                // elements.push(this._createGroup(currentItem[0].Label, foo)); 
                
                var groupData = [];
                
                for (var count = item + 1; count < headers.length; count++) {
                    if (groupDepth === 0) {
                        item = count;
                        break;
                    }
                    
                    if (headers[count][0].Type === 'GROUP_START') {
                        groupDepth++;
                    } else if (headers[count][0].Type === 'GROUP_END') {
                        groupDepth--;
                    }
                    
                    groupData.push(headers[count]);
                }
                
                var parsedElements = this.parseData(groupData, groupDepth);
                
                // for (var element = 0; element < parsedElements.length; element++) {
                    // console.log(parsedElements[element]);
                    elements.push(this._createGroup(currentItem[0].Label, parsedElements)); 
                // }
            }
        }
        
        return elements;
    },
    
    displayElements: function(elements) {
        for (var i = 0; i < elements.length; i++) {
            this.viewContainerElement.appendChild(elements[i]);
        }
    }
};