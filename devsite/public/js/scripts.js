/*!
 * Custom Site Scripts
 * Version: 1.0.0
 * Author: Heath Shults @ Fannie Mae
 */

const svgb = `
<svg iclass="c-ucon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path d="M12.984 13.922v-6.938h-1.969v6.938h1.969zM12.984 17.953v-2.016h-1.969v2.016h1.969zM12 2.016c5.531
  0 9.984 4.453 9.984 9.984s-4.453 9.984-9.984 9.984-9.984-4.453-9.984-9.984 4.453-9.984 9.984-9.984z" />
</svg>
`

// ====== COPY TO CLIPBOARD ===================================>
// maintain properly setup pre tags =========>
let thePreTags = Array.prototype.slice.call(document.querySelectorAll('pre'));
console.log('Pretags: ' + thePreTags.length);
thePreTags.forEach(function (node) {
  let $this = node;
  $this.setAttribute('data-source', 'js/prism-copy-to-clipboard/prism-copy-to-clipboard.js')
});

let theHighlightTags = Array.prototype.slice.call(document.querySelectorAll('.highlight'))
console.log('Highlight Tags: ' + theHighlightTags.length)
theHighlightTags.forEach(function (node, index) {
  let $this = node;
  $this.setAttribute('id', `hl${index}`);
  $this.style.height = '160px';
  $this.setAttribute('expanded', 'false')
});
// jQuery(window).on('load', function () {
let clipInit = false;
let theClipTip = '<div class="fk-copy-to-clipboard-success" role="tooltip">Copied!</div>'
let pretag, inPre, inPreParent,  text, actionToolbar,
  actionButtonShowMore, clip, codeContainer, actionButtonShowMoreLabel,
  contId, btnId, highlightContainer, codeContainerHeight, inPreParentsParent

