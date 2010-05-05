WebInspector.WildfirePanel = function() {
  WebInspector.Panel.call(this);
  
  this.viewsContainerElement = document.createElement("div");
  this.viewsContainerElement.id = "wildfire-views";
  this.element.appendChild(this.viewsContainerElement);
  
  this._view = new WebInspector.WildfireView(this.viewsContainerElement);
};

// WebInspector.WildfirePanel.prototype = {
//   toolbarItemClass: "scripts",
//   wildfireHeaders: {},
//   
//   get toolbarItemLabel() {
//     return 'Wildfire';
//   },
//   
//   show: function() {
//     WebInspector.Panel.prototype.show.call(this);
//     
//     var resource = {};
//     
//     for (i in WebInspector.resources) {
//       if (WebInspector.resources[i]._type == 0) {
//         resource = WebInspector.resources[i];
//       }
//     } 
//     
//     for (header in resource._responseHeaders) {
//       var wildfireRegex = /X-Wf(-([0-9]+)){4}/;
//       var matches = wildfireRegex.exec(header);
//       
//       if (matches !== null && matches[2] !== null) {
//         // Store for later use. The actual header name isn't really that important.
//         // Whilst we're at it, hydrate the header to a JSON object.
//         this.wildfireHeaders[matches[2] - 1] = eval('(' + resource._responseHeaders[header].split('|')[1] + ')');
//       }
//     }
//     
//     if (this.wildfireHeaders.length !== 0) {
//       this._displayData(this.wildfireHeaders);
//     }
//   },
//   
//   hide: function() {
//     WebInspector.Panel.prototype.hide.call(this);
//   },
//   
//   _displayData: function(data) {
//     var parsedData = {};
//     
//     for (i in data) {
//       if (data[i][0].Type == 'TABLE') {
//         var table = document.createElement('table');
//         
//         var caption = document.createElement('caption');
//         caption.innerHTML = data[i][0].Label;
//         
//         table.appendChild(caption);
//         
//         var thead = document.createElement('thead');
//         var tr = document.createElement('tr');
//         
//         for (j in data[i][1][0]) {
//           if (typeof data[i][1][0][j] != 'function') {
//             var th = document.createElement('th');
//             th.innerHTML = data[i][1][0][j];
//             tr.appendChild(th);
//           }
//         }
//         
//         thead.appendChild(tr);
//         
//         var tbody = document.createElement('tbody');
//         
//         for (j = 1; j < data[i][1].length; j++) {
//           var foo = document.createElement('tr');
//           
//           for (k in data[i][1][j]) {
//              if (typeof data[i][1][j][k] != 'function') {
//                var td = document.createElement('td');
//                td.innerHTML = data[i][1][j][k];
//                foo.appendChild(td);
//              }
//            }
//           
//           tbody.appendChild(foo);
//         }
//         
//         table.appendChild(thead);
//         table.appendChild(tbody);
//         
//         
//         this.contentElement.appendChild(table);
//       }
//     }
//     
//     return parsedData;
//   },
// };

