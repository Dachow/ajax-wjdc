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

            submit();
            loadDesc();
            // loadInformation();
            loadContent();
            divideItems(1);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function submit() {
    var xx = document.getElementById("submit");
    xx.innerText = "提交问卷调查";
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

// function loadInformation() {
//
//     // 获取题干内容
//     var title = xmlDoc.getElementsByTagName("title")[1].childNodes[0].nodeValue;
//     var yy = xmlDoc.getElementsByTagName("information")[0].getElementsByTagName("item");
//     var list = [];
//     for (var i = 0; i < yy.length; i++) {
//         var getOpt = yy[i].getElementsByTagName("option");
//         var optList = [];
//
//         var hdContent = yy[i].getElementsByTagName("hd")[0].childNodes[0].nodeValue;
//         for (var j = 0; j < getOpt.length; j++) {
//             optList += "<label><input type='radio' name='" + hdContent + "' />" + getOpt[j].childNodes[0].nodeValue + "</label>";
//         }
//         list.push({
//             hd: hdContent,
//             bd: optList
//         });
//     }
//
//     // 新建一个节点追加到form
//     var info = document.createElement("section");
//     info.setAttribute("id", "information");
//     document.getElementById('content').appendChild(info);
//
//     // 输出题干
//     var titleWrap = document.createElement("div");
//     titleWrap.setAttribute("class", "title");
//     document.getElementById('information').appendChild(titleWrap);
//     document.getElementsByClassName("title")[1].innerHTML = title;
//
//     // 写入数据
//     for (var k = 0; k < list.length; k++) {
//         var items = document.createElement("div");
//         items.setAttribute("class", "items");
//         document.getElementById('information').appendChild(items);
//         document.getElementsByClassName('items')[k].innerHTML = list[k].hd + list[k].bd;
//     }
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
                if (yy[i].attributes[0].nodeValue == "dx") {
                    if (target == "option") {
                        optList += "<label><input type='radio' name='" + hdContent + "' />" + yy[i].getElementsByTagName("option")[j].childNodes[0].nodeValue + "</label>";
                    } else {
                        optList += "<label><input type='radio' name='" + hdContent + "' />" + yy[i].getElementsByTagName("other")[0].childNodes[0].nodeValue + "<input /></label>";
                    }
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
            info.setAttribute("id", "contentwrap"+targetContent);
            document.getElementById('content').appendChild(info);

            // 输出题干
            var titleWrap = document.createElement("div");
            titleWrap.setAttribute("class", "title");
            document.getElementById('contentwrap'+targetContent).appendChild(titleWrap);
            document.getElementsByClassName("title")[targetContent].innerHTML = title;

            // 写入数据
            for (var k = 0; k < list.length; k++) {

                // 获得题目总数
                getSumItems = addItems(k);
                var items = document.createElement("div");
                items.setAttribute("class", "items");
                document.getElementById('contentwrap'+targetContent).appendChild(items);
                document.getElementById('contentwrap'+targetContent).getElementsByClassName('items')[k].innerHTML = list[k].hd + list[k].bd;
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
function divideItems (num) {

    const PAGEITEM = num;
    // console.log(getSumItems);
    var totalItem = getSumItems;
    var targetPage = Math.floor(totalItem / PAGEITEM);
    var targetPageItem = totalItem % PAGEITEM;
    // console.log(targetPage, targetPageItem);

    // 隐藏大于i的题目
    for(var i=PAGEITEM; i<totalItem; i++) {
        document.getElementsByClassName("items")[i].style.display = "none";
        var getSection = document.getElementsByTagName("section");
        for (var j = 1; j < getSection.length-1; j++) {
            if (i <= getSection[j].getElementsByClassName("items").length) {
                getSection[j+1].style.display = "none";
            }
        }
    }
    // 添加分页按钮
    if (PAGEITEM < totalItem) {
        var createPageBt1 = document.createElement("button");
        createPageBt1.setAttribute("class", "page"+1);
        document.getElementById("page").appendChild(createPageBt1);
        document.getElementsByClassName("page"+1)[0].innerHTML = "1";
    }

//有问题
    for (var a = 0; (a < targetPage) && (targetPageItem !== 0); a++) {
        var createPageBt = document.createElement("button");
        createPageBt.setAttribute("class", "page"+(a+2));
        document.getElementById("page").appendChild(createPageBt);
        document.getElementsByClassName("page"+(a+2))[0].innerHTML = (a+2);
    }

}
