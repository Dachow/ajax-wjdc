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
            loadInformation();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function submit() {
    var xx = document.getElementsByTagName("button")[0];
    xx.innerText = "提交问卷调查";
}

function loadDesc() {
    // 获取description的内容
    var title = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
    var yy = xmlDoc.getElementsByTagName("description")[0].getElementsByTagName("p");
    var req = "";
    for (var i = 0; i < yy.length; i++) {
        if (yy[i].childNodes[0].nodeType == 3) {
            req += "<li>" + yy[i].childNodes[0].nodeValue + "</li>";
        }
    }
    // 新建一个节点追加到form
    var desc = document.createElement("div");
    desc.setAttribute("id", "description");
    document.getElementById('content').appendChild(desc);
    // 写入数据
    document.getElementById('description').innerHTML = "<div class='title'>" + title + "</div>" + req;
}

function loadInformation() {

    // 获取题干内容
    var title = xmlDoc.getElementsByTagName("title")[1].childNodes[0].nodeValue;
    var yy = xmlDoc.getElementsByTagName("information")[0].getElementsByTagName("item");
    var list = [];
    for (var i = 0; i < yy.length; i++) {
        var getOpt = yy[i].getElementsByTagName("option");
        var optList = [];

        var hdContent = yy[i].getElementsByTagName("hd")[0].childNodes[0].nodeValue;
        for (var j = 0; j < getOpt.length; j++) {
            optList += "<label><input type='radio' name='" + hdContent + "' />" + getOpt[j].childNodes[0].nodeValue + "</label>";
        }
        list.push({
            hd: hdContent,
            bd: optList
        });
    }

    // 新建一个节点追加到form
    var info = document.createElement("div");
    info.setAttribute("id", "information");
    document.getElementById('content').appendChild(info);

    // 写入数据
    
    for (var k = 0; k < list.length; k++) {
        var items = document.createElement("div");
        items.setAttribute("class", "items");
        document.getElementById('information').appendChild(items);
        document.getElementsByClassName('items')[k].innerHTML = list[k].hd + list[k].bd;
    }

}
