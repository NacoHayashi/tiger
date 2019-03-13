;'use strict';
(function (win) {
var advertierId = '10021',
        pixelId = '20028';

/* the div put slider detail data */
var SliderBox = function (options) {
    var el,
        $el,
        bigTitle,
        smallTitle,
        imgSrc,
        link;


    var init = function (options) {
        bigTitle = options.title.big;
        smallTitle = options.title.little;
        imgSrc = options.img;
        link = options.link;
        render();
    }

    var render = function () {
        el =    '<a href="' + link + '">' + 
                    '<div class="ad_imgBox">' +
                        '<div class="ad_title">' + 
                        '<h4>' + smallTitle + '</h4>' + '<h2>' + bigTitle + '</h2>' +
                        '</div>' +
                        '<img src="' + imgSrc + '" alt="' + smallTitle + '&nbsp;' + bigTitle + '">' +
                    '</div>' +
                '</a>' 

        $el = document.createElement('div');
        $el.classList.add('ad_sliderDiv');
        $el.innerHTML = el;
    }

    this.getEl = function () {
        return $el;
    }

    init.call(this,options);
}

/* the index icon button  */
var NavButton = function (options) {
    var index,
        getBtnIndex,
        el;

    var init = function (options) {
        index = options.index;
        getBtnIndex = options.getBtnIndex;
        render();
        event();
    }
    var render = function () {
        el = document.createElement('button');
    }

    var event = function () {
        el.addEventListener('click', returnIndex);
    }

    this.activeButton = function (options) {
        var sliderIdx = options.options;
        var buttonItems = options.item;
        buttonItems.forEach(function (btn,i) {
            if(sliderIdx == i){
                btn.classList.add('is-active');
            } else {
                btn.classList.remove('is-active');
            }
        })
    }
    var returnIndex = function () {
        getBtnIndex(index);
    }

    this.getEl = function () {
        return el;
    }
    init.call(this,options);
}


/* control nav button */
var SliderNav = function (options) {
    var data,
        indexFromBtn,
        $el,
        button,
        totalBtn;

    var init = function (options) {
        data = options.item;
        indexFromBtn = options.indexFromBtn;
        cacheDOM();
        newButton(data);
        firstActiveButton(0);
    }

    var cacheDOM = function () {
        $el = document.getElementById('ad_buttons');
    } 

    var newButton = function () {
        data.forEach(function (item,index) {
            button = new NavButton({index:index,getBtnIndex:getBtnIndex});
            $el.appendChild(button.getEl());
        });
    }

    var getBtnIndex = function (options) {
        indexFromBtn(options);
    }

    var firstActiveButton = function (options) {
        totalBtn = document.querySelectorAll('#ad_buttons button');
        button.activeButton({options:options,item:totalBtn});
    }

    this.getSliderIndex = function (options) {
        button.activeButton({options:options,item:totalBtn});
    }
    this.getEl = function () {
        return $el;
    }

    init.call(this,options);
}

/* control seima slider and nav */
var SliderWrap = function (options) {
    var MySiema,
        area,
        Nav,
        prevBtn,
        nextBtn,
        creative;

    var init = function (options) {
        newSliderDiv(options);
        Nav = new SliderNav({item:options,indexFromBtn:indexFromBtn});

        MySiema = new Siema({
            selector: '.siema',
            duration: 200,
            easing: 'ease-out',
            perPage: 1,
            startIndex: 0,
            draggable: true,
            multipleDrag: true,
            threshold: 20,
            loop: true,
            rtl: false,
            onInit:sliderInit,
            onChange: sliderOnchange,
          });
        cacheDOM();
        event();
        prevButton();
        nextButton();
    }

    var cacheDOM = function () {
        prevBtn = document.querySelector('.prev');
        nextBtn = document.querySelector('.next');
    }

    var event = function () {
        setInterval(sliderNext, 2000);
        prevBtn.addEventListener('click', prevButton);
        nextBtn.addEventListener('click', nextButton );
    }

    // slider init
    var sliderInit = function () {
        var index = this.currentSlide;
        returnIndexToNav(index);
        // setNameAndExitUrlAndImpression(index);
    }

    // slider onchange
    var sliderOnchange = function () {
        var index = this.currentSlide;
        returnIndexToNav(index);
        // setNameAndExitUrlAndImpression(index);
    }

    var prevButton = function () {
        MySiema.prev();
    }

    var nextButton = function () {
        MySiema.next();
    } 
    
    //for slider autoplay
    var sliderNext = function () {
        MySiema.next()
    }

    //new slider Box
    var newSliderDiv = function (options) {
         options.forEach(function (item) {
            var sliderBox =  new SliderBox(item);
            area = document.getElementById('ad_slider');
             area.appendChild(sliderBox.getEl());
        });
    }

    // get icon index and go to that page
    var indexFromBtn = function (options) {
        MySiema.goTo(options);
    }

    var returnIndexToNav = function (index) {
        Nav.getSliderIndex(index);
    }

    this.cacheFeed = function (options) {
        creative = options;
    }

    var setNameAndExitUrlAndImpression = function (index) {
        var idx = index,
            feed = creative[idx],
            image = new Image;

        image.src = 'https://r.adgeek.net/' + advertierId + '/imp/' + pixelId + '?product_id=' + creative.uKey;

        this.$content.src = creative.Content;
        this.$cta.innerHTML = creative.cta;
        this.exitUrl = creative.ExitUrl.Url;
        this.uKey = creative.uKey;
        Enabler.counter('Impression_' + creative.name, false);
    }

    this.onClickExit = function (e) {
        e.preventDefault();
        // Enabler.exitOverride("exit name goes here", this.exitUrl);
        var exitUrl = 'https://r.adgeek.net/' + advertierId + '/click/' + pixelId + '?product_id=' + this.uKey + '&redirectUrl=' + encodeURIComponent(this.exitUrl);
        // console.log(exitUrl);
        Enabler.counter('Click_' + this.uKey, false);
        Enabler.exitOverride("ExitUrl", exitUrl);
    }
   init.call(this,options);
}

/* data control */
var App = function () {
    var data,
        wrap;

    var dataBox = function () {

        data = [{
            title:{
                little:'0-1歲月齡版',
                big:'超人氣教材搶先看'
            },
            img:'https://www.benesse.com.tw/html/events/buy/pro/DSP/201903021.jpg',
            link:'https://www.benesse.com.tw/html/events/buy/pro/2018/1903/start/m12.html'
        },{
            title:{
                little:'1-2歲寶寶版',
                big:'超人氣教材搶先看'
            },
            img:'https://www.benesse.com.tw/html/events/buy/pro/DSP/201903022.jpg',
            link:'https://www.benesse.com.tw/html/events/buy/pro/2018/1903/baobao/index.html'
        },{
            title:{
                little:'2-3歲幼幼版',
                big:'超人氣教材搶先看'
            },
            img:'https://www.benesse.com.tw/html/events/buy/pro/DSP/201903023.jpg',
            link:'https://www.benesse.com.tw/html/events/buy/pro/2018/1903/yoyo/index.html'
        },{
            title:{
                little:'3-4歲快樂版',
                big:'超人氣教材搶先看'
            },
            img:'https://www.benesse.com.tw/html/events/buy/pro/DSP/201903024.jpg',
            link:'https://www.benesse.com.tw/html/events/buy/pro/2018/1903/happy/index.html'
        },]
    }
    var init = function () {
        dataBox();
        wrap = new SliderWrap(data);

    }
   
    this.initialCreatives = function (options) {
        wrap.cacheFeed(options);
    }

    init.call(this.options)
}
win.app = new App;
})(window);