WebInspector.WildfirePanel.prototype = {
  toolbarItemClass: 'scripts',
  wildfireHeaders: [],
  
  get toolbarItemLabel() {
    return 'Wildfire';
  },
  
  show: function() {
    WebInspector.Panel.prototype.show.call(this);
    
    var resource = {};
    
    for (i in WebInspector.resources) {
      if (WebInspector.resources[i]._type == 0) {
        resource = WebInspector.resources[i];
      }
    } 
    
    for (header in resource._responseHeaders) {
      var wildfireRegex = /X-Wf(-([0-9]+)){4}/;
      var matches = wildfireRegex.exec(header);
      
      if (matches !== null && matches[2] !== null) {
        // Store for later use. The actual header name isn't really that important.
        // Whilst we're at it, hydrate the header to a JSON object.
        this.wildfireHeaders[matches[2] - 1] = eval('(' + resource._responseHeaders[header].split('|')[1] + ')');
      }
    }
    
    if (this.wildfireHeaders.length !== 0) {
      this._view.displayData(this.wildfireHeaders);
    }
  },
  
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
  _createLog: function() {
    
  },
  
  _createInfo: function() {
    
  },
  
  _createWarn: function() {
    
  },
  
  _createTrace: function() {
    
  },
  
  _createException: function() {
    
  },
  
  _createTable: function() {
    
  },
  
  _createGroup: function() {
    
  },
  
  _createItem: function(name, contents) {
    // var listElement = document.createElement('ol');
    // var listItemElement = document.createElement('li');
    // 
    // listItemElement.className = '.audit-result-tree parent';
    // listItemElement.innerHTML = name;
    // 
    // listElement.appendChild(listItemElement);
    // 
    // console.log(listElement);
    // 
    
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
    } else if (typeof contents == 'string' || typeof contents == 'object') {
      var item = document.createElement('li');
      item.innerHTML = contents;
      
      contentsContainer.appendChild(item);
    }
    
    blockContainer.appendChild(contentsContainer);
    
    return blockContainer;
    // return '<div class="section computed-style expanded"><div class="header"><div class="subtitle"><label class="undefined"><input type="checkbox">Show inherited</label></div><div class="title">Computed Style</div></div><ol class="properties source-code" tabindex="0"><li title="-webkit-animation-delay: 0s" class="inherited"><span class="name">-webkit-animation-delay</span>: <span class="value">0s</span>;</li><li title="-webkit-animation-direction: normal" class="inherited"><span class="name">-webkit-animation-direction</span>: <span class="value">normal</span>;</li><li title="-webkit-animation-duration: 0s" class="inherited"><span class="name">-webkit-animation-duration</span>: <span class="value">0s</span>;</li><li title="-webkit-animation-fill-mode: none" class="inherited"><span class="name">-webkit-animation-fill-mode</span>: <span class="value">none</span>;</li><li title="-webkit-animation-iteration-count: 1" class="inherited"><span class="name">-webkit-animation-iteration-count</span>: <span class="value">1</span>;</li><li title="-webkit-animation-name: none" class="inherited"><span class="name">-webkit-animation-name</span>: <span class="value">none</span>;</li><li title="-webkit-animation-play-state: running" class="inherited"><span class="name">-webkit-animation-play-state</span>: <span class="value">running</span>;</li><li title="-webkit-animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1)" class="inherited"><span class="name">-webkit-animation-timing-function</span>: <span class="value">cubic-bezier(0.25, 0.1, 0.25, 1)</span>;</li><li title="-webkit-appearance: none" class="inherited"><span class="name">-webkit-appearance</span>: <span class="value">none</span>;</li><li title="-webkit-backface-visibility: visible" class="inherited"><span class="name">-webkit-backface-visibility</span>: <span class="value">visible</span>;</li><li title="-webkit-background-clip: border-box" class="inherited"><span class="name">-webkit-background-clip</span>: <span class="value">border-box</span>;</li><li title="-webkit-background-composite: source-over" class="inherited"><span class="name">-webkit-background-composite</span>: <span class="value">source-over</span>;</li><li title="-webkit-background-origin: padding-box" class="inherited"><span class="name">-webkit-background-origin</span>: <span class="value">padding-box</span>;</li><li title="-webkit-background-size: auto auto" class="inherited"><span class="name">-webkit-background-size</span>: <span class="value">auto auto</span>;</li><li title="-webkit-border-fit: border" class="inherited"><span class="name">-webkit-border-fit</span>: <span class="value">border</span>;</li><li title="-webkit-border-horizontal-spacing: 0px" class="inherited"><span class="name">-webkit-border-horizontal-spacing</span>: <span class="value">0px</span>;</li><li title="-webkit-border-image: none" class="inherited"><span class="name">-webkit-border-image</span>: <span class="value">none</span>;</li><li title="-webkit-border-vertical-spacing: 0px" class="inherited"><span class="name">-webkit-border-vertical-spacing</span>: <span class="value">0px</span>;</li><li title="-webkit-box-align: stretch" class="inherited"><span class="name">-webkit-box-align</span>: <span class="value">stretch</span>;</li><li title="-webkit-box-direction: normal" class="inherited"><span class="name">-webkit-box-direction</span>: <span class="value">normal</span>;</li><li title="-webkit-box-flex: 0" class="inherited"><span class="name">-webkit-box-flex</span>: <span class="value">0</span>;</li><li title="-webkit-box-flex-group: 1" class="inherited"><span class="name">-webkit-box-flex-group</span>: <span class="value">1</span>;</li><li title="-webkit-box-lines: single" class="inherited"><span class="name">-webkit-box-lines</span>: <span class="value">single</span>;</li><li title="-webkit-box-ordinal-group: 1" class="inherited"><span class="name">-webkit-box-ordinal-group</span>: <span class="value">1</span>;</li><li title="-webkit-box-orient: horizontal" class="inherited"><span class="name">-webkit-box-orient</span>: <span class="value">horizontal</span>;</li><li title="-webkit-box-pack: start" class="inherited"><span class="name">-webkit-box-pack</span>: <span class="value">start</span>;</li><li title="-webkit-box-reflect: none" class="inherited"><span class="name">-webkit-box-reflect</span>: <span class="value">none</span>;</li><li title="-webkit-box-shadow: none" class="inherited"><span class="name">-webkit-box-shadow</span>: <span class="value">none</span>;</li><li title="-webkit-box-sizing: content-box" class="inherited"><span class="name">-webkit-box-sizing</span>: <span class="value">content-box</span>;</li><li title="-webkit-color-correction: default" class="inherited"><span class="name">-webkit-color-correction</span>: <span class="value">default</span>;</li><li title="-webkit-column-break-after: auto" class="inherited"><span class="name">-webkit-column-break-after</span>: <span class="value">auto</span>;</li><li title="-webkit-column-break-before: auto" class="inherited"><span class="name">-webkit-column-break-before</span>: <span class="value">auto</span>;</li><li title="-webkit-column-break-inside: auto" class="inherited"><span class="name">-webkit-column-break-inside</span>: <span class="value">auto</span>;</li><li title="-webkit-column-count: auto" class="inherited"><span class="name">-webkit-column-count</span>: <span class="value">auto</span>;</li><li title="-webkit-column-gap: normal" class="inherited"><span class="name">-webkit-column-gap</span>: <span class="value">normal</span>;</li><li title="-webkit-column-rule-color: black" class="inherited"><span class="name">-webkit-column-rule-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="-webkit-column-rule-style: none" class="inherited"><span class="name">-webkit-column-rule-style</span>: <span class="value">none</span>;</li><li title="-webkit-column-rule-width: 0px" class="inherited"><span class="name">-webkit-column-rule-width</span>: <span class="value">0px</span>;</li><li title="-webkit-column-width: auto" class="inherited"><span class="name">-webkit-column-width</span>: <span class="value">auto</span>;</li><li title="-webkit-dashboard-region: " class="inherited"><span class="name">-webkit-dashboard-region</span>: <span class="value"></span>;</li><li title="-webkit-font-smoothing: auto" class="inherited"><span class="name">-webkit-font-smoothing</span>: <span class="value">auto</span>;</li><li title="-webkit-highlight: none" class="inherited"><span class="name">-webkit-highlight</span>: <span class="value">none</span>;</li><li title="-webkit-line-break: normal" class="inherited"><span class="name">-webkit-line-break</span>: <span class="value">normal</span>;</li><li title="-webkit-line-clamp: none" class="inherited"><span class="name">-webkit-line-clamp</span>: <span class="value">none</span>;</li><li title="-webkit-margin-bottom-collapse: collapse" class="inherited"><span class="name">-webkit-margin-bottom-collapse</span>: <span class="value">collapse</span>;</li><li title="-webkit-margin-top-collapse: collapse" class="inherited"><span class="name">-webkit-margin-top-collapse</span>: <span class="value">collapse</span>;</li><li title="-webkit-marquee-direction: auto" class="inherited"><span class="name">-webkit-marquee-direction</span>: <span class="value">auto</span>;</li><li title="-webkit-marquee-increment: 6px" class="inherited"><span class="name">-webkit-marquee-increment</span>: <span class="value">6px</span>;</li><li title="-webkit-marquee-repetition: infinite" class="inherited"><span class="name">-webkit-marquee-repetition</span>: <span class="value">infinite</span>;</li><li title="-webkit-marquee-style: scroll" class="inherited"><span class="name">-webkit-marquee-style</span>: <span class="value">scroll</span>;</li><li title="-webkit-mask-attachment: scroll" class="inherited"><span class="name">-webkit-mask-attachment</span>: <span class="value">scroll</span>;</li><li title="-webkit-mask-box-image: none" class="inherited"><span class="name">-webkit-mask-box-image</span>: <span class="value">none</span>;</li><li title="-webkit-mask-clip: border-box" class="inherited"><span class="name">-webkit-mask-clip</span>: <span class="value">border-box</span>;</li><li title="-webkit-mask-composite: source-over" class="inherited"><span class="name">-webkit-mask-composite</span>: <span class="value">source-over</span>;</li><li title="-webkit-mask-image: none" class="inherited"><span class="name">-webkit-mask-image</span>: <span class="value">none</span>;</li><li title="-webkit-mask-origin: border-box" class="inherited"><span class="name">-webkit-mask-origin</span>: <span class="value">border-box</span>;</li><li title="-webkit-mask-position: 0% 0%" class="inherited"><span class="name">-webkit-mask-position</span>: <span class="value">0% 0%</span>;</li><li title="-webkit-mask-repeat: repeat" class="inherited"><span class="name">-webkit-mask-repeat</span>: <span class="value">repeat</span>;</li><li title="-webkit-mask-size: auto auto" class="inherited"><span class="name">-webkit-mask-size</span>: <span class="value">auto auto</span>;</li><li title="-webkit-nbsp-mode: normal" class="inherited"><span class="name">-webkit-nbsp-mode</span>: <span class="value">normal</span>;</li><li title="-webkit-perspective: none" class="inherited"><span class="name">-webkit-perspective</span>: <span class="value">none</span>;</li><li title="-webkit-perspective-origin: 630px 190px" class="inherited"><span class="name">-webkit-perspective-origin</span>: <span class="value">630px 190px</span>;</li><li title="-webkit-rtl-ordering: logical" class="inherited"><span class="name">-webkit-rtl-ordering</span>: <span class="value">logical</span>;</li><li title="-webkit-svg-shadow: none" class="inherited"><span class="name">-webkit-svg-shadow</span>: <span class="value">none</span>;</li><li title="-webkit-text-decorations-in-effect: none" class="inherited"><span class="name">-webkit-text-decorations-in-effect</span>: <span class="value">none</span>;</li><li title="-webkit-text-fill-color: black" class="inherited"><span class="name">-webkit-text-fill-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="-webkit-text-security: none" class="inherited"><span class="name">-webkit-text-security</span>: <span class="value">none</span>;</li><li title="-webkit-text-stroke-color: black" class="inherited"><span class="name">-webkit-text-stroke-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="-webkit-text-stroke-width: 0px" class="inherited"><span class="name">-webkit-text-stroke-width</span>: <span class="value">0px</span>;</li><li title="-webkit-transform: none" class="inherited"><span class="name">-webkit-transform</span>: <span class="value">none</span>;</li><li title="-webkit-transform-origin: 630px 190px" class="inherited"><span class="name">-webkit-transform-origin</span>: <span class="value">630px 190px</span>;</li><li title="-webkit-transform-style: flat" class="inherited"><span class="name">-webkit-transform-style</span>: <span class="value">flat</span>;</li><li title="-webkit-transition-delay: 0s" class="inherited"><span class="name">-webkit-transition-delay</span>: <span class="value">0s</span>;</li><li title="-webkit-transition-duration: 0s" class="inherited"><span class="name">-webkit-transition-duration</span>: <span class="value">0s</span>;</li><li title="-webkit-transition-property: all" class="inherited"><span class="name">-webkit-transition-property</span>: <span class="value">all</span>;</li><li title="-webkit-transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1)" class="inherited"><span class="name">-webkit-transition-timing-function</span>: <span class="value">cubic-bezier(0.25, 0.1, 0.25, 1)</span>;</li><li title="-webkit-user-drag: auto" class="inherited"><span class="name">-webkit-user-drag</span>: <span class="value">auto</span>;</li><li title="-webkit-user-modify: read-only" class="inherited"><span class="name">-webkit-user-modify</span>: <span class="value">read-only</span>;</li><li title="-webkit-user-select: text" class="inherited"><span class="name">-webkit-user-select</span>: <span class="value">text</span>;</li><li title="alignment-baseline: auto" class="inherited"><span class="name">alignment-baseline</span>: <span class="value">auto</span>;</li><li title="background-attachment: scroll"><span class="name">background-attachment</span>: <span class="value">scroll</span>;</li><li title="background-clip: border-box"><span class="name">background-clip</span>: <span class="value">border-box</span>;</li><li title="background-color: white"><span class="name">background-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(255, 255, 255); "></span><span>white</span></span>;</li><li title="background-image: none"><span class="name">background-image</span>: <span class="value">none</span>;</li><li title="background-origin: padding-box"><span class="name">background-origin</span>: <span class="value">padding-box</span>;</li><li title="background-position: 0% 0%" class="inherited"><span class="name">background-position</span>: <span class="value">0% 0%</span>;</li><li title="background-repeat: repeat" class="inherited"><span class="name">background-repeat</span>: <span class="value">repeat</span>;</li><li title="background-size: auto auto" class="inherited"><span class="name">background-size</span>: <span class="value">auto auto</span>;</li><li title="baseline-shift: baseline" class="inherited"><span class="name">baseline-shift</span>: <span class="value">baseline</span>;</li><li title="border-bottom-color: black" class="inherited"><span class="name">border-bottom-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="border-bottom-left-radius: 0px" class="inherited"><span class="name">border-bottom-left-radius</span>: <span class="value">0px</span>;</li><li title="border-bottom-right-radius: 0px" class="inherited"><span class="name">border-bottom-right-radius</span>: <span class="value">0px</span>;</li><li title="border-bottom-style: none" class="inherited"><span class="name">border-bottom-style</span>: <span class="value">none</span>;</li><li title="border-bottom-width: 0px" class="inherited"><span class="name">border-bottom-width</span>: <span class="value">0px</span>;</li><li title="border-collapse: separate" class="inherited"><span class="name">border-collapse</span>: <span class="value">separate</span>;</li><li title="border-left-color: black" class="inherited"><span class="name">border-left-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="border-left-style: none" class="inherited"><span class="name">border-left-style</span>: <span class="value">none</span>;</li><li title="border-left-width: 0px" class="inherited"><span class="name">border-left-width</span>: <span class="value">0px</span>;</li><li title="border-right-color: black" class="inherited"><span class="name">border-right-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="border-right-style: none" class="inherited"><span class="name">border-right-style</span>: <span class="value">none</span>;</li><li title="border-right-width: 0px" class="inherited"><span class="name">border-right-width</span>: <span class="value">0px</span>;</li><li title="border-top-color: black" class="inherited"><span class="name">border-top-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="border-top-left-radius: 0px" class="inherited"><span class="name">border-top-left-radius</span>: <span class="value">0px</span>;</li><li title="border-top-right-radius: 0px" class="inherited"><span class="name">border-top-right-radius</span>: <span class="value">0px</span>;</li><li title="border-top-style: none" class="inherited"><span class="name">border-top-style</span>: <span class="value">none</span>;</li><li title="border-top-width: 0px" class="inherited"><span class="name">border-top-width</span>: <span class="value">0px</span>;</li><li title="bottom: auto" class="inherited"><span class="name">bottom</span>: <span class="value">auto</span>;</li><li title="caption-side: top" class="inherited"><span class="name">caption-side</span>: <span class="value">top</span>;</li><li title="clear: none" class="inherited"><span class="name">clear</span>: <span class="value">none</span>;</li><li title="clip: auto" class="inherited"><span class="name">clip</span>: <span class="value">auto</span>;</li><li title="clip-path: none" class="inherited"><span class="name">clip-path</span>: <span class="value">none</span>;</li><li title="clip-rule: nonzero" class="inherited"><span class="name">clip-rule</span>: <span class="value">nonzero</span>;</li><li title="color: black"><span class="name">color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="color-interpolation: srgb" class="inherited"><span class="name">color-interpolation</span>: <span class="value">srgb</span>;</li><li title="color-interpolation-filters: linearrgb" class="inherited"><span class="name">color-interpolation-filters</span>: <span class="value">linearrgb</span>;</li><li title="color-rendering: auto" class="inherited"><span class="name">color-rendering</span>: <span class="value">auto</span>;</li><li title="cursor: auto" class="inherited"><span class="name">cursor</span>: <span class="value">auto</span>;</li><li title="direction: ltr" class="inherited"><span class="name">direction</span>: <span class="value">ltr</span>;</li><li title="display: block"><span class="name">display</span>: <span class="value">block</span>;</li><li title="dominant-baseline: auto" class="inherited"><span class="name">dominant-baseline</span>: <span class="value">auto</span>;</li><li title="empty-cells: show" class="inherited"><span class="name">empty-cells</span>: <span class="value">show</span>;</li><li title="fill: black" class="inherited"><span class="name">fill</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="fill-opacity: 1" class="inherited"><span class="name">fill-opacity</span>: <span class="value">1</span>;</li><li title="fill-rule: nonzero" class="inherited"><span class="name">fill-rule</span>: <span class="value">nonzero</span>;</li><li title="filter: none" class="inherited"><span class="name">filter</span>: <span class="value">none</span>;</li><li title="float: none" class="inherited"><span class="name">float</span>: <span class="value">none</span>;</li><li title="flood-color: black" class="inherited"><span class="name">flood-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="flood-opacity: 1" class="inherited"><span class="name">flood-opacity</span>: <span class="value">1</span>;</li><li title="font-family: arial, sans-serif"><span class="name">font-family</span>: <span class="value">arial, sans-serif</span>;</li><li title="font-size: 16px" class="inherited"><span class="name">font-size</span>: <span class="value">16px</span>;</li><li title="font-style: normal" class="inherited"><span class="name">font-style</span>: <span class="value">normal</span>;</li><li title="font-variant: normal" class="inherited"><span class="name">font-variant</span>: <span class="value">normal</span>;</li><li title="font-weight: normal" class="inherited"><span class="name">font-weight</span>: <span class="value">normal</span>;</li><li title="glyph-orientation-horizontal: 0deg" class="inherited"><span class="name">glyph-orientation-horizontal</span>: <span class="value">0deg</span>;</li><li title="glyph-orientation-vertical: auto" class="inherited"><span class="name">glyph-orientation-vertical</span>: <span class="value">auto</span>;</li><li title="height: 381px"><span class="name">height</span>: <span class="value">381px</span>;</li><li title="image-rendering: auto" class="inherited"><span class="name">image-rendering</span>: <span class="value">auto</span>;</li><li title="kerning: " class="inherited"><span class="name">kerning</span>: <span class="value"></span>;</li><li title="left: auto" class="inherited"><span class="name">left</span>: <span class="value">auto</span>;</li><li title="letter-spacing: normal" class="inherited"><span class="name">letter-spacing</span>: <span class="value">normal</span>;</li><li title="lighting-color: white" class="inherited"><span class="name">lighting-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(255, 255, 255); "></span><span>white</span></span>;</li><li title="line-height: normal" class="inherited"><span class="name">line-height</span>: <span class="value">normal</span>;</li><li title="list-style-image: none" class="inherited"><span class="name">list-style-image</span>: <span class="value">none</span>;</li><li title="list-style-position: outside" class="inherited"><span class="name">list-style-position</span>: <span class="value">outside</span>;</li><li title="list-style-type: disc" class="inherited"><span class="name">list-style-type</span>: <span class="value">disc</span>;</li><li title="margin-bottom: 3px"><span class="name">margin-bottom</span>: <span class="value">3px</span>;</li><li title="margin-left: 8px"><span class="name">margin-left</span>: <span class="value">8px</span>;</li><li title="margin-right: 8px"><span class="name">margin-right</span>: <span class="value">8px</span>;</li><li title="margin-top: 3px"><span class="name">margin-top</span>: <span class="value">3px</span>;</li><li title="marker-end: none" class="inherited"><span class="name">marker-end</span>: <span class="value">none</span>;</li><li title="marker-mid: none" class="inherited"><span class="name">marker-mid</span>: <span class="value">none</span>;</li><li title="marker-start: none" class="inherited"><span class="name">marker-start</span>: <span class="value">none</span>;</li><li title="mask: none" class="inherited"><span class="name">mask</span>: <span class="value">none</span>;</li><li title="max-height: none" class="inherited"><span class="name">max-height</span>: <span class="value">none</span>;</li><li title="max-width: none" class="inherited"><span class="name">max-width</span>: <span class="value">none</span>;</li><li title="min-height: 0px" class="inherited"><span class="name">min-height</span>: <span class="value">0px</span>;</li><li title="min-width: 0px" class="inherited"><span class="name">min-width</span>: <span class="value">0px</span>;</li><li title="opacity: 1" class="inherited"><span class="name">opacity</span>: <span class="value">1</span>;</li><li title="orphans: 2" class="inherited"><span class="name">orphans</span>: <span class="value">2</span>;</li><li title="outline-color: black" class="inherited"><span class="name">outline-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="outline-style: none" class="inherited"><span class="name">outline-style</span>: <span class="value">none</span>;</li><li title="outline-width: 0px" class="inherited"><span class="name">outline-width</span>: <span class="value">0px</span>;</li><li title="overflow-x: visible" class="inherited"><span class="name">overflow-x</span>: <span class="value">visible</span>;</li><li title="overflow-y: visible" class="inherited"><span class="name">overflow-y</span>: <span class="value">visible</span>;</li><li title="padding-bottom: 0px" class="inherited"><span class="name">padding-bottom</span>: <span class="value">0px</span>;</li><li title="padding-left: 0px" class="inherited"><span class="name">padding-left</span>: <span class="value">0px</span>;</li><li title="padding-right: 0px" class="inherited"><span class="name">padding-right</span>: <span class="value">0px</span>;</li><li title="padding-top: 0px" class="inherited"><span class="name">padding-top</span>: <span class="value">0px</span>;</li><li title="page-break-after: auto" class="inherited"><span class="name">page-break-after</span>: <span class="value">auto</span>;</li><li title="page-break-before: auto" class="inherited"><span class="name">page-break-before</span>: <span class="value">auto</span>;</li><li title="page-break-inside: auto" class="inherited"><span class="name">page-break-inside</span>: <span class="value">auto</span>;</li><li title="pointer-events: auto" class="inherited"><span class="name">pointer-events</span>: <span class="value">auto</span>;</li><li title="position: static" class="inherited"><span class="name">position</span>: <span class="value">static</span>;</li><li title="resize: none" class="inherited"><span class="name">resize</span>: <span class="value">none</span>;</li><li title="right: auto" class="inherited"><span class="name">right</span>: <span class="value">auto</span>;</li><li title="shape-rendering: auto" class="inherited"><span class="name">shape-rendering</span>: <span class="value">auto</span>;</li><li title="stop-color: black" class="inherited"><span class="name">stop-color</span>: <span class="value"><span title="Click to change color format" class="swatch" style="background-color: rgb(0, 0, 0); "></span><span>black</span></span>;</li><li title="stop-opacity: 1" class="inherited"><span class="name">stop-opacity</span>: <span class="value">1</span>;</li><li title="stroke: none" class="inherited"><span class="name">stroke</span>: <span class="value">none</span>;</li><li title="stroke-dasharray: " class="inherited"><span class="name">stroke-dasharray</span>: <span class="value"></span>;</li><li title="stroke-dashoffset: " class="inherited"><span class="name">stroke-dashoffset</span>: <span class="value"></span>;</li><li title="stroke-linecap: butt" class="inherited"><span class="name">stroke-linecap</span>: <span class="value">butt</span>;</li><li title="stroke-linejoin: miter" class="inherited"><span class="name">stroke-linejoin</span>: <span class="value">miter</span>;</li><li title="stroke-miterlimit: 4" class="inherited"><span class="name">stroke-miterlimit</span>: <span class="value">4</span>;</li><li title="stroke-opacity: 1" class="inherited"><span class="name">stroke-opacity</span>: <span class="value">1</span>;</li><li title="stroke-width: " class="inherited"><span class="name">stroke-width</span>: <span class="value"></span>;</li><li title="table-layout: auto" class="inherited"><span class="name">table-layout</span>: <span class="value">auto</span>;</li><li title="text-align: auto" class="inherited"><span class="name">text-align</span>: <span class="value">auto</span>;</li><li title="text-anchor: start" class="inherited"><span class="name">text-anchor</span>: <span class="value">start</span>;</li><li title="text-decoration: none" class="inherited"><span class="name">text-decoration</span>: <span class="value">none</span>;</li><li title="text-indent: 0px" class="inherited"><span class="name">text-indent</span>: <span class="value">0px</span>;</li><li title="text-overflow: clip" class="inherited"><span class="name">text-overflow</span>: <span class="value">clip</span>;</li><li title="text-rendering: auto" class="inherited"><span class="name">text-rendering</span>: <span class="value">auto</span>;</li><li title="text-shadow: none" class="inherited"><span class="name">text-shadow</span>: <span class="value">none</span>;</li><li title="text-transform: none" class="inherited"><span class="name">text-transform</span>: <span class="value">none</span>;</li><li title="top: auto" class="inherited"><span class="name">top</span>: <span class="value">auto</span>;</li><li title="unicode-bidi: normal" class="inherited"><span class="name">unicode-bidi</span>: <span class="value">normal</span>;</li><li title="vertical-align: baseline" class="inherited"><span class="name">vertical-align</span>: <span class="value">baseline</span>;</li><li title="visibility: visible" class="inherited"><span class="name">visibility</span>: <span class="value">visible</span>;</li><li title="white-space: normal" class="inherited"><span class="name">white-space</span>: <span class="value">normal</span>;</li><li title="widows: 2" class="inherited"><span class="name">widows</span>: <span class="value">2</span>;</li><li title="width: 1260px"><span class="name">width</span>: <span class="value">1260px</span>;</li><li title="word-break: normal" class="inherited"><span class="name">word-break</span>: <span class="value">normal</span>;</li><li title="word-spacing: 0px" class="inherited"><span class="name">word-spacing</span>: <span class="value">0px</span>;</li><li title="word-wrap: normal" class="inherited"><span class="name">word-wrap</span>: <span class="value">normal</span>;</li><li title="writing-mode: lr-tb" class="inherited"><span class="name">writing-mode</span>: <span class="value">lr-tb</span>;</li><li title="z-index: auto" class="inherited"><span class="name">z-index</span>: <span class="value">auto</span>;</li><li title="zoom: 1" class="inherited"><span class="name">zoom</span>: <span class="value">1</span>;</li></ol></div>';
  },
  
  displayData: function(wildfireHeaders) {
    console.log('displaying data');
    for (item = 0; item < wildfireHeaders.length; item++) {
      console.log(this._createItem('Foo'));
      
      this.viewContainerElement.appendChild(this._createItem('Foo', 'oh hai'));
    }
  },
  
};