(function(global, $) {
  global.insiteScripts = global.insiteScripts || {};
  global.insiteScripts.message = global.insiteScripts.message || function message(scriptOptions) {
    var dmSmartScriptDuration = scriptOptions.duration,
      dmSmartScriptSettings = scriptOptions.settings,
      dmSmartScriptRuleId = scriptOptions.ruleId,
      dmSmartScriptDontParseSettings = scriptOptions.dontParseSettings,
      dmSmartScriptDontSendCloseEvent = scriptOptions.dontSendCloseEvent;

    (function() {
    	
      //don't show a notification if another notification is currently displaying
      if($('#d-notification-bar').length && !$('#d-notification-bar').attr('data-was-shown')) {
    	  return;
      }
      var settings = dmSmartScriptDontParseSettings ? dmSmartScriptSettings : JSON.parse(atob(dmSmartScriptSettings));
      var messageDiv = $('<div id="d-notification-bar">'),
        closeTrigger = $('<div>&#215;</div>');
      
   // detect tranision end event
		var elm = document.createElement("div");
		var tranisitionend = "transitionend";
		var transEndEventNames = {
				  'WebkitTransition': 'webkitTransitionEnd',
				  'MozTransition': 'transitionend',
				  'OTransition': 'oTransitionEnd',
				  'msTransition': 'MSTransitionEnd',
				  'transition': 'transitionend'
				};
		for (key in transEndEventNames) {
			  var val = transEndEventNames[key];
		  if (elm.style[key] != null) {
			  tranisitionend = val;
		    break;
		  }
		}

      var invert = function(rgb) {
        try {
          rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
          for(var i = 0; i < rgb.length; i++)
            rgb[i] = i === 3 ? 1 : 255 - rgb[i];
          return "rgba(" + rgb.join(", ") + ")";
        } catch(e) {
          return "#fff";
        }
      };
      
      var transform = function($e, val){
			$e.css({
				"-webkit-transform":val,
				"-ms-transform":val,
				"transform":val
			})
		}
      
      var toggleMessageOld = function(open) {
    	  if(open) {
    		  messageDiv.slideDown();
    	  }else {
    		  messageDiv.slideUp();
    		  messageDiv.attr('data-was-shown', 'true');
    	  }
      }
      
      var toggleMessage = function(open) {
        var bodyEl = document.body;

        /*******************************************************************************************/
        /* Before attempting to implement a better solution                                        */
        /* (like using only `transform` because it's the only property                             */
        /* beside opacity that doesn't require re-paints)                                          */
        /* please note that there's an issue with `position: fixed` and `transform` on the parent. */
        /* You can read about it here: https://www.w3.org/TR/css-transforms-1/#transform-rendering */
        /*******************************************************************************************/

        // Make sure body has transition - if not add appropriate class
        if (!bodyEl.classList.contains('showing-message')) {
          bodyEl.classList.add('showing-message');
        }

        if (open) {
          bodyEl.style.top = messageDiv.outerHeight() + 'px';
          messageDiv[0].style.transform = 'translateY(0)';
        } else {
          bodyEl.style.top = '0';
          messageDiv[0].style.transform = '';
          messageDiv.attr('data-was-shown', 'true');
        }
        messageDiv[0].dataset.visible = '' + open;
      };

      messageDiv.attr('data-rule', dmSmartScriptRuleId).attr('data-rule-type', 'notification');
      messageDiv.html(decodeURIComponent(settings.body));
      messageDiv.css({
        
        background: settings.background || "rgba(0,0,0,0.8)",
        color: settings.background ? invert(settings.background) : "#fff"
      
      });
      var links = messageDiv.find("a").css({
        color: "inherit"
      }).on('click', function() {
    	  if(!dmSmartScriptDontSendCloseEvent) {
    		  dm_gaq_push_event("notificationLinkClick", null, null, Parameters.SiteAlias, this);
    	  }
        toggleMessage(false);
      });
      if(window.location.href.indexOf('preview=true') > 0) {
        links.each(function(i, link) {
        // rewrite notification messages link to the editor/preview format if in preview/editor mode
          var raw_url = $(link).attr('raw_url');
          if(raw_url) {
        	  if(raw_url.indexOf('preview=true') != -1 && raw_url.indexOf('dm_device=') == -1){
        		  // add the device param if it was not saved
        		  raw_url = raw_url + '&dm_device=' + $.layoutDevice.type; 
        	  }
        	  $(link).attr('href', raw_url);
          }
            
        });
      }
      closeTrigger.css({
        position: "absolute",
        top: "5px",
        right: "10px",
        "font-weight": "bold",
        "cursor": "pointer",
        "color": settings.background ? invert(settings.background) : "#fff"
      }).on("click", function() {
    	 if(!dmSmartScriptDontSendCloseEvent) {
    	        dm_gaq_push_event("notificationClose", null, null, Parameters.SiteAlias, this);

    	  }
    	 toggleMessage(false);
      }).appendTo(messageDiv);
      
      var triggerMessage = function() {
    	  messageDiv.prependTo($('body'));
          var delay = settings.delay ? settings.delay * 1000 : 2000;
          setTimeout(function(){toggleMessage(true);}, delay);
          if(typeof dmSmartScriptDuration != "undefined" && dmSmartScriptDuration) {
            setTimeout(function() {
              toggleMessage(false);
            }, delay + dmSmartScriptDuration * 1000);
          }
      }
      if($.isReady) {
    	  triggerMessage();
      }else {
    	  $(document).ready(function(){
    		  triggerMessage();
    	  });
      }
     
    })();
  };
})(this, jQuery);