if (!Enabler.isInitialized()) {
    Enabler.addEventListener(
      studio.events.StudioEvent.INIT,
      enablerInitialized);
  } else {
     enablerInitialized();
  }

  function enablerInitialized() {
    // Enabler initialized.
    // In App ads are rendered offscreen so animation should wait for
    // the visible event. These are simulated with delays in the local
    // environment.
    if (!Enabler.isVisible()) {
      Enabler.addEventListener(
        studio.events.StudioEvent.VISIBLE,
        adVisible);
    } else {
       adVisible();
    }
  }
  function adVisible() {
    // Ad visible, start ad/animation.
    Enabler.setProfileId(10376228);
    var devDynamicContent = {};

    devDynamicContent.datafeed = [{}, {}, {}, {}];
    devDynamicContent.datafeed[0]._id = 0;
    devDynamicContent.datafeed[0].uKey = 111;
    devDynamicContent.datafeed[0].name = "0~1歲專屬月齡版";
    devDynamicContent.datafeed[0].Content = "../images/content-01.png";
    devDynamicContent.datafeed[0].cta = "搶先看";
    devDynamicContent.datafeed[0].Report_ID = 111;
    devDynamicContent.datafeed[0].Report_Name = "\u5FA9\u4EC7\u8005\u806F\u76DF3\uFF1A\u7121\u9650\u4E4B\u6230";
    devDynamicContent.datafeed[0].Cover = {};
    devDynamicContent.datafeed[0].Cover.Url = "../images/right-01.png";
    devDynamicContent.datafeed[0].ExitUrl = {};
    devDynamicContent.datafeed[0].ExitUrl.Url = "https://www.benesse.com.tw/html/events/buy/pro/2018/1903/start/m12.html";
    devDynamicContent.datafeed[1].uKey = 222;
    devDynamicContent.datafeed[1].name = "1-2歲專屬寶寶版";
    devDynamicContent.datafeed[1].Content = "../images/content-02.png";
    devDynamicContent.datafeed[1].cta = "搶先看";
    devDynamicContent.datafeed[1].Report_ID = 222;
    devDynamicContent.datafeed[1].Report_Name = "\u5FA9\u4EC7\u8005\u806F\u76DF3\uFF1A\u7121\u9650\u4E4B\u6230";
    devDynamicContent.datafeed[1].Cover = {};
    devDynamicContent.datafeed[1].Cover.Url = "../images/right-02.png";
    devDynamicContent.datafeed[1].ExitUrl = {};
    devDynamicContent.datafeed[1].ExitUrl.Url = "https://www.benesse.com.tw/html/events/buy/pro/2018/1903/baobao/index.html";
    devDynamicContent.datafeed[2].uKey = 333;
    devDynamicContent.datafeed[2].name = "2-3歲專屬幼幼版";
    devDynamicContent.datafeed[2].Content = "../images/content-03.png";
    devDynamicContent.datafeed[2].cta = "搶先看";
    devDynamicContent.datafeed[2].Report_ID = 333;
    devDynamicContent.datafeed[2].Report_Name = "\u5FA9\u4EC7\u8005\u806F\u76DF3\uFF1A\u7121\u9650\u4E4B\u6230";
    devDynamicContent.datafeed[2].Cover = {};
    devDynamicContent.datafeed[2].Cover.Url = "../images/right-03.png";
    devDynamicContent.datafeed[2].ExitUrl = {};
    devDynamicContent.datafeed[2].ExitUrl.Url = "https://www.benesse.com.tw/html/events/buy/pro/2018/1903/yoyo/index.html";
    devDynamicContent.datafeed[3].uKey = 444;
    devDynamicContent.datafeed[3].name = "3-4歲專屬快樂版";
    devDynamicContent.datafeed[3].Content = "../images/content-04.png";
    devDynamicContent.datafeed[3].cta = "搶先看";
    devDynamicContent.datafeed[3].Report_ID = 444;
    devDynamicContent.datafeed[3].Report_Name = "\u5FA9\u4EC7\u8005\u806F\u76DF3\uFF1A\u7121\u9650\u4E4B\u6230";
    devDynamicContent.datafeed[3].Cover = {};
    devDynamicContent.datafeed[3].Cover.Url = "../images/right-04.png";
    devDynamicContent.datafeed[3].ExitUrl = {};
    devDynamicContent.datafeed[3].ExitUrl.Url = "https://www.benesse.com.tw/html/events/buy/pro/2018/1903/happy/index.html";
    Enabler.setDevDynamicContent(devDynamicContent);

    window.app.initialCreatives(dynamicContent.datafeed);

  }