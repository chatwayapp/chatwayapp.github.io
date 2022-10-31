
var script = (function () {

  // Hash detection UI changes

  const hashes = ['#', '#people', '#messages', '#groups', '#teams', '#projects']

  hashChange();

  $(window).on('hashchange', function () {
    hashChange();
  });

  function hashChange() {
    $(function () {
      const hash = location.hash == '' ? '#' : location.hash
      if (hashes.includes(hash)) {
        $('.nav-link').each(function () {
          if (($(this).attr('href') || '') == hash) {
            $(this).addClass('active');
          } else {
            $(this).removeClass('active');
          }
        });
      } else {
        location.hash = '#'
      }
    });
  }

})();