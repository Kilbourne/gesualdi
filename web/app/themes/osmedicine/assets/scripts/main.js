/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

;(function($) {
  var disc_cache=[];

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {
         FastClick.attach(document.body);
        var lightbox = lity();
        $(document).on('click', '.credits', lightbox); 
        //$('body>.page-wrapper').height(function(i,h){
        //  return $('#responsive-menu').height();
        //})
        (function Menu(){
          var isOpen=false;
          //$(document).on('click',function(e){ if (e.which != 2 && !$(e.target).closest('#responsive-menu, #click-menu').length) { closeRM() }});
          $(document).on('click', '#click-menu', function() { !isOpen ? openRM() : closeRM() });
          if (window.matchMedia("(min-width: 800px)").matches && isOpen) {
            closeRM();
          }
          function openRM() {
              //$('#responsive-menu').css('display', 'block');
              $('#responsive-menu').addClass('RMOpened');
              $('#click-menu').addClass('click-menu-active');
              $('#responsive-menu').stop().animate({ left: "0" }, 500, 'linear', function() {
                  //$('#responsive-menu').css('height', $(document).height());
                  isOpen = true
              })
          }

          function closeRM() {
              //$('#responsive-menu').animate({ left: -$('#responsive-menu').width() }, 500, 'linear', function() {
                  //$('#responsive-menu').css('display', 'none');
                  $('#responsive-menu').removeClass('RMOpened');
                  $('#click-menu').removeClass('click-menu-active');
                  isOpen = false
              //})
          }
          $(window).resize(function() {
              $('#responsive-menu').stop(true, true);
              //$('#responsive-menu').css('height', $(document).height());
              if ($(window).width() > 800) {
                  //if ($('#responsive-menu').css('left') != -$('#responsive-menu').width()) { closeRM() }
              }
          });
        }())
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        $('.full-slider').unslider({
          arrows:false,
          animation:"fade",
          autoplay:true
        });
        $('.full-slider').unslider('initSwipe');
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    'page_template_band':{
      init:function(){
        $('.discs-list').slick({slidesToShow:3});
      }
    },
    'discografia':{
      init: function() {
        var music = document.getElementById('music');
          $('.disco-link').click(ajaxDisco);
          $('#pButton').click(playAudio);
          $('#music').on('ended',resetPlayAudio)

          History.Adapter.bind(window,'statechange',function statechangeCallback (){ // Note: We are using statechange instead of popstate
           var State = History.getState(); // Note: We are using History.getState() instead of event.state
           var data=State.data.data,

           p=$('#'+State.data.target);

                                       $('.extended-disc-panel').fadeOut('400', function() {
                                        stopAudio();
                              $('.discs-list>li.active').add(p).toggleClass('active');
                            $(".disco-title").text(data.title);
                            var src= $(".copertina>img");
                            src.remove();
                            $(".copertina").append(data.thumb);
                            //$(target).children('img').remove()
                            //$(target).append(src);
                            $(".tracklist>div").html(data.tracklist);
                            $(".descrizione-disco>div").html(data.excerpt);
                            if(data.audio_sample){
                              music.src=data.audio_sample;
                              $('#pButton').show();
                            }else{
                              $('#pButton').hide();
                            }
                            $('.extended-disc-panel').fadeIn('400',function(){
                                     $('.extended-disc-panel').removeClass('not-visible');
                            });
                            });

           //if(State.data.disco){
            //$('.disco-link[href="'+State.data.disco+'"').click();
           //}
          } );
                    if(document.location.toString().indexOf('?disco=')>-1){
            var searched=document.location.toString().split('?disco=')[1];
            $('.disco-link').filter(function(){
              var splitted =this.href.split('/'),
                            location=splitted[splitted.length-1]!==''?splitted[splitted.length-1]:splitted[splitted.length-2];
                            return location === searched;
                          }).click();
            History.Adapter.trigger(window,'statechange')
          }else{
            $('.extended-disc-panel').removeClass('not-visible');
          }
          function ajaxDisco(e){
            e.preventDefault();
            var cached;
            var target=e.currentTarget,url=target.href;
            cached=JSON.parse(localStorage.getItem(url));
var splitted=url.split('/'),
                            location=splitted[splitted.length-1]!==''?splitted[splitted.length-1]:splitted[splitted.length-2];
            if(cached !==null){
              History.pushState(cached, cached.data.title, '?disco='+location);
            }else{
            $.post( gesualdi.ajaxurl, {
                            action: 'gesualdi_disco',
                            postlink: url ,
                            nonce:gesualdi.nonce
                        },

                        function(response) {
                          if(response.success){
                            var data=response.data;
                            var obj ={disco:url,data:data,target:target.parentElement.id};
                            localStorage.setItem(url, JSON.stringify(obj));
                             History.pushState(obj, data.title, '?disco='+location);

                          }
                        });
          }
        }
           function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

          function playAudio() {
            var music = document.getElementById('music');
            if (music.paused) {
              music.play();
              pButton.className = "";
              pButton.className = "pause";
            } else {
              music.pause();
              pButton.className = "";
              pButton.className = "play";
            }
          }
          function resetPlayAudio(){
            pButton.className = "";
              pButton.className = "play";

          }
          function stopAudio() {
            if (!music.paused) {
              music.pause();
              pButton.className = "";
              pButton.className = "play";
            }
          }
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    }

  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
