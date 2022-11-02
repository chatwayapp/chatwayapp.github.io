
var script = (async function () {

  // Init

  const fbConfig = {
    //...
  };

  const app = new Realm.App({ id: 'chatwayapp-zsdqh' });
  const fbApp = initializeApp(fbConfig);

  const fbAuth = getAuth(app);

  const ghAuthProvider = new GithubAuthProvider();

  signInWithPopup(fbAuth, ghAuthProvider)
    .then((result) => {
      const ghCredentials = GithubAuthProvider.credentialFromResult(result);
      const ghToken = ghCredentials.accessToken;
      const ghUser = result.user;
      console.log('Sign in with GitHub success.')
      console.log(ghCredentials);
      console.log(ghToken);
      console.log(ghUser);
    }).catch((error) => {
      console.error(error);
    });

  const credentials = Realm.Credentials.anonymous();

  console.log(credentials);

  const user = await app.logIn(credentials);
  console.log(user.id == app.currentUser.id ? 'logged in anonymously' : 'failed to log in');
  console.log(user);
  console.log(app.currentUser);

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
        $('.content-main').each(function () {
          if ('#' + ($(this).attr('id') || '').replace('home', '').replace('-pane', '') == hash) {
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

  function test() {
    console.log('test');
  }

  return {
    test: test
  }

})();