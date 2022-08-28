// ==UserScript==
// @name         Emby danmaku extension
// @description  Emby弹幕插件
// @namespace    https://github.com/RyoLee
// @author       RyoLee
// @version      1.9
// @copyright    2022, RyoLee (https://github.com/RyoLee)
// @license      MIT; https://raw.githubusercontent.com/RyoLee/emby-danmaku/master/LICENSE
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @updateURL    https://cdn.jsdelivr.net/gh/RyoLee/emby-danmaku@gh-pages/ede.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/RyoLee/emby-danmaku@gh-pages/ede.user.js
// @grant        none
// @match        */web/index.html
// ==/UserScript==

(async function () {
    'use strict';
    if (document.querySelector('meta[name="application-name"]').content == 'Emby') {
        // ------ configs start------
        const check_interval = 200;
        const chConverTtitle = ['当前状态: 未启用', '当前状态: 转换为简体', '当前状态: 转换为繁体'];
        // 0:当前状态关闭 1:当前状态打开
        const danmaku_icons = ['\uE0B9', '\uE7A2'];
        const search_icon = '\uE881';
        const translate_icon = '\uE927';
        const info_icon = '\uE0E0';
        const filter_icons = ['\uE3E0', '\uE3D0', '\uE3D1', '\uE3D2'];
        const buttonOptions = {
            class: 'paper-icon-button-light',
            is: 'paper-icon-button-light',
        };
        const uiQueryStr = '.videoOsd-centerButtons';
        const mediaContainerQueryStr = "div[data-type='video-osd']";
        const mediaQueryStr = 'video';
        const displayButtonOpts = {
            title: '弹幕开关',
            id: 'displayDanmaku',
            innerText: null,
            onclick: () => {
                if (window.ede.loading) {
                    console.log('正在加载,请稍后再试');
                    return;
                }
                console.log('切换弹幕开关');
                window.ede.danmakuSwitch = (window.ede.danmakuSwitch + 1) % 2;
                window.localStorage.setItem('danmakuSwitch', window.ede.danmakuSwitch);
                document.querySelector('#displayDanmaku').children[0].innerText = danmaku_icons[window.ede.danmakuSwitch];
                if (window.ede.danmaku) {
                    window.ede.danmakuSwitch == 1 ? window.ede.danmaku.show() : window.ede.danmaku.hide();
                }
            },
        };
        const searchButtonOpts = {
            title: '搜索弹幕',
            id: 'searchDanmaku',
            innerText: search_icon,
            onclick: () => {
                if (window.ede.loading) {
                    console.log('正在加载,请稍后再试');
                    return;
                }
                console.log('手动匹配弹幕');
                reloadDanmaku('search');
            },
        };
        const translateButtonOpts = {
            title: null,
            id: 'translateDanmaku',
            innerText: translate_icon,
            onclick: () => {
                if (window.ede.loading) {
                    console.log('正在加载,请稍后再试');
                    return;
                }
                console.log('切换简繁转换');
                window.ede.chConvert = (window.ede.chConvert + 1) % 3;
                window.localStorage.setItem('chConvert', window.ede.chConvert);
                document.querySelector('#translateDanmaku').setAttribute('title', chConverTtitle[window.ede.chConvert]);
                reloadDanmaku('reload');
                console.log(document.querySelector('#translateDanmaku').getAttribute('title'));
            },
        };
        const infoButtonOpts = {
            title: '弹幕信息',
            id: 'printDanmakuInfo',
            innerText: info_icon,
            onclick: () => {
                if (!window.ede.episode_info || window.ede.loading) {
                    console.log('正在加载,请稍后再试');
                    return;
                }
                console.log('显示当前信息');
                let msg = '动画名称:' + window.ede.episode_info.animeTitle;
                if (window.ede.episode_info.episodeTitle) {
                    msg += '\n分集名称:' + window.ede.episode_info.episodeTitle;
                }
                sendNotification('当前弹幕匹配', msg);
            },
        };

        const filterButtonOpts = {
            title: '过滤等级(下次加载生效)',
            id: 'filteringDanmaku',
            innerText: null,
            onclick: () => {
                console.log('切换弹幕过滤等级');
                let level = window.localStorage.getItem('danmakuFilterLevel');
                level = ((level ? parseInt(level) : 0) + 1) % 4;
                window.localStorage.setItem('danmakuFilterLevel', level);
                document.querySelector('#filteringDanmaku').children[0].innerText = filter_icons[level];
            },
        };
        // ------ configs end------
        /* eslint-disable */
        /* https://cdn.jsdelivr.net/npm/danmaku/dist/danmaku.dom.min.js */
        // prettier-ignore
        !function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).Danmaku=i()}(this,(function(){"use strict";var t=function(){for(var t=["oTransform","msTransform","mozTransform","webkitTransform","transform"],i=document.createElement("div").style,e=0;e<t.length;e++)if(t[e]in i)return t[e];return"transform"}();function i(t){var i=document.createElement("div");if(i.style.cssText="position:absolute;","function"==typeof t.render){var e=t.render();if(e instanceof HTMLElement)return i.appendChild(e),i}if(i.textContent=t.text,t.style)for(var n in t.style)i.style[n]=t.style[n];return i}var e={name:"dom",init:function(){var t=document.createElement("div");return t.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);",t},clear:function(t){for(var i=t.lastChild;i;)t.removeChild(i),i=t.lastChild},resize:function(t,i,e){t.style.width=i+"px",t.style.height=e+"px"},framing:function(){},setup:function(t,e){var n=document.createDocumentFragment(),s=0,h=null;for(s=0;s<e.length;s++)(h=e[s]).node=h.node||i(h),n.appendChild(h.node);for(e.length&&t.appendChild(n),s=0;s<e.length;s++)(h=e[s]).width=h.width||h.node.offsetWidth,h.height=h.height||h.node.offsetHeight},render:function(i,e){e.node.style[t]="translate("+e.x+"px,"+e.y+"px)"},remove:function(t,i){t.removeChild(i.node),this.media||(i.node=null)}};function n(t){var i=this,e=this.media?this.media.currentTime:Date.now()/1e3,n=this.media?this.media.playbackRate:1;function s(t,s){if("top"===s.mode||"bottom"===s.mode)return e-t.time<i._.duration;var h=(i._.width+t.width)*(e-t.time)*n/i._.duration;if(t.width>h)return!0;var r=i._.duration+t.time-e,o=i._.width+s.width,a=i.media?s.time:s._utc,d=o*(e-a)*n/i._.duration,m=i._.width-d;return r>i._.duration*m/(i._.width+s.width)}for(var h=this._.space[t.mode],r=0,o=0,a=1;a<h.length;a++){var d=h[a],m=t.height;if("top"!==t.mode&&"bottom"!==t.mode||(m+=d.height),d.range-d.height-h[r].range>=m){o=a;break}s(d,t)&&(r=a)}var u=h[r].range,l={range:u+t.height,time:this.media?t.time:t._utc,width:t.width,height:t.height};return h.splice(r+1,o-r-1,l),"bottom"===t.mode?this._.height-t.height-u%this._.height:u%(this._.height-t.height)}var s=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(t){return setTimeout(t,50/3)},h=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||clearTimeout;function r(t,i,e){for(var n=0,s=0,h=t.length;s<h-1;)e>=t[n=s+h>>1][i]?s=n:h=n;return t[s]&&e<t[s][i]?s:h}function o(t){return/^(ltr|top|bottom)$/i.test(t)?t.toLowerCase():"rtl"}function a(){var t=9007199254740991;return[{range:0,time:-t,width:t,height:0},{range:t,time:t,width:0,height:0}]}function d(t){t.ltr=a(),t.rtl=a(),t.top=a(),t.bottom=a()}function m(){if(!this._.visible||!this._.paused)return this;if(this._.paused=!1,this.media)for(var t=0;t<this._.runningList.length;t++){var i=this._.runningList[t];i._utc=Date.now()/1e3-(this.media.currentTime-i.time)}var e=this,h=function(t,i,e,s){return function(){t(this._.stage);var h=Date.now()/1e3,r=this.media?this.media.currentTime:h,o=this.media?this.media.playbackRate:1,a=null,d=0,m=0;for(m=this._.runningList.length-1;m>=0;m--)a=this._.runningList[m],r-(d=this.media?a.time:a._utc)>this._.duration&&(s(this._.stage,a),this._.runningList.splice(m,1));for(var u=[];this._.position<this.comments.length&&(a=this.comments[this._.position],!((d=this.media?a.time:a._utc)>=r));)r-d>this._.duration||(this.media&&(a._utc=h-(this.media.currentTime-a.time)),u.push(a)),++this._.position;for(i(this._.stage,u),m=0;m<u.length;m++)(a=u[m]).y=n.call(this,a),this._.runningList.push(a);for(m=0;m<this._.runningList.length;m++){a=this._.runningList[m];var l=(this._.width+a.width)*(h-a._utc)*o/this._.duration;"ltr"===a.mode&&(a.x=l-a.width+.5|0),"rtl"===a.mode&&(a.x=this._.width-l+.5|0),"top"!==a.mode&&"bottom"!==a.mode||(a.x=this._.width-a.width>>1),e(this._.stage,a)}}}(this._.engine.framing.bind(this),this._.engine.setup.bind(this),this._.engine.render.bind(this),this._.engine.remove.bind(this));return this._.requestID=s((function t(){h.call(e),e._.requestID=s(t)})),this}function u(){return!this._.visible||this._.paused||(this._.paused=!0,h(this._.requestID),this._.requestID=0),this}function l(){if(!this.media)return this;this.clear(),d(this._.space);var t=r(this.comments,"time",this.media.currentTime);return this._.position=Math.max(0,t-1),this}function c(t){t.play=m.bind(this),t.pause=u.bind(this),t.seeking=l.bind(this),this.media.addEventListener("play",t.play),this.media.addEventListener("pause",t.pause),this.media.addEventListener("playing",t.play),this.media.addEventListener("waiting",t.pause),this.media.addEventListener("seeking",t.seeking)}function f(t){this.media.removeEventListener("play",t.play),this.media.removeEventListener("pause",t.pause),this.media.removeEventListener("playing",t.play),this.media.removeEventListener("waiting",t.pause),this.media.removeEventListener("seeking",t.seeking),t.play=null,t.pause=null,t.seeking=null}function p(t){this._={},this.container=t.container||document.createElement("div"),this.media=t.media,this._.visible=!0,this.engine="dom",this._.engine=e,this._.requestID=0,this._.speed=Math.max(0,t.speed)||144,this._.duration=4,this.comments=t.comments||[],this.comments.sort((function(t,i){return t.time-i.time}));for(var i=0;i<this.comments.length;i++)this.comments[i].mode=o(this.comments[i].mode);return this._.runningList=[],this._.position=0,this._.paused=!0,this.media&&(this._.listener={},c.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.cssText+="position:relative;pointer-events:none;",this.resize(),this.container.appendChild(this._.stage),this._.space={},d(this._.space),this.media&&this.media.paused||(l.call(this),m.call(this)),this}function _(){if(!this.container)return this;for(var t in u.call(this),this.clear(),this.container.removeChild(this._.stage),this.media&&f.call(this,this._.listener),this)Object.prototype.hasOwnProperty.call(this,t)&&(this[t]=null);return this}var g=["mode","time","text","render","style"];function v(t){if(!t||"[object Object]"!==Object.prototype.toString.call(t))return this;for(var i={},e=0;e<g.length;e++)void 0!==t[g[e]]&&(i[g[e]]=t[g[e]]);if(i.text=(i.text||"").toString(),i.mode=o(i.mode),i._utc=Date.now()/1e3,this.media){var n=0;void 0===i.time?(i.time=this.media.currentTime,n=this._.position):(n=r(this.comments,"time",i.time))<this._.position&&(this._.position+=1),this.comments.splice(n,0,i)}else this.comments.push(i);return this}function w(){return this._.visible?this:(this._.visible=!0,this.media&&this.media.paused||(l.call(this),m.call(this)),this)}function y(){return this._.visible?(u.call(this),this.clear(),this._.visible=!1,this):this}function b(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}function L(){return this._.width=this.container.offsetWidth,this._.height=this.container.offsetHeight,this._.engine.resize(this._.stage,this._.width,this._.height),this._.duration=this._.width/this._.speed,this}var x={get:function(){return this._.speed},set:function(t){return"number"!=typeof t||isNaN(t)||!isFinite(t)||t<=0?this._.speed:(this._.speed=t,this._.width&&(this._.duration=this._.width/t),t)}};function T(t){t&&p.call(this,t)}return T.prototype.destroy=function(){return _.call(this)},T.prototype.emit=function(t){return v.call(this,t)},T.prototype.show=function(){return w.call(this)},T.prototype.hide=function(){return y.call(this)},T.prototype.clear=function(){return b.call(this)},T.prototype.resize=function(){return L.call(this)},Object.defineProperty(T.prototype,"speed",x),T}));
        /* eslint-enable */

        class EDE {
            constructor() {
                this.chConvert = 1;
                if (window.localStorage.getItem('chConvert')) {
                    this.chConvert = window.localStorage.getItem('chConvert');
                }
                // 0:当前状态关闭 1:当前状态打开
                this.danmakuSwitch = 1;
                if (window.localStorage.getItem('danmakuSwitch')) {
                    this.danmakuSwitch = parseInt(window.localStorage.getItem('danmakuSwitch'));
                }
                this.danmaku = null;
                this.episode_info = null;
                this.ob = null;
                this.loading = false;
            }
        }

        function createButton(opt) {
            let button = document.createElement('button', buttonOptions);
            button.setAttribute('title', opt.title);
            button.setAttribute('id', opt.id);
            let icon = document.createElement('span');
            icon.className = 'md-icon';
            icon.innerText = opt.innerText;
            button.appendChild(icon);
            button.onclick = opt.onclick;
            return button;
        }

        function initListener() {
            let container = document.querySelector(mediaQueryStr);
            // 页面未加载
            if (!container) {
                if (window.ede.episode_info) {
                    window.ede.episode_info = null;
                }
                return;
            }
            if (!container.getAttribute('ede_listening')) {
                console.log('正在初始化Listener');
                container.setAttribute('ede_listening', true);
                container.addEventListener('play', reloadDanmaku);
                console.log('Listener初始化完成');
            }
        }

        function initUI() {
            // 页面未加载
            if (!document.querySelector(uiQueryStr)) {
                return;
            }
            // 已初始化
            if (document.getElementById('danmakuCtr')) {
                return;
            }
            console.log('正在初始化UI');
            // 弹幕按钮容器div
            let parent = document.querySelector(uiQueryStr).parentNode;
            let menubar = document.createElement('div');
            menubar.id = 'danmakuCtr';
            if (!window.ede.episode_info) {
                menubar.style.opacity = 0.5;
            }
            parent.append(menubar);
            // 弹幕开关
            displayButtonOpts.innerText = danmaku_icons[window.ede.danmakuSwitch];
            menubar.appendChild(createButton(displayButtonOpts));
            // 手动匹配
            menubar.appendChild(createButton(searchButtonOpts));
            // 简繁转换
            translateButtonOpts.title = chConverTtitle[window.ede.chConvert];
            menubar.appendChild(createButton(translateButtonOpts));
            // 屏蔽等级
            filterButtonOpts.innerText = filter_icons[parseInt(window.localStorage.getItem('danmakuFilterLevel') ? window.localStorage.getItem('danmakuFilterLevel') : 0)];
            menubar.appendChild(createButton(filterButtonOpts));
            // 弹幕信息
            menubar.appendChild(createButton(infoButtonOpts));
            console.log('UI初始化完成');
        }

        function sendNotification(title, msg) {
            const Notification = window.Notification || window.webkitNotifications;
            console.log(msg);
            if (Notification.permission === 'granted') {
                return new Notification(title, {
                    body: msg,
                });
            } else {
                Notification.requestPermission((permission) => {
                    if (permission === 'granted') {
                        return new Notification(title, {
                            body: msg,
                        });
                    }
                });
            }
        }

        function getEmbyItemInfo() {
            return window.require(['pluginManager']).then((items) => {
                if (items) {
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.pluginsList) {
                            for (let j = 0; j < item.pluginsList.length; j++) {
                                const plugin = item.pluginsList[j];
                                if (plugin && plugin.id == 'htmlvideoplayer') {
                                    return plugin._currentPlayOptions ? plugin._currentPlayOptions.item : null;
                                }
                            }
                        }
                    }
                }
                return null;
            });
        }

        async function getEpisodeInfo(is_auto = true) {
            let item = await getEmbyItemInfo();
            if (!item) {
                return null;
            }
            let _id;
            let animeName;
            let anime_id = -1;
            let episode;
            if (item.Type == 'Episode') {
                _id = item.SeasonId;
                animeName = item.SeriesName;
                episode = item.IndexNumber;
                let session = item.ParentIndexNumber;
                if (session != 1) {
                    animeName += ' ' + session;
                }
            } else {
                _id = item.Id;
                animeName = item.Name;
                episode = 'movie';
            }
            let _id_key = '_anime_id_rel_' + _id;
            let _name_key = '_anime_name_rel_' + _id;
            let _episode_key = '_episode_id_rel_' + _id + '_' + episode;
            if (is_auto) {
                if (window.localStorage.getItem(_episode_key)) {
                    return JSON.parse(window.localStorage.getItem(_episode_key));
                }
            }
            if (window.localStorage.getItem(_id_key)) {
                anime_id = window.localStorage.getItem(_id_key);
            }
            if (window.localStorage.getItem(_name_key)) {
                animeName = window.localStorage.getItem(_name_key);
            }
            if (!is_auto) {
                animeName = prompt('确认动画名:', animeName);
            }

            let searchUrl = 'https://api.dandanplay.net/api/v2/search/episodes?anime=' + animeName + '&withRelated=true';
            if (is_auto) {
                searchUrl += '&episode=' + episode;
            }
            let animaInfo = await fetch(searchUrl)
                .then((response) => response.json())
                .catch((error) => {
                    console.log('查询失败:', error);
                    return null;
                });
            console.log('查询成功');
            console.log(animaInfo);
            let selecAnime_id = 1;
            if (anime_id != -1) {
                for (let index = 0; index < animaInfo.animes.length; index++) {
                    if (animaInfo.animes[index].animeId == anime_id) {
                        selecAnime_id = index + 1;
                    }
                }
            }
            if (!is_auto) {
                let anime_lists_str = list2string(animaInfo);
                console.log(anime_lists_str);
                selecAnime_id = prompt('选择:\n' + anime_lists_str, selecAnime_id);
                selecAnime_id = parseInt(selecAnime_id) - 1;
                window.localStorage.setItem(_id_key, animaInfo.animes[selecAnime_id].animeId);
                window.localStorage.setItem(_name_key, animaInfo.animes[selecAnime_id].animeTitle);
                let episode_lists_str = ep2string(animaInfo.animes[selecAnime_id].episodes);
                episode = prompt('确认集数:\n' + episode_lists_str, parseInt(episode));
                episode = parseInt(episode) - 1;
            } else {
                selecAnime_id = parseInt(selecAnime_id) - 1;
                episode = 0;
            }
            let episodeInfo = {
                episodeId: animaInfo.animes[selecAnime_id].episodes[episode].episodeId,
                animeTitle: animaInfo.animes[selecAnime_id].animeTitle,
                episodeTitle: animaInfo.animes[selecAnime_id].type == 'tvseries' ? animaInfo.animes[selecAnime_id].episodes[episode].episodeTitle : null,
            };
            window.localStorage.setItem(_episode_key, JSON.stringify(episodeInfo));
            return episodeInfo;
        }

        function getComments(episodeId) {
            let url = 'https://api.xn--7ovq92diups1e.com/cors/https://api.dandanplay.net/api/v2/comment/' + episodeId + '?withRelated=true&chConvert=' + window.ede.chConvert;
            return fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log('弹幕下载成功: ' + data.comments.length);
                    return data.comments;
                })
                .catch((error) => {
                    console.log('获取弹幕失败:', error);
                    return null;
                });
        }

        async function createDanmaku(comments) {
            if (!comments) {
                return;
            }
            if (window.ede.danmaku != null) {
                window.ede.danmaku.clear();
                window.ede.danmaku.destroy();
                window.ede.danmaku = null;
            }
            let _comments = danmakuFilter(danmakuParser(comments));
            console.log('弹幕加载成功: ' + _comments.length);

            while (!document.querySelector(mediaContainerQueryStr)) {
                await new Promise((resolve) => setTimeout(resolve, 200));
            }

            let _container = document.querySelector(mediaContainerQueryStr);
            let _media = document.querySelector(mediaQueryStr);
            window.ede.danmaku = new Danmaku({
                container: _container,
                media: _media,
                comments: _comments,
                engine: 'DOM',
            });
            window.ede.danmakuSwitch == 1 ? window.ede.danmaku.show() : window.ede.danmaku.hide();
            if (window.ede.ob) {
                window.ede.ob.disconnect();
            }
            window.ede.ob = new ResizeObserver(() => {
                if (window.ede.danmaku) {
                    console.log('Resizing');
                    window.ede.danmaku.resize();
                }
            });
            window.ede.ob.observe(_container);
        }

        function reloadDanmaku(type = 'check') {
            if (window.ede.loading) {
                console.log('正在重新加载');
                return;
            }
            window.ede.loading = true;
            getEpisodeInfo(type != 'search')
                .then((info) => {
                    return new Promise((resolve, reject) => {
                        if (!info) {
                            if (type != 'init') {
                                reject('播放器未完成加载');
                            } else {
                                reject(null);
                            }
                        }
                        if (type != 'search' && type != 'reload' && window.ede.danmaku && window.ede.episode_info && window.ede.episode_info.episodeId == info.episodeId) {
                            reject('当前播放视频未变动');
                        } else {
                            window.ede.episode_info = info;
                            resolve(info.episodeId);
                        }
                    });
                })
                .then(
                    (episodeId) =>
                        getComments(episodeId).then((comments) =>
                            createDanmaku(comments).then(() => {
                                console.log('弹幕就位');
                            }),
                        ),
                    (msg) => {
                        if (msg) {
                            console.log(msg);
                        }
                    },
                )
                .then(() => {
                    window.ede.loading = false;
                    if (document.getElementById('danmakuCtr').style.opacity != 1) {
                        document.getElementById('danmakuCtr').style.opacity = 1;
                    }
                });
        }

        function danmakuFilter(comments) {
            let level = parseInt(window.localStorage.getItem('danmakuFilterLevel') ? window.localStorage.getItem('danmakuFilterLevel') : 0);
            if (level == 0) {
                return comments;
            }
            let limit = 9 - level * 2;
            let vertical_limit = 6;
            let arr_comments = [];
            let vertical_comments = [];
            for (let index = 0; index < comments.length; index++) {
                let element = comments[index];
                let i = Math.ceil(element.time);
                let i_v = Math.ceil(element.time / 3);
                if (!arr_comments[i]) {
                    arr_comments[i] = [];
                }
                if (!vertical_comments[i_v]) {
                    vertical_comments[i_v] = [];
                }
                // TODO: 屏蔽过滤
                if (vertical_comments[i_v].length < vertical_limit) {
                    vertical_comments[i_v].push(element);
                } else {
                    element.mode = 'rtl';
                }
                if (arr_comments[i].length < limit) {
                    arr_comments[i].push(element);
                }
            }
            return arr_comments.flat();
        }

        function danmakuParser($obj) {
            //const $xml = new DOMParser().parseFromString(string, 'text/xml')
            return $obj
                .map(($comment) => {
                    const p = $comment.p;
                    //if (p === null || $comment.childNodes[0] === undefined) return null
                    const values = p.split(',');
                    const mode = { 6: 'ltr', 1: 'rtl', 5: 'top', 4: 'bottom' }[values[1]];
                    if (!mode) return null;
                    //const fontSize = Number(values[2]) || 25
                    const winWidth = document.body.offsetWidth;
                    const fontSize = winWidth > 1500 ? 31 : 22;
                    const color = `000000${Number(values[2]).toString(16)}`.slice(-6);
                    return {
                        text: $comment.m,
                        mode,
                        time: values[0] * 1,
                        style: {
                            // DOM
                            fontSize: `${fontSize}px`,
                            color: `#${color}`,
                            opacity: '0.6',
                            textShadow: '-1px 0px 1px #000, 0px 1px 1px #000, 1px 0px 1px #000, 0px -1px 1px #000',

                            // canvas
                            globalAlpha: 0.6,
                            font: `${fontSize}px SimHei`,
                            fillStyle: `#${color}`,
                            // strokeStyle: color === '000000' ? '#fff' : '#000',
                            lineWidth: 1.0,
                        },
                    };
                })
                .filter((x) => x);
        }

        function list2string($obj2) {
            const $animes = $obj2.animes;
            let anime_lists = $animes.map(($single_anime) => {
                return $single_anime.animeTitle + ' 类型:' + $single_anime.typeDescription;
            });
            let anime_lists_str = '1:' + anime_lists[0];
            for (let i = 1; i < anime_lists.length; i++) {
                anime_lists_str = anime_lists_str + '\n' + (i + 1).toString() + ':' + anime_lists[i];
            }
            return anime_lists_str;
        }

        function ep2string($obj3) {
            const $animes = $obj3;
            let anime_lists = $animes.map(($single_ep) => {
                return $single_ep.episodeTitle;
            });
            let ep_lists_str = '1:' + anime_lists[0];
            for (let i = 1; i < anime_lists.length; i++) {
                ep_lists_str = ep_lists_str + '\n' + (i + 1).toString() + ':' + anime_lists[i];
            }
            return ep_lists_str;
        }

        while (!window.require) {
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
        if (!window.ede) {
            window.ede = new EDE();
            setInterval(() => {
                initUI();
            }, check_interval);
            while (!(await getEmbyItemInfo())) {
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
            reloadDanmaku('init');
            setInterval(() => {
                initListener();
            }, check_interval);
        }
    }
})();
