import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  button: {
    background: theme.color[background],
    color: theme.color[color],
    ':hover': {
      background: theme.color[hover]
    }
  }
})

const element = <div className={`${css(styles.button)}`}></div>
