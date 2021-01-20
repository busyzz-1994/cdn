(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var processData = function processData(p) {
    var data = {
      dns: p.domainLookupEnd - p.domainLookupStart,
      //DNS 解析时长
      tcpConnect: p.connectEnd - p.connectStart,
      // TCP 链接时长
      ttfb: p.responseStart - p.navigationStart,
      //接收到首字时长
      sendEnd: p.responseEnd - p.requestStart,
      //开始发送到接收完毕的时长
      sendStart: p.responseStart - p.requestStart,
      // 请求发送开始到接收到首个字节的时间
      whiteScreen: p.domLoading - p.navigationStart,
      // 白屏时长
      domRender: p.domComplete - p.domLoading,
      // dom的渲染时长
      domContent: p.domInteractive - p.domLoading,
      // DOM 元素加载时长
      onloadEventTime: p.loadEventEnd - p.loadEventStart,
      // 在onload回调里面执行的代码时长
      total: p.loadEventEnd - p.navigationStart //总时长

    };
    return data;
  };

  var load = function load(callback) {
    var timer;

    var check = function check() {
      if (window.performance.timing.loadEventEnd) {
        callback();
        clearInterval(timer);
      } else {
        timer = setInterval(function () {
          check();
        }, 500);
      }
    };

    window.addEventListener('load', check, false);
  };

  var domReady = function domReady(callback) {
    var timer;

    var check = function check() {
      if (window.performance.timing.domInteractive) {
        callback();
        clearInterval(timer);
      } else {
        timer = setInterval(function () {
          check();
        }, 500);
      }
    };

    window.addEventListener('DOMContentLoaded', check, false);
  };

  var performance = {
    init: function init(callback) {
      //dom加载完毕,不包括外部资源,有可能用户在网页没有加载完就退出了
      domReady(function () {
        var data = processData(window.performance.timing);
        data.type = 'DOMContentLoaded';
        callback(data);
      }); //所有资源加载完毕

      load(function () {
        var data = processData(window.performance.timing);
        data.type = 'load';
        callback(data);
      });
    }
  };

  // 监控页面的性能  - 就是算时间差 performance 对象 timing;
  performance.init(function (data) {
    console.log('timing', data);
  });

})));
