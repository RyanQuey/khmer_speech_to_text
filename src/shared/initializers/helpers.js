export default () => {

  String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.titleCase = function () {
    var i, j, str, lowers, uppers;
    str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
      str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
        function(txt) {
          return txt.toLowerCase();
        });

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
      str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
        uppers[i].toUpperCase());

    return str;
  };

  window.Helpers = {
    match: function (needle, haystack) {
      if (!haystack) {
        return false;
      }

      let strings = String(needle.toUpperCase()).split(/\s+/);
      let found = true;
      for (let s of strings) {
        if (String(haystack).toUpperCase().indexOf(s) === -1) {
          found = false;
          break;
        }
      }

      return found;
    },

    safeDataPath: function (object, keyString, def = null) {
      let keys = keyString.split('.');
      let returnValue = null;
      let lookup = object;

      if (!lookup) {
        return def;
      }

      for (let key of keys) {
        if (lookup[key]) {
          returnValue = lookup[key];
          lookup = lookup[key];
        } else {
          return def;
        }
      }

      return returnValue;
    },

    notifyOfAPIError: function (data, title) {
      var err = "Unknown error.";
      if (data.responseText) {
        try {
          var stuff = JSON.parse(data.responseText);
          err = stuff.error || stuff.message || err;
          // test if waterline found a duplicate when data was supposed be unique
          let re = /A record with that `(.*)` already exists/
          let matchData = re.exec(stuff.message)
          if (matchData) {
            if (err === stuff.error) {
              err = `${err}. A record with that ${matchData[1]} already exists`
            }
          }
        } catch (e) {
          // do nothin' ... my favorite!
        }
      }

      console.log("ERROR:", err);
    },

    dayAbbreviations: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],

    sortFunctions: {
      compare: function (v1, v2) {
        if (v1 < v2) {
          return -1;
        } else if (v1 > v2) {
          return 1;
        } else {
          return 0;
        }
      },
      name: function (a, b) {
        if(!a.lastName && !b.lastName){
          return 0;
        } else if(!a.lastName){
          return 1;
        } else if(!b.lastName){
          return -1;
        }

        return Helpers.sortFunctions.compare(a.lastName.toUpperCase(), b.lastName.toUpperCase());
      },
      email: function (a, b) {
        return Helpers.sortFunctions.compare(a.email.toUpperCase(), b.email.toUpperCase());
      },
      phone: function (a, b) {
        if(!a.phone && !b.phone){
          return 0;
        } else if(!a.phone){
          return 1;
        } else if(!b.phone){
          return -1;
        }

        return Helpers.sortFunctions.compare(a.phone.toUpperCase(), b.phone.toUpperCase());
      },
      joined: function (a, b) {
        return Helpers.sortFunctions.compare(a.createdAt.toUpperCase(), b.createdAt.toUpperCase());
      },
    }
  }

  /* maybe add later
  const Cookies = require("js-cookie")
  let Cookie = {
      get: function(key){
          try {
              return $.parseJSON(Cookies.get(key))
          }catch(e){

          }
      },
      set: function(key, value){
          return Cookies.set(key, JSON.stringify(value),  { domain: '.' + this.host, path: '/'  })
      },
      remove: function(key){
          Cookies.remove(key, { domain: '.' + this.host })
      }
  }

  Cookie.host = location.host.split(".")
  Cookie.host.shift()
  Cookie.host = Cookie.host.join(".")
  Cookie.host = Cookie.host.split(":")[0]

  window.Cookie = Cookie;
 */
}
