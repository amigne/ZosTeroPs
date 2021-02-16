/**
 * jsTable v0.0.x
 *
 * Website: https://github.com/amigne/jsTable
 * Description: Light table editor.
 *
 * This software is distributed under MIT License.
 */

if (! jSuites && typeof(require) === 'function') {
    var jSuites = require('jsuites');
    require('jsuites/dist/jsuites.css');
}

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.jsTable = factory();
}(this, (function () {
    'use strict';

    // jsTable core object
    let jsTable = (function(element, options) {
        // Create jsTable object
        let obj = {};
        obj.options = {};


        if (! (element instanceof Element || element instanceof HTMLDocument)) {
            console.error('jsTable: el is not a valid DOM element');
            return false;
        }

        // Loading default configuration
        let defaults = {
            // Data
            data: null,                                                        //// OK
            // Custom sorting handler
            sorting:null,
            // Rows and columns definitions
            rows: [],                                                          //// OK
            columns: [],                                                       //// OK
            // Column width that is used by default
            defaultColWidth: 120,                                              //// OK
            defaultColAlign: 'center',                                         //// OK
            // Spare rows and columns
            minSpareRows:0,
            minSpareCols:0,
            // Minimal table dimensions
            minDimensions: [0,0],                                              //// OK
            // @type {boolean} - Include the header titles on copy
            includeHeadersOnCopy: false,                                       //// OK
            // Allow column sorting
            columnSorting: true,                                               //// OK
            // Allow column dragging
            columnDrag: false,                                                 //// OK
            // Allow column resizing
            columnResize: true,                                                //// OK
            // Allow row resizing
            rowResize: false,                                                  //// OK
            // Allow row dragging
            rowDrag: true,                                                     //// OK
            // Allow new rows
            allowInsertRow: true,                                              //// OK
            // Allow new rows
            allowManualInsertRow:true,
            // Allow new columns
            allowInsertColumn: true,                                           //// OK
            // Allow new rows
            allowManualInsertColumn:true,
            // Allow row delete
            allowDeleteRow: true,                                              //// OK
            // Allow deleting of all rows
            allowDeletingAllRows:false,
            // Allow column delete
            allowDeleteColumn: true,                                           //// OK
            // Allow rename column
            allowRenameColumn: true,                                           //// OK
            // Global wrap
            wordWrap:false,
            // Image options
            imageOptions: null,
            // Delimiters
            csvDelimiter:',',
            // First row as header
            parseTableFirstRowAsHeader:false,
            parseTableAutoCellType:false,
            // Disable corner selection
            selectionCopy:true,
            // Allow search
            search: false,                                                     //// OK
            // Create pagination
            pagination: false,                                                 //// OK
            paginationOptions: null,                                           //// OK
            // Table overflow
            tableOverflow:false,
            tableHeight:'300px',
            tableWidth:null,
            // Meta
            meta: null,
            // Style
            style: null,                                                       //// OK

            // Execute formulas
            autoIncrement:true,
            autoCasting:true,
            // Security
            stripHTMLOnCopy:false,
            // Event handles
            onundo:null,
            onredo:null,
            onload:null,
            onchange: null,                                                    //// OK
            onbeforechange:null,
            onafterchanges: null,                                              //// OK
            onbeforeinsertrow: null,
            oninsertrow:null,
            onbeforeinsertcolumn: null,
            oninsertcolumn:null,
            onbeforedeleterow:null,
            ondeleterow:null,
            onbeforedeletecolumn:null,
            ondeletecolumn:null,
            onmoverow:null,
            onmovecolumn:null,
            onresizerow:null,
            onresizecolumn:null,
            onsort:null,
            onselection:null,
            oncopy:null,
            onpaste:null,
            onbeforepaste:null,
            onfocus:null,
            onblur:null,
            onchangeheader:null,
            oncreateeditor:null,
            oneditionstart:null,
            oneditionend:null,
            onchangestyle:null,
            onchangemeta:null,
            onchangepage:null,
            // Global event dispatcher
            onevent: null,                                                     //// OK
            // Customize any cell behavior
            updateTable:null,
            // Detach the HTML table when calling updateTable
            detachForUpdates: false,
            freezeColumns: null,                                               //// OK
            // Texts
            text:{
                noRecordsFound: 'No records found',                            //// OK
                showingPage: 'Showing page {0} of {1} entries',
                show: 'Show ',
                search: 'Search',                                              //// OK
                entries: ' entries',
                columnName: 'Column name',
                insertANewColumnBefore: 'Insert a new column before',          //// OK
                insertANewColumnAfter: 'Insert a new column after',            //// OK
                deleteSelectedColumns: 'Delete selected columns',              //// OK
                renameThisColumn: 'Rename this column',                        //// OK
                orderAscending: 'Order ascending',                             //// OK
                orderDescending: 'Order descending',                           //// OK
                insertANewRowBefore: 'Insert a new row before',                //// OK
                insertANewRowAfter: 'Insert a new row after',                  //// OK
                deleteSelectedRows: 'Delete selected rows',                    //// OK
                copy: 'Copy...',                                               //// OK
                paste: 'Paste...',                                             //// OK
                about: 'About...',                                             //// OK
                areYouSureToDeleteTheSelectedRows: 'Are you sure to delete the selected rows?',
                areYouSureToDeleteTheSelectedColumns: 'Are you sure to delete the selected columns?',
                thisActionWillClearYourSearchResultsAreYouSure: 'This action will clear your search results. Are you sure?',
                noCellsSelected: 'No cells selected',
            },
            // About message
            about:"jsTable\nVersion 0.0.x\nWebsite: https://github.com/amigne/jsTable",  //// OK
        };

        // Loading initial configuration from user
        for (let property in defaults) {
            if (options && options.hasOwnProperty(property)) {
                if (property === 'text') {
                    obj.options[property] = defaults[property];
                    for (let textKey in options[property]) {
                        if (options[property].hasOwnProperty(textKey)){
                            obj.options[property][textKey] = options[property][textKey];
                        }
                    }
                } else {
                    obj.options[property] = options[property];
                }
            } else {
                obj.options[property] = defaults[property];
            }
        }

        // Global elements
        obj.element = element;
        obj.corner = null;
        obj.contextMenu = null;                                                //// OK
        obj.textarea = null; // Helper textarea for copying content
        obj.content = null;                                                    //// OK
        obj.table = null;                                                      //// OK
        obj.thead = null;                                                      //// OK
        obj.tbody = null;                                                      //// OK
        obj.rows = [];                                                         //// OK
        obj.results = null;                                                    //// OK
        obj.searchInput = null;
        obj.pagination = null;                                                 //// OK
        obj.pageNumber = null;
        obj.headerContainer = null;
        obj.colgroupContainer = null;                                          //// OK

        // Containers
        obj.headers = [];
        obj.records = [];                                                      //// OK
        obj.history = [];                                                      //// OK
        obj.colgroup = [];
        obj.selection = [];
        obj.highlighted  = [];
        obj.selectedCell = null;                                               //// OK
        obj.selectedContainer = null;
        obj.style = [];
        obj.data = null;
        obj.filter = null;

        // Internal controllers
        obj.cursor = null;
        obj.historyIndex = -1;                                                 // OK
        obj.ignoreEvents = false;                                              // OK
        obj.ignoreHistory = false;
        obj.edition = null;
        obj.hashString = null;
        obj.resizing = null;
        obj.dragging = null;

        /**
         * Trigger events
         */
        obj.dispatch = function(event) {
            // Dispatch events
            let ret;
            if (! obj.ignoreEvents) {
                // Call global event
                if (typeof(obj.options.onevent) === 'function') {
                    ret = obj.options.onevent.apply(this, arguments);
                }
                // Call specific events
                if (typeof(obj.options[event]) === 'function') {
                    ret = obj.options[event].apply(this, Array.prototype.slice.call(arguments, 1));
                }
            }

            return ret;
        }

        /**
         * Prepare the jsTable table
         */
        obj.prepareTable = function() {
            // Number of columns
            let size = obj.options.columns.length;
            let keys;
            if (obj.options.data && typeof(obj.options.data[0]) !== 'undefined') {
                // Data keys
                keys = Object.keys(obj.options.data[0]);
                if (keys.length > size) {
                    size = keys.length;
                }
            }

            // Minimal dimensions
            if (obj.options.minDimensions[0] > size) {
                size = obj.options.minDimensions[0];
            }

            // Preparations
            for (let i = 0; i < size; ++i) {
                // Default column description
                if (! obj.options.columns[i]) {
                    obj.options.columns[i] = { name: keys && keys[i] ? keys[i] : i };
                } else {
                    obj.options.columns[i].name = keys && keys[i] ? keys[i] : i;
                }
                if (! obj.options.columns[i].source) {
                    obj.options.columns[i].source = [];
                }
                if (! obj.options.columns[i].options) {
                    obj.options.columns[i].options = [];
                }
                if (! obj.options.columns[i].allowEmpty) {
                    obj.options.columns[i].allowEmpty = false;
                }
                if (! obj.options.columns[i].title) {
                    obj.options.columns[i].title = '';
                }
                if (! obj.options.columns[i].width) {
                    obj.options.columns[i].width = obj.options.defaultColWidth;
                }
                if (! obj.options.columns[i].align) {
                    obj.options.columns[i].align = obj.options.defaultColAlign;
                }
            }

            // Create the table when is ready
            obj.createTable();
        }

        obj.createTable = function() {
            // Elements
            obj.table = document.createElement('table');
            obj.thead = document.createElement('thead');
            obj.tbody = document.createElement('tbody');

            // Create headers controllers
            obj.headers = [];                                                  //// ????
            obj.colgroup = [];                                                 //// ????

            // Create table container
            obj.content = document.createElement('div');
            obj.content.classList.add('jsTable_content');
            obj.content.onscroll = function(e) {                               //// ????
                obj.scrollControls(e);
            }

            // Search
            let searchContainer = document.createElement('div');
            let searchText = document.createTextNode((obj.options.text.search) + ': ');
            obj.searchInput = document.createElement('input');
            obj.searchInput.classList.add('jsTable_search');
            searchContainer.appendChild(searchText);
            searchContainer.appendChild(obj.searchInput);
            obj.searchInput.onfocus = function() {
                obj.resetSelection();
            }

            // Pagination select option
            let paginationUpdateContainer = document.createElement('div');
            if (obj.options.pagination > 0 && obj.options.paginationOptions && obj.options.paginationOptions.length > 0) {
                obj.paginationDropdown = document.createElement('select');
                obj.paginationDropdown.classList.add('jsTable_pagination_dropdown');
                obj.paginationDropdown.onchange = function() {
                    obj.options.pagination = parseInt(this.value);
                    obj.page(0);
                }

                for (let i = 0; i < obj.options.paginationOptions.length; ++i) {
                    let temp = document.createElement('option');
                    temp.value = obj.options.paginationOptions[i];
                    temp.innerHTML = obj.options.paginationOptions[i];
                    obj.paginationDropdown.appendChild(temp);
                }

                // Set initial pagination value
                obj.paginationDropdown.value = obj.options.pagination;

                paginationUpdateContainer.appendChild(document.createTextNode(obj.options.text.show));
                paginationUpdateContainer.appendChild(obj.paginationDropdown);
                paginationUpdateContainer.appendChild(document.createTextNode(obj.options.text.entries));
            }

            // Filter and pagination container
            let filter = document.createElement('div');
            filter.classList.add('jsTable_filter');
            filter.appendChild(paginationUpdateContainer);
            filter.appendChild(searchContainer);

            // Colsgroup
            obj.colgroupContainer = document.createElement('colgroup');
            let tempCol = document.createElement('col');
            tempCol.setAttribute('width', '50');
            obj.colgroupContainer.appendChild(tempCol);

            // Row
            obj.headerContainer = document.createElement('tr');
            tempCol = document.createElement('td');
            tempCol.classList.add('jsTable_selectall');
            obj.headerContainer.appendChild(tempCol);

            for (let i = 0; i < obj.options.columns.length; ++i) {
                // Create header
                obj.createCellHeader(i);
                // Append cell to the container
                obj.headerContainer.appendChild(obj.headers[i]);
                obj.colgroupContainer.appendChild(obj.colgroup[i]);
            }
            obj.thead.appendChild(obj.headerContainer);

            // Content table
            obj.table = document.createElement('table');
            obj.table.classList.add('jsTable');
            obj.table.setAttribute('cellpadding', '0');
            obj.table.setAttribute('cellspacing', '0');
            obj.table.setAttribute('unselectable', 'yes');
            obj.table.appendChild(obj.colgroupContainer);
            obj.table.appendChild(obj.thead);
            obj.table.appendChild(obj.tbody);

            // Spreadsheet corner
            obj.corner = document.createElement('div');
            obj.corner.className = 'jsTable_corner';
            obj.corner.setAttribute('unselectable', 'on');
            obj.corner.setAttribute('onselectstart', 'return false');

            // TODO: Determine if selection copy is needed or not
            if (obj.options.selectionCopy === false) {
                obj.corner.style.display = 'none';
            }

            // Textarea helper
            obj.textarea = document.createElement('textarea');
            obj.textarea.className = 'jsTable_textarea';
            obj.textarea.id = 'jsTable_textarea';
            obj.textarea.tabIndex = -1;

            // Contextmenu container
            obj.contextMenu = document.createElement('div');
            obj.contextMenu.className = 'jsTable_contextmenu';

            // Create element
            jSuites.contextmenu(obj.contextMenu, {
                onclick: function() {
                    obj.contextMenu.contextmenu.close(false);
                }
            });

            // Create table container
            let container = document.createElement('div');
            container.classList.add('jsTable_table');

            // Pagination
            obj.pagination = document.createElement('div');
            obj.pagination.classList.add('jsTable_pagination');
            let paginationInfo = document.createElement('div');
            let paginationPages = document.createElement('div');
            obj.pagination.appendChild(paginationInfo);
            obj.pagination.appendChild(paginationPages);

            // Hide pagination if not in use
            if (! obj.options.pagination) {
                obj.pagination.style.display = 'none';
            }

            // Append containers to the table
            if (obj.options.search === true) {
                element.appendChild(filter);
            }

            // Elements
            obj.content.appendChild(obj.table);
            obj.content.appendChild(obj.corner);
            obj.content.appendChild(obj.textarea);

            element.appendChild(obj.content);
            element.appendChild(obj.pagination);
            element.appendChild(obj.contextMenu);
            element.classList.add('jsTable_container');

            // Overflow
            if (obj.options.tableOverflow === true) {
                if (obj.options.tableHeight) {
                    obj.content.style['overflow-y'] = 'auto';
                    obj.content.style.maxHeight = obj.options.tableHeight;
                }
                if (obj.options.tableWidth) {
                    obj.content.style['overflow-x'] = 'auto';
                    obj.content.style.width = obj.options.tableWidth;
                }
            }

            // Actions
            if (obj.options.columnDrag === true) {
                obj.thead.classList.add('draggable');
            }
            if (obj.options.columnResize === true) {
                obj.thead.classList.add('resizable');
            }
            if (obj.options.rowDrag === true) {
                obj.tbody.classList.add('draggable');
            }
            if (obj.options.rowResize === true) {
                obj.tbody.classList.add('resizable');
            }

            // Load data
            obj.setData();

            // Style
            if (obj.options.style) {
                obj.setStyle(obj.options.style, null, null, 1, 1);
            }
        }

        /**
         * Set data
         *
         * @param data - In case no data is sent, default is reloaded
         */
        obj.setData = function(data) {
            // Update data
            if (data) {
                if (typeof(data) === 'string') {
                    data = JSON.parse(data);
                }
                obj.options.data = data;
            }

            // Data
            if (! obj.options.data) {
                obj.options.data = [];
            }

            // Prepare data
            if (obj.options.data && obj.options.data[0]) {
                if (! Array.isArray(obj.options.data[0])) {
                    let data = [];
                    for (let j = 0; j < obj.options.data.length; ++j) {
                        let row = [];
                        for (let i = 0; i < obj.options.columns.length; ++i) {
                            row[i] = obj.options.data[j][obj.options.columns[i].name];
                        }
                        data.push(row);
                    }
                    obj.options.data = data;
                }
            }

            // Adjust minimal dimensions
            let size_i = obj.options.columns.length;
            let size_j = obj.options.data.length;
            let min_i = obj.options.minDimensions[0];
            let min_j = obj.options.minDimensions[1];
            let max_i = min_i > size_i ? min_i : size_i;
            let max_j = min_j > size_j ? min_j : size_j;

            for (let j = 0; j < max_j; ++j) {
                for (let i = 0; i < max_i; ++i) {
                    if (obj.options.data[j] === undefined) {
                        obj.options.data[j] = [];
                    }
                    if (obj.options.data[j][i] === undefined) {
                        obj.options.data[j][i] = '';
                    }
                }
            }

            // Reset containers
            obj.rows = [];
            obj.results = null;
            obj.records = [];
            obj.history = [];

            // Reset internal controllers
            obj.historyIndex = -1;

            // Reset data
            obj.tbody.innerHTML = '';

            let startNumber = 0;
            let finalNumber = obj.options.data.length;
            if (obj.options.pagination) {
                // Pagination
                if (! obj.pageNumber) {
                    obj.pageNumber = 0;
                }
                startNumber = (obj.options.pagination * obj.pageNumber);
                finalNumber = (obj.options.pagination * obj.pageNumber) + obj.options.pagination;

                if (obj.options.data.length < finalNumber) {
                    finalNumber = obj.options.data.length;
                }
            }

            // Append nodes to the HTML
            for (let j = 0; j < obj.options.data.length; ++j) {
                // Create row
                let tr = obj.createRow(j, obj.options.data[j]);
                // Append line to the table
                if (j >= startNumber && j < finalNumber) {
                    obj.tbody.appendChild(tr);
                }
            }

            if (obj.options.pagination) {
                obj.updatePagination();
            }

            // Update table with custom configurations if applicable
            obj.updateTable();

            // Onload
            obj.dispatch('onload', element, obj);
        }

        /**
         * Get the whole table data
         *
         * @param highlighted - {bool} get highlighted cells only
         * @return {array} extracted data
         */
        obj.getData = function(highlighted) {
            // Control vars
            let dataset = [];
            let px = 0;
            let py = 0;

            // Column and row length
            let x = obj.options.columns.length
            let y = obj.options.data.length

            // Go through the columns to get the data
            for (let j = 0; j < y; ++j) {
                px = 0;
                for (let i = 0; i < x; ++i) {
                    // Cell selected or full set
                    if (! highlighted || obj.records[j][i].classList.contains('highlight')) {
                        // Get value
                        if (! dataset[py]) {
                            dataset[py] = [];
                        }
                        dataset[py][px] = obj.options.data[j][i];
                        px++;
                    }
                }
                if (px > 0) {
                    py++;
                }
           }

           return dataset;
        }

        /**
         * Get a row of data
         * @param {number} rowNumber - the number of the row to get the data
         * @return {array} - the get data
         */
        obj.getRowData = function(rowNumber) {
            return obj.options.data[rowNumber];
        }

        /**
         * Set a row data
         * @param {number} rowNumber - the number of the row to set the data
         * @param {array} data - the data to set in the row
         */
        obj.setRowData = function(rowNumber, data) {
            for (let i = 0; i < obj.headers.length; ++i) {
                // Update cell
                let columnName = jsTable.getColumnNameFromId([ i, rowNumber ]);
                // Set value
                if (data[i] != null) {
                    obj.setValue(columnName, data[i]);
                }
            }
        }

        /**
         * Get a column data
         *
         * @param {number} columnNumber - the number of the column to get the data
         * @return {array} - the get data
         */
        obj.getColumnData = function(columnNumber) {
            let dataset = [];
            // Go through the rows to get the data
            for (let j = 0; j < obj.options.data.length; ++j) {
                dataset.push(obj.options.data[j][columnNumber]);
            }
            return dataset;
        }

        /**
         * Set a column data by colNumber
         *
         * @param {number} columnNumber - the number of the column to set the data
         * @param {array} data - the data to set in the column
         */
        obj.setColumnData = function(colNumber, data) {
            for (let j = 0; j < obj.rows.length; ++j) {
                // Update cell
                let columnName = jsTable.getColumnNameFromId([ colNumber, j ]);
                // Set value
                if (data[j] != null) {
                    obj.setValue(columnName, data[j]);
                }
            }
        }

        /**
         * Get the columns properties
         *
         * @returns {array} - The set of columns properties.
         */
        obj.getColumnsProperties = function() {
            let columns = [];
            for (let i = 0; i < obj.options.columns.length; ++i) {
                columns.push({
                    'title': obj.getHeader(i),
                    'width': obj.options.columns[i].width,
                });
            }

            return columns;
        }

        /**
         * Create row
         *
         * @param {number} j - The number of the row to be created
         * @param {array} data - The data to fill in the new row
         * @param {array} - The newly created row
         */
        obj.createRow = function(j, data) {
            // Create container
            if (! obj.records[j]) {
                obj.records[j] = [];
            }
            // Default data
            if (! data) {
                data = obj.options.data[j];
            }
            // New line of data to be append in the table
            obj.rows[j] = document.createElement('tr');
            obj.rows[j].setAttribute('data-y', j);
            // Index
            let index = null;
            // Definitions
            if (obj.options.rows[j]) {
                if (obj.options.rows[j].height) {
                    obj.rows[j].style.height = obj.options.rows[j].height;
                }
                if (obj.options.rows[j].title) {
                    index = obj.options.rows[j].title;
                }
            }
            if (! index) {
                index = parseInt(j + 1);
            }
            // Row number label
            let td = document.createElement('td');
            td.innerHTML = index;
            td.setAttribute('data-y', j);
            td.className = 'jsTable_row';
            obj.rows[j].appendChild(td);

            // Data columns
            for (let i = 0; i < obj.options.columns.length; ++i) {
                // New column of data to be append in the line
                obj.records[j][i] = obj.createCell(i, j, data[i]);
                // Add column to the row
                obj.rows[j].appendChild(obj.records[j][i]);
            }

            // Add row to the table body
            return obj.rows[j];
        }

        /**
         * Create cell
         *
         * @param {number} i - The horizontal position of the cell
         * @param {number} j - The vertical position of the cell
         * @param {string} value - The value of the cell
         * @return {Object} - (HTMLTableCellElement) The created cell
         */
        obj.createCell = function(i, j, value) {
            // Create cell and properties
            let td = document.createElement('td');
            td.setAttribute('data-x', ''+i);
            td.setAttribute('data-y', ''+j);

            td.innerText = value;

            // Readonly
            if (obj.options.columns[i].readOnly === true) {
                td.className = 'readonly';
            }

            // Text align
            td.style.textAlign = obj.options.columns[i].align ? obj.options.columns[i].align : 'center';

            // Wrap option
            td.style.whiteSpace = 'pre-wrap';

            return td;
        }

        obj.createCellHeader = function(colNumber) {
            // Create col global control
            var colWidth = obj.options.columns[colNumber].width ? obj.options.columns[colNumber].width : obj.options.defaultColWidth;
            var colAlign = obj.options.columns[colNumber].align ? obj.options.columns[colNumber].align : obj.options.defaultColAlign;

            // Create header cell
            obj.headers[colNumber] = document.createElement('td');
            obj.headers[colNumber].innerText = obj.options.columns[colNumber].title ? obj.options.columns[colNumber].title : jsTable.getColumnName(colNumber);
            obj.headers[colNumber].setAttribute('data-x', colNumber);
            obj.headers[colNumber].style.textAlign = colAlign;
            if (obj.options.columns[colNumber].title) {
                obj.headers[colNumber].setAttribute('title', obj.options.columns[colNumber].textContent);
            }

            // Width control
            obj.colgroup[colNumber] = document.createElement('col');
            obj.colgroup[colNumber].setAttribute('width', colWidth);
        }

        /**
         * Open the editor
         *
         * @param object cell
         * @return void
         */
        obj.openEditor = function(cell, empty, e) {
            // Get cell position
            var y = cell.getAttribute('data-y');
            var x = cell.getAttribute('data-x');

            // On edition start
            obj.dispatch('oneditionstart', element, cell, x, y);

            // Overflow
            if (x > 0) {
                obj.records[y][x-1].style.overflow = 'hidden';
            }

            // Create editor
            var createEditor = function(type) {
                // Cell information
                var info = cell.getBoundingClientRect();

                // Create dropdown
                var editor = document.createElement(type);
                editor.style.width = (info.width) + 'px';
                editor.style.height = (info.height - 2) + 'px';
                editor.style.minHeight = (info.height - 2) + 'px';

                // Edit cell
                cell.classList.add('editor');
                cell.innerHTML = '';
                cell.appendChild(editor);

                // On edition start
                obj.dispatch('oncreateeditor', element, cell, x, y, editor);

                return editor;
            }

            // Readonly
            if (cell.classList.contains('readonly') == true) {
                // Do nothing
            } else {
                // Holder
                obj.edition = [ obj.records[y][x], obj.records[y][x].innerHTML, x, y ];

                // Value
                var value = empty == true ? '' : obj.options.data[y][x];

                // Basic editor
                var editor = createEditor('textarea');

                editor.onblur = function() {
                    obj.closeEditor(cell, true);
                };
                editor.focus();
                editor.value = value;
                editor.scrollLeft = editor.scrollWidth;
            }
        }

        /**
         * Close the editor and save the information
         *
         * @param object cell
         * @param boolean save
         * @return void
         */
        obj.closeEditor = function(cell, save) {
            let x = parseInt(cell.getAttribute('data-x'));
            let y = parseInt(cell.getAttribute('data-y'));

            let value;
            // Get cell properties
            if (save === true) {
                value = cell.children[0].value;
                cell.children[0].onblur = null;

                // Ignore changes if the value is the same
                if (obj.options.data[y][x] === value) {
                    cell.innerHTML = obj.edition[1];
                } else {
                    obj.setValue(cell, value);
                }
            } else {
                cell.children[0].onblur = null;

                // Restore value
                cell.innerHTML = obj.edition && obj.edition[1] ? obj.edition[1] : '';
            }

            // On edition end
            obj.dispatch('oneditionend', element, cell, x, y, value, save);

            // Remove editor class
            cell.classList.remove('editor');

            // Finish edition
            obj.edition = null;
        }

        /**
         * Get the cell object
         *
         * @param object cell
         * @return string value
         */
        obj.getCell = function(cell) {
            // Convert in case name is excel liked ex. A10, BB92
            cell = jsTable.getIdFromColumnName(cell, true);
            let x = cell[0];
            let y = cell[1];

            return obj.records[y][x];
        }

        /**
         * Get the cell object from coords
         *
         * @param object cell
         * @return string value
         */
        obj.getCellFromCoords = function(x, y) {
            return obj.records[y][x];
        }

        /**
         * Get label
         *
         * @param object cell
         * @return string value
         */
        obj.getLabel = function(cell) {
            // Convert in case name is excel liked ex. A10, BB92
            cell = jsTable.getIdFromColumnName(cell, true);
            var x = cell[0];
            var y = cell[1];

            return obj.records[y][x].innerHTML;
        }

        /**
         * Get labelfrom coords
         *
         * @param object cell
         * @return string value
         */
        obj.getLabelFromCoords = function(x, y) {
            return obj.records[y][x].innerHTML;
        }

        /**
         * Get the value from a cell
         *
         * @param object cell
         * @return string value
         */
        obj.getValue = function(cell, processedValue) {
            if (typeof(cell) == 'object') {
                var x = cell.getAttribute('data-x');
                var y = cell.getAttribute('data-y');
            } else {
                cell = jsTable.getIdFromColumnName(cell, true);
                var x = cell[0];
                var y = cell[1];
            }

            var value = null;

            if (x != null && y != null) {
                if (obj.records[y] && obj.records[y][x] && processedValue) {
                    value = obj.records[y][x].innerHTML;
                } else {
                    if (obj.options.data[y] && obj.options.data[y][x] != 'undefined') {
                        value = obj.options.data[y][x];
                    }
                }
            }

            return value;
        }

        /**
         * Get the value from a coords
         *
         * @param {number} x
         * @param {number} y
         * @return string value
         */
        obj.getValueFromCoords = function(x, y, processedValue) {
            var value = null;

            if (x != null && y != null) {
                if ((obj.records[y] && obj.records[y][x]) && processedValue) {
                    value = obj.records[y][x].innerHTML;
                } else {
                    if (obj.options.data[y] && obj.options.data[y][x] != 'undefined') {
                        value = obj.options.data[y][x];
                    }
                }
            }

            return value;
        }

        /**
         * Set a cell value
         *
         * @param {mixed} cell - Destination cell (either an Excel-like cell, an HTML element)
         * @param {string} value - The new value
         * @param {bool} force - Indicate whether the value update must be forced
         * @return void
         */
        obj.setValue = function(cell, value, force) {
            let records = [];

            if (typeof(cell) === 'string') {
                let columnId = jsTable.getIdFromColumnName(cell, true);
                let x = columnId[0];
                let y = columnId[1];

                records.push(obj.updateCell(Number(x), Number(y), value, force));
            } else {
                let x = null;
                let y = null;

                if (cell && cell.getAttribute) {
                    x = cell.getAttribute('data-x');
                    y = cell.getAttribute('data-y');
                }

                if (x != null && y != null) {
                    records.push(obj.updateCell(Number(x), Number(y), value, force));
                } else {
                    let keys = Object.keys(cell);
                    if (keys.length > 0) {
                        for (let i = 0; i < keys.length; ++i) {
                            if (typeof(cell[i]) === 'string') {
                                let columnId = jsTable.getIdFromColumnName(cell[i], true);
                                x = columnId[0];
                                y = columnId[1];
                            } else {
                                if (cell[i].x != null && cell[i].y != null) {
                                    x = cell[i].x;
                                    y = cell[i].y;

                                    // Flexible setup
                                    if (cell[i].newValue != null) {
                                        value = cell[i].newValue;
                                    } else if (cell[i].value != null) {
                                        value = cell[i].value;
                                    }
                                } else {
                                    x = cell[i].getAttribute('data-x');
                                    y = cell[i].getAttribute('data-y');
                                }
                            }

                             // Update cell
                            if (x != null && y != null) {
                                records.push(obj.updateCell(Number(x), Number(y), value, force));
                            }
                        }
                    }
                }
            }

            // Update history
            obj.setHistory({
                action: 'setValue',
                records: records,
                selection: obj.selectedCell,
            });

            // Update table with custom configurations if applicable
            obj.updateTable();

            // On after changes
            obj.onafterchanges(element, records);
        }

        /**
         * Set a cell value based on coordinates
         *
         * @param {numeric} x - Destination cell horizontal coordinate
         * @param {numeric} y - Destination cell vertical coordinate
         * @param {string} value - The new value
         * @return {void}
         */
        obj.setValueFromCoords = function(x, y, value, force) {
            let records = [];

            records.push(obj.updateCell(Number(x), Number(y), value, force));

            // Update history
            obj.setHistory({
                action: 'setValue',
                records: records,
                selection: obj.selectedCell,
            });

            // Update table with custom configurations if applicable
            obj.updateTable();

            // On after changes
            obj.onafterchanges(element, records);
        }

        /**
         * Update cell content
         *
         * @param {number} x - Destination cell horizontal coordinate
         * @param {number} y - Destination cell vertical coordinate
         * @param {string} value - The new value
         * @param {Object} - A record describing the update
         */
        obj.updateCell = function(x, y, value, force) {
            let record;

            if (obj.records[y][x].classList.contains('readonly') && ! force) {
                // Do nothing
                record = {
                    x: x,
                    y: y,
                    col: x,
                    row: y
                }
            } else {
                let duplicate = false;
                if (x === 0) {
                    for (let j = 0; j < obj.rows.length; ++j) {
                        if ((j !== y) && (value === obj.options.data[j][x])) {
                            duplicate = true;
                        }
                    }
                }

                if (duplicate) {
                    alert('"' + value + '" is a duplicate value on the first column.');
                    value = obj.options.data[y][x];
                } else {
                    // On change
                    let val = obj.dispatch('onbeforechange', element, obj.records[y][x], x, y, value);

                    // If you return something this will overwrite the value
                    if (val !== undefined) {
                        value = val;
                    }
                }

                // History format
                record = {
                    x: x,
                    y: y,
                    col: x,
                    row: y,
                    newValue: value,
                    oldValue: obj.options.data[y][x],
                }

                // Update data and cell
                obj.options.data[y][x] = value;
                // Label
                obj.records[y][x].innerText = value;
                // Handle big text inside a cell
                obj.records[y][x].style.whiteSpace = 'pre-wrap';

                // Overflow
                if (x > 0) {
                    if (value) {
                        obj.records[y][x-1].style.overflow = 'hidden';
                    } else {
                        obj.records[y][x-1].style.overflow = '';
                    }
                }

                // On change
                obj.dispatch('onchange', element, (obj.records[y] && obj.records[y][x] ? obj.records[y][x] : null), x, y, value, record.oldValue);
            }

            return record;
        }

        /**
         * Helper function to copy data using the corner icon
         */
        obj.copyData = function(o, d) {
            // Get data from all selected cells
            let data = obj.getData(true);

            // Selected cells
            var h = obj.selectedContainer;

            // Cells
            var x1 = parseInt(o.getAttribute('data-x'));
            var y1 = parseInt(o.getAttribute('data-y'));
            var x2 = parseInt(d.getAttribute('data-x'));
            var y2 = parseInt(d.getAttribute('data-y'));

            // Records
            var records = [];
            var breakControl = false;

            if (h[0] == x1) {
                // Vertical copy
                if (y1 < h[1]) {
                    var rowNumber = y1 - h[1];
                } else {
                    var rowNumber = 1;
                }
                var colNumber = 0;
            } else {
                if (x1 < h[0]) {
                    var colNumber = x1 - h[0];
                } else {
                    var colNumber = 1;
                }
                var rowNumber = 0;
            }

            // Copy data procedure
            var posx = 0;
            var posy = 0;

            for (var j = y1; j <= y2; j++) {
                // Skip hidden rows
                if (obj.rows[j] && obj.rows[j].style.display == 'none') {
                    continue;
                }

                // Controls
                if (data[posy] == undefined) {
                    posy = 0;
                }
                posx = 0;

                // Data columns
                if (h[0] != x1) {
                    if (x1 < h[0]) {
                        var colNumber = x1 - h[0];
                    } else {
                        var colNumber = 1;
                    }
                }
                // Data columns
                for (let i = x1; i <= x2; ++i) {
                    // Update non-readonly
                    if (obj.records[j][i] && ! obj.records[j][i].classList.contains('readonly') && obj.records[j][i].style.display != 'none' && breakControl == false) {
                        // Stop if contains value
                        if (! obj.selection.length) {
                            if (obj.options.data[j][i] != '') {
                                breakControl = true;
                                continue;
                            }
                        }

                        // Column
                        if (data[posy] == undefined) {
                            posx = 0;
                        } else if (data[posy][posx] == undefined) {
                            posx = 0;
                        }

                        // Value
                        var value = data[posy][posx];

                        if (value && ! data[1] && obj.options.autoIncrement == true) {
                            if ((''+value).substr(0,1) == '=') {
                                var tokens = value.match(/([A-Z]+[0-9]+)/g);

                                if (tokens) {
                                    var affectedTokens = [];
                                    for (var index = 0; index < tokens.length; index++) {
                                        var position = jsTable.getIdFromColumnName(tokens[index], 1);
                                        position[0] += colNumber;
                                        position[1] += rowNumber;
                                        if (position[1] < 0) {
                                            position[1] = 0;
                                        }
                                        var token = jsTable.getColumnNameFromId([position[0], position[1]]);

                                        if (token != tokens[index]) {
                                            affectedTokens[tokens[index]] = token;
                                        }
                                    }
                                }
                            } else {
                                if (value == Number(value)) {
                                    value = Number(value) + rowNumber;
                                }
                            }
                        }

                        records.push(obj.updateCell(i, j, value));
                    }
                    posx++;
                    if (h[0] != x1) {
                        colNumber++;
                    }
                }
                posy++;
                rowNumber++;
            }

            // Update history
            obj.setHistory({
                action:'setValue',
                records:records,
                selection:obj.selectedCell,
            });

            // Update table with custom configuration if applicable
            obj.updateTable();

            // On after changes
            obj.onafterchanges(element, records);
        }

        /**
         * Refresh current selection
         */
        obj.refreshSelection = function() {
            if (obj.selectedCell) {
                obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            }
        }

        /**
         * Move coords to A1 in case ovelaps with an excluded cell
         */
        obj.conditionalSelectionUpdate = function(type, o, d) {
            if (type == 1) {
                if (obj.selectedCell && ((o >= obj.selectedCell[1] && o <= obj.selectedCell[3]) || (d >= obj.selectedCell[1] && d <= obj.selectedCell[3]))) {
                    obj.resetSelection();
                    return;
                }
            } else {
                if (obj.selectedCell && ((o >= obj.selectedCell[0] && o <= obj.selectedCell[2]) || (d >= obj.selectedCell[0] && d <= obj.selectedCell[2]))) {
                    obj.resetSelection();
                    return;
                }
            }
        }

        /**
         * Clear table selection
         */
        obj.resetSelection = function(blur) {
            // Remove style
            if (! obj.highlighted.length) {
                var previousStatus = 0;
            } else {
                var previousStatus = 1;

                for (var i = 0; i < obj.highlighted.length; i++) {
                    obj.highlighted[i].classList.remove('highlight');
                    obj.highlighted[i].classList.remove('highlight-left');
                    obj.highlighted[i].classList.remove('highlight-right');
                    obj.highlighted[i].classList.remove('highlight-top');
                    obj.highlighted[i].classList.remove('highlight-bottom');
                    obj.highlighted[i].classList.remove('highlight-selected');

                    var px = parseInt(obj.highlighted[i].getAttribute('data-x'));
                    var py = parseInt(obj.highlighted[i].getAttribute('data-y'));

                    var ux = px;
                    var uy = py;

                    // Remove selected from headers
                    for (var j = px; j <= ux; j++) {
                        if (obj.headers[j]) {
                            obj.headers[j].classList.remove('selected');
                        }
                    }

                    // Remove selected from rows
                    for (var j = py; j <= uy; j++) {
                        if (obj.rows[j]) {
                            obj.rows[j].classList.remove('selected');
                        }
                    }
                }
            }

            // Reset highlighed cells
            obj.highlighted = [];

            // Reset
            obj.selectedCell = null;

            // Hide corner
            obj.corner.style.top = '-2000px';
            obj.corner.style.left = '-2000px';

            if (blur == true && previousStatus == 1) {
                obj.dispatch('onblur', element);
            }

            return previousStatus;
        }

        /**
         * Update selection based on two cells
         */
        obj.updateSelection = function(el1, el2, origin) {
            var x1 = el1.getAttribute('data-x');
            var y1 = el1.getAttribute('data-y');
            if (el2) {
                var x2 = el2.getAttribute('data-x');
                var y2 = el2.getAttribute('data-y');
            } else {
                var x2 = x1;
                var y2 = y1;
            }

            obj.updateSelectionFromCoords(x1, y1, x2, y2, origin);
        }

        /**
         * Update selection from coords
         */
        obj.updateSelectionFromCoords = function(x1, y1, x2, y2, origin) {
            // Reset Selection
            var updated = null;
            var previousState = obj.resetSelection();

            // Same element
            if (x2 == null) {
                x2 = x1;
            }
            if (y2 == null) {
                y2 = y1;
            }

            // Selection must be within the existing data
            if (x1 >= obj.headers.length) {
                x1 = obj.headers.length - 1;
            }
            if (y1 >= obj.rows.length) {
                y1 = obj.rows.length - 1;
            }
            if (x2 >= obj.headers.length) {
                x2 = obj.headers.length - 1;
            }
            if (y2 >= obj.rows.length) {
                y2 = obj.rows.length - 1;
            }

            // Keep selected cell
            obj.selectedCell = [x1, y1, x2, y2];

            // Select cells
            if (x1 != null) {
                // Add selected cell
                if (obj.records[y1][x1]) {
                    obj.records[y1][x1].classList.add('highlight-selected');
                }

                // Origin & Destination
                if (parseInt(x1) < parseInt(x2)) {
                    var px = parseInt(x1);
                    var ux = parseInt(x2);
                } else {
                    var px = parseInt(x2);
                    var ux = parseInt(x1);
                }

                if (parseInt(y1) < parseInt(y2)) {
                    var py = parseInt(y1);
                    var uy = parseInt(y2);
                } else {
                    var py = parseInt(y2);
                    var uy = parseInt(y1);
                }

                // Limits
                var borderLeft = null;
                var borderRight = null;
                var borderTop = null;
                var borderBottom = null;

                // Vertical limits
                for (var j = py; j <= uy; j++) {
                    if (obj.rows[j].style.display != 'none') {
                        if (borderTop == null) {
                            borderTop = j;
                        }
                        borderBottom = j;
                    }
                }

                // Redefining styles
                for (var i = px; i <= ux; i++) {
                    for (var j = py; j <= uy; j++) {
                        if (obj.rows[j].style.display != 'none' && obj.records[j][i].style.display != 'none') {
                            obj.records[j][i].classList.add('highlight');
                            obj.highlighted.push(obj.records[j][i]);
                        }
                    }

                    // Horizontal limits
                    if (borderLeft == null) {
                        borderLeft = i;
                    }
                    borderRight = i;
                }

                // Create borders
                if (! borderLeft) {
                    borderLeft = 0;
                }
                if (! borderRight) {
                    borderRight = 0;
                }
                for (var i = borderLeft; i <= borderRight; i++) {
                    // Top border
                    if (obj.records[borderTop] && obj.records[borderTop][i]) {
                        obj.records[borderTop][i].classList.add('highlight-top');
                    }
                    // Bottom border
                    if (obj.records[borderBottom] && obj.records[borderBottom][i]) {
                        obj.records[borderBottom][i].classList.add('highlight-bottom');
                    }
                    // Add selected from headers
                    obj.headers[i].classList.add('selected');
                }

                for (var j = borderTop; j <= borderBottom; j++) {
                    if (obj.rows[j] && obj.rows[j].style.display != 'none') {
                        // Left border
                        obj.records[j][borderLeft].classList.add('highlight-left');
                        // Right border
                        obj.records[j][borderRight].classList.add('highlight-right');
                        // Add selected from rows
                        obj.rows[j].classList.add('selected');
                    }
                }

                obj.selectedContainer = [ borderLeft, borderTop, borderRight, borderBottom ];
            }

            // Handle events
            if (previousState == 0) {
                obj.dispatch('onfocus', element);

                obj.removeCopyingSelection();
            }

            obj.dispatch('onselection', element, borderLeft, borderTop, borderRight, borderBottom, origin);

            // Find corner cell
            obj.updateCornerPosition();
        }

        /**
         * Remove copy selection
         *
         * @return void
         */
        obj.removeCopySelection = function() {
            // Remove current selection
            for (var i = 0; i < obj.selection.length; i++) {
                obj.selection[i].classList.remove('selection');
                obj.selection[i].classList.remove('selection-left');
                obj.selection[i].classList.remove('selection-right');
                obj.selection[i].classList.remove('selection-top');
                obj.selection[i].classList.remove('selection-bottom');
            }

            obj.selection = [];
        }

        /**
         * Update copy selection
         *
         * @param int x, y
         * @return void
         */
        obj.updateCopySelection = function(x3, y3) {
            // Remove selection
            obj.removeCopySelection();

            // Get elements first and last
            var x1 = obj.selectedContainer[0];
            var y1 = obj.selectedContainer[1];
            var x2 = obj.selectedContainer[2];
            var y2 = obj.selectedContainer[3];

            if (x3 != null && y3 != null) {
                if (x3 - x2 > 0) {
                    var px = parseInt(x2) + 1;
                    var ux = parseInt(x3);
                } else {
                    var px = parseInt(x3);
                    var ux = parseInt(x1) - 1;
                }

                if (y3 - y2 > 0) {
                    var py = parseInt(y2) + 1;
                    var uy = parseInt(y3);
                } else {
                    var py = parseInt(y3);
                    var uy = parseInt(y1) - 1;
                }

                if (ux - px <= uy - py) {
                    var px = parseInt(x1);
                    var ux = parseInt(x2);
                } else {
                    var py = parseInt(y1);
                    var uy = parseInt(y2);
                }

                for (var j = py; j <= uy; j++) {
                    for (var i = px; i <= ux; i++) {
                        if (obj.records[j][i] && obj.rows[j].style.display != 'none' && obj.records[j][i].style.display != 'none') {
                            obj.records[j][i].classList.add('selection');
                            obj.records[py][i].classList.add('selection-top');
                            obj.records[uy][i].classList.add('selection-bottom');
                            obj.records[j][px].classList.add('selection-left');
                            obj.records[j][ux].classList.add('selection-right');

                            // Persist selected elements
                            obj.selection.push(obj.records[j][i]);
                        }
                    }
                }
            }
        }

        /**
         * Update corner position
         *
         * @return void
         */
        obj.updateCornerPosition = function() {
            // If any selected cells
            if (! obj.highlighted.length) {
                obj.corner.style.top = '-2000px';
                obj.corner.style.left = '-2000px';
            } else {
                // Get last cell
                var last = obj.highlighted[obj.highlighted.length-1];

                var contentRect = obj.content.getBoundingClientRect();
                var x1 = contentRect.left;
                var y1 = contentRect.top;

                var lastRect = last.getBoundingClientRect();
                var x2 = lastRect.left;
                var y2 = lastRect.top;
                var w2 = lastRect.width;
                var h2 = lastRect.height;

                var x = (x2 - x1) + obj.content.scrollLeft + w2 - 4;
                var y = (y2 - y1) + obj.content.scrollTop + h2 - 4;

                // Place the corner in the correct place
                obj.corner.style.top = y + 'px';
                obj.corner.style.left = x + 'px';

                if (obj.options.freezeColumns) {
                    var width = obj.getFreezeWidth();
                    if (x2 - x1 + w2 < width) {
                        obj.corner.style.display = 'none';
                    } else {
                        if (obj.options.selectionCopy == true) {
                            obj.corner.style.display = '';
                        }
                    }
                } else {
                    if (obj.options.selectionCopy == true) {
                        obj.corner.style.display = '';
                    }
                }
            }
        }

        /**
         * Update scroll position based on the selection
         */
        obj.updateScroll = function(direction) {
            // jsTable Container information
            var contentRect = obj.content.getBoundingClientRect();
            var x1 = contentRect.left;
            var y1 = contentRect.top;
            var w1 = contentRect.width;
            var h1 = contentRect.height;

            // Direction Left or Up
            var reference = obj.records[obj.selectedCell[3]][obj.selectedCell[2]];

            // Reference
            var referenceRect = reference.getBoundingClientRect();
            var x2 = referenceRect.left;
            var y2 = referenceRect.top;
            var w2 = referenceRect.width;
            var h2 = referenceRect.height;

            // Direction
            if (direction == 0 || direction == 1) {
                var x = (x2 - x1) + obj.content.scrollLeft;
                var y = (y2 - y1) + obj.content.scrollTop - 2;
            } else {
                var x = (x2 - x1) + obj.content.scrollLeft + w2;
                var y = (y2 - y1) + obj.content.scrollTop + h2;
            }

            // Top position check
            if (y > (obj.content.scrollTop + 30) && y < (obj.content.scrollTop + h1)) {
                // In the viewport
            } else {
                // Out of viewport
                if (y < obj.content.scrollTop + 30) {
                    obj.content.scrollTop = y - h2;
                } else {
                    obj.content.scrollTop = y - (h1 - 2);
                }
            }

            // Freeze columns?
            var freezed = obj.getFreezeWidth();

            // Left position check
            if (x > (obj.content.scrollLeft + freezed) && x < (obj.content.scrollLeft + w1)) {
                // In the viewport
            } else {
                // Out of viewport
                if (x < obj.content.scrollLeft + 30) {
                    obj.content.scrollLeft = x;
                    if (obj.content.scrollLeft < 50) {
                        obj.content.scrollLeft = 0;
                    }
                } else if (x < obj.content.scrollLeft + freezed) {
                    obj.content.scrollLeft = x - freezed - 1;
                } else {
                    obj.content.scrollLeft = x - (w1 - 20);
                }
            }
        }

        /**
         * Get the column width
         *
         * @param int column column number (first column is: 0)
         * @return int current width
         */
        obj.getWidth = function(column) {
            if (! column) {
                // Get all headers
                var data = [];
                for (var i = 0; i < obj.headers.length; i++) {
                    data.push(obj.options.columns[i].width);
                }
            } else {
                // In case the column is an object
                if (typeof(column) == 'object') {
                    column = $(column).getAttribute('data-x');
                }

                data = obj.colgroup[column].getAttribute('width')
            }

            return data;
        }


        /**
         * Set the column width
         *
         * @param int column number (first column is: 0)
         * @param int new column width
         * @param int old column width
         */
        obj.setWidth = function (column, width, oldWidth) {
            if (width) {
                if (Array.isArray(column)) {
                    // Oldwidth
                    if (! oldWidth) {
                        var oldWidth = [];
                    }
                    // Set width
                    for (var i = 0; i < column.length; i++) {
                        if (! oldWidth[i]) {
                            oldWidth[i] = obj.colgroup[column[i]].getAttribute('width');
                        }
                        var w = Array.isArray(width) && width[i] ? width[i] : width;
                        obj.colgroup[column[i]].setAttribute('width', w);
                        obj.options.columns[column[i]].width = w;
                    }
                } else {
                    // Oldwidth
                    if (! oldWidth) {
                        oldWidth = obj.colgroup[column].getAttribute('width');
                    }
                    // Set width
                    obj.colgroup[column].setAttribute('width', width);
                    obj.options.columns[column].width = width;
                }

                // Keeping history of changes
                obj.setHistory({
                    action:'setWidth',
                    column:column,
                    oldValue:oldWidth,
                    newValue:width,
                });

                // On resize column
                obj.dispatch('onresizecolumn', element, column, width, oldWidth);

                // Update corner position
                obj.updateCornerPosition();
            }
        }

        /**
         * Set the row height
         *
         * @param row - row number (first row is: 0)
         * @param height - new row height
         * @param oldHeight - old row height
         */
        obj.setHeight = function (row, height, oldHeight) {
            if (height > 0) {
                // In case the column is an object
                if (typeof(row) == 'object') {
                    row = row.getAttribute('data-y');
                }

                // Oldwidth
                if (! oldHeight) {
                    oldHeight = obj.rows[row].getAttribute('height');

                    if (! oldHeight) {
                        var rect = obj.rows[row].getBoundingClientRect();
                        oldHeight = rect.height;
                    }
                }

                // Integer
                height = parseInt(height);

                // Set width
                obj.rows[row].style.height = height + 'px';

                // Keep options updated
                if (! obj.options.rows[row]) {
                    obj.options.rows[row] = {};
                }
                obj.options.rows[row].height = height;

                // Keeping history of changes
                obj.setHistory({
                    action:'setHeight',
                    row:row,
                    oldValue:oldHeight,
                    newValue:height,
                });

                // On resize column
                obj.dispatch('onresizerow', element, row, height, oldHeight);

                // Update corner position
                obj.updateCornerPosition();
            }
        }

        /**
         * Get the row height
         *
         * @param row - row number (first row is: 0)
         * @return height - current row height
         */
        obj.getHeight = function(row) {
            if (! row) {
                // Get height of all rows
                var data = [];
                for (var j = 0; j < obj.rows.length; j++) {
                    var h = obj.rows[j].style.height;
                    if (h) {
                        data[j] = h;
                    }
                }
            } else {
                // In case the row is an object
                if (typeof(row) == 'object') {
                    row = $(row).getAttribute('data-y');
                }

                var data = obj.rows[row].style.height;
            }

            return data;
        }

        /**
         * Get the column title
         *
         * @param column - column number (first column is: 0)
         * @param title - new column title
         */
        obj.getHeader = function(column) {
            return obj.headers[column].innerText;
        }

        /**
         * Set the column title
         *
         * @param {number} column - column number (first column is: 0)
         * @param {string} newValue - new column title
         */
        obj.setHeader = function(column, inValue) {
            if (obj.headers[column]) {
                let oldValue = obj.headers[column].innerText;

                let newValue = inValue ? inValue : prompt(obj.options.text.columnName, oldValue);

                if (newValue) {
                    newValue = newValue.toUpperCase();

                    let duplicate = false;
                    for (let i = 0; i < obj.headers.length; ++i) {
                        if ((i !== column) && (newValue === obj.headers[i].innerText)) {
                            duplicate = true;
                        }
                    }

                    if (duplicate) {
                        if (! inValue) {
                            alert('There is already a header with the title "' + newValue + '".')
                        }
                        newValue = oldValue;
                    }

                    obj.headers[column].innerText = newValue;
                    // Keep the title property
                    obj.headers[column].setAttribute('title', newValue);
                    // Update title
                    obj.options.columns[column].title = newValue;
                }

                obj.setHistory({
                    action: 'setHeader',
                    column: column,
                    oldValue: oldValue,
                    newValue: newValue
                });

                // On onchange header
                obj.dispatch('onchangeheader', element, column, oldValue, newValue);
            }
        }

        /**
         * Get the headers
         *
         * @param {bool} asArray - Returns the headers as an array, or as a string
         * @return {[]|string} - An array or a joined string with the names of the headers
         */
        obj.getHeaders = function (asArray) {
            let title = [];

            for (let i = 0; i < obj.headers.length; ++i) {
                title.push(obj.getHeader(i));
            }

            return asArray ? title : title.join(obj.options.csvDelimiter);
        }

        /**
         * Get meta information from cell(s)
         *
         * @return integer
         */
        obj.getMeta = function(cell, key) {
            if (! cell) {
                return obj.options.meta;
            } else {
                if (key) {
                    return obj.options.meta[cell] && obj.options.meta[cell][key] ? obj.options.meta[cell][key] : null;
                } else {
                    return obj.options.meta[cell] ? obj.options.meta[cell] : null;
                }
            }
        }

        /**
         * Set meta information to cell(s)
         *
         * @return integer
         */
        obj.setMeta = function(o, k, v) {
            if (! obj.options.meta) {
                obj.options.meta = {}
            }

            if (k && v) {
                // Set data value
                if (! obj.options.meta[o]) {
                    obj.options.meta[o] = {};
                }
                obj.options.meta[o][k] = v;
            } else {
                // Apply that for all cells
                var keys = Object.keys(o);
                for (var i = 0; i < keys.length; i++) {
                    if (! obj.options.meta[keys[i]]) {
                        obj.options.meta[keys[i]] = {};
                    }

                    var prop = Object.keys(o[keys[i]]);
                    for (var j = 0; j < prop.length; j++) {
                        obj.options.meta[keys[i]][prop[j]] = o[keys[i]][prop[j]];
                    }
                }
            }

            obj.dispatch('onchangemeta', element, o, k, v);
        }

        /**
         * Update meta information
         *
         * @return integer
         */
        obj.updateMeta = function(affectedCells) {
            if (obj.options.meta) {
                var newMeta = {};
                var keys = Object.keys(obj.options.meta);
                for (var i = 0; i < keys.length; i++) {
                    if (affectedCells[keys[i]]) {
                        newMeta[affectedCells[keys[i]]] = obj.options.meta[keys[i]];
                    } else {
                        newMeta[keys[i]] = obj.options.meta[keys[i]];
                    }
                }
                // Update meta information
                obj.options.meta = newMeta;
            }
        }

        /**
         * Get style information from cell(s)
         *
         * @return integer
         */
        obj.getStyle = function(cell, key) {
            // Cell
            if (! cell) {
                // Control vars
                var data = {};

                // Column and row length
                var x = obj.options.data[0].length;
                var y = obj.options.data.length;

                // Go through the columns to get the data
                for (var j = 0; j < y; j++) {
                    for (var i = 0; i < x; i++) {
                        // Value
                        var v = key ? obj.records[j][i].style[key] : obj.records[j][i].getAttribute('style');

                        // Any meta data for this column?
                        if (v) {
                            // Column name
                            var k = jsTable.getColumnNameFromId([i, j]);
                            // Value
                            data[k] = v;
                        }
                    }
                }

               return data;
            } else {
                cell = jsTable.getIdFromColumnName(cell, true);

                return key ? obj.records[cell[1]][cell[0]].style[key] : obj.records[cell[1]][cell[0]].getAttribute('style');
            }
        }

        obj.resetStyle = function(o, ignoreHistoryAndEvents) {
            var keys = Object.keys(o);
            for (var i = 0; i < keys.length; i++) {
                // Position
                var cell = jsTable.getIdFromColumnName(keys[i], true);
                if (obj.records[cell[1]] && obj.records[cell[1]][cell[0]]) {
                    obj.records[cell[1]][cell[0]].setAttribute('style', '');
                }
            }
            obj.setStyle(o, null, null, null, ignoreHistoryAndEvents);
        }

        /**
         * Set meta information to cell(s)
         *
         * @return integer
         */
        obj.setStyle = function(o, k, v, force, ignoreHistoryAndEvents) {
            var newValue = {};
            var oldValue = {};

            // Apply style
            var applyStyle = function(cellId, key, value) {
                // Position
                var cell = jsTable.getIdFromColumnName(cellId, true);

                if (obj.records[cell[1]] && obj.records[cell[1]][cell[0]] && (obj.records[cell[1]][cell[0]].classList.contains('readonly')==false || force)) {
                    // Current value
                    var currentValue = obj.records[cell[1]][cell[0]].style[key];

                    // Change layout
                    if (currentValue == value && ! force) {
                        value = '';
                        obj.records[cell[1]][cell[0]].style[key] = '';
                    } else {
                        obj.records[cell[1]][cell[0]].style[key] = value;
                    }

                    // History
                    if (! oldValue[cellId]) {
                        oldValue[cellId] = [];
                    }
                    if (! newValue[cellId]) {
                        newValue[cellId] = [];
                    }

                    oldValue[cellId].push([key + ':' + currentValue]);
                    newValue[cellId].push([key + ':' + value]);
                }
            }

            if (k && v) {
                // Get object from string
                if (typeof(o) == 'string') {
                    applyStyle(o, k, v);
                } else {
                    // Avoid duplications
                    var oneApplication = [];
                    // Apply that for all cells
                    for (var i = 0; i < o.length; i++) {
                        var x = o[i].getAttribute('data-x');
                        var y = o[i].getAttribute('data-y');
                        var cellName = jsTable.getColumnNameFromId([x, y]);

                        // This happens when is a merged cell
                        if (! oneApplication[cellName]) {
                            applyStyle(cellName, k, v);
                            oneApplication[cellName] = true;
                        }
                    }
                }
            } else {
                var keys = Object.keys(o);
                for (var i = 0; i < keys.length; i++) {
                    var style = o[keys[i]];
                    if (typeof(style) == 'string') {
                        style = style.split(';');
                    }
                    for (var j = 0; j < style.length; j++) {
                        if (typeof(style[j]) == 'string') {
                            style[j] = style[j].split(':');
                        }
                        // Apply value
                        if (style[j][0].trim()) {
                            applyStyle(keys[i], style[j][0].trim(), style[j][1]);
                        }
                    }
                }
            }

            var keys = Object.keys(oldValue);
            for (var i = 0; i < keys.length; i++) {
                oldValue[keys[i]] = oldValue[keys[i]].join(';');
            }
            var keys = Object.keys(newValue);
            for (var i = 0; i < keys.length; i++) {
                newValue[keys[i]] = newValue[keys[i]].join(';');
            }

            if (! ignoreHistoryAndEvents) {
                // Keeping history of changes
                obj.setHistory({
                    action: 'setStyle',
                    oldValue: oldValue,
                    newValue: newValue,
                });
            }

            obj.dispatch('onchangestyle', element, o, k, v);
        }

        /**
         * Get table config information
         */
        obj.getConfig = function() {
            var options = obj.options;
            options.style = obj.getStyle();

            return options;
        }

        /**
         * Sort data and reload table
         */
        obj.orderBy = function(column, order) {
            if (column >= 0) {
                // Direction
                if (order == null) {
                    order = obj.headers[column].classList.contains('arrow-down') ? 1 : 0;
                } else {
                    order = order ? 1 : 0;
                }

                // Test order
                var temp = [];
                for (var j = 0; j < obj.options.data.length; j++) {
                    temp[j] = [ j, obj.records[j][column].innerText.toLowerCase() ];
                }

                // Default sorting method
                if (typeof(obj.options.sorting) !== 'function') {
                    obj.options.sorting = function(direction) {
                        return function(a, b) {
                            var valueA = a[1];
                            var valueB = b[1];

                            if (! direction) {
                                return (valueA === '' && valueB !== '') ? 1 : (valueA !== '' && valueB === '') ? -1 : (valueA > valueB) ? 1 : (valueA < valueB) ? -1 :  0;
                            } else {
                                return (valueA === '' && valueB !== '') ? 1 : (valueA !== '' && valueB === '') ? -1 : (valueA > valueB) ? -1 : (valueA < valueB) ? 1 :  0;
                            }
                        }
                    }
                }

                temp = temp.sort(obj.options.sorting(order));

                // Save history
                var newValue = [];
                for (var j = 0; j < temp.length; j++) {
                    newValue[j] = temp[j][0];
                }

                // Save history
                obj.setHistory({
                    action: 'orderBy',
                    rows: newValue,
                    column: column,
                    order: order,
                });

                // Update order
                obj.updateOrderArrow(column, order);
                obj.updateOrder(newValue);

                // On sort event
                obj.dispatch('onsort', element, column, order);

                return true;
            }
        }

        /**
         * Update order arrow
         */
        obj.updateOrderArrow = function(column, order) {
            // Remove order
            for (var i = 0; i < obj.headers.length; i++) {
                obj.headers[i].classList.remove('arrow-up');
                obj.headers[i].classList.remove('arrow-down');
            }

            // No order specified then toggle order
            if (order) {
                obj.headers[column].classList.add('arrow-up');
            } else {
                obj.headers[column].classList.add('arrow-down');
            }
        }

        /**
         * Update rows position
         */
        obj.updateOrder = function(rows) {
            // History
            var data = []
            for (var j = 0; j < rows.length; j++) {
                data[j] = obj.options.data[rows[j]];
            }
            obj.options.data = data;

            var data = []
            for (var j = 0; j < rows.length; j++) {
                data[j] = obj.records[rows[j]];
            }
            obj.records = data;

            var data = []
            for (var j = 0; j < rows.length; j++) {
                data[j] = obj.rows[rows[j]];
            }
            obj.rows = data;

            // Update references
            obj.updateTableReferences();

            // Redo search
            if (obj.results && obj.results.length) {
                if (obj.searchInput.value) {
                    obj.search(obj.searchInput.value);
                }
            } else {
                // Create page
                obj.results = null;
                obj.pageNumber = 0;

                if (obj.options.pagination > 0) {
                    obj.page(0);
                } else {
                    for (var j = 0; j < obj.rows.length; j++) {
                        obj.tbody.appendChild(obj.rows[j]);
                    }
                }
            }
        }

        /**
         * Move row
         *
         * @return void
         */
        obj.moveRow = function(o, d, ignoreDom) {
            if (obj.options.search == true) {
                if (obj.results && obj.results.length != obj.rows.length) {
                    if (confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)) {
                        obj.resetSearch();
                    } else {
                        return false;
                    }
                }

                obj.results = null;
            }

            if (! ignoreDom) {
                if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[d]) >= 0) {
                    if (o > d) {
                        obj.tbody.insertBefore(obj.rows[o], obj.rows[d]);
                    } else {
                        obj.tbody.insertBefore(obj.rows[o], obj.rows[d].nextSibling);
                    }
                } else {
                    obj.tbody.removeChild(obj.rows[o]);
                }
            }

            // Place references in the correct position
            obj.rows.splice(d, 0, obj.rows.splice(o, 1)[0]);
            obj.records.splice(d, 0, obj.records.splice(o, 1)[0]);
            obj.options.data.splice(d, 0, obj.options.data.splice(o, 1)[0]);

            // Respect pagination
            if (obj.options.pagination > 0 && obj.tbody.children.length != obj.options.pagination) {
                obj.page(obj.pageNumber);
            }

            // Keeping history of changes
            obj.setHistory({
                action:'moveRow',
                oldValue: o,
                newValue: d,
            });

            // Update table references
            obj.updateTableReferences();

            // Events
            obj.dispatch('onmoverow', element, o, d);
        }

        /**
         * Insert a new row
         *
         * @param mixed - number of blank lines to be insert or a single array with the data of the new row
         * @param rowNumber
         * @param insertBefore
         * @return void
         */
        obj.insertRow = function(mixed, rowNumber, insertBefore) {
            // Configuration
            if (obj.options.allowInsertRow == true) {
                // Records
                var records = [];

                // Data to be insert
                var data = [];

                // The insert could be lead by number of rows or the array of data
                if (mixed > 0) {
                    var numOfRows = mixed;
                } else {
                    var numOfRows = 1;

                    if (mixed) {
                        data = mixed;
                    }
                }

                // Direction
                var insertBefore = insertBefore ? true : false;

                // Current column number
                var lastRow = obj.options.data.length - 1;

                if (rowNumber == undefined || rowNumber >= parseInt(lastRow) || rowNumber < 0) {
                    rowNumber = lastRow;
                }

                // Onbeforeinsertrow
                if (obj.dispatch('onbeforeinsertrow', element, rowNumber, numOfRows, insertBefore) === false) {
                    console.log('onbeforeinsertrow returned false');

                    return false;
                }

                // Clear any search
                if (obj.options.search == true) {
                    if (obj.results && obj.results.length != obj.rows.length) {
                        if (confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)) {
                            obj.resetSearch();
                        } else {
                            return false;
                        }
                    }

                    obj.results = null;
                }

                // Insertbefore
                var rowIndex = (! insertBefore) ? rowNumber + 1 : rowNumber;

                // Keep the current data
                var currentRecords = obj.records.splice(rowIndex);
                var currentData = obj.options.data.splice(rowIndex);
                var currentRows = obj.rows.splice(rowIndex);

                // Adding lines
                var rowRecords = [];
                var rowData = [];
                var rowNode = [];

                for (var row = rowIndex; row < (numOfRows + rowIndex); row++) {
                    // Push data to the data container
                    obj.options.data[row] = [];
                    for (var col = 0; col < obj.options.columns.length; col++) {
                        obj.options.data[row][col]  = data[col] ? data[col] : '';
                    }
                    // Create row
                    var tr = obj.createRow(row, obj.options.data[row]);
                    // Append node
                    if (currentRows[0]) {
                        if (Array.prototype.indexOf.call(obj.tbody.children, currentRows[0]) >= 0) {
                            obj.tbody.insertBefore(tr, currentRows[0]);
                        }
                    } else {
                        if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[rowNumber]) >= 0) {
                            obj.tbody.appendChild(tr);
                        }
                    }
                    // Record History
                    rowRecords.push(obj.records[row]);
                    rowData.push(obj.options.data[row]);
                    rowNode.push(tr);
                }

                // Copy the data back to the main data
                Array.prototype.push.apply(obj.records, currentRecords);
                Array.prototype.push.apply(obj.options.data, currentData);
                Array.prototype.push.apply(obj.rows, currentRows);

                // Respect pagination
                if (obj.options.pagination > 0) {
                    obj.page(obj.pageNumber);
                }

                // Keep history
                obj.setHistory({
                    action: 'insertRow',
                    rowNumber: rowNumber,
                    numOfRows: numOfRows,
                    insertBefore: insertBefore,
                    rowRecords: rowRecords,
                    rowData: rowData,
                    rowNode: rowNode,
                });

                // Remove table references
                obj.updateTableReferences();

                // Events
                obj.dispatch('oninsertrow', element, rowNumber, numOfRows, rowRecords, insertBefore);
            }
        }

        /**
         * Delete a row by number
         *
         * @param integer rowNumber - row number to be excluded
         * @param integer numOfRows - number of lines
         * @return void
         */
        obj.deleteRow = function(rowNumber, numOfRows) {
            // Global Configuration
            if (obj.options.allowDeleteRow == true) {
                if (obj.options.allowDeletingAllRows == true || obj.options.data.length > 1) {
                    // Delete row definitions
                    if (rowNumber == undefined) {
                        var number = obj.getSelectedRows();

                        if (! number[0]) {
                            rowNumber = obj.options.data.length - 1;
                            numOfRows = 1;
                        } else {
                            rowNumber = parseInt(number[0].getAttribute('data-y'));
                            numOfRows = number.length;
                        }
                    }

                    // Last column
                    var lastRow = obj.options.data.length - 1;

                    if (rowNumber == undefined || rowNumber > lastRow || rowNumber < 0) {
                        rowNumber = lastRow;
                    }

                    if (! numOfRows) {
                        numOfRows = 1;
                    }

                    // Do not delete more than the number of recoreds
                    if (rowNumber + numOfRows >= obj.options.data.length) {
                        numOfRows = obj.options.data.length - rowNumber;
                    }

                    // Onbeforedeleterow
                    if (obj.dispatch('onbeforedeleterow', element, rowNumber, numOfRows) === false) {
                        console.log('onbeforedeleterow returned false');
                        return false;
                    }

                    if (parseInt(rowNumber) > -1) {
                        // Clear any search
                        if (obj.options.search == true) {
                            if (obj.results && obj.results.length != obj.rows.length) {
                                if (confirm(obj.options.text.thisActionWillClearYourSearchResultsAreYouSure)) {
                                    obj.resetSearch();
                                } else {
                                    return false;
                                }
                            }

                            obj.results = null;
                        }

                        // If delete all rows, and set allowDeletingAllRows false, will stay one row
                        if (! obj.options.allowDeletingAllRows && lastRow + 1 === numOfRows) {
                            numOfRows--;
                            console.error('jsTable: It is not possible to delete the last row');
                        }

                        // Remove node
                        for (var row = rowNumber; row < rowNumber + numOfRows; row++) {
                            if (Array.prototype.indexOf.call(obj.tbody.children, obj.rows[row]) >= 0) {
                                obj.rows[row].className = '';
                                obj.rows[row].parentNode.removeChild(obj.rows[row]);
                            }
                        }

                        // Remove data
                        var rowRecords = obj.records.splice(rowNumber, numOfRows);
                        var rowData = obj.options.data.splice(rowNumber, numOfRows);
                        var rowNode = obj.rows.splice(rowNumber, numOfRows);

                        // Respect pagination
                        if (obj.options.pagination > 0 && obj.tbody.children.length !== obj.options.pagination) {
                            obj.page(obj.pageNumber);
                        }

                        // Remove selection
                        obj.conditionalSelectionUpdate(1, rowNumber, (rowNumber + numOfRows) - 1);

                        // Keep history
                        obj.setHistory({
                            action: 'deleteRow',
                            rowNumber: rowNumber,
                            numOfRows: numOfRows,
                            insertBefore: 1,
                            rowRecords: rowRecords,
                            rowData: rowData,
                            rowNode: rowNode
                        });

                        // Remove table references
                        obj.updateTableReferences();

                        // Events
                        obj.dispatch('ondeleterow', element, rowNumber, numOfRows, rowRecords);
                    }
                } else {
                    console.error('jsTable: It is not possible to delete the last row');
                }
            }
        }

        /**
         * Move column
         *
         * @return void
         */
        obj.moveColumn = function(o, d) {
            var o = parseInt(o);
            var d = parseInt(d);

            if (o > d) {
                obj.headerContainer.insertBefore(obj.headers[o], obj.headers[d]);
                obj.colgroupContainer.insertBefore(obj.colgroup[o], obj.colgroup[d]);

                for (var j = 0; j < obj.rows.length; j++) {
                    obj.rows[j].insertBefore(obj.records[j][o], obj.records[j][d]);
                }
            } else {
                obj.headerContainer.insertBefore(obj.headers[o], obj.headers[d].nextSibling);
                obj.colgroupContainer.insertBefore(obj.colgroup[o], obj.colgroup[d].nextSibling);

                for (var j = 0; j < obj.rows.length; j++) {
                    obj.rows[j].insertBefore(obj.records[j][o], obj.records[j][d].nextSibling);
                }
            }

            obj.options.columns.splice(d, 0, obj.options.columns.splice(o, 1)[0]);
            obj.headers.splice(d, 0, obj.headers.splice(o, 1)[0]);
            obj.colgroup.splice(d, 0, obj.colgroup.splice(o, 1)[0]);

            for (var j = 0; j < obj.rows.length; j++) {
                obj.options.data[j].splice(d, 0, obj.options.data[j].splice(o, 1)[0]);
                obj.records[j].splice(d, 0, obj.records[j].splice(o, 1)[0]);
            }

            // Keeping history of changes
            obj.setHistory({
                action:'moveColumn',
                oldValue: o,
                newValue: d,
            });

            // Update table references
            obj.updateTableReferences();

            // Events
            obj.dispatch('onmovecolumn', element, o, d);
        }

        /**
         * Insert a new column
         *
         * @param mixed - num of columns to be added or data to be added in one single column
         * @param int columnNumber - number of columns to be created
         * @param bool insertBefore
         * @param object properties - column properties
         * @return void
         */
        obj.insertColumn = function(mixed, columnNumber, insertBefore, properties) {
            // Configuration
            if (obj.options.allowInsertColumn == true) {
                // Records
                var records = [];

                // Data to be insert
                var data = [];

                // The insert could be lead by number of rows or the array of data
                if (mixed > 0) {
                    var numOfColumns = mixed;
                } else {
                    var numOfColumns = 1;

                    if (mixed) {
                        data = mixed;
                    }
                }

                // Direction
                var insertBefore = insertBefore ? true : false;

                // Current column number
                var lastColumn = obj.options.columns.length - 1;

                // Confirm position
                if (columnNumber == undefined || columnNumber >= parseInt(lastColumn) || columnNumber < 0) {
                    columnNumber = lastColumn;
                }

                // Onbeforeinsertcolumn
                if (obj.dispatch('onbeforeinsertcolumn', element, columnNumber, numOfColumns, insertBefore) === false) {
                    console.log('onbeforeinsertcolumn returned false');

                    return false;
                }

                // Create default properties
                if (! properties) {
                    properties = [];
                }

                for (var i = 0; i < numOfColumns; i++) {
                    if (! properties[i]) {
                        properties[i] = { type:'text', source:[], options:[], width:obj.options.defaultColWidth, align:obj.options.defaultColAlign };
                    }
                }

                // Insert before
                var columnIndex = (! insertBefore) ? columnNumber + 1 : columnNumber;
                obj.options.columns = jsTable.injectArray(obj.options.columns, columnIndex, properties);

                // Open space in the containers
                var currentHeaders = obj.headers.splice(columnIndex);
                var currentColgroup = obj.colgroup.splice(columnIndex);

                // History
                var historyHeaders = [];
                var historyColgroup = [];
                var historyRecords = [];
                var historyData = [];

                // Add new headers
                for (var col = columnIndex; col < (numOfColumns + columnIndex); col++) {
                    obj.createCellHeader(col);
                    obj.headerContainer.insertBefore(obj.headers[col], obj.headerContainer.children[col+1]);
                    obj.colgroupContainer.insertBefore(obj.colgroup[col], obj.colgroupContainer.children[col+1]);

                    historyHeaders.push(obj.headers[col]);
                    historyColgroup.push(obj.colgroup[col]);
                }

                // Adding visual columns
                for (var row = 0; row < obj.options.data.length; row++) {
                    // Keep the current data
                    var currentData = obj.options.data[row].splice(columnIndex);
                    var currentRecord = obj.records[row].splice(columnIndex);

                    // History
                    historyData[row] = [];
                    historyRecords[row] = [];

                    for (var col = columnIndex; col < (numOfColumns + columnIndex); col++) {
                        // New value
                        var value = data[row] ? data[row] : '';
                        obj.options.data[row][col] = value;
                        // New cell
                        var td = obj.createCell(col, row, obj.options.data[row][col]);
                        obj.records[row][col] = td;
                        // Add cell to the row
                        if (obj.rows[row]) {
                            obj.rows[row].insertBefore(td, obj.rows[row].children[col+1]);
                        }

                        // Record History
                        historyData[row].push(value);
                        historyRecords[row].push(td);
                    }

                    // Copy the data back to the main data
                    Array.prototype.push.apply(obj.options.data[row], currentData);
                    Array.prototype.push.apply(obj.records[row], currentRecord);
                }

                Array.prototype.push.apply(obj.headers, currentHeaders);
                Array.prototype.push.apply(obj.colgroup, currentColgroup);

                // Keep history
                obj.setHistory({
                    action: 'insertColumn',
                    columnNumber:columnNumber,
                    numOfColumns:numOfColumns,
                    insertBefore:insertBefore,
                    columns:properties,
                    headers:historyHeaders,
                    colgroup:historyColgroup,
                    records:historyRecords,
                    data:historyData,
                });

                // Remove table references
                obj.updateTableReferences();

                // Events
                obj.dispatch('oninsertcolumn', element, columnNumber, numOfColumns, historyRecords, insertBefore);
            }
        }

        /**
         * Delete a column by number
         *
         * @param integer columnNumber - reference column to be excluded
         * @param integer numOfColumns - number of columns to be excluded from the reference column
         * @return void
         */
        obj.deleteColumn = function(columnNumber, numOfColumns) {
            // Global Configuration
            if (obj.options.allowDeleteColumn == true) {
                if (obj.headers.length > 1) {
                    // Delete column definitions
                    if (columnNumber == undefined) {
                        var number = obj.getSelectedColumns(true);

                        if (! number.length) {
                            // Remove last column
                            columnNumber = obj.headers.length - 1;
                            numOfColumns = 1;
                        } else {
                            // Remove selected
                            columnNumber = parseInt(number[0]);
                            numOfColumns = parseInt(number.length);
                        }
                    }

                    // Lasat column
                    var lastColumn = obj.options.data[0].length - 1;

                    if (columnNumber == undefined || columnNumber > lastColumn || columnNumber < 0) {
                        columnNumber = lastColumn;
                    }

                    // Minimum of columns to be delete is 1
                    if (! numOfColumns) {
                        numOfColumns = 1;
                    }

                    // Can't delete more than the limit of the table
                    if (numOfColumns > obj.options.data[0].length - columnNumber) {
                        numOfColumns = obj.options.data[0].length - columnNumber;
                    }

                    // onbeforedeletecolumn
                   if (obj.dispatch('onbeforedeletecolumn', element, columnNumber, numOfColumns) === false) {
                      console.log('onbeforedeletecolumn returned false');
                      return false;
                   }

                    // Can't remove the last column
                    if (parseInt(columnNumber) > -1) {
                        // Delete the column properties
                        var columns = obj.options.columns.splice(columnNumber, numOfColumns);

                        for (var col = columnNumber; col < columnNumber + numOfColumns; col++) {
                            obj.colgroup[col].className = '';
                            obj.headers[col].className = '';
                            obj.colgroup[col].parentNode.removeChild(obj.colgroup[col]);
                            obj.headers[col].parentNode.removeChild(obj.headers[col]);
                        }

                        var historyHeaders = obj.headers.splice(columnNumber, numOfColumns);
                        var historyColgroup = obj.colgroup.splice(columnNumber, numOfColumns);
                        var historyRecords = [];
                        var historyData = [];

                        for (var row = 0; row < obj.options.data.length; row++) {
                            for (var col = columnNumber; col < columnNumber + numOfColumns; col++) {
                                obj.records[row][col].className = '';
                                obj.records[row][col].parentNode.removeChild(obj.records[row][col]);
                            }
                        }

                        // Delete headers
                        for (var row = 0; row < obj.options.data.length; row++) {
                            // History
                            historyData[row] = obj.options.data[row].splice(columnNumber, numOfColumns);
                            historyRecords[row] = obj.records[row].splice(columnNumber, numOfColumns);
                        }

                        // Remove selection
                        obj.conditionalSelectionUpdate(0, columnNumber, (columnNumber + numOfColumns) - 1);

                        // Keeping history of changes
                        obj.setHistory({
                            action:'deleteColumn',
                            columnNumber:columnNumber,
                            numOfColumns:numOfColumns,
                            insertBefore: 1,
                            columns:columns,
                            headers:historyHeaders,
                            colgroup:historyColgroup,
                            records:historyRecords,
                            data:historyData,
                        });

                        // Update table references
                        obj.updateTableReferences();

                        // Delete
                        obj.dispatch('ondeletecolumn', element, columnNumber, numOfColumns, historyRecords);
                    }
                } else {
                    console.error('jsTable: It is not possible to delete the last column');
                }
            }
        }

        /**
         * Get seleted rows numbers
         *
         * @return array
         */
        obj.getSelectedRows = function(asIds) {
            var rows = [];
            // Get all selected rows
            for (var j = 0; j < obj.rows.length; j++) {
                if (obj.rows[j].classList.contains('selected')) {
                    if (asIds) {
                        rows.push(j);
                    } else {
                        rows.push(obj.rows[j]);
                    }
                }
            }

            return rows;
        },

        /**
         * Get selected column numbers
         *
         * @return array
         */
        obj.getSelectedColumns = function() {
            var cols = [];
            // Get all selected cols
            for (var i = 0; i < obj.headers.length; i++) {
                if (obj.headers[i].classList.contains('selected')) {
                    cols.push(i);
                }
            }

            return cols;
        }

        /**
         * Get highlighted
         *
         * @return array
         */
        obj.getHighlighted = function() {
            return obj.highlighted;
        }

        /**
         * Update cell references
         *
         * @return void
         */
        obj.updateTableReferences = function() {
            // Update headers
            for (var i = 0; i < obj.headers.length; i++) {
                var x = obj.headers[i].getAttribute('data-x');

                if (x != i) {
                    // Update coords
                    obj.headers[i].setAttribute('data-x', i);
                    // Title
                    if (! obj.headers[i].getAttribute('title')) {
                        obj.headers[i].innerHTML = jsTable.getColumnName(i);
                    }
                }
            }

            // Update all rows
            for (var j = 0; j < obj.rows.length; j++) {
                if (obj.rows[j]) {
                    var y = obj.rows[j].getAttribute('data-y');

                    if (y != j) {
                        // Update coords
                        obj.rows[j].setAttribute('data-y', j);
                        obj.rows[j].children[0].setAttribute('data-y', j);
                        // Row number
                        obj.rows[j].children[0].innerHTML = j + 1;
                    }
                }
            }

            // Regular cells affected by this change
            var affectedTokens = [];

            // Update cell
            var updatePosition = function(x,y,i,j) {
                if (x != i) {
                    obj.records[j][i].setAttribute('data-x', i);
                }
                if (y != j) {
                    obj.records[j][i].setAttribute('data-y', j);
                }

                // Other updates
                if (x != i || y != j) {
                    var columnIdFrom = jsTable.getColumnNameFromId([x, y]);
                    var columnIdTo = jsTable.getColumnNameFromId([i, j]);
                    affectedTokens[columnIdFrom] = columnIdTo;
                }
            }

            for (var j = 0; j < obj.records.length; j++) {
                for (var i = 0; i < obj.records[0].length; i++) {
                    if (obj.records[j][i]) {
                        // Current values
                        var x = obj.records[j][i].getAttribute('data-x');
                        var y = obj.records[j][i].getAttribute('data-y');

                        // Update column
                        updatePosition(x,y,i,j);
                    }
                }
            }

            // Update meta data
            obj.updateMeta(affectedTokens);

            // Refresh selection
            obj.refreshSelection();

            // Update table with custom configuration if applicable
            obj.updateTable();
        }

        /**
         * Custom settings for the cells
         */
        obj.updateTable = function() {
            // Check for spare
            if (obj.options.minSpareRows > 0) {
                let numBlankRows = 0;
                for (let j = obj.rows.length - 1; j >= 0; --j) {
                    let test = false;
                    for (let i = 0; i < obj.headers.length; ++i) {
                        if (obj.options.data[j][i]) {
                            test = true;
                            break /* i-for loop */
                        }
                    }
                    if (test) {
                        break; /* j-for loop */
                    }
                    numBlankRows++;
                }

                if (obj.options.minSpareRows - numBlankRows > 0) {
                    obj.insertRow(obj.options.minSpareRows - numBlankRows)
                }
            }

            if (obj.options.minSpareCols > 0) {
                let numBlankCols = 0;
                for (let i = obj.headers.length - 1; i >= 0 ; --i) {
                    let test = false;
                    for (let j = 0; j < obj.rows.length; ++j) {
                        if (obj.options.data[j][i]) {
                            test = true;
                            break; /* j-for loop */
                        }
                    }
                    if (test) {
                        break; /* i-for loop */
                    }
                    numBlankCols++;
                }

                if (obj.options.minSpareCols - numBlankCols > 0) {
                    obj.insertColumn(obj.options.minSpareCols - numBlankCols)
                }
            }

            // Customizations by the developer
            if (typeof(obj.options.updateTable) === 'function') {
                if (obj.options.detachForUpdates) {
                    element.removeChild(obj.content);
                }

                for (let j = 0; j < obj.rows.length; ++j) {
                    for (let i = 0; i < obj.headers.length; ++i) {
                        obj.options.updateTable(element, obj.records[j][i], i, j, obj.options.data[j][i], obj.records[j][i].innerText, jsTable.getColumnNameFromId([i, j]));
                    }
                }

                if (obj.options.detachForUpdates) {
                    element.insertBefore(obj.content, obj.pagination);
                }
            }

            // Update corner position
            setTimeout(function() {
                obj.updateCornerPosition();
            },0);
        }

        /**
         * Readonly
         */
        obj.isReadOnly = function(cell) {
            if (cell = obj.getCell(cell)) {
                return cell.classList.contains('readonly');
            }
        }

        /**
         * Readonly
         */
        obj.setReadOnly = function(cell, state) {
            if (cell = obj.getCell(cell)) {
                if (state) {
                    cell.classList.add('readonly');
                } else {
                    cell.classList.remove('readonly');
                }
            }
        }

        /**
         * Trying to extract a number from a string
         */
        obj.parseNumber = function(value, columnNumber) {
            // Decimal point
            var decimal = columnNumber && obj.options.columns[columnNumber].decimal ? obj.options.columns[columnNumber].decimal : '.';

            // Parse both parts of the number
            var number = ('' + value);
            number = number.split(decimal);
            number[0] = number[0].match(/[+-]?[0-9]/g);
            if (number[0]) {
                number[0] = number[0].join('');
            }
            if (number[1]) {
                number[1] = number[1].match(/[0-9]*/g).join('');
            }

            // Is a valid number
            if (number[0] && Number(number[0]) >= 0) {
                if (! number[1]) {
                    var value = Number(number[0] + '.00');
                } else {
                    var value = Number(number[0] + '.' + number[1]);
                }
            } else {
                var value = null;
            }

            return value;
        }

        obj.up = function(shiftKey, ctrlKey, altKey) {
            if (altKey) {
                if (obj.selectedCell[0] >= 0) {
                    obj.setHeader(Number(obj.selectedCell[0]));
                }
            }
            if (shiftKey) {
                if (obj.selectedCell[3] > 0) {
                    obj.up.visible(1, ctrlKey ? 0 : 1)
                }
            } else {
                if (obj.selectedCell[1] > 0) {
                    obj.up.visible(0, ctrlKey ? 0 : 1)
                }
                obj.selectedCell[2] = obj.selectedCell[0];
                obj.selectedCell[3] = obj.selectedCell[1];
            }

            // Update selection
            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);

            // Change page
            if (obj.options.pagination > 0) {
                let pageNumber = obj.whichPage(obj.selectedCell[3]);
                if (pageNumber !== obj.pageNumber) {
                    obj.page(pageNumber);
                }
            }

            obj.updateScroll(1);
        }

        obj.up.visible = function(group, direction) {
            if (group == 0) {
                var x = parseInt(obj.selectedCell[0]);
                var y = parseInt(obj.selectedCell[1]);
            } else {
                var x = parseInt(obj.selectedCell[2]);
                var y = parseInt(obj.selectedCell[3]);
            }

            if (direction == 0) {
                for (var j = 0; j < y; j++) {
                    if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                        y = j;
                        break;
                    }
                }
            } else {
                y = obj.up.get(x, y);
            }

            if (group == 0) {
                obj.selectedCell[0] = x;
                obj.selectedCell[1] = y;
            } else {
                obj.selectedCell[2] = x;
                obj.selectedCell[3] = y;
            }
        }

        obj.up.get = function(x, y) {
            var x = parseInt(x);
            var y = parseInt(y);
            for (var j = (y - 1); j >= 0; j--) {
                if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                    y = j;
                    break;
                }
            }

            return y;
        }

        obj.down = function(shiftKey, ctrlKey) {
            if (shiftKey) {
                if (obj.selectedCell[3] < obj.records.length - 1) {
                    obj.down.visible(1, ctrlKey ? 0 : 1)
                }
            } else {
                if (obj.selectedCell[1] < obj.records.length - 1) {
                    obj.down.visible(0, ctrlKey ? 0 : 1)
                }
                obj.selectedCell[2] = obj.selectedCell[0];
                obj.selectedCell[3] = obj.selectedCell[1];
            }

            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);

            // Change page
            if (obj.options.pagination > 0) {
                var pageNumber = obj.whichPage(obj.selectedCell[3]);
                if (pageNumber != obj.pageNumber) {
                    obj.page(pageNumber);
                }
            }

            obj.updateScroll(3);
        }

        obj.down.visible = function(group, direction) {
            if (group == 0) {
                var x = parseInt(obj.selectedCell[0]);
                var y = parseInt(obj.selectedCell[1]);
            } else {
                var x = parseInt(obj.selectedCell[2]);
                var y = parseInt(obj.selectedCell[3]);
            }

            if (direction == 0) {
                for (var j = obj.rows.length - 1; j > y; j--) {
                    if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                        y = j;
                        break;
                    }
                }
            } else {
                y = obj.down.get(x, y);
            }

            if (group == 0) {
                obj.selectedCell[0] = x;
                obj.selectedCell[1] = y;
            } else {
                obj.selectedCell[2] = x;
                obj.selectedCell[3] = y;
            }
        }

        obj.down.get = function(x, y) {
            var x = parseInt(x);
            var y = parseInt(y);
            for (var j = (y + 1); j < obj.rows.length; j++) {
                if (obj.records[j][x].style.display != 'none' && obj.rows[j].style.display != 'none') {
                    y = j;
                    break;
                }
            }

            return y;
        }

        obj.right = function(shiftKey, ctrlKey) {
            if (shiftKey) {
                if (obj.selectedCell[2] < obj.headers.length - 1) {
                    obj.right.visible(1, ctrlKey ? 0 : 1)
                }
            } else {
                if (obj.selectedCell[0] < obj.headers.length - 1) {
                    obj.right.visible(0, ctrlKey ? 0 : 1)
                }
                obj.selectedCell[2] = obj.selectedCell[0];
                obj.selectedCell[3] = obj.selectedCell[1];
            }

            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            obj.updateScroll(2);
        }

        obj.right.visible = function(group, direction) {
            if (group == 0) {
                var x = parseInt(obj.selectedCell[0]);
                var y = parseInt(obj.selectedCell[1]);
            } else {
                var x = parseInt(obj.selectedCell[2]);
                var y = parseInt(obj.selectedCell[3]);
            }

            if (direction == 0) {
                for (var i = obj.headers.length - 1; i > x; i--) {
                    if (obj.records[y][i].style.display != 'none') {
                        x = i;
                        break;
                    }
                }
            } else {
                x = obj.right.get(x, y);
            }

            if (group == 0) {
                obj.selectedCell[0] = x;
                obj.selectedCell[1] = y;
            } else {
                obj.selectedCell[2] = x;
                obj.selectedCell[3] = y;
            }
        }

        obj.right.get = function(x, y) {
            var x = parseInt(x);
            var y = parseInt(y);

            for (var i = (x + 1); i < obj.headers.length; i++) {
                if (obj.records[y][i].style.display != 'none') {
                    x = i;
                    break;
                }
            }

            return x;
        }

        obj.left = function(shiftKey, ctrlKey) {
            if (shiftKey) {
                if (obj.selectedCell[2] > 0) {
                    obj.left.visible(1, ctrlKey ? 0 : 1)
                }
            } else {
                if (obj.selectedCell[0] > 0) {
                    obj.left.visible(0, ctrlKey ? 0 : 1)
                }
                obj.selectedCell[2] = obj.selectedCell[0];
                obj.selectedCell[3] = obj.selectedCell[1];
            }

            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            obj.updateScroll(0);
        }

        obj.left.visible = function(group, direction) {
            if (group == 0) {
                var x = parseInt(obj.selectedCell[0]);
                var y = parseInt(obj.selectedCell[1]);
            } else {
                var x = parseInt(obj.selectedCell[2]);
                var y = parseInt(obj.selectedCell[3]);
            }

            if (direction == 0) {
                for (var i = 0; i < x; i++) {
                    if (obj.records[y][i].style.display != 'none') {
                        x = i;
                        break;
                    }
                }
            } else {
                x = obj.left.get(x, y);
            }

            if (group == 0) {
                obj.selectedCell[0] = x;
                obj.selectedCell[1] = y;
            } else {
                obj.selectedCell[2] = x;
                obj.selectedCell[3] = y;
            }
        }

        obj.left.get = function(x, y) {
            var x = parseInt(x);
            var y = parseInt(y);
            for (var i = (x - 1); i >= 0; i--) {
                if (obj.records[y][i].style.display != 'none') {
                    x = i;
                    break;
                }
            }

            return x;
        }

        obj.first = function(shiftKey, ctrlKey) {
            if (shiftKey) {
                if (ctrlKey) {
                    obj.selectedCell[3] = 0;
                } else {
                    obj.left.visible(1, 0);
                }
            } else {
                if (ctrlKey) {
                    obj.selectedCell[1] = 0;
                } else {
                    obj.left.visible(0, 0);
                }
                obj.selectedCell[2] = obj.selectedCell[0];
                obj.selectedCell[3] = obj.selectedCell[1];
            }

            // Change page
            if (obj.options.pagination > 0) {
                var pageNumber = obj.whichPage(obj.selectedCell[3]);
                if (pageNumber != obj.pageNumber) {
                    obj.page(pageNumber);
                }
            }

            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            obj.updateScroll(1);
        }

        obj.last = function(shiftKey, ctrlKey) {
            if (shiftKey) {
                if (ctrlKey) {
                    obj.selectedCell[3] = obj.records.length - 1;
                } else {
                    obj.right.visible(1, 0);
                }
            } else {
                if (ctrlKey) {
                    obj.selectedCell[1] = obj.records.length - 1;
                } else {
                    obj.right.visible(0, 0);
                }
                obj.selectedCell[2] = obj.selectedCell[0];
                obj.selectedCell[3] = obj.selectedCell[1];
            }

            // Change page
            if (obj.options.pagination > 0) {
                var pageNumber = obj.whichPage(obj.selectedCell[3]);
                if (pageNumber != obj.pageNumber) {
                    obj.page(pageNumber);
                }
            }

            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
            obj.updateScroll(3);
        }

        obj.selectAll = function() {
            if (! obj.selectedCell) {
                obj.selectedCell = [];
            }

            obj.selectedCell[0] = 0;
            obj.selectedCell[1] = 0;
            obj.selectedCell[2] = obj.headers.length - 1;
            obj.selectedCell[3] = obj.records.length - 1;

            obj.updateSelectionFromCoords(obj.selectedCell[0], obj.selectedCell[1], obj.selectedCell[2], obj.selectedCell[3]);
        }

        /**
         * Reset search
         */
        obj.resetSearch = function() {
            obj.searchInput.value = '';
            obj.search('');
            obj.results = null;
        }

        /**
         * Search
         */
        obj.search = function(query) {
            // Query
            if (query) {
                query = query.toLowerCase();
            }

            // Reset selection
            obj.resetSelection();

            // Total of results
            obj.pageNumber = 0;
            obj.results = [];

            if (query) {
                // Search filter
                var search = function(item, query, index) {
                    for (var i = 0; i < item.length; i++) {
                        if ((''+item[i]).toLowerCase().search(query) >= 0 ||
                            (''+obj.records[index][i].innerHTML).toLowerCase().search(query) >= 0) {
                            return true;
                        }
                    }
                    return false;
                }

                // Result
                var addToResult = function(k) {
                    if (obj.results.indexOf(k) == -1) {
                        obj.results.push(k);
                    }
                }

                // Filter
                var data = obj.options.data.filter(function(v, k) {
                    if (search(v, query, k)) {
                        addToResult(k);
                        return true;
                    } else {
                        return false;
                    }
                });
            } else {
                obj.results = null;
            }

            return obj.updateResult();
        }

        obj.updateResult = function() {
            var total = 0;
            var index = 0;

            // Page 1
            if (obj.options.pagination > 0) {
                total = obj.options.pagination;
            } else {
                if (obj.results) {
                    total = obj.results.length;
                } else {
                    total = obj.rows.length;
                }
            }

            // Reset current nodes
            while (obj.tbody.firstChild) {
                obj.tbody.removeChild(obj.tbody.firstChild);
            }

            // Hide all records from the table
            for (var j = 0; j < obj.rows.length; j++) {
                if (! obj.results || obj.results.indexOf(j) > -1) {
                    if (index < total) {
                        obj.tbody.appendChild(obj.rows[j]);
                        index++;
                    }
                    obj.rows[j].style.display = '';
                } else {
                    obj.rows[j].style.display = 'none';
                }
            }

            // Update pagination
            if (obj.options.pagination > 0) {
                obj.updatePagination();
            }

            obj.updateCornerPosition();

            return total;
        }

        /**
         * Which page the cell is
         */
        obj.whichPage = function(cell) {
            // Search
            if (obj.options.search == true && obj.results) {
                cell = obj.results.indexOf(cell);
            }

            return (Math.ceil((parseInt(cell) + 1) / parseInt(obj.options.pagination))) - 1;
        }

        /**
         * Go to page
         */
        obj.page = function(pageNumber) {
            var oldPage = obj.pageNumber;

            // Search
            if (obj.options.search == true && obj.results) {
                var results = obj.results;
            } else {
                var results = obj.rows;
            }

            // Per page
            var quantityPerPage = parseInt(obj.options.pagination);

            // pageNumber
            if (pageNumber == null || pageNumber == -1) {
                // Last page
                pageNumber = Math.ceil(results.length / quantityPerPage) - 1;
            }

            // Page number
            obj.pageNumber = pageNumber;

            var startRow = (pageNumber * quantityPerPage);
            var finalRow = (pageNumber * quantityPerPage) + quantityPerPage;
            if (finalRow > results.length) {
                finalRow = results.length;
            }
            if (startRow < 0) {
                startRow = 0;
            }

            // Reset container
            while (obj.tbody.firstChild) {
                obj.tbody.removeChild(obj.tbody.firstChild);
            }

            // Appeding items
            for (var j = startRow; j < finalRow; j++) {
                if (obj.options.search == true && obj.results) {
                    obj.tbody.appendChild(obj.rows[results[j]]);
                } else {
                    obj.tbody.appendChild(obj.rows[j]);
                }
            }

            if (obj.options.pagination > 0) {
                obj.updatePagination();
            }

            // Update corner position
            obj.updateCornerPosition();

            // Events
            obj.dispatch('onchangepage', element, pageNumber, oldPage);
        }

        /**
         * Update the pagination
         */
        obj.updatePagination = function() {
            // Reset container
            obj.pagination.children[0].innerHTML = '';
            obj.pagination.children[1].innerHTML = '';

            // Start pagination
            if (obj.options.pagination) {
                // Searchable
                let results = (obj.options.search === true && obj.results) ?
                    obj.results.length : obj.rows.length;

                if (! results) {
                    // No records found
                    obj.pagination.children[0].innerHTML = obj.options.text.noRecordsFound;
                } else {
                    // Pagination container
                    let quantyOfPages = Math.ceil(results / obj.options.pagination);
                    let startNumber;
                    let finalNumber;
                    if (obj.pageNumber < 6) {
                        startNumber = 1;
                        finalNumber = quantyOfPages < 10 ? quantyOfPages : 10;
                    } else if (quantyOfPages - obj.pageNumber < 5) {
                        startNumber = quantyOfPages - 9;
                        finalNumber = quantyOfPages;
                        if (startNumber < 1) {
                            startNumber = 1;
                        }
                    } else {
                        startNumber = obj.pageNumber - 4;
                        finalNumber = obj.pageNumber + 5;
                    }

                    // First
                    if (startNumber > 1) {
                        let paginationItem = document.createElement('div');
                        paginationItem.className = 'jsTable_page';
                        paginationItem.innerHTML = '<';
                        paginationItem.title = '1';
                        obj.pagination.children[1].appendChild(paginationItem);
                    }

                    // Get page links
                    for (let i = startNumber; i <= finalNumber; ++i) {
                        let paginationItem = document.createElement('div');
                        paginationItem.className = 'jsTable_page';
                        paginationItem.innerHTML = '' + i;
                        obj.pagination.children[1].appendChild(paginationItem);

                        if (obj.pageNumber === (i-1)) {
                            paginationItem.classList.add('jsTable_page_selected');
                        }
                    }

                    // Last
                    if (finalNumber < quantyOfPages) {
                        let paginationItem = document.createElement('div');
                        paginationItem.className = 'jsTable_page';
                        paginationItem.innerHTML = '>';
                        paginationItem.title = quantyOfPages.toString();
                        obj.pagination.children[1].appendChild(paginationItem);
                    }

                    // Text
                    let format = function(format) {
                        let args = Array.prototype.slice.call(arguments, 1);
                        return format.replace(/{(\d+)}/g, function(match, number) {
                          return typeof args[number] !== 'undefined'
                            ? args[number]
                            : match
                          ;
                        });
                    };

                    obj.pagination.children[0].innerHTML = format(obj.options.text.showingPage, obj.pageNumber + 1, quantyOfPages)
                }
            }
        }

        /**
         * Initializes a new history record for undo/redo
         *
         * @return null
         */
        obj.setHistory = function(changes) {
            if (obj.ignoreHistory != true) {
                // Increment and get the current history index
                let index = ++obj.historyIndex;

                // Slice the array to discard undone changes
                obj.history = (obj.history = obj.history.slice(0, index + 1));

                // Keep history
                obj.history[index] = changes;
            }
        }

        /**
         * Copy method
         *
         * @param bool highlighted - Get only highlighted cells
         * @param delimiter - \t default to keep compatibility with excel
         * @return string value
         */
        obj.copy = function(highlighted, delimiter, returnData) {
            if (! delimiter) {
                delimiter = "\t";
            }

            // Controls
            let header = [];
            let col = [];
            let colLabel = [];
            let row = [];
            let rowLabel = [];
            let x = obj.options.data[0].length
            let y = obj.options.data.length
            let tmp = '';
            let copyHeader = obj.options.includeHeadersOnCopy;

            // Reset container
            obj.style = [];

            // Go through the columns to get the data
            for (let j = 0; j < y; ++j) {
                col = [];
                colLabel = [];

                for (let i = 0; i < x; ++i) {
                    // If cell is highlighted
                    if (! highlighted || obj.records[j][i].classList.contains('highlight')) {
                        if (copyHeader == true) {
                            header.push(obj.headers[i].innerText);
                        }
                        // Values
                        var value = obj.options.data[j][i];
                        if (value.match && (value.match(/,/g) || value.match(/\n/) || value.match(/\"/))) {
                            value = value.replace(new RegExp('"', 'g'), '""');
                            value = '"' + value + '"';
                        }
                        col.push(value);

                        // Labels
                        var label = obj.records[j][i].innerText;
                        if (label.match && (label.match(/,/g) || label.match(/\n/) || label.match(/\"/))) {
                            // Scape double quotes
                            label = label.replace(new RegExp('"', 'g'), '""');
                            label = '"' + label + '"';
                        }

                        colLabel.push(label);

                        // Get style
                        tmp = obj.records[j][i].getAttribute('style');
                        tmp = tmp.replace('display: none;', '');
                        obj.style.push(tmp ? tmp : '');
                    }
                }

                if (col.length) {
                    if (copyHeader) {
                        row.push(header.join(delimiter));
                    }
                    row.push(col.join(delimiter));
                }
                if (colLabel.length) {
                    if (copyHeader) {
                        rowLabel.push(header.join(delimiter));
                    }
                    rowLabel.push(colLabel.join(delimiter));
                }
                copyHeader = false;
            }

            // Final string
            var str = row.join("\r\n");
            var strLabel = rowLabel.join("\r\n");

            // Create a hidden textarea to copy the values
            if (! returnData) {
                obj.textarea.value = str;
                obj.textarea.select();
                document.execCommand("copy");
            }

            // Keep data
            obj.data = str;

            // Keep non visible information
            obj.hashString = obj.hash(obj.data);

            // Any exiting border should go
            obj.removeCopyingSelection();

            // Border
            if (obj.highlighted) {
                for (var i = 0; i < obj.highlighted.length; i++) {
                    obj.highlighted[i].classList.add('copying');
                    if (obj.highlighted[i].classList.contains('highlight-left')) {
                        obj.highlighted[i].classList.add('copying-left');
                    }
                    if (obj.highlighted[i].classList.contains('highlight-right')) {
                        obj.highlighted[i].classList.add('copying-right');
                    }
                    if (obj.highlighted[i].classList.contains('highlight-top')) {
                        obj.highlighted[i].classList.add('copying-top');
                    }
                    if (obj.highlighted[i].classList.contains('highlight-bottom')) {
                        obj.highlighted[i].classList.add('copying-bottom');
                    }
                }
            }

            // Paste event
            obj.dispatch('oncopy', element, row, obj.hashString);

            return obj.data;
        }

        /**
         * jsTable paste method
         *
         * @param integer row number
         * @return string value
         */
        obj.paste = function(x, y, data) {
            // Paste filter
            var ret = obj.dispatch('onbeforepaste', element, data, x, y);

            if (ret === false) {
                return false;
            } else if (ret) {
                var data = ret;
            }

            // Controls
            var hash = obj.hash(data);
            var style = (hash == obj.hashString) ? obj.style : null;

            // Depending on the behavior
            if (hash === obj.hashString) {
                var data = obj.data;
            }

            // Split new line
            var data = obj.parseCSV(data, "\t");

            if (x != null && y != null && data) {
                // Records
                var i = 0;
                var j = 0;
                var records = [];
                var newStyle = {};
                var oldStyle = {};
                var styleIndex = 0;

                // Index
                var colIndex = parseInt(x);
                var rowIndex = parseInt(y);
                var row = null;

                // Go through the columns to get the data
                while (row = data[j]) {
                    i = 0;
                    colIndex = parseInt(x);

                    while (row[i] != null) {
                        // Update and keep history
                        var record = obj.updateCell(colIndex, rowIndex, row[i]);
                        // Keep history
                        records.push(record);
                        // Style
                        if (style && style[styleIndex]) {
                            var columnName = jsTable.getColumnNameFromId([colIndex, rowIndex]);
                            newStyle[columnName] = style[styleIndex];
                            oldStyle[columnName] = obj.getStyle(columnName);
                            obj.records[rowIndex][colIndex].setAttribute('style', style[styleIndex]);
                            styleIndex++
                        }
                        i++;
                        if (row[i] != null) {
                            if (colIndex >= obj.headers.length - 1) {
                                obj.insertColumn();
                            }
                            colIndex = obj.right.get(colIndex, rowIndex);
                        }
                    }

                    j++;
                    if (data[j]) {
                        if (rowIndex >= obj.rows.length-1) {
                            obj.insertRow();
                        }
                        rowIndex = obj.down.get(x, rowIndex);
                    }
                }

                // Select the new cells
                obj.updateSelectionFromCoords(x, y, colIndex, rowIndex);

                // Update history
                obj.setHistory({
                    action:'setValue',
                    records:records,
                    selection:obj.selectedCell,
                    newStyle:newStyle,
                    oldStyle:oldStyle,
                });

                // Update table
                obj.updateTable();

                // Paste event
                obj.dispatch('onpaste', element, data);

                // On after changes
                obj.onafterchanges(element, records);
            }

            obj.removeCopyingSelection();
        }

        /**
         * Remove copying border
         */
        obj.removeCopyingSelection = function() {
            let copying = document.querySelectorAll('.jsTable .copying');
            for (let i = 0; i < copying.length; i++) {
                copying[i].classList.remove('copying');
                copying[i].classList.remove('copying-left');
                copying[i].classList.remove('copying-right');
                copying[i].classList.remove('copying-top');
                copying[i].classList.remove('copying-bottom');
            }
        }

        /**
         * Process row
         */
        obj.historyProcessRow = function(type, historyRecord) {
            var rowIndex = (! historyRecord.insertBefore) ? historyRecord.rowNumber + 1 : historyRecord.rowNumber;

            if (obj.options.search == true) {
                if (obj.results && obj.results.length != obj.rows.length) {
                    obj.resetSearch();
                }
            }

            // Remove row
            if (type == 1) {
                var numOfRows = historyRecord.numOfRows;
                // Remove nodes
                for (var j = rowIndex; j < (numOfRows + rowIndex); j++) {
                    obj.rows[j].parentNode.removeChild(obj.rows[j]);
                }
                // Remove references
                obj.records.splice(rowIndex, numOfRows);
                obj.options.data.splice(rowIndex, numOfRows);
                obj.rows.splice(rowIndex, numOfRows);

                obj.conditionalSelectionUpdate(1, rowIndex, (numOfRows + rowIndex) - 1);
            } else {
                // Insert data
                obj.records = jsTable.injectArray(obj.records, rowIndex, historyRecord.rowRecords);
                obj.options.data = jsTable.injectArray(obj.options.data, rowIndex, historyRecord.rowData);
                obj.rows = jsTable.injectArray(obj.rows, rowIndex, historyRecord.rowNode);
                // Insert nodes
                var index = 0
                for (var j = rowIndex; j < (historyRecord.numOfRows + rowIndex); j++) {
                    obj.tbody.insertBefore(historyRecord.rowNode[index], obj.tbody.children[j]);
                    index++;
                }
            }

            // Respect pagination
            if (obj.options.pagination > 0) {
                obj.page(obj.pageNumber);
            }

            obj.updateTableReferences();
        }

        /**
         * Process column
         */
        obj.historyProcessColumn = function(type, historyRecord) {
            var columnIndex = (! historyRecord.insertBefore) ? historyRecord.columnNumber + 1 : historyRecord.columnNumber;

            // Remove column
            if (type == 1) {
                var numOfColumns = historyRecord.numOfColumns;

                obj.options.columns.splice(columnIndex, numOfColumns);
                for (var i = columnIndex; i < (numOfColumns + columnIndex); i++) {
                    obj.headers[i].parentNode.removeChild(obj.headers[i]);
                    obj.colgroup[i].parentNode.removeChild(obj.colgroup[i]);
                }
                obj.headers.splice(columnIndex, numOfColumns);
                obj.colgroup.splice(columnIndex, numOfColumns);
                for (var j = 0; j < historyRecord.data.length; j++) {
                    for (var i = columnIndex; i < (numOfColumns + columnIndex); i++) {
                        obj.records[j][i].parentNode.removeChild(obj.records[j][i]);
                    }
                    obj.records[j].splice(columnIndex, numOfColumns);
                    obj.options.data[j].splice(columnIndex, numOfColumns);
                }
            } else {
                // Insert data
                obj.options.columns = jsTable.injectArray(obj.options.columns, columnIndex, historyRecord.columns);
                obj.headers = jsTable.injectArray(obj.headers, columnIndex, historyRecord.headers);
                obj.colgroup = jsTable.injectArray(obj.colgroup, columnIndex, historyRecord.colgroup);

                var index = 0
                for (var i = columnIndex; i < (historyRecord.numOfColumns + columnIndex); i++) {
                    obj.headerContainer.insertBefore(historyRecord.headers[index], obj.headerContainer.children[i+1]);
                    obj.colgroupContainer.insertBefore(historyRecord.colgroup[index], obj.colgroupContainer.children[i+1]);
                    index++;
                }

                for (var j = 0; j < historyRecord.data.length; j++) {
                    obj.options.data[j] = jsTable.injectArray(obj.options.data[j], columnIndex, historyRecord.data[j]);
                    obj.records[j] = jsTable.injectArray(obj.records[j], columnIndex, historyRecord.records[j]);
                    var index = 0
                    for (var i = columnIndex; i < (historyRecord.numOfColumns + columnIndex); i++) {
                        obj.rows[j].insertBefore(historyRecord.records[j][index], obj.rows[j].children[i+1]);
                        index++;
                    }
                }
            }

            obj.updateTableReferences();
        }

        /**
         * Undo last action
         */
        obj.undo = function() {
            // Ignore events and history
            var ignoreEvents = obj.ignoreEvents ? true : false;
            var ignoreHistory = obj.ignoreHistory ? true : false;

            obj.ignoreEvents = true;
            obj.ignoreHistory = true;

            // Records
            var records = [];

            // Update cells
            if (obj.historyIndex >= 0) {
                // History
                var historyRecord = obj.history[obj.historyIndex--];

                if (historyRecord.action == 'insertRow') {
                    obj.historyProcessRow(1, historyRecord);
                } else if (historyRecord.action == 'deleteRow') {
                    obj.historyProcessRow(0, historyRecord);
                } else if (historyRecord.action == 'insertColumn') {
                    obj.historyProcessColumn(1, historyRecord);
                } else if (historyRecord.action == 'deleteColumn') {
                    obj.historyProcessColumn(0, historyRecord);
                } else if (historyRecord.action == 'moveRow') {
                    obj.moveRow(historyRecord.newValue, historyRecord.oldValue);
                } else if (historyRecord.action == 'moveColumn') {
                    obj.moveColumn(historyRecord.newValue, historyRecord.oldValue);
                } else if (historyRecord.action == 'setStyle') {
                    obj.setStyle(historyRecord.oldValue, null, null, 1);
                } else if (historyRecord.action == 'setWidth') {
                    obj.setWidth(historyRecord.column, historyRecord.oldValue);
                } else if (historyRecord.action == 'setHeight') {
                    obj.setHeight(historyRecord.row, historyRecord.oldValue);
                } else if (historyRecord.action == 'setHeader') {
                    obj.setHeader(Number(historyRecord.column), historyRecord.oldValue);
                } else if (historyRecord.action == 'orderBy') {
                    var rows = [];
                    for (var j = 0; j < historyRecord.rows.length; j++) {
                        rows[historyRecord.rows[j]] = j;
                    }
                    obj.updateOrderArrow(historyRecord.column, historyRecord.order ? 0 : 1);
                    obj.updateOrder(rows);
                } else if (historyRecord.action == 'setValue') {
                    // Redo for changes in cells
                    for (var i = 0; i < historyRecord.records.length; i++) {
                        records.push({
                            x: historyRecord.records[i].x,
                            y: historyRecord.records[i].y,
                            newValue: historyRecord.records[i].oldValue,
                        });

                        if (historyRecord.oldStyle) {
                            obj.resetStyle(historyRecord.oldStyle);
                        }
                    }
                    // Update records
                    obj.setValue(records);

                    // Update selection
                    if (historyRecord.selection) {
                        obj.updateSelectionFromCoords(historyRecord.selection[0], historyRecord.selection[1], historyRecord.selection[2], historyRecord.selection[3]);
                    }
                }
            }
            obj.ignoreEvents = ignoreEvents;
            obj.ignoreHistory = ignoreHistory;

            // Events
            obj.dispatch('onundo', element, historyRecord);
        }

        /**
         * Redo previously undone action
         */
        obj.redo = function() {
            // Ignore events and history
            var ignoreEvents = obj.ignoreEvents ? true : false;
            var ignoreHistory = obj.ignoreHistory ? true : false;

            obj.ignoreEvents = true;
            obj.ignoreHistory = true;

            // Records
            var records = [];

            // Update cells
            if (obj.historyIndex < obj.history.length - 1) {
                // History
                var historyRecord = obj.history[++obj.historyIndex];

                if (historyRecord.action == 'insertRow') {
                    obj.historyProcessRow(0, historyRecord);
                } else if (historyRecord.action == 'deleteRow') {
                    obj.historyProcessRow(1, historyRecord);
                } else if (historyRecord.action == 'insertColumn') {
                    obj.historyProcessColumn(0, historyRecord);
                } else if (historyRecord.action == 'deleteColumn') {
                    obj.historyProcessColumn(1, historyRecord);
                } else if (historyRecord.action == 'moveRow') {
                    obj.moveRow(historyRecord.oldValue, historyRecord.newValue);
                } else if (historyRecord.action == 'moveColumn') {
                    obj.moveColumn(historyRecord.oldValue, historyRecord.newValue);
                } else if (historyRecord.action == 'setStyle') {
                    obj.setStyle(historyRecord.newValue, null, null, 1);
                } else if (historyRecord.action == 'setWidth') {
                    obj.setWidth(historyRecord.column, historyRecord.newValue);
                } else if (historyRecord.action == 'setHeight') {
                    obj.setHeight(historyRecord.row, historyRecord.newValue);
                } else if (historyRecord.action == 'setHeader') {
                    obj.setHeader(Number(historyRecord.column), historyRecord.newValue);
                } else if (historyRecord.action == 'orderBy') {
                    obj.updateOrderArrow(historyRecord.column, historyRecord.order);
                    obj.updateOrder(historyRecord.rows);
                } else if (historyRecord.action == 'setValue') {
                    obj.setValue(historyRecord.records);
                    // Redo for changes in cells
                    for (var i = 0; i < historyRecord.records.length; i++) {
                        if (historyRecord.oldStyle) {
                            obj.resetStyle(historyRecord.newStyle);
                        }
                    }
                    // Update selection
                    if (historyRecord.selection) {
                        obj.updateSelectionFromCoords(historyRecord.selection[0], historyRecord.selection[1], historyRecord.selection[2], historyRecord.selection[3]);
                    }
                }
            }
            obj.ignoreEvents = ignoreEvents;
            obj.ignoreHistory = ignoreHistory;

            // Events
            obj.dispatch('onredo', element, historyRecord);
        }

        /**
         * From stackoverflow contributions
         */
        obj.parseCSV = function(str, delimiter) {
            // Remove last line break
            str = str.replace(/\r?\n$|\r$|\n$/g, "");
            // Last caracter is the delimiter
            if (str.charCodeAt(str.length-1) == 9) {
                str += "\0";
            }
            // user-supplied delimeter or default comma
            delimiter = (delimiter || ",");

            var arr = [];
            var quote = false;  // true means we're inside a quoted field
            // iterate over each character, keep track of current row and column (of the returned array)
            for (var row = 0, col = 0, c = 0; c < str.length; c++) {
                var cc = str[c], nc = str[c+1];
                arr[row] = arr[row] || [];
                arr[row][col] = arr[row][col] || '';

                // If the current character is a quotation mark, and we're inside a quoted field, and the next character is also a quotation mark, add a quotation mark to the current column and skip the next character
                if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

                // If it's just one quotation mark, begin/end quoted field
                if (cc == '"') { quote = !quote; continue; }

                // If it's a comma and we're not in a quoted field, move on to the next column
                if (cc == delimiter && !quote) { ++col; continue; }

                // If it's a newline (CRLF) and we're not in a quoted field, skip the next character and move on to the next row and move to column 0 of that new row
                if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

                // If it's a newline (LF or CR) and we're not in a quoted field, move on to the next row and move to column 0 of that new row
                if (cc == '\n' && !quote) { ++row; col = 0; continue; }
                if (cc == '\r' && !quote) { ++row; col = 0; continue; }

                // Otherwise, append the current character to the current column
                arr[row][col] += cc;
            }
            return arr;
        }

        obj.hash = function(str) {
            var hash = 0, i, chr;

            if (str.length === 0) {
                return hash;
            } else {
                for (i = 0; i < str.length; i++) {
                  chr = str.charCodeAt(i);
                  hash = ((hash << 5) - hash) + chr;
                  hash |= 0;
                }
            }
            return hash;
        }

        obj.onafterchanges = function(el, records) {
            // Events
            obj.dispatch('onafterchanges', el, records);
        }

        obj.destroy = function() {
            jsTable.destroy(element);
        }

        /**
         * Initialization method
         */
        obj.init = function() {
            jsTable.current = obj;

            // Build handlers
            if (typeof(jsTable.build) === 'function') {
                jsTable.build(document);
                jsTable.build = null;
            }

            // Event
            element.setAttribute('tabindex', 1);
            element.addEventListener('focus', function(e) {
                if (jsTable.current && ! obj.selectedCell) {
                    obj.updateSelectionFromCoords(0,0,0,0);
                    obj.left();
                }
            });

            // Prepare table
            obj.prepareTable();
        }

        // Context menu
        if (options && options.contextMenu != null) {
            obj.options.contextMenu = options.contextMenu;
        } else {
            obj.options.contextMenu = function(el, x, y, e) {
                let items = [];
                if (y === null) {
                    // Insert a new column
                    if (obj.options.allowInsertColumn === true) {
                        if (x > 0) {
                            items.push({
                                title: obj.options.text.insertANewColumnBefore,
                                onclick: function () {
                                    obj.insertColumn(1, parseInt(x), 1);
                                }
                            });
                        }
                        items.push({
                            title: obj.options.text.insertANewColumnAfter,
                            onclick: function() {
                                obj.insertColumn(1, parseInt(x), 0);
                            }
                        });
                    }
                    // Delete a column
                    if (obj.options.allowDeleteColumn === true) {
                        items.push({
                            title: obj.options.text.deleteSelectedColumns,
                            onclick: function() {
                                obj.deleteColumn(obj.getSelectedColumns().length ? undefined : parseInt(x));
                            }
                        });
                    }
                    // Rename column
                    if (obj.options.allowRenameColumn === true) {
                        items.push({
                            title: obj.options.text.renameThisColumn,
                            onclick: function() {
                                obj.setHeader(Number(x));
                            }
                        });
                    }
                    // Sorting
                    if (obj.options.columnSorting === true) {
                        items.push({ type:'line' });
                        items.push({
                            title: obj.options.text.orderAscending,
                            onclick: function() {
                                obj.orderBy(x, 0);
                            }
                        });
                        items.push({
                            title: obj.options.text.orderDescending,
                            onclick: function() {
                                obj.orderBy(x, 1);
                            }
                        });
                    }
                } else {
                    // Insert new row
                    if (obj.options.allowInsertRow === true) {
                        items.push({
                            title: obj.options.text.insertANewRowBefore,
                            onclick: function() {
                                obj.insertRow(1, parseInt(y), 1);
                            }
                        });
                        items.push({
                            title: obj.options.text.insertANewRowAfter,
                            onclick: function() {
                                obj.insertRow(1, parseInt(y));
                            }
                        });
                    }
                    if (obj.options.allowDeleteRow === true) {
                        items.push({
                            title: obj.options.text.deleteSelectedRows,
                            onclick: function() {
                                obj.deleteRow(obj.getSelectedRows().length ? undefined : parseInt(y));
                            }
                        });
                    }
                }
                items.push({ type:'line' });
                // Copy
                items.push({
                    title: obj.options.text.copy,
                    shortcut: 'Ctrl + C',
                    onclick: function() {
                        obj.copy(true);
                    }
                });
                // Paste
                if (navigator && navigator.clipboard) {
                    items.push({
                        title: obj.options.text.paste,
                        shortcut: 'Ctrl + V',
                        onclick: function() {
                            if (obj.selectedCell) {
                                navigator.clipboard.readText().then(function(text) {
                                    if (text) {
                                        jsTable.current.paste(obj.selectedCell[0], obj.selectedCell[1], text);
                                    }
                                });
                            }
                        }
                    });
                }
               // About
                if (obj.options.about) {
                    items.push({
                        title: obj.options.text.about,
                        onclick: function() {
                            alert(obj.options.about);
                        }
                    });
                }

                return items;
            }
        }

        obj.scrollControls = function(e) {
            if (obj.options.freezeColumns > 0 && obj.content.scrollLeft != scrollLeft) {
                obj.updateFreezePosition();
            }

            // Close editor
            if (obj.options.tableOverflow == true) {
                if (obj.edition && e.target.className.substr(0,9) != 'jdropdown') {
                    obj.closeEditor(obj.edition[0], true);
                }
            }
        }

        // Get width of all freezed cells together
        obj.getFreezeWidth = function() {
            let width = 0;
            if (obj.options.freezeColumns > 0) {
                for (let i = 0; i < obj.options.freezeColumns; i++) {
                    width += parseInt(obj.options.columns[i].width);
                }
            }
            return width;
        }

        let scrollLeft = 0;

        obj.updateFreezePosition = function() {
            scrollLeft = obj.content.scrollLeft;
            let width = 0;
            if (scrollLeft > 50) {
                for (var i = 0; i < obj.options.freezeColumns; i++) {
                    if (i > 0) {
                        width += parseInt(obj.options.columns[i-1].width);
                    }
                    obj.headers[i].classList.add('jsTable_freezed');
                    obj.headers[i].style.left = width + 'px';
                    for (var j = 0; j < obj.rows.length; j++) {
                        if (obj.rows[j] && obj.records[j][i]) {
                            var shifted = (scrollLeft + (i > 0 ? obj.records[j][i-1].style.width : 0)) - 51 + 'px';
                            obj.records[j][i].classList.add('jsTable_freezed');
                            obj.records[j][i].style.left = shifted;
                        }
                    }
                }
            } else {
                for (var i = 0; i < obj.options.freezeColumns; i++) {
                    obj.headers[i].classList.remove('jsTable_freezed');
                    obj.headers[i].style.left = '';
                    for (var j = 0; j < obj.rows.length; j++) {
                        if (obj.records[j][i]) {
                            obj.records[j][i].classList.remove('jsTable_freezed');
                            obj.records[j][i].style.left = '';
                        }
                    }
                }
            }

            // Place the corner in the correct place
            obj.updateCornerPosition();
        }

        element.jsTable = obj;

        obj.init();

        return obj;
    });

    jsTable.current = null;
    jsTable.timeControl = null;

    jsTable.destroy = function(element, destroyEventHandlers) {
        if (element.jsTable) {
            let root = element.jsTable.options.root ? element.jsTable.options.root : document;
            element.removeEventListener("DOMMouseScroll", element.jsTable.scrollControls);
            element.removeEventListener("mousewheel", element.jsTable.scrollControls);
            element.jsTable = null;
            element.innerHTML = '';

            if (destroyEventHandlers) {
                root.removeEventListener("mouseup", jsTable.mouseUpControls);
                root.removeEventListener("mousedown", jsTable.mouseDownControls);
                root.removeEventListener("mousemove", jsTable.mouseMoveControls);
                root.removeEventListener("mouseover", jsTable.mouseOverControls);
                root.removeEventListener("dblclick", jsTable.doubleClickControls);
                root.removeEventListener("paste", jsTable.pasteControls);
                root.removeEventListener("contextmenu", jsTable.contextMenuControls);
                root.removeEventListener("touchstart", jsTable.touchStartControls);
                root.removeEventListener("touchend", jsTable.touchEndControls);
                root.removeEventListener("touchcancel", jsTable.touchEndControls);
                document.removeEventListener("keydown", jsTable.keyDownControls);
                jsTable = null;
            }
        }
    }

    jsTable.build = function(root) {
        root.addEventListener("mouseup", jsTable.mouseUpControls);
        root.addEventListener("mousedown", jsTable.mouseDownControls);
        root.addEventListener("mousemove", jsTable.mouseMoveControls);
        root.addEventListener("mouseover", jsTable.mouseOverControls);
        root.addEventListener("dblclick", jsTable.doubleClickControls);
        root.addEventListener("paste", jsTable.pasteControls);
        root.addEventListener("contextmenu", jsTable.contextMenuControls);
        root.addEventListener("touchstart", jsTable.touchStartControls);
        root.addEventListener("touchend", jsTable.touchEndControls);
        root.addEventListener("touchcancel", jsTable.touchEndControls);
        root.addEventListener("touchmove", jsTable.touchEndControls);
        document.addEventListener("keydown", jsTable.keyDownControls);
    }

    /**
     * Events
     */
    jsTable.keyDownControls = function(e) {
        if (jsTable.current) {
            if (jsTable.current.edition) {
                if (e.which === 27) { // Escape
                    if (jsTable.current.edition) {
                        // Exit without saving
                        jsTable.current.closeEditor(jsTable.current.edition[0], false);
                    }
                    e.preventDefault();
                } else if (e.which === 13) { // Enter
                    if (e.altKey) {
                        // Alt enter -> do not close editor
                        let editorTextarea = jsTable.current.edition[0].children[0];
                        let editorValue = jsTable.current.edition[0].children[0].value;
                        let editorIndexOf = editorTextarea.selectionStart;
                        editorValue = editorValue.slice(0, editorIndexOf) + "\n" + editorValue.slice(editorIndexOf);
                        editorTextarea.value = editorValue;
                        editorTextarea.focus();
                        editorTextarea.selectionStart = editorIndexOf + 1;
                        editorTextarea.selectionEnd = editorIndexOf + 1;
                    } else {
                        jsTable.current.edition[0].children[0].blur();
                    }
                    e.preventDefault();
                } else if (e.which === 9) { // Tab
                    jsTable.current.edition[0].children[0].blur();
                    e.preventDefault();
                }
            }

            if (! jsTable.current.edition && jsTable.current.selectedCell) {
                // Which key
                if (e.which === 37) {
                    jsTable.current.left(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which === 39) {
                    jsTable.current.right(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which === 38) {
                    jsTable.current.up(e.shiftKey, e.ctrlKey, e.altKey);
                    e.preventDefault();
                } else if (e.which === 40) {
                    jsTable.current.down(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which === 36) {
                    jsTable.current.first(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which === 35) {
                    jsTable.current.last(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which === 46) { // Delete key
                    if (jsTable.current.selectedRow) {
                        if (jsTable.current.options.allowDeleteRow) {
                            if (confirm(jsTable.current.options.text.areYouSureToDeleteTheSelectedRows)) {
                                jsTable.current.deleteRow();
                            }
                        }
                    } else if (jsTable.current.selectedHeader) {
                        if (jsTable.current.options.allowDeleteColumn) {
                            if (confirm(jsTable.current.options.text.areYouSureToDeleteTheSelectedColumns)) {
                                jsTable.current.deleteColumn();
                            }
                        }
                    } else {
                        // Change value
                        jsTable.current.setValue(jsTable.current.highlighted, '');
                    }
                    e.preventDefault();
                } else if (e.which === 13) { // Enter key
                    // Move cursor
                    if (e.shiftKey) {
                        jsTable.current.up();
                    } else {
                        if (jsTable.current.options.allowInsertRow) {
                            if (jsTable.current.options.allowManualInsertRow) {
                                if (jsTable.current.selectedCell[1] === jsTable.current.options.data.length - 1) {
                                    // New record in case selectedCell in the last row
                                    jsTable.current.insertRow();
                                }
                            }
                        }
                        jsTable.current.down();
                    }
                    e.preventDefault();
                } else if (e.which === 9) { // Tab key
                    if (e.shiftKey) {
                        jsTable.current.left();
                    } else {
                        if (jsTable.current.options.allowInsertColumn) {
                            if (jsTable.current.options.allowManualInsertColumn) {
                                if (jsTable.current.selectedCell[0] === jsTable.current.options.data[0].length - 1) {
                                    // New record in case selectedCell in the last column
                                    jsTable.current.insertColumn();
                                }
                            }
                        }
                        jsTable.current.right();
                    }
                    e.preventDefault();
                } else {
                    if ((e.ctrlKey || e.metaKey) && ! e.shiftKey) {
                        if (e.which === 65) { // Ctrl + A
                            jsTable.current.selectAll();
                            e.preventDefault();
                        } else if (e.which === 89) { // Ctrl + Y
                            jsTable.current.redo();
                            e.preventDefault();
                        } else if (e.which === 90) { // Ctrl + Z
                            jsTable.current.undo();
                            e.preventDefault();
                        } else if (e.which === 67) { // Ctrl + C
                            jsTable.current.copy(true);
                            e.preventDefault();
                        } else if (e.which === 88) { // Ctrl + X
                            jsTable.cutControls();
                            e.preventDefault();
                        } else if (e.which === 86) { // Ctrl + V
                            jsTable.pasteControls();
                            e.preventDefault();
                        }
                    } else {
                        if (jsTable.current.selectedCell) {
                            let rowId = jsTable.current.selectedCell[1];
                            let columnId = jsTable.current.selectedCell[0];

                            // Characters able to start a edition
                            if (e.keyCode === 32) { // Space key
                                // Start edition
                                jsTable.current.openEditor(jsTable.current.records[rowId][columnId], true);
                            } else if (e.keyCode === 113) { // F2
                                // Start edition
                                jsTable.current.openEditor(jsTable.current.records[rowId][columnId], false);
                            } else if ((e.keyCode === 8) || // Backspace key
                                (e.keyCode >= 48 && e.keyCode <= 57) || // 0-9 digit keys
                                (e.keyCode >= 96 && e.keyCode <= 111) || // numpad keys
                                (e.keyCode >= 187 && e.keyCode <= 190) || // equal, comma, and dash signs
                                ((String.fromCharCode(e.keyCode) === e.key || String.fromCharCode(e.keyCode).toLowerCase() === e.key.toLowerCase()) && jsTable.validLetter(String.fromCharCode(e.keyCode)))) { // Characters
                                // Start edition
                                jsTable.current.openEditor(jsTable.current.records[rowId][columnId], true);
                            }
                        }
                    }
                }
            } else {
                if (e.target.classList.contains('jsTable_search')) {
                    if (jsTable.timeControl) {
                        clearTimeout(jsTable.timeControl);
                    }

                    jsTable.timeControl = setTimeout(function() {
                        jsTable.current.search(e.target.value);
                    }, 200);
                }
            }
        }
    }

    jsTable.isMouseAction = false;

    jsTable.mouseDownControls = function(e) {
        e = e || window.event;
        let mouseButton = e.buttons || e.button || e.which;

        // Get elements
        let jstableTable = jsTable.getElement(e.target);

        if (jstableTable[0]) {
            if (jsTable.current !== jstableTable[0].jsTable) {
                if (jsTable.current) {
                    if (jsTable.current.edition) {
                        jsTable.current.closeEditor(jsTable.current.edition[0], true);
                    }
                    jsTable.current.resetSelection();
                }
                jsTable.current = jstableTable[0].jsTable;
            }
        } else {
            if (jsTable.current) {
                if (jsTable.current.edition) {
                    jsTable.current.closeEditor(jsTable.current.edition[0], true);
                }

                jsTable.current.resetSelection(true);
                jsTable.current = null;
            }
        }

        if (jsTable.current && mouseButton === 1) {
            if (e.target.classList.contains('jsTable_selectall')) {
                if (jsTable.current) {
                    jsTable.current.selectAll();
                }
            } else if (e.target.classList.contains('jsTable_corner')) {
                jsTable.current.selectedCorner = true;
            } else {
                // Header found
                if (jstableTable[1] === 1) {
                    let columnId = e.target.getAttribute('data-x');
                    if (columnId) {
                        // Update cursor
                        let info = e.target.getBoundingClientRect();
                        if (jsTable.current.options.columnResize && info.width - e.offsetX < 6) {
                            // Resize helper
                            jsTable.current.resizing = {
                                mousePosition: e.pageX,
                                column: columnId,
                                width: info.width,
                            };

                            // Border indication
                            jsTable.current.headers[columnId].classList.add('resizing');
                            for (let j = 0; j < jsTable.current.records.length; ++j) {
                                if (jsTable.current.records[j][columnId]) {
                                    jsTable.current.records[j][columnId].classList.add('resizing');
                                }
                            }
                        } else if (jsTable.current.options.columnDrag == true && info.height - e.offsetY < 6) {
                            // Reset selection
                            jsTable.current.resetSelection();
                            // Drag helper
                            jsTable.current.dragging = {
                                element: e.target,
                                column:columnId,
                                destination:columnId,
                            };
                            // Border indication
                            jsTable.current.headers[columnId].classList.add('dragging');
                            for (var j = 0; j < jsTable.current.records.length; j++) {
                                if (jsTable.current.records[j][columnId]) {
                                    jsTable.current.records[j][columnId].classList.add('dragging');
                                }
                            }
                        } else {
                            if (jsTable.current.selectedHeader && (e.shiftKey || e.ctrlKey)) {
                                var o = jsTable.current.selectedHeader;
                                var d = columnId;
                            } else {
                                // Press to rename
                                if (jsTable.current.selectedHeader == columnId && jsTable.current.options.allowRenameColumn == true) {
                                    jsTable.timeControl = setTimeout(function() {
                                        jsTable.current.setHeader(Number(columnId));
                                    }, 800);
                                }

                                // Keep track of which header was selected first
                                jsTable.current.selectedHeader = columnId;

                                // Update selection single column
                                var o = columnId;
                                var d = columnId;
                            }

                            // Update selection
                            jsTable.current.updateSelectionFromCoords(o, 0, d, jsTable.current.options.data.length - 1);
                        }
                    } else {
                        if (e.target.parentNode.classList.contains('jsTable_nested')) {
                            if (e.target.getAttribute('data-column')) {
                                var column = e.target.getAttribute('data-column').split(',');
                                var c1 = parseInt(column[0]);
                                var c2 = parseInt(column[column.length-1]);
                            } else {
                                var c1 = 0;
                                var c2 = jsTable.current.options.columns.length - 1;
                            }
                            jsTable.current.updateSelectionFromCoords(c1, 0, c2, jsTable.current.options.data.length - 1);
                        }
                    }
                } else {
                    jsTable.current.selectedHeader = false;
                }

                // Body found
                if (jstableTable[1] == 2) {
                    var rowId = e.target.getAttribute('data-y');

                    if (e.target.classList.contains('jsTable_row')) {
                        var info = e.target.getBoundingClientRect();
                        if (jsTable.current.options.rowResize == true && info.height - e.offsetY < 6) {
                            // Resize helper
                            jsTable.current.resizing = {
                                element: e.target.parentNode,
                                mousePosition: e.pageY,
                                row: rowId,
                                height: info.height,
                            };
                            // Border indication
                            e.target.parentNode.classList.add('resizing');
                        } else if (jsTable.current.options.rowDrag == true && info.width - e.offsetX < 6) {
                            if (jsTable.current.options.search == true && jsTable.current.results) {
                                console.error('jsTable: Please clear your search before perform this action');
                            } else {
                                // Reset selection
                                jsTable.current.resetSelection();
                                // Drag helper
                                jsTable.current.dragging = {
                                    element: e.target.parentNode,
                                    row:rowId,
                                    destination:rowId,
                                };
                                // Border indication
                                e.target.parentNode.classList.add('dragging');
                            }
                        } else {
                            if (jsTable.current.selectedRow && (e.shiftKey || e.ctrlKey)) {
                                var o = jsTable.current.selectedRow;
                                var d = rowId;
                            } else {
                                // Keep track of which header was selected first
                                jsTable.current.selectedRow = rowId;

                                // Update selection single column
                                var o = rowId;
                                var d = rowId;
                            }

                            // Update selection
                            jsTable.current.updateSelectionFromCoords(0, o, jsTable.current.options.data[0].length - 1, d);
                        }
                    } else {
                        // Jclose
                        if (e.target.classList.contains('jclose') && e.target.clientWidth - e.offsetX < 50 && e.offsetY < 50) {
                            jsTable.current.closeEditor(jsTable.current.edition[0], true);
                        } else {
                            var getCellCoords = function(element) {
                                var x = element.getAttribute('data-x');
                                var y = element.getAttribute('data-y');
                                if (x && y) {
                                    return [x, y];
                                } else {
                                    if (element.parentNode) {
                                        return getCellCoords(element.parentNode);
                                    }
                                }
                            };

                            var position = getCellCoords(e.target);
                            if (position) {

                                var columnId = position[0];
                                var rowId = position[1];
                                // Close edition
                                if (jsTable.current.edition) {
                                    if (jsTable.current.edition[2] != columnId || jsTable.current.edition[3] != rowId) {
                                        jsTable.current.closeEditor(jsTable.current.edition[0], true);
                                    }
                                }

                                if (! jsTable.current.edition) {
                                    // Update cell selection
                                    if (e.shiftKey) {
                                        jsTable.current.updateSelectionFromCoords(jsTable.current.selectedCell[0], jsTable.current.selectedCell[1], columnId, rowId);
                                    } else {
                                        jsTable.current.updateSelectionFromCoords(columnId, rowId);
                                    }
                                }

                                // No full row selected
                                jsTable.current.selectedHeader = null;
                                jsTable.current.selectedRow = null;
                            }
                        }
                    }
                } else {
                    jsTable.current.selectedRow = false;
                }

                // Pagination
                if (e.target.classList.contains('jsTable_page')) {
                    if (e.target.innerText === '<') {
                        jsTable.current.page(0);
                    } else if (e.target.innerText === '>') {
                        jsTable.current.page(e.target.getAttribute('title') - 1);
                    } else {
                        jsTable.current.page(e.target.innerText - 1);
                    }
                }
            }

            if (jsTable.current.edition) {
                jsTable.isMouseAction = false;
            } else {
                jsTable.isMouseAction = true;
            }
        } else {
            jsTable.isMouseAction = false;
        }
    }

    jsTable.mouseUpControls = function(e) {
        if (jsTable.current) {
            // Update cell size
            if (jsTable.current.resizing) {
                // Columns to be updated
                if (jsTable.current.resizing.column) {
                    // New width
                    var newWidth = jsTable.current.colgroup[jsTable.current.resizing.column].getAttribute('width');
                    // Columns
                    var columns = jsTable.current.getSelectedColumns();
                    if (columns.length > 1) {
                        var currentWidth = [];
                        for (var i = 0; i < columns.length; i++) {
                            currentWidth.push(parseInt(jsTable.current.colgroup[columns[i]].getAttribute('width')));
                        }
                        // Previous width
                        var index = columns.indexOf(parseInt(jsTable.current.resizing.column));
                        currentWidth[index] = jsTable.current.resizing.width;
                        jsTable.current.setWidth(columns, newWidth, currentWidth);
                    } else {
                        jsTable.current.setWidth(jsTable.current.resizing.column, newWidth, jsTable.current.resizing.width);
                    }
                    // Remove border
                    jsTable.current.headers[jsTable.current.resizing.column].classList.remove('resizing');
                    for (var j = 0; j < jsTable.current.records.length; j++) {
                        if (jsTable.current.records[j][jsTable.current.resizing.column]) {
                            jsTable.current.records[j][jsTable.current.resizing.column].classList.remove('resizing');
                        }
                    }
                } else {
                    // Remove Class
                    jsTable.current.rows[jsTable.current.resizing.row].children[0].classList.remove('resizing');
                    var newHeight = jsTable.current.rows[jsTable.current.resizing.row].getAttribute('height');
                    jsTable.current.setHeight(jsTable.current.resizing.row, newHeight, jsTable.current.resizing.height);
                    // Remove border
                    jsTable.current.resizing.element.classList.remove('resizing');
                }
                // Reset resizing helper
                jsTable.current.resizing = null;
            } else if (jsTable.current.dragging) {
                // Reset dragging helper
                if (jsTable.current.dragging) {
                    if (jsTable.current.dragging.column) {
                        // Target
                        var columnId = e.target.getAttribute('data-x');
                        // Remove move style
                        jsTable.current.headers[jsTable.current.dragging.column].classList.remove('dragging');
                        for (var j = 0; j < jsTable.current.rows.length; j++) {
                            if (jsTable.current.records[j][jsTable.current.dragging.column]) {
                                jsTable.current.records[j][jsTable.current.dragging.column].classList.remove('dragging');
                            }
                        }
                        for (var i = 0; i < jsTable.current.headers.length; i++) {
                            jsTable.current.headers[i].classList.remove('dragging-left');
                            jsTable.current.headers[i].classList.remove('dragging-right');
                        }
                        // Update position
                        if (columnId) {
                            if (jsTable.current.dragging.column != jsTable.current.dragging.destination) {
                                jsTable.current.moveColumn(jsTable.current.dragging.column, jsTable.current.dragging.destination);
                            }
                        }
                    } else {
                        if (jsTable.current.dragging.element.nextSibling) {
                            var position = parseInt(jsTable.current.dragging.element.nextSibling.getAttribute('data-y'));
                            if (jsTable.current.dragging.row < position) {
                                position -= 1;
                            }
                        } else {
                            var position = parseInt(jsTable.current.dragging.element.previousSibling.getAttribute('data-y'));
                        }
                        if (jsTable.current.dragging.row != jsTable.current.dragging.destination) {
                            jsTable.current.moveRow(jsTable.current.dragging.row, position, true);
                        }
                        jsTable.current.dragging.element.classList.remove('dragging');
                    }
                    jsTable.current.dragging = null;
                }
            } else {
                // Close any corner selection
                if (jsTable.current.selectedCorner) {
                    jsTable.current.selectedCorner = false;

                    // Data to be copied
                    if (jsTable.current.selection.length > 0) {
                        // Copy data
                        jsTable.current.copyData(jsTable.current.selection[0], jsTable.current.selection[jsTable.current.selection.length - 1]);

                        // Remove selection
                        jsTable.current.removeCopySelection();
                    }
                }
            }
        }

        // Clear any time control
        if (jsTable.timeControl) {
            clearTimeout(jsTable.timeControl);
            jsTable.timeControl = null;
        }

        // Mouse up
        jsTable.isMouseAction = false;
    }

    // Mouse move controls
    jsTable.mouseMoveControls = function(e) {
        e = e || window.event;
        if (e.buttons) {
            var mouseButton = e.buttons;
        } else if (e.button) {
            var mouseButton = e.button;
        } else {
            var mouseButton = e.which;
        }

        if (! mouseButton) {
            jsTable.isMouseAction = false;
        }

        if (jsTable.current) {
            if (jsTable.isMouseAction == true) {
                // Resizing is ongoing
                if (jsTable.current.resizing) {
                    if (jsTable.current.resizing.column) {
                        var width = e.pageX - jsTable.current.resizing.mousePosition;

                        if (jsTable.current.resizing.width + width > 0) {
                            var tempWidth = jsTable.current.resizing.width + width;
                            jsTable.current.colgroup[jsTable.current.resizing.column].setAttribute('width', tempWidth);

                            jsTable.current.updateCornerPosition();
                        }
                    } else {
                        var height = e.pageY - jsTable.current.resizing.mousePosition;

                        if (jsTable.current.resizing.height + height > 0) {
                            var tempHeight = jsTable.current.resizing.height + height;
                            jsTable.current.rows[jsTable.current.resizing.row].setAttribute('height', tempHeight);

                            jsTable.current.updateCornerPosition();
                        }
                    }
                }
            } else {
                var x = e.target.getAttribute('data-x');
                var y = e.target.getAttribute('data-y');
                var rect = e.target.getBoundingClientRect();

                if (jsTable.current.cursor) {
                    jsTable.current.cursor.style.cursor = '';
                    jsTable.current.cursor = null;
                }

                if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className) {
                    if (e.target.parentNode.parentNode.classList.contains('resizable')) {
                        if (e.target && x && ! y && (rect.width - (e.clientX - rect.left) < 6)) {
                            jsTable.current.cursor = e.target;
                            jsTable.current.cursor.style.cursor = 'col-resize';
                        } else if (e.target && ! x && y && (rect.height - (e.clientY - rect.top) < 6)) {
                            jsTable.current.cursor = e.target;
                            jsTable.current.cursor.style.cursor = 'row-resize';
                        }
                    }

                    if (e.target.parentNode.parentNode.classList.contains('draggable')) {
                        if (e.target && ! x && y && (rect.width - (e.clientX - rect.left) < 6)) {
                            jsTable.current.cursor = e.target;
                            jsTable.current.cursor.style.cursor = 'move';
                        } else if (e.target && x && ! y && (rect.height - (e.clientY - rect.top) < 6)) {
                            jsTable.current.cursor = e.target;
                            jsTable.current.cursor.style.cursor = 'move';
                        }
                    }
                }
            }
        }
    }

    jsTable.mouseOverControls = function(e) {
        e = e || window.event;

        let mouseButton;
        if (e.buttons) {
            mouseButton = e.buttons;
        } else if (e.button) {
            mouseButton = e.button;
        } else {
            mouseButton = e.which;
        }

        if (! mouseButton) {
            jsTable.isMouseAction = false;
        }

        if (jsTable.current && jsTable.isMouseAction) {
            // Get elements
            let jsTableElement = jsTable.getElement(e.target);

            if (jsTableElement[0]) {
                // Avoid cross reference
                if (jsTable.current !== jsTableElement[0].jsTable) {
                    if (jsTable.current) {
                        return false;
                    }
                }

                let columnId = parseInt(e.target.getAttribute('data-x'));
                let rowId = parseInt(e.target.getAttribute('data-y'));

                if (jsTable.current.dragging) {
                    if (jsTable.current.dragging.column) {
                        if (columnId) {
                            for (let i = 0; i < jsTable.current.headers.length; ++i) {
                                jsTable.current.headers[i].classList.remove('dragging-left');
                                jsTable.current.headers[i].classList.remove('dragging-right');
                            }

                            if (parseInt(jsTable.current.dragging.column) === columnId) {
                                jsTable.current.dragging.destination = columnId;
                            } else {
                                if (e.target.clientWidth / 2 > e.offsetX) {
                                    if (jsTable.current.dragging.column < columnId) {
                                        jsTable.current.dragging.destination = columnId - 1;
                                    } else {
                                        jsTable.current.dragging.destination = columnId;
                                    }
                                    jsTable.current.headers[columnId].classList.add('dragging-left');
                                } else {
                                    if (jsTable.current.dragging.column < columnId) {
                                        jsTable.current.dragging.destination = columnId;
                                    } else {
                                        jsTable.current.dragging.destination = columnId + 1;
                                    }
                                    jsTable.current.headers[columnId].classList.add('dragging-right');
                                }
                            }
                        }
                    } else {
                        if (rowId) {
                            let target = (e.target.clientHeight / 2 > e.offsetY) ? e.target.parentNode.nextSibling : e.target.parentNode;
                            if (jsTable.current.dragging.element !== target) {
                                e.target.parentNode.parentNode.insertBefore(jsTable.current.dragging.element, target);
                                jsTable.current.dragging.destination = Array.prototype.indexOf.call(jsTable.current.dragging.element.parentNode.children, jsTable.current.dragging.element);
                            }
                        }
                    }
                } else if (jsTable.current.resizing) {
                } else {
                    // Header found
                    if (jsTableElement[1] === 1) {
                        if (jsTable.current.selectedHeader) {
                            let columnId = parseInt(e.target.getAttribute('data-x'));
                            let o = jsTable.current.selectedHeader;
                            let d = columnId;
                            // Update selection
                            jsTable.current.updateSelectionFromCoords(o, 0, d, jsTable.current.options.data.length - 1);
                        }
                    }

                    // Body found
                    if (jsTableElement[1] === 2) {
                        if (e.target.classList.contains('jsTable_row')) {
                            if (jsTable.current.selectedRow) {
                                let o = jsTable.current.selectedRow;
                                let d = rowId;
                                // Update selection
                                jsTable.current.updateSelectionFromCoords(0, o, jsTable.current.options.data[0].length - 1, d);
                            }
                        } else {
                            // Do not select when edition is in progress
                            if (! jsTable.current.edition) {
                                if (columnId && rowId) {
                                    if (jsTable.current.selectedCorner) {
                                        jsTable.current.updateCopySelection(columnId, rowId);
                                    } else {
                                        if (jsTable.current.selectedCell) {
                                            jsTable.current.updateSelectionFromCoords(jsTable.current.selectedCell[0], jsTable.current.selectedCell[1], columnId, rowId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Clear any time control
        if (jsTable.timeControl) {
            clearTimeout(jsTable.timeControl);
            jsTable.timeControl = null;
        }
    }

    /**
     * Double click event handler: controls the double click in the corner, cell edition or column re-ordering.
     */
    jsTable.doubleClickControls = function(e) {
        // jsTable is selected
        if (jsTable.current) {
            // Corner action
            if (e.target.classList.contains('jsTable_corner')) {
                // Any selected cells
                if (jsTable.current.highlighted.length > 0) {
                    // Copy from this
                    var x1 = jsTable.current.highlighted[0].getAttribute('data-x');
                    var y1 = parseInt(jsTable.current.highlighted[jsTable.current.highlighted.length - 1].getAttribute('data-y')) + 1;
                    // Until this
                    var x2 = jsTable.current.highlighted[jsTable.current.highlighted.length - 1].getAttribute('data-x');
                    var y2 = jsTable.current.records.length - 1
                    // Execute copy
                    jsTable.current.copyData(jsTable.current.records[y1][x1], jsTable.current.records[y2][x2]);
                }
            } else if (e.target.classList.contains('jsTable_column_filter')) {
                // Column
                var columnId = e.target.getAttribute('data-x');
                // Open filter
                jsTable.current.openFilter(columnId);

            } else {
                // Get table
                var jsTableElement = jsTable.getElement(e.target);

                // Double click over header
                if (jsTableElement[1] == 1 && jsTable.current.options.columnSorting == true) {
                    // Check valid column header coords
                    var columnId = e.target.getAttribute('data-x');
                    if (columnId) {
                        jsTable.current.orderBy(columnId);
                    }
                }

                // Double click over body
                if (jsTableElement[1] == 2) {
                    if (! jsTable.current.edition) {
                        var getCellCoords = function(element) {
                            if (element.parentNode) {
                                var x = element.getAttribute('data-x');
                                var y = element.getAttribute('data-y');
                                if (x && y) {
                                    return element;
                                } else {
                                    return getCellCoords(element.parentNode);
                                }
                            }
                        }
                        var cell = getCellCoords(e.target);
                        if (cell && cell.classList.contains('highlight')) {
                            jsTable.current.openEditor(cell);
                        }
                    }
                }
            }
        }
    }

    jsTable.copyControls = function(e) {
        if (jsTable.current && jsTable.copyControls.enabled) {
            if (! jsTable.current.edition) {
                jsTable.current.copy(true);
            }
        }
    }

    jsTable.cutControls = function(e) {
        if (jsTable.current) {
            if (! jsTable.current.edition) {
                jsTable.current.copy(true);
                jsTable.current.setValue(jsTable.current.highlighted, '');
            }
        }
    }

    jsTable.pasteControls = function(e) {
        if (jsTable.current && jsTable.current.selectedCell) {
            if (! jsTable.current.edition) {
                if (e && e.clipboardData) {
                    jsTable.current.paste(jsTable.current.selectedCell[0], jsTable.current.selectedCell[1], e.clipboardData.getData('text'));
                    e.preventDefault();
                } else if (window.clipboardData) {
                    jsTable.current.paste(jsTable.current.selectedCell[0], jsTable.current.selectedCell[1], window.clipboardData.getData('text'));
                }
            }
        }
    }

    jsTable.contextMenuControls = function(e) {
        e = e || window.event;

        let mouseButton;
        if ("buttons" in e) {
            mouseButton = e.buttons;
        } else {
            mouseButton = e.which || e.button;
        }

        if (jsTable.current) {
            if (jsTable.current.edition) {
                e.preventDefault();
            } else if (jsTable.current.options.contextMenu) {
                jsTable.current.contextMenu.contextmenu.close();

                if (jsTable.current) {
                    var x = e.target.getAttribute('data-x');
                    var y = e.target.getAttribute('data-y');

                    if (x || y) {
                        if ((x < parseInt(jsTable.current.selectedCell[0])) || (x > parseInt(jsTable.current.selectedCell[2])) ||
                            (y < parseInt(jsTable.current.selectedCell[1])) || (y > parseInt(jsTable.current.selectedCell[3])))
                        {
                            jsTable.current.updateSelectionFromCoords(x, y, x, y);
                        }

                        // Table found
                        var items = jsTable.current.options.contextMenu(jsTable.current, x, y, e);
                        // The id is depending on header and body
                        jsTable.current.contextMenu.contextmenu.open(e, items);
                        // Avoid the real one
                        e.preventDefault();
                    }
                }
            }
        }
    }

    jsTable.touchStartControls = function(e) {
        var jsTableElement = jsTable.getElement(e.target);

        if (jsTableElement[0]) {
            if (jsTable.current != jsTableElement[0].jsTable) {
                if (jsTable.current) {
                    jsTable.current.resetSelection();
                }
                jsTable.current = jsTableElement[0].jsTable;
            }
        } else {
            if (jsTable.current) {
                jsTable.current.resetSelection();
                jsTable.current = null;
            }
        }

        if (jsTable.current) {
            if (! jsTable.current.edition) {
                var columnId = e.target.getAttribute('data-x');
                var rowId = e.target.getAttribute('data-y');

                if (columnId && rowId) {
                    jsTable.current.updateSelectionFromCoords(columnId, rowId);

                    jsTable.timeControl = setTimeout(function() {
                        // Keep temporary reference to the element
                        jsTable.tmpElement = e.target;
                        jsTable.current.openEditor(e.target, false, e);
                    }, 500);
                }
            }
        }
    }

    jsTable.touchEndControls = function(e) {
        // Clear any time control
        if (jsTable.timeControl) {
            clearTimeout(jsTable.timeControl);
            jsTable.timeControl = null;
            // Element
            if (jsTable.tmpElement && jsTable.tmpElement.children[0].tagName == 'INPUT') {
                jsTable.tmpElement.children[0].focus();
            }
            jsTable.tmpElement = null;
        }
    }

    /**
     * Valid international letter
     */
    jsTable.validLetter = function (text) {
        let regex = /([\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC-\u0400-\u04FF']+)/g;
        return text.match(regex) ? 1 : 0;
    }

    /**
     * Helper injectArray
     */
    jsTable.injectArray = function(o, idx, arr) {
        return o.slice(0, idx).concat(arr).concat(o.slice(idx));
    }

    /**
     * Get letter based on a number
     *
     * @param {numeric} i
     * @return {string} letter
     */
    jsTable.getColumnName = function(i) {
        let letter = '';
        if (i > 701) {
            letter += String.fromCharCode(64 + parseInt(i / 676));
            letter += String.fromCharCode(64 + parseInt((i % 676) / 26));
        } else if (i > 25) {
            letter += String.fromCharCode(64 + parseInt(i / 26));
        }
        letter += String.fromCharCode(65 + (i % 26));

        return letter;
    }

    /**
     * Convert Excel-like column to jsTable ID
     *
     * @param string id
     * @param bool arr
     * @return string id
     */
    jsTable.getIdFromColumnName = function (id, arr) {
        // Get the letters
        let t = /^[a-zA-Z]+/.exec(id);

        if (t) {
            // Base 26 calculation
            let code = 0;
            for (let i = 0; i < t[0].length; ++i) {
                code += parseInt(t[0].charCodeAt(i) - 64) * Math.pow(26, (t[0].length - 1 - i));
            }
            code--;
            // Make sure jsTable starts on zero
            if (code < 0) {
                code = 0;
            }

            // Number
            let number = parseInt(/[0-9]+$/.exec(id));
            if (number > 0) {
                number--;
            }

            if (arr) {
                id = [ code, number ];
            } else {
                id = code + '-' + number;
            }
        }

        return id;
    }

    /**
     * Convert jsTable ID to Excel-like column name
     *
     * @param string id
     * @return string id
     */
    jsTable.getColumnNameFromId = function (cellId) {
        if (! Array.isArray(cellId)) {
            cellId = cellId.split('-');
        }

        return jsTable.getColumnName(parseInt(cellId[0])) + (parseInt(cellId[1]) + 1);
    }

    /**
     * Determine the table container of the element given in parameter, as
     * well as the section where it is present.
     *
     * @param {Object} element - The element to find
     * @return {array} - The first value is the container of the jsTable, the
     *                   second value is the type of section (1 for THEAD, 2
     *                   for TBODY).
     */
    jsTable.getElement = function(element) {
        let jsTableSection = 0;
        let jsTableElement = null;

        function path (element) {
            if (element.className && element.classList.contains('jsTable_container')) {
                jsTableElement = element;
            }

            if (element.tagName === 'THEAD') {
                jsTableSection = 1;
            } else if (element.tagName === 'TBODY') {
                jsTableSection = 2;
            }

            if (element.parentNode && ! jsTableElement) {
                path(element.parentNode);
            }
        }

        path(element);

        return [ jsTableElement, jsTableSection ];
    }

    /**
     * jQuery Support
     */
    if (typeof(jQuery) !== 'undefined') {
        (function($){
            $.fn.jsTable = function(method) {
                let spreadsheetContainer = $(this).get(0);
                if (! spreadsheetContainer.jsTable) {
                    return jsTable($(this).get(0), arguments[0]);
                } else {
                    return spreadsheetContainer.jsTable[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
                }
            };
        })(jQuery);
    }

    return jsTable;
})));
