(function(global) {
    //定义一些默认参数
    'use strict';
    var DEFAULT_PAGE_NUM = 10;
    var PAGE_INDEX_NUM = 5;
    var _options = {
        current_page: 0, // 当前页
        total_page: 0, // 总页数
        total_count: 0, // 总数量
        page_num: 0, // 每页个数
    }
    var _parent_ele;
    var _input_page = 0;
    var _pagination = {
        paging: function(parent_ele, current_page, total_page, page_num) {
            if (isNaN(Number(current_page))) {
                throw '当前页参数非数字';
                return;
            }
            if (isNaN(Number(total_page))) {
                throw '总页数参数非数字';
                return;
            }
            if (total_page < current_page) {
                throw '总页数不能小于当前页';
                return;
            }
            _options.current_page = current_page <= 1 ? 1 : current_page >= total_page ? total_page : current_page;
            _options.total_page = total_page <= 0 ? 1 : total_page;
            _options.page_num = isNaN(Number(page_num)) ? DEFAULT_PAGE_NUM : page_num;
            _parent_ele = parent_ele;
            this.render(_options);
        },
        render: function(options) {
            // 清空子节点
            var childs = _parent_ele.childNodes;
            for (var i = childs.length - 1; i >= 0; i--) {
                _parent_ele.removeChild(childs[i]);
            }
            var _li_nav = _page_item.createNav(options);
            _parent_ele.appendChild(_li_nav);
            var _li_l = _page_item.create('l', options);
            _parent_ele.appendChild(_li_l);
            var _left_page = options.total_page - options.current_page + 1; // 剩余页数
            var _page_index_from = 0;
            if (_left_page < PAGE_INDEX_NUM) {
                _page_index_from = options.total_page - PAGE_INDEX_NUM + 1; // 剩余页数不足5页时,保留倒数5个页索引
                _page_index_from = _page_index_from < 0 ? 1 : _page_index_from;
            } else {
                _page_index_from = options.current_page
            }
            var _page_index_num = options.total_page < PAGE_INDEX_NUM ? options.total_page : PAGE_INDEX_NUM;
            for (var i = 0; i < _page_index_num; i++) {
                var _li_i = _page_item.create('', options, _page_index_from + i);
                _parent_ele.appendChild(_li_i);
            }
            var _li_r = _page_item.create('r', options);
            var _li_jump = _page_item.createJump();
            _parent_ele.appendChild(_li_r);
            _parent_ele.appendChild(_li_jump);
        },
    }
    var _page_item = {
        createNav: function(options){
            var _li = document.createElement('li');
            _li.className = 'page-item disabled';
            var _a = document.createElement('a');
            _a.className = 'page-link';
            _a.style.borderColor = '#FFFFFF';
            _a.innerText = options.current_page+'/'+options.total_page;
            _li.appendChild(_a);
            return _li;
        },
        create: function(side, options, page_index) {
            var _li = document.createElement('li');
            _li.className = 'page-item';
            var _a = document.createElement('a');
            _a.className = 'page-link';
            if (side == 'l') {
                if (options.current_page == 1) {
                    _li.classList.add('disabled');
                } else {
                    _li.dataset.toPage = options.current_page - 1;
                }
                _a.innerText = '«';
            } else if (side == 'r') {
                if (options.current_page == options.total_page) {
                    _li.classList.add('disabled');
                } else {
                    _li.dataset.toPage = options.current_page + 1;
                }
                _a.innerText = '»';
            } else {
                if (options.current_page == page_index) {
                    _li.classList.add('active');
                } else {
                    _li.dataset.toPage = page_index;
                }
                _a.innerText = page_index;
            }
            _li.appendChild(_a);
            _li.addEventListener('click', function(e) {
                var _toPage = this.dataset.toPage;
                if (!isNaN(Number(_toPage))) { // 是数字判断
                    _options.current_page = Number(_toPage);
                    _pagination.render(_options);
                }
            });
            return _li;
        },
        createJump: function() {
            var _li = document.createElement('li');
            _li.className = 'page-item form-element';
            _li.style.width = '100px';
            var _div = document.createElement('div');
            _div.style.display = 'flex';
            var _div_col3 = document.createElement('div');
            _div_col3.className = 'col-sm-6';
            _div_col3.style.paddingLeft = '5px';
            _div_col3.style.paddingRight = '5px';
            var _input = document.createElement('input');
            _input.className = 'form-control page-input';
            _input.value = _options.current_page;
            _div_col3.appendChild(_input);
            var _span = document.createElement('span');
            _span.className = 'page-go';
            var _button = document.createElement('button');
            _button.className = 'btn btn-primary btn-sm';
            _button.style.height = '2rem';
            _button.innerText = 'Go';
            _button.addEventListener('click', function(e) {
                var _value = _input.value;
                if (!isNaN(Number(_value))) { // 是数字判断
                    var _page = Number(_value);
                    if (_page <= 0) {
                        _page = 1;
                    } else if (_page >= _options.total_page) {
                        _page = _options.total_page;
                    }
                    _options.current_page = _page;
                    _pagination.render(_options);
                }
            });
            _span.appendChild(_button);
            _div.appendChild(_div_col3);
            _div.appendChild(_span);


            _li.appendChild(_div);
            return _li;
        }
    }
    global.pagination = _pagination;
})(this);