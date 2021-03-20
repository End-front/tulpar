'use strict';

let body = document.body || document.getElementsByTagName('body')[0];
let widthScroll = window.innerWidth - document.documentElement.clientWidth;
let BSLBufferClassModify = {
  'BSL-pr': 'padding-right:' + widthScroll + 'px;',
  'BSL-ml--m': 'margin-left: -' + widthScroll + 'px',
  'BSL-ml-part--m': 'margin-left: -' + widthScroll/2 + "px;",
  'BSL-mr': 'margin-right:' + widthScroll + 'px',
  'BSL-mr--m': 'margin-right: -' + widthScroll + 'px;',
};
let canBodyTogglelock = true;

function blockScrollBody(options) {  
  if (options == null) options = {};

  if (canBodyTogglelock && !body.classList.contains('body-scroll-lock')) {
    canBodyTogglelock = false;

    setTimeout(function() {
      for (let index = 0; index < body.children.length; index++) {
        const element = body.children[index];
        if (element.classList.contains('modal-body')) {
          continue;
        }
        if (element.classList.contains('BSL-prevent')) {
          element.setAttribute('data-prev-style', (element.getAttribute('style') || ''));
          element.setAttribute('style', (element.getAttribute('style') || '') + BSLGetStyleLineOnClass(element.classList));
          let childerBSL = element.querySelectorAll('.BSL-item');
          for (let j = 0; j < childerBSL.length; j++) {
            const children = childerBSL[j];
            children.setAttribute('data-prev-style', (children.getAttribute('style') || ''));
            children.setAttribute('style', (children.getAttribute('style') || '') + BSLGetStyleLineOnClass(children.classList));
          } 
        } else {
          element.style.paddingRight = widthScroll + 'px';
        } 
      }
      
      document.documentElement.style.overflowY = 'hidden';
      body.style.overflowY = 'hidden';
      body.classList.add('body-scroll-lock');

      canBodyTogglelock = true;
    }, options.time || 0)
  }
}


function unblockScrollBody(options) {
  if (options == null) options = {};
  if (canBodyTogglelock && body.classList.contains('body-scroll-lock')) {
    canBodyTogglelock = false;

    setTimeout(function() {
      for (let index = 0; index < body.children.length; index++) {
        const element = body.children[index];
        if (element.classList.contains('BSL-prevent')) {
          element.setAttribute('style', element.getAttribute('data-prev-style'));
          let childerBSL = element.querySelectorAll('.BSL-item');
          for (let j = 0; j < childerBSL.length; j++) {
            const children = childerBSL[j];
            children.setAttribute('style', children.getAttribute('data-prev-style'));
          }
        } else {
          element.style.paddingRight = '0px';
        } 
      }
    
      document.documentElement.style.overflowY = 'auto';
      body.style.overflowY = 'auto';
      body.classList.remove('body-scroll-lock');

      canBodyTogglelock = true;
    }, options.time || 0)
  }
}

function BSLGetStyleLineOnClass(classes) {
  let resultStringSyle = ''; 
  for (let index = 0; index < classes.length; index++) {
    const stingClass = classes.item(index);
    if (BSLBufferClassModify[stingClass]) {
      resultStringSyle += BSLBufferClassModify[stingClass]; 
    }
  }
  return resultStringSyle;
}

// let modals = document.querySelectorAll('.modal-body--open');
// for (let index = 0; index < modals.length; index++) {
//   const modal = modals[index];
//   let wrapper = modal.querySelector('.modal-wrapper');
//   modal.addEventListener('click', function(e) {
//     if(e.target == modal || e.target.closest('.modal-exit') || e.target == wrapper) {
//       body.classList.remove('modal-body--open')
//     }
//   })
// }

function modalOpen(id) {
  if(document.querySelector('.modal-body--open')) {
    modalClose(null, false);
  }
  blockScrollBody();
  
  let newModal = document.querySelector('.modal-body#'+id);
  newModal.classList.add('modal-body--open');

  modalToggleScrollBody(newModal);
}

