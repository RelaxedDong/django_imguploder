function add_selected_img(src, widget_name) {
    $("#upload_image_" + widget_name).before("<div class=\"selected-img\">\n" +
        "    <i class=\"iconfont icon-delete delete_icon_image\" data-widgetname=\"" + widget_name + "\" title=\"删除图片\" onclick='delete_img(this)'></i>\n" +
        "    <img class=\"widget_imgs " + widget_name + "_values\" src=\"" + src.replace("'", '').replace("'", '') + "\" alt=\"待选图片\" onclick='show_big_img(this)'>\n" +
        "</div>");
    updateTextareaValue(widget_name);
}

function getRotate(_this, index) {
    var degree = (_this.data('rotate') || 0) - 90;
    set_big_img_degree(degree);
}

function imgShow(outerdiv, innerdiv, bigimg, obj) {
    var src = obj.src;//获取当前点击的pimg元素中的src属性
    var widget_name = $(obj).attr('class');
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性
    $(bigimg).attr("current_widget", widget_name);
    var windowW = $(window).width();//获取当前窗口宽度
    var windowH = $(window).height();//获取当前窗口高度
    var realWidth = obj.naturalWidth;//获取图片真实宽度
    var realHeight = obj.naturalHeight;//获取图片真实高度
    var imgWidth, imgHeight;
    var scale = 0.9;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
    if (realHeight > windowH * scale) {//判断图片高度
        imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放
        imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度
        if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度
            imgWidth = windowW * scale;//再对宽度进行缩放
        }
    } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度
        imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放
        imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度
    } else {//如果图片真实高度和宽度都符合要求，高宽不变
        imgWidth = realWidth;
        imgHeight = realHeight;
    }
    $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放
    var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距
    var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距
    $(innerdiv).css({"top": h, "left": w});//设置#innerdiv的top和left属性
    $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
    set_big_img_degree(0);
}

function updateTextareaValue(widget_name) {
    var imageUrls = [];
    $('.' + widget_name + '_values').each(function () {
        var imgUrl = $(this).attr('src');
        imageUrls.push(imgUrl);
    });
    $('#' + widget_name).val(imageUrls);
}


function getCurrentIndexByObj(current_widget, src) {
    let currentIndex = 0
    var images = document.getElementsByClassName(current_widget); // 获取所有图片元素
    for (var i = 0; i < images.length; i++) {
        if (images[i].src == src) {
            currentIndex = i;
            break;
        }
    }
    return currentIndex
}

//因为图片是动态添加的，所以不能使用选择器选择。
function show_big_img(obj) {
    // 判断当前的这个对象地址是第几个
    imgShow("#outerdiv", "#innerdiv", "#bigimg", obj);
}

function delete_img(e) {
    var name = $(e).data('widgetname');
    $(e).closest('.selected-img').remove();
    updateTextareaValue(name);
}

document.addEventListener("keydown", function (event) {
    if (!$("#bigimg").is(":visible")) {
        return;
    }
    if (event.keyCode === 27) {
        // ESC 键
        $("#outerdiv").fadeOut("fast");
        set_big_img_degree(0);
    } else if (event.keyCode in {37: 1, 39: 1}) {
        // 左右键切换图片
        let current_widget = $("#bigimg").attr("current_widget");
        let current_src = $("#bigimg").attr("src")
        let currentIndex = getCurrentIndexByObj(current_widget, current_src);
        let isNextImage = (event.keyCode === 39);
        let node = getNextImage(current_widget, isNextImage, currentIndex);
        show_big_img(node);
    }
});

function set_big_img_degree(degree) {
    let _this = $("#bigimg")
    _this.css('transform', 'rotate(' + degree + 'deg)');
    _this.css('-ms-transform', 'rotate(' + degree + 'deg)');
    _this.css('-webkit-transform', 'rotate(' + degree + 'deg)');
    _this.css('-moz-transform', 'rotate(' + degree + 'deg)');
    _this.data('rotate', degree);
}

$(function () {
    $("#bigimg").click(function () {//再次点击淡出消失弹出层
        getRotate($("#bigimg"), 1);
        return false;
    });
    $("#outerdiv").click(function () {//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
        set_big_img_degree(0);
        return false;
    });
})

function getNextImage(widget_name, is_next, currentIndex) {
    var images = document.getElementsByClassName(widget_name); // 获取所有图片元素
    if (is_next) {
        if (currentIndex + 1 >= images.length) {
            currentIndex = 0;
        } else {
            currentIndex = currentIndex + 1;
        }
    } else {
        if (currentIndex - 1 < 0) {
            currentIndex = images.length - 1;
        } else {
            currentIndex = currentIndex - 1;
        }
    }
    return images[currentIndex];
}

