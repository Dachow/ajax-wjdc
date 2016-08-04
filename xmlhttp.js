function loadXMLDoc(url) {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            xmlDoc = xmlhttp.responseXML.documentElement;

            begin();
            loadDesc();
            // loadInformation();
            loadContent();

            divideItems(3);
            addPageBt();
            // pageBtClick();
            selectIt();
            targetPage(1);
            selectItems();

            submitIt();

        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function begin() {
    var xx = document.getElementById("beginBt");
    // xx.innerText = "提交问卷调查";
    xx.style.display = "none";
    // xx.submit();
}

// 返回elems子元素个数
function getChildElementsLength(elems) {
    var i = 0;
    for (var j = 0; j < elems.childNodes.length; j++) {
        if (elems.childNodes[j].nodeType == 1) {
            i += 1;
        }
    }
    return i;
}
// 返回elems子元素标签名数组
function getChildElementsName(elems) {
    var i = 0;
    var list = [];
    for (var j = 0; j < elems.childNodes.length; j++) {
        if (elems.childNodes[j].nodeType == 1) {
            list[i] = elems.childNodes[j].nodeName;
            i += 1;
        }
    }
    return list;
}

function loadDesc() {
    // 获取description的内容
    var title = xmlDoc.getElementsByTagName("notice")[0].childNodes[0].nodeValue;
    var yy = xmlDoc.getElementsByTagName("description")[0].getElementsByTagName("p");
    var req = "";
    for (var i = 0; i < yy.length; i++) {
        if (yy[i].childNodes[0].nodeType == 3) {
            req += "<li>" + yy[i].childNodes[0].nodeValue + "</li>";
        }
    }
    // 新建一个节点追加到form
    var desc = document.createElement("section");
    desc.setAttribute("id", "description");
    document.getElementById('content').appendChild(desc);
    // 写入数据
    document.getElementById('description').innerHTML = "<div class='notice'>" + title + "</div>" + req;
}

// function optIndex () {
//
// }

function loadContent() {
    // 获取题干内容
    var getContentLength = xmlDoc.getElementsByTagName("section").length;

    for (targetContent = 0; targetContent < getContentLength; targetContent++) {

        var title = xmlDoc.getElementsByTagName("title")[targetContent].childNodes[0].nodeValue;
        var yy = xmlDoc.getElementsByTagName("section")[targetContent].getElementsByTagName("item");

        // var zz = childElements(yy[4].getElementsByTagName("bd")[i]);
        var list = [];
        // 循环item
        for (var i = 0; i < yy.length; i++) {

            // 获取选项个数
            var childLength = getChildElementsLength(yy[i].getElementsByTagName("bd")[0]);
            // 获取选项集合
            var childName = getChildElementsName(yy[i].getElementsByTagName("bd")[0]);
            var optList = [];
            var hdContent = yy[i].getElementsByTagName("hd")[0].childNodes[0].nodeValue;
            // 循环选项
            for (var j = 0; j < childLength; j++) {

                // 获取item > bd里当前循环的选项
                var target = childName[j];

                // 外层判断单多选,内层判断标签是option还是other
                // // 有问题
                if (yy[i].attributes[0].nodeValue == "dx") {
                    if (target == "option") {
                        // for (var index = 0; index < array.length; index++) {
                        //     var indexOpt = childName[j].toString().indexOf("option", index);
                        // }
                        optList += "<label><input type='radio' name='" + hdContent + "' />" + yy[i].getElementsByTagName("option")[j].childNodes[0].nodeValue + "</label>";

                    } else if (target == "other") {
                        optList += "<label><input type='radio' name='" + hdContent + "' />" + yy[i].getElementsByTagName("other")[0].childNodes[0].nodeValue + "<input /></label>";
                    }
                    //  else {
                    //     optList += "<label>" + yy[i].getElementsByTagName("add")[0].childNodes[0].nodeValue + "</label>";
                    // }
                } else if (yy[i].attributes[0].nodeValue == "sx") {
                    if (target == "option") {
                        optList += "<label><input type='checkbox' name='" + hdContent + "' />" + yy[i].getElementsByTagName("option")[j].childNodes[0].nodeValue + "</label>";
                    } else {
                        optList += "<label><input type='checkbox' name='" + hdContent + "' />" + yy[i].getElementsByTagName("other")[0].childNodes[0].nodeValue + "<input /></label>";
                    }
                } else if (yy[i].attributes[0].nodeValue == "textarea") {
                    optList += "<textarea></textarea>";
                }
            }
            list.push({
                hd: hdContent,
                bd: optList
            });
        }

        // 新建一个节点追加到form
        var info = document.createElement("section");
        info.setAttribute("id", "contentwrap" + targetContent);
        document.getElementById('content').appendChild(info);

        // 输出题干
        var titleWrap = document.createElement("div");
        titleWrap.setAttribute("class", "title");
        document.getElementById('contentwrap' + targetContent).appendChild(titleWrap);
        document.getElementsByClassName("title")[targetContent].innerHTML = title;

        // 写入数据
        for (var k = 0; k < list.length; k++) {

            // 获得题目总数
            getSumItems = addItems(k);
            var items = document.createElement("div");
            items.setAttribute("class", "items");
            document.getElementById('contentwrap' + targetContent).appendChild(items);
            document.getElementById('contentwrap' + targetContent).getElementsByClassName('items')[k].innerHTML = list[k].hd + list[k].bd;
        }
    }
}

// 每次渲染一个item加1
function addItems(targetK) {
    if (targetContent === 0 && targetK === 0) {
        sumItems = 1;
    } else {
        sumItems += 1;
    }
    return sumItems;
}

// 分割页面
function divideItems(num) {

    PAGEITEM = num;
    // console.log(getSumItems);
    totalItem = getSumItems;
    var targetPage = Math.floor(totalItem / PAGEITEM);
    var targetPageItem = totalItem % PAGEITEM;
    // console.log(targetPage, targetPageItem);

    // 隐藏大于i的题目
    // for(var i=PAGEITEM; i<totalItem; i++) {
    //     document.getElementsByClassName("items")[i].style.display = "none";
    //     var getSection = document.getElementsByTagName("section");
    //     for (var j = 1; j < getSection.length-1; j++) {
    //         if (i <= getSection[j].getElementsByClassName("items").length) {
    //             getSection[j+1].style.display = "none";
    //         }
    //     }
    // }

    // 隐藏所有题目 显示指定数目的题
    // var getSection = document.getElementsByTagName("section");
    // var getItems = document.getElementsByClassName("items");
    // for (var i = 1; i < totalItem; i++) {
    //     getItems[i].style.display = "none";
    // }
    // for (var j = 0; j < PAGEITEM; j++) {
    //     getItems[j].style.display = "block";
    //     for (var k = 1; k < getSection.length-1; k++) {
    //       if (PAGEITEM <= getSection[k].getElementsByClassName("items").length){
    //         getSection[k+1].style.display = "none";
    //       }
    //     }
    // }
}

function addPageBt() {
    // 添加第一页分页按钮
    if (PAGEITEM < totalItem) {
        var createPageBt1 = document.createElement("button");
        createPageBt1.setAttribute("class", "page" + 1);
        createPageBt1.setAttribute("value", 1);
        createPageBt1.setAttribute("onclick", "targetPage(1)");
        document.getElementById("page").appendChild(createPageBt1);
        document.getElementsByClassName("page" + 1)[0].innerHTML = "1";
    }

    // 添加其余页按钮
    for (var a = 0;
        (a < targetPage) && (PAGEITEM !== totalItem); a++) {
        var createPageBt = document.createElement("button");
        createPageBt.setAttribute("class", "page" + (a + 2));
        createPageBt.setAttribute("value", (a + 2));
        createPageBt.setAttribute("onclick", "targetPage" + "(" + (a + 2) + ")");
        document.getElementById("page").appendChild(createPageBt);
        document.getElementsByClassName("page" + (a + 2))[0].innerHTML = (a + 2);
    }
}

function targetPage(event) {

    // 同步下拉框
    var getSelect = document.getElementById("selectWrap");
    getSelect.value = event - 1;


    // 初始化隐藏所有item
    var getSection = document.getElementsByTagName("section");
    var getItems = document.getElementsByClassName("items");
    for (var i = 0; i < totalItem; i++) {
        getItems[i].style.display = "none";
    }

    // 点击第一个按钮和其它按钮
    if (event == 1) {
        for (var j = 0; j < PAGEITEM; j++) {
            getItems[j].style.display = "block";
            for (var k = 1; k < getSection.length - 1; k++) {
                // TODO 问题
                if (PAGEITEM <= getSection[k].getElementsByClassName("items").length) {
                    getSection[k + 1].getElementsByClassName("title")[0].style.display = "none";
                }
            }
        }
    } else {
        var getBtLength = document.getElementById("page").getElementsByTagName("button").length;

        // 如果点击最后一页
        if (event == getBtLength) {
            for (var a = PAGEITEM * (getBtLength - 1); a < totalItem; a++) {
                getItems[a].style.display = "block";
            }
        } else {
            for (var b = PAGEITEM * (event - 1); b < PAGEITEM * event; b++) {
                getItems[b].style.display = "block";
                for (var bI = 1; bI < getSection.length - 1; bI++) {
                    if (PAGEITEM * event <= getSection[bI].getElementsByClassName("items").length) {
                        getSection[bI + 1].getElementsByClassName("title")[0].style.display = "none";
                    }
                }
            }
        }
    }
}


function selectIt() {
    var TotalItemsL = document.createElement("span");
    TotalItemsL.setAttribute("class", "TotalItemsL");
    document.getElementById('content').appendChild(TotalItemsL);
    document.getElementsByClassName("TotalItemsL")[0].innerHTML = "共" + totalItem + "条";



    var getBtWrap = document.getElementById("page");

    var noticePageL = document.createElement("span");
    noticePageL.setAttribute("class", "noticePageL");
    document.getElementById('content').appendChild(noticePageL);
    document.getElementsByClassName("noticePageL")[0].innerHTML = "当前第 ";

    var select = document.createElement("select");
    select.setAttribute("id", "selectWrap");
    select.setAttribute("onclick", "targetOption" + "(" + ")");
    document.getElementById('content').appendChild(select);

    var noticePageR = document.createElement("span");
    noticePageR.setAttribute("class", "noticePageR");
    document.getElementById('content').appendChild(noticePageR);
    document.getElementsByClassName("noticePageR")[0].innerHTML = " 页，";


    try {
        // var getBt = getBtWrap.getElementsByTagName("button");

        for (var i = 0; i < Math.ceil(totalItem / PAGEITEM); i++) {
            var option = document.createElement("option");
            option.setAttribute("value", i);

            document.getElementById('selectWrap').appendChild(option);
            document.getElementById("selectWrap").getElementsByTagName("option")[i].innerHTML = i + 1;
        }
    } catch (e) {
        // return;
    } finally {
        // return targetPage(targetNum);
    }
}

// 当前第几页点击事件
function targetOption() {
    var target = document.getElementById("selectWrap");
    // console.log(typeof(xx.value));
    // 调用对应按钮
    targetPage((parseInt(target.value) + 1));
}


function selectItems() {

    var noticeItemsL = document.createElement("span");
    noticeItemsL.setAttribute("class", "noticeItemsL");
    document.getElementById('content').appendChild(noticeItemsL);
    document.getElementsByClassName("noticeItemsL")[0].innerHTML = "每页显示 ";

    var select = document.createElement("select");
    select.setAttribute("id", "selectItemsWrap");
    select.setAttribute("onclick", "selectItemsOption" + "(" + ")");
    document.getElementById('content').appendChild(select);

    var noticeItemsR = document.createElement("span");
    noticeItemsR.setAttribute("class", "noticeItemsR");
    document.getElementById('content').appendChild(noticeItemsR);
    document.getElementsByClassName("noticeItemsR")[0].innerHTML = " 条";

    try {
        // var getBt = getBtWrap.getElementsByTagName("button");
        for (var i = 0; i < totalItem; i++) {
            var option = document.createElement("option");
            option.setAttribute("value", i);

            document.getElementById('selectItemsWrap').appendChild(option);
            document.getElementById("selectItemsWrap").getElementsByTagName("option")[i].innerHTML = i + 1;
        }
    } catch (e) {
        // return;
    } finally {
        // 更新下拉框
        var getTargetItems = document.getElementById("selectItemsWrap");
        getTargetItems.value = PAGEITEM - 1;
    }
}

function selectItemsOption() {
    var target = document.getElementById("selectItemsWrap");
    divideItems((parseInt(target.value) + 1));
    targetPage(1);
    // targetOption();
    // selectIt(1);
}

function submitIt() {
    var submitBt = document.createElement("input");
    submitBt.setAttribute("type", "submit");
    submitBt.setAttribute("name", "submit");
    submitBt.setAttribute("value", "提交");
    document.getElementById('content').appendChild(submitBt);
    // document.getElementsByClassName("submitBt")[0].innerHTML = "提交";
}
