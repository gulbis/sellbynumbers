if (!window.__offlineMapping) {
	window.__offlineMapping = {
		"http://oberdanpilates.dudaone.com/": "oberdanpilates.dudaone.com.html",
		"http://oberdanpilates.dudaone.com/en-gb/home": "home.html",
		"http://oberdanpilates.dudaone.com/site/": "site.html",
	};

	(function() {
		var swapLink = function(a) {
			var url = a.href,
				key = url.split("#")[0],
				hash = url.substr(key.length);
			if (__offlineMapping[key]) {
				a.setAttribute("data-offline-href", url);
				a.href = __offlineMapping[key] + hash;
			}
		};

		document.addEventListener("DOMContentLoaded", function() {
			[].forEach.call(document.querySelectorAll("a[href^=http]"), swapLink);
		});

		document.addEventListener("click", function(e) {
			var a = e.target;
			if (a.tagName !== "A" || a.protocol === "file:") return;
			swapLink(a);
		}, false);
	})();
}