function modalClose(id, blockBody) {
  if (blockBody == null) {
    blockBody = true;
  }
  if (blockBody) {
    unblockScrollBody({
      time: getTransitonTimeFromModal(document.querySelector('.modal-body--open')),
    });
  }
  if (id != null ) {
    document.querySelector('.modal-body#'+id).classList.remove('modal-body--open');
    modalToggleScrollBody(document.querySelector('.modal-body#'+id));
  } else {
    let modalsOpen = document.querySelectorAll('.modal-body--open');
    for (let index = 0; index < modalsOpen.length; index++) {
      const element = modalsOpen[index];
      element.classList.remove('modal-body--open');
      modalToggleScrollBody(element);
    }
  }
}
document.documentElement.addEventListener('keydown', function(e) {
  if(e.code == 'Escape') {
    modalClose();
  }
})
function modalCreate(option) {
  if (option.element) {
    let modalBody = option.element;
    let modalWrapper = modalBody.querySelector('.modal-wrapper');
    let modalContent = modalBody.querySelector('.modal-content');

    let modalExit = document.createElement('button');
    modalExit.classList.add('modal-exit');
    modalExit.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0.25C4.62391 0.25 0.25 4.62391 0.25 10C0.25 15.3761 4.62391 19.75 10 19.75C15.3761 19.75 19.75 15.3761 19.75 10C19.75 4.62391 15.3761 0.25 10 0.25ZM13.5302 12.4698C13.6027 12.5388 13.6608 12.6216 13.7008 12.7133C13.7409 12.805 13.7622 12.9039 13.7635 13.004C13.7648 13.1041 13.746 13.2034 13.7083 13.2961C13.6706 13.3889 13.6147 13.4731 13.5439 13.5439C13.4731 13.6147 13.3889 13.6706 13.2961 13.7083C13.2034 13.746 13.1041 13.7648 13.004 13.7635C12.9039 13.7622 12.805 13.7409 12.7133 13.7008C12.6216 13.6608 12.5388 13.6027 12.4698 13.5302L10 11.0608L7.53016 13.5302C7.38836 13.6649 7.19955 13.7389 7.00398 13.7364C6.8084 13.7339 6.62155 13.6551 6.48325 13.5168C6.34495 13.3785 6.26614 13.1916 6.26364 12.996C6.26114 12.8005 6.33513 12.6116 6.46984 12.4698L8.93922 10L6.46984 7.53016C6.33513 7.38836 6.26114 7.19955 6.26364 7.00398C6.26614 6.8084 6.34495 6.62155 6.48325 6.48325C6.62155 6.34495 6.8084 6.26614 7.00398 6.26364C7.19955 6.26114 7.38836 6.33513 7.53016 6.46984L10 8.93922L12.4698 6.46984C12.6116 6.33513 12.8005 6.26114 12.996 6.26364C13.1916 6.26614 13.3785 6.34495 13.5168 6.48325C13.6551 6.62155 13.7339 6.8084 13.7364 7.00398C13.7389 7.19955 13.6649 7.38836 13.5302 7.53016L11.0608 10L13.5302 12.4698Z" fill="#8093AC"/></svg>';
    
  
    modalBody.addEventListener('click', function(e) {
      if (e.target == modalBody || e.target == modalWrapper) {
        modalClose();
      }
    })
    modalExit.addEventListener('click', function() {
      modalClose();
    })

    if (option.modalExit !== false) {
      modalContent.appendChild(modalExit);
    }
  } else {
    let modalBody = document.createElement('div');
    if (option.id && modalIdValidCheck(option.id)) {
      modalBody.id = option.id;
    } else {
      modalBody.id = modalIdGet();
    }
    
    modalBody.classList.add('modal-body');
    if (option.classModal) {
      for (let index = 0; index < option.classModal.length; index++) {
        const element = option.classModal[index];
        modalBody.classList.add(element);
      }
    }
    let modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal-wrapper');
    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    if (option.content) {
      modalContent.innerHTML = option.content;
    }
  
    let modalExit = document.createElement('button');
    modalExit.classList.add('modal-exit');
    modalExit.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0.25C4.62391 0.25 0.25 4.62391 0.25 10C0.25 15.3761 4.62391 19.75 10 19.75C15.3761 19.75 19.75 15.3761 19.75 10C19.75 4.62391 15.3761 0.25 10 0.25ZM13.5302 12.4698C13.6027 12.5388 13.6608 12.6216 13.7008 12.7133C13.7409 12.805 13.7622 12.9039 13.7635 13.004C13.7648 13.1041 13.746 13.2034 13.7083 13.2961C13.6706 13.3889 13.6147 13.4731 13.5439 13.5439C13.4731 13.6147 13.3889 13.6706 13.2961 13.7083C13.2034 13.746 13.1041 13.7648 13.004 13.7635C12.9039 13.7622 12.805 13.7409 12.7133 13.7008C12.6216 13.6608 12.5388 13.6027 12.4698 13.5302L10 11.0608L7.53016 13.5302C7.38836 13.6649 7.19955 13.7389 7.00398 13.7364C6.8084 13.7339 6.62155 13.6551 6.48325 13.5168C6.34495 13.3785 6.26614 13.1916 6.26364 12.996C6.26114 12.8005 6.33513 12.6116 6.46984 12.4698L8.93922 10L6.46984 7.53016C6.33513 7.38836 6.26114 7.19955 6.26364 7.00398C6.26614 6.8084 6.34495 6.62155 6.48325 6.48325C6.62155 6.34495 6.8084 6.26614 7.00398 6.26364C7.19955 6.26114 7.38836 6.33513 7.53016 6.46984L10 8.93922L12.4698 6.46984C12.6116 6.33513 12.8005 6.26114 12.996 6.26364C13.1916 6.26614 13.3785 6.34495 13.5168 6.48325C13.6551 6.62155 13.7339 6.8084 13.7364 7.00398C13.7389 7.19955 13.6649 7.38836 13.5302 7.53016L11.0608 10L13.5302 12.4698Z" fill="#8093AC"/></svg>';
    
  
    modalBody.addEventListener('click', function(e) {
      if (e.target == modalBody || e.target == modalWrapper) {
        modalClose();
      }
    })
    modalExit.addEventListener('click', function() {
      modalClose();
    })
    
    if (option.modalExit !== false) {
      modalContent.appendChild(modalExit);
    }
    modalWrapper.appendChild(modalContent);
    modalBody.appendChild(modalWrapper)
    body.appendChild(modalBody);
  }
}

