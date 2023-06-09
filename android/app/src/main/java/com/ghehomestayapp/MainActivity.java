package com.ghehomestayapp;
import com.facebook.react.ReactActivity;
import android.os.Bundle; // required for onCreate parameter
import org.devio.rn.splashscreen.SplashScreen; // here
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashStatusBarTheme);
        //SplashScreen.show(this,R.style.SplashTheme);
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_splash_screen);
    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "GHEHomeStayApp";
  }

  // add the below
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
    @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

}
