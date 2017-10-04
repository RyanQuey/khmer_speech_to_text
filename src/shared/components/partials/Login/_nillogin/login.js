App.Component.add("Shared.Partials.Login", {
  followStores: function(){
    return {
      view: "loginModal.view"
    }
  },

  handleSubmit: function(e){
    e.preventDefault()
    this.setState({ signingIn: true });
    var component = this;
    var params = {};

    let type = Store("loginModal.view").get();
    let error;

    if (type == "login") {
      ['email', 'password'].forEach(function(key){
        params[key] = component.state[key];
      });
      error = "Invalid e-mail or password.";
    } else if (type == "signup") {
      ['firstName', 'lastName', 'email', 'phone', 'address', 'unit', 'city', 'state', 'zip', 'password', 'passwordConfirmation'].forEach(function(key){
        params[key] = component.state[key];
      });
      error = "Unknown error.";
    } else {
      ['email','password','address', 'unit', 'city', 'state', 'zip'].forEach(function(key){
        params[key] = component.state[key];
      });
      params['type'] = type
      error = "Unknown error.";
    }

    var doIt = function () {
      User.login(params, type)
      .then((user) => {
        component.setState({ signingIn: false });
        if (type == "signup") {
          Store("notify").set({ message: 'Thanks for signing up with Next In Line!', title: "Signed up!", level: "success" });
        }

        if (typeof component.props.onSuccess === 'function') {
          // component.props.onSuccess();
        }
      })
      .catch(function(data) {
        component.setState({ signingIn: false });
        if (!component.state.email) {
          error = "Please add your email";
        } else if (data.responseText) {
          try {
            var stuff = JSON.parse(data.responseText);
            error = stuff.error || stuff.message || error;
            error = error.replace("firstName", "First Name");
            error = error.replace("lastName", "Last Name");
          } catch (e) {
            // do nothin' ... my favorite!
          }
        }

        if (data.responseText) {
          var stuff = JSON.parse(data.responseText);
          if(stuff.error === "Address is required."){
            Store("loginModal.view").set("address");
          }
        }

        let title = (type == "login" || type == "address") ? "Error logging in" : "Error signing up"
        Store("notify").set({ title, message: error, level: "error" });
      });
    };

    setTimeout(doIt, 500);
  },

  componentWillUnmount: function(){
    Helpers.detach(this);

    this._isMounted = false;
  },

  checkLogin: function () {
    if (this._isMounted) {
      let logged = Store("flags.loggedIn").get();
      if (logged) {
        if (typeof this.props.onSuccess === 'function') {
          this.props.onSuccess()
        }
      } else if (this.props.forAdmin) {
        page("/admin/users/login")
      }
    }
  },

  componentDidMount: function(){
    this._additionalDetachables = [Store("flags.loggedIn").onChange(() => {
      this.checkLogin();
    })];

    this._isMounted = true;

    this.checkLogin();
  },


  toggleType: function () {
    if (Store("loginModal.view").get() === "login") {
      Store("loginModal.view").set("signup");
    } else {
      Store("loginModal.view").set("login");
    }
  },

  cancel: function (e) {
    if (e) {
      e.preventDefault();
    }

    this.props.onCancel();
  },

  // TODO: try to combine with handleParam
  handlePhone: function(value){
    this.setState({ phone: value })
  },

  forgotPassword: function (e) {
    e.preventDefault();
    this.setState({ forgot: true });
  },

  render: function () {
    let showCancel = (typeof this.props.onCancel === 'function')
    let modal = this.props.modal;
    // TODO: can use this.state.view instead
    let type = Store("loginModal.view").get();
    let loginBoxMessage = () => {
      if (this.props.forAdmin) {
        return "Sign in to administer your organization"
      } else if (type == "login") {
        return "Login to Next In Line"
      } else if (type == "signup") {
        return "Register with Next In Line"
      } else {
        return "Please enter your address so we may find the organizations most convenient for you."
      }
    }

    // probably don't need this
    /*
    if (Store("flags.loggedIn").get()) {
      return (
        <i className="fa fa-lg fa-spinner fa-spin" />
      )
    }
    */

    /*
    var windowHeight = ($(window).height() > 750? $(window).height(): 750 );
    if(type == "signup"){
      windowHeight += 200;
    }
    */

    return (
      <div id="login-container" className={!modal && "users-session-container"} >
        <div className="login-box">
          <div className="login-box-body">
            <Shared.SessionTitle />
            { this.state.forgot ? (
              <div>
                <Shared.User.ForgotPasswordForm showCancel={showCancel} onCancel={this.cancel} />
              </div>
            ) : (<div>
              <p className="login-box-msg">{loginBoxMessage()}</p>

              <form onSubmit={this.handleSubmit}>
                {(type == "signup" || type == "address") && (
                  <div>
                    {type == "signup" && (
                      <div className="form-group has-feedback">
                        <input type="text" className="form-control name-input" placeholder="First Name" data-key="firstName" onChange={this.handleParam} />
                        <input type="text" className="form-control name-input" placeholder="Last Name" data-key="lastName" onChange={this.handleParam} />
                        <i className="glyphicon glyphicon-user form-control-feedback"></i>
                      </div>
                    )}
                    <div className="form-group has-feedback">
                      <input type="text" className="form-control" placeholder="Address 1" data-key="address" onChange={this.handleParam} />
                      <i className="glyphicon glyphicon-pushpin form-control-feedback"></i>
                    </div>
                    <div className="form-group has-feedback">
                      <input type="text" className="form-control" placeholder="Address 2" data-key="unit" onChange={this.handleParam} />
                    </div>
                    <div className="form-group has-feedback">
                      <input type="text" className="form-control location-input" placeholder="City" data-key="city" onChange={this.handleParam} />
                      <StateSelect className="form-control location-input" data-key="state" onChange={this.handleParam}/>
                      <input type="text" className="form-control location-input" placeholder="Zip" data-key="zip" onChange={this.handleParam} />
                    </div>
                  </div>
                )}
                <div className="form-group has-feedback">
                  <input type="email" className="form-control" placeholder="Email" data-key="email" onChange={this.handleParam} />
                  <i className="glyphicon glyphicon-envelope form-control-feedback"></i>
                </div>
                {type == "signup" && (
                  <Input.Phone onChange={this.handlePhone} />
                )}
                <div className="form-group has-feedback">
                  <input type="password" className="form-control" placeholder="Password" data-key="password" onChange={this.handleParam} />
                  <i className="glyphicon glyphicon-lock form-control-feedback"></i>
                </div>
                {type == "signup" && (
                  <div className="form-group has-feedback">
                    <input type="password" className="form-control" placeholder="Confirm" data-key="passwordConfirmation" onChange={this.handleParam} />
                    <i className="glyphicon glyphicon-lock form-control-feedback" />
                  </div>
                )}
                <div className="row">
                  <div className="col-xs-4">
                    {this.state.signingIn ?(
                      <button className="sign-in-button btn btn-default btn-block disabled"><i className="fa fa-spinner fa-spin fa-lg"></i></button>
                    ):(
                      <button type="submit" className="btn btn-primary btn-block">{(type === "address" ? "Submit" : ((type === "login") ? "Sign In" : "Sign Up"))}</button>
                    )}
                  </div>
                  { showCancel ? (
                    <div className="col-xs-4">
                        <span className="btn btn-default btn-block" onClick={this.cancel}>Cancel</span>
                    </div>
                  ) : (
                    <div className="col-xs-2"></div>
                  )}
                  <div className="col-xs-12">
                    <a href="#" onClick={this.forgotPassword}>Forgot Password?</a>
                  </div>
                </div>
              </form>

              <div>
                <br />
                {(type === "login") ? "Don't Have an Account?" : "Already Have an Account?"}
                <br />
                <button onClick={this.toggleType} className="btn btn-default">Click Here to Sign {(type === "login") ? "Up" : "In"}!</button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    )
  }
})