function modalIdGet(string) {
  let id = 1;
  if (string == null ) {
    string = 'modal-'
  }
  while (document.querySelector('#'+string+id)) {
    id++;
  }
  return string+id;
}
function modalIdValidCheck(id) {
  if (document.querySelector('#'+id)) {
    return false;
  }
  return true;
}
function getTransitonTimeFromModal(modal) {
  if (typeof modal == 'object') {
    let time = getComputedStyle(modal).getPropertyValue('transition').match(/visibility (\d[.\d]+[sm]+)/);
    if (time) {
      let second = time[1].substring(0, time[1].length-1) * 1000 + 10;
      return second;
    }
    return 0;
  }
  return 0;
}

function modalToggleScrollBody(modal) {
  modalBlockBody(modal);
  setTimeout(function() {
    modalUnblockBody(modal);
  }, getTransitonTimeFromModal(modal));
}

function modalBlockBody(modal) {
  let wrapperModal = modal.querySelector('.modal-wrapper'); 
  modal.style.overflowY = 'hidden';
  
  if (modal.clientHeight < wrapperModal.offsetHeight) {
    modal.style.paddingRight = widthScroll + 'px';
  }
}
function modalUnblockBody(modal) {
  let wrapperModal = modal.querySelector('.modal-wrapper'); 
  modal.style.overflowY = 'auto';

  modal.style.paddingRight = 0 + 'px';
}