jQuery('pre').each(function (index) {
  pretag = jQuery(this),
  text = pretag.text();

  if (text.length > 5) {
    if (!clipInit) {
      text,
      clip = new Clipboard('.copy-to-clipboard', {
        text: function (trigger) {
          text = jQuery(trigger).next('pre').text();
          return text.replace(/^\$\s/gm, '');
        }
      });

      clip.on('success', function (e) {
        e.clearSelection();
        inPre = jQuery(e.trigger).parent().prop('tagName') == 'PRE';
        jQuery(e.trigger).attr('aria-label', 'Copied!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
        jQuery(e.trigger).attr('title', 'copied!').addClass('is-active');
        jQuery(e.trigger).on('mouseleave', function () {
          jQuery(e.trigger).attr('title', 'copy').removeClass('is-active');
        })
      });

      clip.on('error', function (e) {
        inPre = jQuery(e.trigger).parent().prop('tagName') == 'PRE';
        jQuery(e.trigger).attr('aria-label', fallbackMessage(e.action)).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
        // jQuery(document).one('copy', function () {
        jQuery(e.trigger).attr('aria-label', 'Copied to clipboard!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
      });
    }

    inPreParent = jQuery(this).parent()

    inPreParentsParent = inPreParent.parent()
    clipInit = true;
  }

  pretag.before('<button class="copy-to-clipboard" title="copy" /></button>')
  pretag.next('.copy-to-clipboard').on('mouseleave', function () {
    jQuery(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
  });

  /* assemble content
           create the toolbarelements */
  actionToolbar = document.createElement('div')
  actionButtonShowMore = document.createElement('button')
  actionButtonShowMoreLabel = document.createElement('label')

  /* add classes to toolbar and buttons */
  actionToolbar.classList.add('fk-code-action-toolbar')
  actionToolbar.setAttribute('id', `tb${index}`)
  actionButtonShowMore.classList.add('hvr-sweep-to-bottom', 'fk-showmore-button')
  actionButtonShowMore.setAttribute('id', `smb${index}`)
  actionButtonShowMoreLabel.setAttribute('id', `lbl${index}`)
  actionButtonShowMoreLabel.textContent = 'Show More'


  /* add content to the buttons, the buttons to the toolbar and putthe toolbar below the pre/code */
  actionButtonShowMore.appendChild(actionButtonShowMoreLabel)
  actionToolbar.appendChild(actionButtonShowMore)
  // actionToolbar.classList.toggle('u-visibility-hidden');
  pretag.parent().after(actionToolbar);

  actionButtonShowMore.addEventListener('click', function (event) {

    btnId = this.id
    contId = btnId.replace('smb', 'hl')
    highlightContainer = document.getElementById(contId);
    codeContainer = document.getElementById(contId).getElementsByTagName('code')[0]
    codeContainerHeight = codeContainer.offsetHeight + 50

    if (highlightContainer.getAttribute('expanded') === 'false'){
      if (codeContainerHeight < 160) {
        return
      } else {
        actionButtonShowMoreLabel = document.getElementById(`lbl${index}`)
        actionButtonShowMoreLabel.textContent ='Show Less'
        highlightContainer.style.height = codeContainerHeight + 'px';
        highlightContainer.setAttribute('expanded', 'true');
      }
    } else {
      actionButtonShowMoreLabel.textContent ='Show More'
      highlightContainer.style.height = '160px';
      highlightContainer.setAttribute('expanded', 'false')
    }
    //alert('Element clicked through function!');
  });
  jQuery(actionButtonShowMore).mouseup(function() {
    actionButtonShowMoreLabel.textContent ='Show Less'
  })
})
// ====== /COPY TO CLIPBOARD ================================= //

// ====== ANIMATE WHEN SCROLLED INTO VIEW ====================>

// ====== /ANIMATE WHEN SCROLLED INTO VIEW ================== //
// ====== GET URL PARAMETERS =================================>
let getUrlParameter = (sPageURL) => {
  let url = sPageURL.split('?');
  let obj = {};
  if (url.length == 2) {
    let sURLletiables = url[1].split('&'),
      sParameterName,
      i;
    for (i = 0; i < sURLletiables.length; i++) {
      sParameterName = sURLletiables[i].split('=');
      obj[sParameterName[0]] = sParameterName[1];
    }
    return obj;
  } else {
    return undefined;
  }
};
  // ====== /GET URL PARAMETERS ============================= //

function fallbackMessage(action) {
  let actionMsg = '';
  let actionKey = (action === 'cut' ? 'X' : 'C');

  if (/iPhone|iPad/i.test(navigator.userAgent)) {
    actionMsg = 'No support :(';
  } else if (/Mac/i.test(navigator.userAgent)) {
    actionMsg = 'Press âŒ˜-' + actionKey + ' to ' + action;
  } else {
    actionMsg = 'Press Ctrl-' + actionKey + ' to ' + action;
  }

  return actionMsg;
}

  

// ====== SEARCH FUNCTIONS ======>
let ajax;
jQuery('[data-search-input]').on('input', function () {
  let input = jQuery(this),
    value = input.val(),
    items = jQuery('[data-nav-id]');
  items.removeClass('search-match');
  if (!value.length) {
    jQuery('ul.topics').removeClass('searched');
    items.css('display', 'block');
    sessionStorage.removeItem('search-value');
    jQuery('.highlightable').unhighlight({
      element: 'mark'
    })
    return;
  }

  sessionStorage.setItem('search-value', value);
  jQuery('.highlightable').unhighlight({
    element: 'mark'
  }).highlight(value, {
    element: 'mark'
  });

  if (ajax && ajax.abort) ajax.abort();

  jQuery('[data-search-clear]').on('click', function () {
    jQuery('[data-search-input]').val('').trigger('input');
    sessionStorage.removeItem('search-input');
    jQuery('.highlightable').unhighlight({
      element: 'mark'
    })
  });
});

jQuery.expr[':'].contains = jQuery.expr.createPseudo(function (arg) {
  return function (elem) {
    return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  };
});

if (sessionStorage.getItem('search-value')) {
  let searchValue = sessionStorage.getItem('search-value')
  jQuery(document.body).removeClass('searchbox-hidden');
  jQuery('[data-search-input]').val(searchValue);
  jQuery('[data-search-input]').trigger('input');
  let searchedElem = jQuery('#body-inner').find(':contains(' + searchValue + ')').get(0);
  if (searchedElem) {
    searchedElem.scrollIntoView(true);
    let scrolledY = window.scrollY;
    if (scrolledY) {
      window.scroll(0, scrolledY - 125);
    }
  }
}
// store this page in session
sessionStorage.setItem(jQuery('body').data('url'), 1);

// loop through the sessionStorage and see if something should be marked as visited
for (let url in sessionStorage) {
  if (sessionStorage.getItem(url) == 1) jQuery('[data-nav-id="' + url + '"]').addClass('visited');
}