import React from 'react'
import { configure, addDecorator } from '@kadira/storybook'
import { BackgroundColor } from 'react-storybook-decorator-background';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from 'reducers'
import theme from 'theme'

const req = require.context('components', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

addDecorator(story => (
  <Provider store={store}>
    <BrowserRouter>
      <BackgroundColor
        colors={[
          theme.color.black,
          theme.color.primary,
          theme.color.secondary,
          theme.color.accent1,
          theme.color.accent2,
          theme.color.accent3,
          theme.color.white
        ]}
        story={story}
      />
    </BrowserRouter>
  </Provider>
))

configure(loadStories, module)
