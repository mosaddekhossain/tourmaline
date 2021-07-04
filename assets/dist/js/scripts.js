var turnOffThisMotherFuckingScrollButKeepTheModalOpen=true;
var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)

    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            // if(figureEl.children.length > 1) {
            //     // <figcaption> content
            //     item.title = figureEl.children[1].innerHTML;
            // }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'DIV');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // bgOpacity: 0.98,
            // closeOnScroll: false,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.swipeGallery');

$("window").off("scroll");
$("document").off("scroll");

+function ($) {
  'use strict';

  autosize($('textarea'));

  // // create ruler HTML for the DOM
  // var helloh    = '<div class="add-newReply">'+
  //                 '<div class="thumb-xs pull-left m-r">'+
  //                   '<a href="./profile.html"><img class="img-circle" src="assets/imgs/a1.jpg" alt=""></a>'+
  //                 '</div>'+
  //                 '<div class="form-group clear">'+
  //                   '<label class="hide" for="newReply">Add your comment</label>'+
  //                   '<textarea name="New Reply" id="newReply" class="form-control" placeholder="New reply" type="textarea" rows="1"></textarea>'+
  //                 '</div>'+
  //               '</div>';


  // $(".replyArea").on("click",function(e){
  //   e.preventDefault();
  //
  //   $(this).parent().parent().parent().parent().addClass("new-reply");
  //
  //   $(this).parent().parent().parent().addClass("reply");
  //
  //   // set HTML to the DOM
  //   $(this).parent().parent().parent().after($(helloh));
  //   autosize($('textarea'));
  //
  //
  //   var $targetTextarea = $("#newReply");
  //   $targetTextarea.focus();
  //
  //   $targetTextarea.on('blur', function() {
  //     if ($(this).val() === '') {
  //       $(this).parent().parent().remove('.add-newReply');
  //     }
  //   });
  //
  // });

  var replyHTML = '<div id="newReplyContainer">'+
                      '<div class="thumb-xs pull-left m-r">'+
                        '<a href="./profile.html"><img class="img-circle" src="assets/imgs/a1.jpg" alt=""></a>'+
                      '</div>'+
                      '<div class="form-group clear">'+
                        '<label class="hide" for="newReply">Add your comment</label>'+
                        '<textarea name="New Reply" id="newReply" class="form-control" placeholder="New reply" type="textarea" rows="1"></textarea>'+
                      '</div>'+
                    '</div>';


  $(".reply").on("click",function(e){
    e.preventDefault();

    var isNewReply = $(".replies").children().is("#newReplyContainer");

    if(isNewReply){
      return false;
    } else {
      var targetDOM = $(this).parents(".replies");
      // set HTML to the DOM
      $(targetDOM).append($(replyHTML));
      autosize($('textarea'));
    }

    // // var targetDOM = $(this).parents(".replies").addClass("add-new-reply");
    // var targetDOM = $(this).parents(".replies");
    //
    // // set HTML to the DOM
    // $(targetDOM).append($(replyHTML));
    // autosize($('textarea'));


    var $targetTextarea = $("#newReply");

    $targetTextarea.focus();

    $targetTextarea.on('blur', function() {
      if ($(this).val() === '') {
        $(this).parents("#newReplyContainer").remove();
      }
      else {
        // $(this).parents("#newReplyContainer").remove();
        var r = confirm("Discard your reply?");
        if (r == true) {
            $(this).parents("#newReplyContainer").remove();
        } else {
            $targetTextarea.focus();
        }
      }
    });

  });

}(jQuery);

$(document).ready(function() {

  $(".grid_justified").justifiedGallery({
      rowHeight : 350,
      lastRow : 'nojustify',
      //fixedHeight: true,
      margins : 15,
      captions: false
  });

  // masonry grid
  $('.grid_masonry').masonry({
    itemSelector: '.photo_container',
    gutter: 0
  });

  // Returns height of browser viewport
  $(window).on('resize.windowscreen', function() {
    $('.windowscreen').height($(this).height());
  });
  $(window).trigger('resize.windowscreen');

  // bootstrap-submenu initialize
  $('[data-submenu]').submenupicker();

  // $(".photo_sidebar").on("scroll",function(e){
  //   console.log("tap");
  //   // e.preventDefault();
  //   e.stopPropagation();
  //   return false;
  // });

  $(".jsTham").on("click",function(e){
    e.stopPropagation();
  });

  // action_region
  $(".photo_thumbnail").hover(function(){
    $(this).toggleClass("is-hover");
    $(this).siblings(".action_region").toggleClass("is-visible");
  });

  $(".action_region").hover(function(){
    $(this).siblings(".photo_thumbnail").toggleClass("is-hover");
    $(this).toggleClass("is-visible");
  });

  $(".btn-love").on("click",function(e){
    e.preventDefault();
    var isLoved = $(this).hasClass("loved");
    if(isLoved) {
      $(this).removeClass("active loved");
    } else {
      var $this = $(this).addClass("active");
      window.setTimeout(function(){
          $this.addClass('loved');
          $this.removeClass("active");
      }, 1000);
    }
  });

  $(".btn-action").on("click",function(e){
    e.preventDefault();
    $(this).toggleClass("active");
    $(this).children(".hi").toggleClass("hi-add hi-check");
  });

});
