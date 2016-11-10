// adds analytics to the page
(function (m, oo, d, y, is, a, boss) {
  m[ 'GoogleAnalyticsObject' ] = is;
  m[ is ] = m[ is ] || function () {
      (m[ is ].q = m[ is ].q || []).push(arguments)
    }, m[ is ].l = 1 * new Date();
  a = oo.createElement(d),
    boss = oo.getElementsByTagName(d)[ 0 ];
  a.async = 1;
  a.src = y;
  boss.parentNode.insertBefore(a, boss)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-58623092-4', 'auto');

export default ga;

export function pageView() {
  ga('send', 'pageview', location.pathname, { title: window.title });
}